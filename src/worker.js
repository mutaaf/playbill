// Playbill: how every app at mutaafaziz.com (and 18-0.co) introduces itself to search engines and AI agents.
//   edge     GET /, /<app>/            the app's own page (service binding) + canonical, OG, JSON-LD, an accessible
//                                     description, all from the catalog. Any failure serves the page untouched.
//            GET /<app>/llms.txt       per-app brief for AI agents
//            GET /robots.txt, /sitemap.xml, /llms-full.txt, /<INDEXNOW_KEY>.txt
//            GET /playbill/ext/<app>/(robots.txt|sitemap.xml|llms.txt|head.html)  for apps on other hosts (18-0.co)
//   operator /playbill/api/admin/*     cookie session (ADMIN_PASSWORD) or agent (Bearer AGENT_TOKEN)
//   static   /playbill/admin/          the console
import { ensureSchema, getSettings, setSetting, loadApps, invalidate, publicApp } from './db.js';
import { role, sessionCookie, clearCookie, timingSafeEqual } from './auth.js';
import { headPlan, aboutHtml, llmsTxt, llmsFull, sitemap, robots, classify, validateEdit, pathOf, ORIGIN } from './lib/render.js';
import { report } from './report.js';
import { authUrl, exchangeCode, syncGoogle, syncBing, indexNow, redirectUri } from './search.js';
import { probeChunk } from './probe.js';

import { FRONTED } from './cast.js';

// App id → service binding of the Worker that serves it. Generated from Cast List (scripts/sync.mjs).
const BINDINGS = Object.fromEntries(Object.values(FRONTED).map((f) => [f.id, f.binding]));
const ID_BY_PATH = Object.fromEntries(Object.entries(FRONTED).map(([path, f]) => [path, f.id]));
const json = (data, init = {}) => new Response(JSON.stringify(data), {
  ...init, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(init.headers || {}) },
});
const text = (body, type = 'text/plain') => new Response(body, { headers: { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'public, max-age=600' } });
const today = () => new Date().toISOString().slice(0, 10);
const SECRET_KEYS = ['google_client_secret', 'bing_api_key', 'openai_api_key', 'perplexity_api_key', 'anthropic_api_key'];
const SETTING_KEYS = ['google_client_id', 'gsc_sites', 'probe_enabled', 'probe_per_app', 'openai_model', 'perplexity_model', 'anthropic_model', ...SECRET_KEYS];

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const p = url.pathname;
    // The edge pages must never fail because of Playbill: serve the app's page untouched on any error.
    const front = frontApp(p);
    if (front) {
      const upstream = env[BINDINGS[front]];
      const res = await upstream.fetch(req);
      try { return await decorate(env, ctx, req, res, front); } catch (e) { console.error('decorate', e); return res; }
    }
    try {
      if (p === `/${env.INDEXNOW_KEY}.txt` || p === `/playbill/ext/18-0/${env.INDEXNOW_KEY}.txt`) return text(env.INDEXNOW_KEY);
      await ensureSchema(env.DB);
      if (p === '/robots.txt') return text(robots());
      if (p === '/sitemap.xml') return text(sitemap(await loadApps(env.DB)), 'application/xml');
      if (p === '/llms-full.txt') {
        const site = await (await env.SITE.fetch(new Request(`${ORIGIN}/llms.txt`))).text();
        return text(llmsFull(site, await loadApps(env.DB)));
      }
      const ll = p.match(/^(\/.+\/)llms\.txt$/);
      if (ll && ID_BY_PATH[ll[1]]) return llms(env, ctx, req, ID_BY_PATH[ll[1]]);
      const ext = p.match(/^\/playbill\/ext\/([a-z0-9-]+)\/(robots\.txt|sitemap\.xml|llms\.txt|head\.html)$/);
      if (ext) return external(env, ctx, req, ext[1], ext[2]);
      if (p === '/playbill/api/google/callback') return googleCallback(env, url);
      if (p.startsWith('/playbill/api/admin/')) return admin(env, req, url, p.slice('/playbill/api/admin/'.length), ctx);
      if (p === '/playbill' || p === '/playbill/') return Response.redirect(`${url.origin}/playbill/admin/`, 302);
      return env.ASSETS.fetch(req);
    } catch (e) {
      console.error(e);
      return json({ error: 'server error' }, { status: 500 });
    }
  },

  async scheduled(evt, env) {
    await ensureSchema(env.DB);
    if (evt.cron === '41 * * * *') {
      try { await probeChunk(env.DB); } catch (e) { await setSetting(env.DB, 'probe_last_error', String(e.message || e)); }
      return;
    }
    // Daily: notice which pages changed, tell IndexNow, refresh Google + Bing data.
    try { await freshness(env); } catch (e) { await setSetting(env.DB, 'indexnow_last_error', String(e.message || e)); }
    try { await syncGoogle(env.DB, env); } catch (e) { await setSetting(env.DB, 'google_last_error', String(e.message || e)); }
    try { await syncBing(env.DB); } catch (e) { await setSetting(env.DB, 'bing_last_error', String(e.message || e)); }
  },
};

