// D1 schema + seed. The Worker creates its own tables on first request (idempotent).
// The repo's catalog.json is the seed; after that D1 is the live copy (the console and Agency edit it).
import seed from '../catalog.json';
import { IDENTITY } from './cast.js';
import { copyUpdates } from './lib/copy.js';

const IDENTITY_OF = (id) => { const c = IDENTITY[id]; return c ? { url: c.url, audience: c.audience } : {}; };

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)`,
  // data: the published entry (JSON). draft: a kids-app edit waiting for operator sign-off.
  `CREATE TABLE IF NOT EXISTS apps (id TEXT PRIMARY KEY, data TEXT NOT NULL, draft TEXT, html_hash TEXT,
    modified TEXT, sort INTEGER DEFAULT 0, updated_at TEXT, updated_by TEXT)`,
  `CREATE TABLE IF NOT EXISTS changes (id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT, app_id TEXT, by TEXT, fields TEXT, status TEXT)`,
  // Aggregate visits by crawler family; no IPs, no visitor ids.
  `CREATE TABLE IF NOT EXISTS crawls (day TEXT, app_id TEXT, bot TEXT, kind TEXT, n INTEGER DEFAULT 0, PRIMARY KEY (day, app_id, bot, kind))`,
  // Search Console / Bing: queries over the trailing 28 days (replaced each sync) + daily totals.
  `CREATE TABLE IF NOT EXISTS queries (source TEXT, app_id TEXT, query TEXT, page TEXT, clicks INTEGER, impressions INTEGER,
    ctr REAL, position REAL, PRIMARY KEY (source, app_id, query, page))`,
  `CREATE TABLE IF NOT EXISTS search_daily (day TEXT, app_id TEXT, source TEXT, clicks INTEGER, impressions INTEGER, PRIMARY KEY (day, app_id, source))`,
  `CREATE TABLE IF NOT EXISTS index_status (url TEXT PRIMARY KEY, app_id TEXT, verdict TEXT, coverage TEXT, last_crawl TEXT, checked_at TEXT)`,
  // Weekly answer-engine probe: did ChatGPT / Perplexity / Claude cite or name us for a target question?
  `CREATE TABLE IF NOT EXISTS citations (week TEXT, engine TEXT, query TEXT, app_id TEXT, cited INTEGER, mentioned INTEGER,
    sources TEXT, error TEXT, PRIMARY KEY (week, engine, query))`,
  // The title + description hash of each app's catalog.json entry as last seen, so a merged copy change publishes.
  `CREATE TABLE IF NOT EXISTS copy_seen (id TEXT PRIMARY KEY, hash TEXT NOT NULL)`,
];

let ready = false;
export async function ensureSchema(db) {
  if (ready) return;
  await db.batch(SCHEMA.map((s) => db.prepare(s)));
  await db.batch(seed.map((a, i) => db.prepare(
    'INSERT OR IGNORE INTO apps (id, data, sort, updated_at, updated_by) VALUES (?,?,?,?,?)',
  ).bind(a.id, JSON.stringify(a), i, new Date().toISOString(), 'seed')));
  await applyMergedCopy(db);
  ready = true;
}

// catalog.json is reviewed copy: the owner merged it (the search-copy drafts PR, or a hand edit). A title or
// description that changed there since the last deploy replaces the live one; anything else stays D1's.
export async function applyMergedCopy(db) {
  const { results } = await db.prepare('SELECT id, hash FROM copy_seen').all();
  const { baseline, apply } = copyUpdates(seed, results || []);
  const at = new Date().toISOString();
  const stmts = [
    ...baseline.map((b) => db.prepare('INSERT OR IGNORE INTO copy_seen (id, hash) VALUES (?, ?)').bind(b.id, b.hash)),
    ...apply.flatMap((u) => [
      db.prepare("UPDATE apps SET data = json_set(data, '$.title', ?, '$.description', ?), updated_at = ?, updated_by = 'catalog' WHERE id = ?").bind(u.title, u.description, at, u.id),
      db.prepare('UPDATE copy_seen SET hash = ? WHERE id = ?').bind(u.hash, u.id),
      db.prepare('INSERT INTO changes (at, app_id, by, fields, status) VALUES (?,?,?,?,?)').bind(at, u.id, 'catalog', 'title,description', 'merged'),
    ]),
  ];
  if (stmts.length) await db.batch(stmts);
  return { baseline: baseline.length, applied: apply.map((u) => u.id) };
}

export async function getSettings(db) {
  const { results } = await db.prepare('SELECT key, value FROM settings').all();
  const s = Object.fromEntries(results.map((r) => [r.key, r.value]));
  for (const k of ['probe_enabled']) s[k] = s[k] === '1';
  return s;
}

export async function setSetting(db, key, value) {
  await db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
    .bind(key, value == null ? '' : String(value)).run();
}

// Catalog rows are read on every front-page hit, so keep them in the isolate for a minute.
let cache = { at: 0, apps: null };
export function invalidate() { cache = { at: 0, apps: null }; }

export async function loadApps(db, { fresh = false } = {}) {
  if (!fresh && cache.apps && Date.now() - cache.at < 60e3) return cache.apps;
  const { results } = await db.prepare('SELECT * FROM apps ORDER BY sort').all();
  // Name, URL and audience are Cast List's (the portfolio's catalog); the rest is Playbill's own copy.
  const apps = results.map((r) => ({ ...JSON.parse(r.data), ...IDENTITY_OF(r.id), ...(r.modified && { modified: r.modified }),
    _draft: r.draft ? JSON.parse(r.draft) : null, _updated_at: r.updated_at, _updated_by: r.updated_by }));
  cache = { at: Date.now(), apps };
  return apps;
}

export const publicApp = (a) => Object.fromEntries(Object.entries(a).filter(([k]) => !k.startsWith('_')));
