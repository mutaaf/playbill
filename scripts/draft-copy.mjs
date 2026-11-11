#!/usr/bin/env node
// Draft search copy with Prompter (the portfolio's AI gateway) from Cast List's facts, into catalog.json.
// Only apps whose facts (name, tagline, keywords, kind, audience, ads) changed since their last merged draft
// are drafted; copy-sources.json records which facts each app's copy was drafted from. The drafts go to a
// pull request (.github/workflows/draft-copy.yml); nothing publishes until the owner merges it.
//   PROMPTER_TOKEN=… node scripts/draft-copy.mjs [--body <file>] [--only <id,id>]
// CAST_FEED=<url or file> and PROMPTER_URL override the sources (tests, offline).
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { eligible, inputHash, prompt, parseDraft, checkDraft, careful } from '../src/lib/copy.js';

const FEED = process.env.CAST_FEED || 'https://mutaafaziz.com/cast/api/apps';
const PROMPTER = process.env.PROMPTER_URL || 'https://mutaafaziz.com/prompter/api/run';
const root = new URL('..', import.meta.url);
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };

async function feed() {
  const raw = /^https?:/.test(FEED) ? await (await fetch(FEED, { headers: { 'user-agent': 'playbill-drafts' } })).text() : await readFile(FEED, 'utf8');
  const b = JSON.parse(raw);
  return Array.isArray(b) ? b : b.apps;
}

/** One draft from Prompter: up to two tries, the second told why the first was refused. */
export async function draft(app, ask) {
  let why = null;
  for (let i = 0; i < 2; i++) {
    const d = parseDraft(await ask(prompt(app, why)));
    const errors = checkDraft(d, app);
    if (!errors.length) return { ok: true, ...d };
    why = errors.join('; ');
  }
  return { ok: false, why };
}

export async function askPrompter(messages, token = process.env.PROMPTER_TOKEN) {
  const r = await fetch(PROMPTER, { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ messages, max_tokens: 200 }) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.ok) throw new Error(`Prompter answered ${r.status}: ${j.error ?? 'no detail'}`);
  return j.response;
}

/** Draft every app that needs it. Returns the new catalog, sources, and rows for the PR body. */
export async function run({ apps, catalog, sources, ask, only = null }) {
  const rows = [], next = structuredClone(catalog), src = { ...sources };
  for (const a of eligible(apps)) {
    const id = a.ids.playbill;
    if (only && !only.includes(id)) continue;
    const h = inputHash(a);
    if (src[id]?.inputs === h) continue;
    const entry = next.find((e) => e.id === id);
    if (!entry) { rows.push({ id, name: a.name, audience: a.audience, note: 'no catalog.json entry yet: write one by hand (summary, FAQs, features) first' }); continue; }
    let d;
    try { d = await draft(a, ask); } catch (e) { d = { ok: false, why: String(e.message).slice(0, 200) }; }
    if (!d.ok) { rows.push({ id, name: a.name, audience: a.audience, note: `kept the current copy: ${d.why}` }); continue; }
    rows.push({ id, name: a.name, audience: a.audience, careful: careful(a), inputs: h, before: { title: entry.title, description: entry.description }, after: { title: d.title, description: d.description } });
    entry.title = d.title; entry.description = d.description;
    src[id] = { inputs: h };
  }
  return { catalog: next, sources: Object.fromEntries(Object.entries(src).sort(([x], [y]) => x.localeCompare(y))), rows };
}

const md = (s) => String(s).replace(/\|/g, '\\|');
export function body(rows) {
  const drafted = rows.filter((r) => r.after), notes = rows.filter((r) => r.note);
  const sig = drafted.map((r) => `${r.id}=${r.inputs}`).sort().join(',');
  return [
    'Search copy drafted by **Prompter** (Workers AI through the portfolio gateway) from each app\'s facts in [Cast List](https://mutaafaziz.com/cast/): name, tagline and keywords.',
    'Nothing is live until you merge. On merge, Workers Builds deploys and each changed title and description replaces the live copy in D1.',
    '',
    '| App | Audience | Before | Draft |', '|---|---|---|---|',
    ...drafted.map((r) => `| ${md(r.name)} (\`${r.id}\`) | ${r.audience}${r.careful ? ' (kids rule)' : ''} | **${md(r.before.title)}**<br>${md(r.before.description)} | **${md(r.after.title)}**<br>${md(r.after.description)} |`),
    '',
    ...(notes.length ? ['Not drafted:', ...notes.map((r) => `- ${r.name} (\`${r.id}\`): ${r.note}`), ''] : []),
    'Kids apps (and any app with `ads: false`) are told to write nothing about ads, tracking, money or urgency, and a word check refuses any draft that does (`src/lib/copy.js`). Edit any line here before merging; close the PR to keep today\'s copy (it won\'t be redrafted until the app\'s facts change).',
    '',
    `<!-- drafts:${sig} -->`,
    '',
    '🤖 Generated with [Claude Code](https://claude.com/claude-code)',
  ].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.PROMPTER_TOKEN) { console.error('PROMPTER_TOKEN is not set'); process.exit(1); }
  const catPath = new URL('catalog.json', root), srcPath = new URL('copy-sources.json', root);
  const catalog = JSON.parse(await readFile(catPath, 'utf8'));
  const sources = existsSync(srcPath) ? JSON.parse(await readFile(srcPath, 'utf8')) : {};
  const out = await run({ apps: await feed(), catalog, sources, ask: (m) => askPrompter(m), only: arg('--only')?.split(',') ?? null });
  await writeFile(catPath, JSON.stringify(out.catalog, null, 2) + '\n');
  await writeFile(srcPath, JSON.stringify(out.sources, null, 2) + '\n');
  if (arg('--body')) await writeFile(arg('--body'), body(out.rows));
  for (const r of out.rows) console.log(r.after ? `drafted ${r.id}: ${r.after.title}` : `skipped ${r.id}: ${r.note}`);
  console.log(`${out.rows.filter((r) => r.after).length} drafted, ${out.rows.filter((r) => r.note).length} not`);
}