function frontApp(p) {
  return ID_BY_PATH[p] || null;
}

function count(env, ctx, req, appId, kind) {
  const bot = classify(req.headers.get('user-agent'));
  ctx.waitUntil(env.DB.prepare(`INSERT INTO crawls (day, app_id, bot, kind, n) VALUES (?,?,?,?,1)
    ON CONFLICT(day, app_id, bot, kind) DO UPDATE SET n = n + 1`).bind(today(), appId, bot, kind).run().catch(() => {}));
}

async function decorate(env, ctx, req, res, id) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res;
  if (res.status !== 200 || !(res.headers.get('content-type') || '').includes('text/html')) return res;
  await ensureSchema(env.DB);
  const apps = await loadApps(env.DB);
  const app = apps.find((a) => a.id === id);
  if (!app) return res;
  count(env, ctx, req, id, 'page');
  const plan = headPlan(app);
  const seen = new Set();
  let rw = new HTMLRewriter()
    .on('head > title', { element(e) { seen.add('title'); e.setInnerContent(plan.title); } });
  for (const [sel, value] of Object.entries(plan.replace)) {
    rw = rw.on(sel, { element(e) { seen.add(sel); e.setAttribute('content', value); } });
  }
  for (const [sel] of plan.add) rw = rw.on(sel, { element() { seen.add(sel); } });
  rw = rw.on('head', { element(e) {
    e.onEndTag((end) => {
      const missing = plan.add.filter(([sel]) => !seen.has(sel)).map(([, tag]) => tag);
      if (!seen.has('title')) missing.unshift(`<title>${plan.title.replace(/</g, '&lt;')}</title>`);
      end.before(`${missing.join('\n')}\n${plan.jsonld}\n`, { html: true });
    });
  } });
  // The site's front page is already a full profile; apps (mostly canvases) get the accessible description.
  if (app.kind !== 'site') rw = rw.on('body', { element(e) { e.onEndTag((end) => end.before(aboutHtml(app, apps), { html: true })); } });
  const out = rw.transform(res);
  const h = new Headers(out.headers);
  h.set('x-playbill', '1');
  h.append('link', `<${app.url.replace(/\/?$/, '/')}llms.txt>; rel="alternate"; type="text/plain"`);
  h.delete('content-length');
  return new Response(out.body, { status: out.status, headers: h });
}

async function llms(env, ctx, req, id) {
  const apps = await loadApps(env.DB);
  const app = apps.find((a) => a.id === id && pathOf(a));
  if (!app) return BINDINGS[id] ? env[BINDINGS[id]].fetch(req) : new Response('not found', { status: 404 });
  count(env, ctx, req, id, 'llms');
  return text(llmsTxt(app, apps));
}

