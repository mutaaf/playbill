// Answer-engine share: each week, ask ChatGPT, Perplexity and Claude a rotating sample of each app's
// target questions and record whether the answer cites our URL or names the app. Runs hourly in small
// chunks (Workers cap outbound requests per run) until the week's sample is done.
import Anthropic from '@anthropic-ai/sdk';
import { getSettings, loadApps } from './db.js';
import { appForUrl } from './lib/render.js';

export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((t - y) / 864e5 + 1) / 7)).padStart(2, '0')}`;
}

/** This week's sample: `per` intents per app, rotating so every intent gets checked over a few weeks. */
export function sample(apps, week, per = 2) {
  const n = Number(week.slice(-2)) || 0;
  return apps.flatMap((a) => {
    const xs = (a.intents || []).filter((q) => !q.toLowerCase().includes(a.name.toLowerCase()));
    if (!xs.length) return [];
    return Array.from({ length: Math.min(per, xs.length) }, (_, i) => ({ app: a.id, query: xs[(n * per + i) % xs.length] }));
  });
}

export function engines(s) {
  return [
    s.openai_api_key && { id: 'chatgpt', run: (q) => askOpenAI(s, q) },
    s.perplexity_api_key && { id: 'perplexity', run: (q) => askPerplexity(s, q) },
    s.anthropic_api_key && { id: 'claude', run: (q) => askClaude(s, q) },
  ].filter(Boolean);
}

async function askOpenAI(s, q) {
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST', headers: { authorization: `Bearer ${s.openai_api_key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: s.openai_model || 'gpt-5-mini', tools: [{ type: 'web_search' }], input: q }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || `OpenAI ${r.status}`);
  const parts = (j.output || []).filter((o) => o.type === 'message').flatMap((o) => o.content || []);
  return { text: parts.map((p) => p.text || '').join('\n'),
    urls: parts.flatMap((p) => (p.annotations || []).filter((a) => a.type === 'url_citation').map((a) => a.url)) };
}

async function askPerplexity(s, q) {
  const r = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST', headers: { authorization: `Bearer ${s.perplexity_api_key}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: s.perplexity_model || 'sonar', messages: [{ role: 'user', content: q }] }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || `Perplexity ${r.status}`);
  return { text: j.choices?.[0]?.message?.content || '',
    urls: [...(j.citations || []), ...(j.search_results || []).map((x) => x.url)] };
}

async function askClaude(s, q) {
  const client = new Anthropic({ apiKey: s.anthropic_api_key });
  const messages = [{ role: 'user', content: q }];
  let msg;
  // A long server-tool turn can pause; send it back so the server continues it.
  for (let i = 0; i < 3; i++) {
    msg = await client.beta.messages.create({
      model: s.anthropic_model || 'claude-opus-5-5', max_tokens: 4000, output_config: { effort: 'low' },
      tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }],
      messages, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default',
    });
    if (msg.stop_reason !== 'pause_turn') break;
    messages.push({ role: 'assistant', content: msg.content });
  }
  if (msg.stop_reason === 'refusal') throw new Error('refused');
  const texts = msg.content.filter((b) => b.type === 'text');
  return { text: texts.map((b) => b.text).join(''),
    urls: texts.flatMap((b) => (b.citations || []).map((c) => c.url).filter(Boolean)) };
}

const domain = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return null; } };

/** Score one answer against the app it should surface. */
export function score(answer, app, apps) {
  const urls = [...new Set(answer.urls || [])];
  const cited = urls.some((u) => appForUrl(u, apps) === app.id) ? 1 : 0;
  const mentioned = new RegExp(`\\b${app.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(answer.text || '') ? 1 : 0;
  const sources = [...new Set(urls.map(domain).filter(Boolean))].slice(0, 8);
  return { cited, mentioned, sources };
}

/** One hourly chunk: run up to `budget` (engine, query) pairs that this week hasn't done yet. */
export async function probeChunk(db, budget = 12) {
  const s = await getSettings(db);
  if (!s.probe_enabled) return { skipped: 'probe off' };
  const eng = engines(s);
  if (!eng.length) return { skipped: 'no engine keys' };
  const week = isoWeek();
  const apps = await loadApps(db);
  const todo = [];
  const { results: done } = await db.prepare('SELECT engine, query FROM citations WHERE week = ?').bind(week).all();
  const have = new Set(done.map((d) => `${d.engine}|${d.query}`));
  for (const item of sample(apps, week, Number(s.probe_per_app) || 2))
    for (const e of eng) if (!have.has(`${e.id}|${item.query}`)) todo.push({ ...item, e });
  let ran = 0;
  for (const t of todo.slice(0, budget)) {
    const app = apps.find((a) => a.id === t.app);
    let row;
    try {
      row = { ...score(await t.e.run(t.query), app, apps), error: null };
    } catch (err) {
      row = { cited: 0, mentioned: 0, sources: [], error: String(err.message || err).slice(0, 200) };
    }
    await db.prepare('INSERT OR REPLACE INTO citations VALUES (?,?,?,?,?,?,?,?)')
      .bind(week, t.e.id, t.query, t.app, row.cited, row.mentioned, JSON.stringify(row.sources), row.error).run();
    ran++;
  }
  return { week, ran, left: Math.max(0, todo.length - ran) };
}