async function external(env, ctx, req, id, file) {
  const apps = await loadApps(env.DB);
  const app = apps.find((a) => a.id === id);
  if (!app || pathOf(app)) return new Response('not found', { status: 404 });
  const host = new URL(app.url).origin;
  if (file === 'llms.txt') { count(env, ctx, req, id, 'llms'); return text(llmsTxt(app, apps)); }
  if (file === 'robots.txt') return text(robots(host));
  // Static hosts (18-0.co on Vercel) splice this into their HTML at build time.
  if (file === 'head.html') return text(`${headPlan(app).jsonld}\n<!--playbill-body-->\n${aboutHtml(app, apps)}`, 'text/html');
  return text(sitemap(apps, host), 'application/xml');
}

/** Hash each front page; a changed page gets a new dateModified and an IndexNow ping. */
async function freshness(env) {
  const { results } = await env.DB.prepare('SELECT id, html_hash, data FROM apps').all();
  const changed = [];
  for (const r of results) {
    const a = JSON.parse(r.data);
    let body;
    if (BINDINGS[a.id]) body = await (await env[BINDINGS[a.id]].fetch(new Request(a.url, { headers: { 'user-agent': 'Playbill' } }))).text();
    else body = await (await fetch(a.url, { headers: { 'user-agent': 'Playbill' } })).text();
    const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body)))].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
    if (hash === r.html_hash) continue;
    await env.DB.prepare('UPDATE apps SET html_hash = ?, modified = ? WHERE id = ?').bind(hash, r.html_hash ? today() : (a.updated || today()), a.id).run();
    if (r.html_hash) changed.push(a.url);
  }
  invalidate();
  // Catalog edits queue their URLs here; they go out with the page changes in one daily batch.
  const s = await getSettings(env.DB);
  let queued = [];
  try { queued = JSON.parse(s.indexnow_queue || '[]'); } catch {}
  for (const u of queued) if (!changed.includes(u)) changed.push(u);
  if (changed.length) {
    const apps = await loadApps(env.DB, { fresh: true });
    const urls = [...changed, ...changed.flatMap((u) => { const a = apps.find((x) => x.url === u); return a && pathOf(a) ? [`${ORIGIN}${pathOf(a)}llms.txt`] : []; })];
    const result = await indexNow(env, urls);
    await setSetting(env.DB, 'indexnow_last', JSON.stringify({ at: new Date().toISOString(), urls, result }));
    // Keep the queue if IndexNow throttled us (429); tomorrow's run retries it.
    if (Object.values(result).every((st) => st < 300)) await setSetting(env.DB, 'indexnow_queue', '[]');
  }
  return changed;
}

async function googleCallback(env, url) {
  // Google's redirect is cross-site, so the SameSite=Strict session cookie isn't sent here.
  // The one-time state (minted by a signed-in operator in admin/google/connect) is the proof.
  const s = await getSettings(env.DB);
  const state = url.searchParams.get('state') || '';
  if (!s.google_oauth_state || !timingSafeEqual(state, s.google_oauth_state)) return new Response('State mismatch, try Connect again.', { status: 400 });
  await setSetting(env.DB, 'google_oauth_state', '');
  if (url.searchParams.get('error')) return new Response(`Google said: ${url.searchParams.get('error')}. Try Connect again.`, { status: 400 });
  try {
    await exchangeCode(env.DB, { ...s, google_client_secret: s.google_client_secret || env.GOOGLE_CLIENT_SECRET }, url.origin, url.searchParams.get('code'));
    await syncGoogle(env.DB, env).catch((e) => setSetting(env.DB, 'google_last_error', String(e.message || e)));
    return Response.redirect(`${url.origin}/playbill/admin/#setup`, 302);
  } catch (e) {
    return new Response(`Google connect failed: ${e.message}`, { status: 400 });
  }
}

// ---------- operator + agent ----------

async function admin(env, req, url, route, ctx) {
  const db = env.DB;
  if (route === 'login' && req.method === 'POST') {
    const { password } = await req.json().catch(() => ({}));
    if (!env.ADMIN_PASSWORD || !timingSafeEqual(password || '', env.ADMIN_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 600));
      return json({ error: 'wrong password' }, { status: 401 });
    }
    return json({ ok: true }, { headers: { 'set-cookie': await sessionCookie(env.ADMIN_PASSWORD) } });
  }
  if (route === 'logout') return json({ ok: true }, { headers: { 'set-cookie': clearCookie } });
  const who = await role(req, env);
  if (!who) return json({ error: 'sign in' }, { status: 401 });
  if (req.method !== 'GET' && req.headers.get('origin') && req.headers.get('origin') !== url.origin) return json({ error: 'origin' }, { status: 403 });
  const [head, a, b] = route.split('/');
  const body = req.method === 'PUT' || req.method === 'POST' ? await req.clone().json().catch(() => ({})) : {};
  // Agents edit copy (kids apps included, 2026-11-02) and read data; keys and connections stay human-only.
  if (who === 'agent' && (head === 'settings' || head === 'google' || head === 'bing' || (head === 'apps' && b === 'approve'))) {
    return json({ error: 'operator only' }, { status: 403 });
  }

  if (head === 'report' && req.method === 'GET') return json(await report(db, Math.min(90, Math.max(7, +url.searchParams.get('days') || 28))));

  if (head === 'state' && req.method === 'GET') {
    const s = await getSettings(db);
    const settings = {};
    for (const k of SETTING_KEYS) settings[k] = SECRET_KEYS.includes(k) ? (s[k] ? '••••••' : '') : s[k] ?? '';
    if (env.GOOGLE_CLIENT_SECRET && !s.google_client_secret) settings.google_client_secret = '•••••• (shared with Marquee)';
    settings.probe_enabled = !!s.probe_enabled;
    for (const k of ['google_last_sync', 'google_last_error', 'google_sites_found', 'bing_last_sync', 'bing_last_error', 'probe_last_error', 'indexnow_last', 'indexnow_last_error']) settings[k] = s[k] || '';
    settings.google_connected = !!s.google_refresh_token;
    const apps = await loadApps(db, { fresh: true });
    const { results: changes } = await db.prepare('SELECT * FROM changes ORDER BY id DESC LIMIT 40').all();
    return json({ settings, apps, changes, redirect_uri: redirectUri(url.origin), indexnow_key: env.INDEXNOW_KEY, role: who });
  }

  if (head === 'catalog' && req.method === 'GET') return json((await loadApps(db, { fresh: true })).map(publicApp));

  if (head === 'apps' && a) {
    const row = await db.prepare('SELECT * FROM apps WHERE id = ?').bind(a).first();
    if (!row) return json({ error: 'no such app' }, { status: 404 });
    const data = JSON.parse(row.data);
    if (b === 'approve' && req.method === 'POST') {
      if (!row.draft) return json({ error: 'no draft' }, { status: 400 });
      const draft = JSON.parse(row.draft);
      await db.prepare('UPDATE apps SET data = ?, draft = NULL, updated_at = ?, updated_by = ? WHERE id = ?')
        .bind(JSON.stringify({ ...data, ...draft }), new Date().toISOString(), 'operator', a).run();
      await logChange(db, a, 'operator', Object.keys(draft), 'approved');
      invalidate();
      ctx.waitUntil(enqueue(env.DB, appUrls({ ...data, ...draft })));
      return json({ ok: true });
    }
    if (b === 'reject' && req.method === 'POST') {
      await db.prepare('UPDATE apps SET draft = NULL WHERE id = ?').bind(a).run();
      await logChange(db, a, 'operator', [], 'rejected');
      return json({ ok: true });
    }
    if (!b && req.method === 'PUT') {
      const { patch, errors } = validateEdit(body);
      if (errors.length) return json({ error: errors.join('; ') }, { status: 400 });
      if (!Object.keys(patch).length) return json({ error: 'nothing to change' }, { status: 400 });
      await db.prepare('UPDATE apps SET data = ?, updated_at = ?, updated_by = ? WHERE id = ?')
        .bind(JSON.stringify({ ...data, ...patch }), new Date().toISOString(), who, a).run();
      await logChange(db, a, who, Object.keys(patch), 'live');
      invalidate();
      ctx.waitUntil(enqueue(env.DB, appUrls({ ...data, ...patch })));
      return json({ ok: true, status: 'live' });
    }
  }

  if (head === 'settings' && req.method === 'PUT') {
    for (const [k, v] of Object.entries(body)) {
      if (!SETTING_KEYS.includes(k) || String(v).startsWith('••••••')) continue;
      await setSetting(db, k, typeof v === 'boolean' ? (v ? '1' : '') : String(v ?? '').trim());
    }
    return json({ ok: true });
  }

  if (head === 'google') {
    const s = await getSettings(db);
    s.google_client_secret ||= env.GOOGLE_CLIENT_SECRET;
    s.google_client_id ||= env.GOOGLE_CLIENT_ID;
    if (a === 'connect') {
      if (!s.google_client_id || !s.google_client_secret) return json({ error: 'Paste the OAuth client id and secret first.' }, { status: 400 });
      if (!(await getSettings(db)).google_client_id) await setSetting(db, 'google_client_id', s.google_client_id);
      const state = crypto.randomUUID();
      await setSetting(db, 'google_oauth_state', state);
      return json({ url: authUrl(s, url.origin, state), redirect: redirectUri(url.origin) });
    }
    if (a === 'sync' && req.method === 'POST') {
      try { return json(await syncGoogle(db, env)); } catch (e) {
        await setSetting(db, 'google_last_error', String(e.message || e));
        return json({ error: String(e.message || e) }, { status: 502 });
      }
    }
    if (a === 'disconnect' && req.method === 'POST') { await setSetting(db, 'google_refresh_token', ''); return json({ ok: true }); }
  }
  if (head === 'bing' && a === 'sync' && req.method === 'POST') {
    try { return json(await syncBing(db)); } catch (e) { await setSetting(db, 'bing_last_error', String(e.message || e)); return json({ error: String(e.message || e) }, { status: 502 }); }
  }
  if (head === 'indexnow' && req.method === 'POST') {
    const apps = await loadApps(db);
    const urls = apps.flatMap((x) => [x.url, ...(pathOf(x) ? [`${ORIGIN}${pathOf(x)}llms.txt`] : [])]);
    return json({ urls: urls.length, result: await indexNow(env, urls) });
  }
  if (head === 'probe' && req.method === 'POST') {
    if (who === 'agent') return json({ error: 'operator only (it spends API credit)' }, { status: 403 });
    return json(await probeChunk(db, 12));
  }
  return json({ error: 'not found' }, { status: 404 });
}

// An app's front page plus its extra_urls (relative ones resolve against the app's origin).
function appUrls(app) {
  const out = [app.url];
  for (const u of app.extra_urls || []) { try { out.push(new URL(u, app.url).href); } catch {} }
  return out;
}

async function enqueue(db, urls) {
  const s = await getSettings(db);
  let q = [];
  try { q = JSON.parse(s.indexnow_queue || '[]'); } catch {}
  for (const url of [].concat(urls)) if (!q.includes(url)) q.push(url);
  await setSetting(db, 'indexnow_queue', JSON.stringify(q));
}

async function logChange(db, app, by, fields, status) {
  await db.prepare('INSERT INTO changes (at, app_id, by, fields, status) VALUES (?,?,?,?,?)')
    .bind(new Date().toISOString(), app, by, fields.join(','), status).run();
}
