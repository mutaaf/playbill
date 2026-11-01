// Where the traffic comes from: Google Search Console (OAuth), Bing Webmaster (API key), IndexNow pings.
import { getSettings, setSetting, loadApps } from './db.js';
import { appForUrl, ORIGIN } from './lib/render.js';

const SCOPE = 'https://www.googleapis.com/auth/webmasters';
const GSC = 'https://www.googleapis.com/webmasters/v3';
const iso = (d) => d.toISOString().slice(0, 10);

export const redirectUri = (origin) => `${origin}/playbill/api/google/callback`;
export const sites = (s) => (s.gsc_sites || 'sc-domain:mutaafaziz.com,sc-domain:18-0.co').split(',').map((x) => x.trim()).filter(Boolean);

export function authUrl(s, origin, state) {
  return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
    client_id: s.google_client_id, redirect_uri: redirectUri(origin), response_type: 'code',
    scope: SCOPE, access_type: 'offline', prompt: 'consent', state,
  })}`;
}

async function token(body) {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(body),
  });
  return r.json();
}

export async function exchangeCode(db, s, origin, code) {
  const j = await token({ code, client_id: s.google_client_id, client_secret: s.google_client_secret,
    redirect_uri: redirectUri(origin), grant_type: 'authorization_code' });
  if (!j.refresh_token) throw new Error(j.error_description || j.error || 'no refresh token');
  await setSetting(db, 'google_refresh_token', j.refresh_token);
}

async function gfetch(at, url, init = {}) {
  const r = await fetch(url, { ...init, headers: { authorization: `Bearer ${at}`, 'content-type': 'application/json', ...(init.headers || {}) } });
  const text = await r.text();
  const j = text ? JSON.parse(text) : {};
  if (!r.ok) throw new Error(j.error?.message || `Google ${r.status}`);
  return j;
}

/** Pull 28 days of queries and pages, submit sitemaps, inspect each app's front page. */
export async function syncGoogle(db, env = {}) {
  const s = await getSettings(db);
  // The client secret is shared with Marquee as a Worker secret; the console can override it.
  s.google_client_id ||= env.GOOGLE_CLIENT_ID;
  s.google_client_secret ||= env.GOOGLE_CLIENT_SECRET;
  if (!s.google_refresh_token) return { skipped: 'not connected' };
  const t = await token({ client_id: s.google_client_id, client_secret: s.google_client_secret,
    refresh_token: s.google_refresh_token, grant_type: 'refresh_token' });
  if (!t.access_token) throw new Error(t.error_description || t.error || 'token refresh failed');
  const at = t.access_token;
  const apps = await loadApps(db, { fresh: true });
  const end = new Date(Date.now() - 2 * 864e5), start = new Date(+end - 27 * 864e5);
  const listed = (await gfetch(at, `${GSC}/sites`)).siteEntry || [];
  // A property added but not yet verified is listed as siteUnverifiedUser; it can't be read.
  const owned = sites(s).filter((x) => listed.some((e) => e.siteUrl === x && e.permissionLevel !== 'siteUnverifiedUser'));
  const stmts = [db.prepare("DELETE FROM queries WHERE source = 'google'")];
  let rows = 0;
  for (const site of owned) {
    const q = (dims, limit) => gfetch(at, `${GSC}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: 'POST', body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions: dims, rowLimit: limit }) });
    for (const r of (await q(['query', 'page'], 1000)).rows || []) {
      const app = appForUrl(r.keys[1], apps) || 'site';
      stmts.push(db.prepare(`INSERT OR REPLACE INTO queries VALUES ('google',?,?,?,?,?,?,?)`)
        .bind(app, r.keys[0], r.keys[1], r.clicks, r.impressions, r.ctr, r.position));
      rows++;
    }
    const daily = new Map();
    for (const r of (await q(['date', 'page'], 5000)).rows || []) {
      const k = `${r.keys[0]}|${appForUrl(r.keys[1], apps) || 'site'}`;
      const v = daily.get(k) || [0, 0];
      daily.set(k, [v[0] + r.clicks, v[1] + r.impressions]);
    }
    for (const [k, [c, i]] of daily) stmts.push(db.prepare(`INSERT OR REPLACE INTO search_daily VALUES (?,?,'google',?,?)`).bind(...k.split('|'), c, i));
    // Keep the sitemap submitted; Google re-reads it on its own after that.
    const host = site.startsWith('sc-domain:') ? `https://${site.slice(10)}` : site.replace(/\/$/, '');
    await gfetch(at, `${GSC}/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(`${host}/sitemap.xml`)}`, { method: 'PUT' }).catch(() => {});
    // URL Inspection: is each front page indexed, and when was it last crawled?
    for (const a of apps.filter((x) => new URL(x.url).origin === host)) {
      try {
        const r = await gfetch(at, 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
          method: 'POST', body: JSON.stringify({ inspectionUrl: a.url, siteUrl: site }) });
        const x = r.inspectionResult?.indexStatusResult || {};
        stmts.push(db.prepare('INSERT OR REPLACE INTO index_status VALUES (?,?,?,?,?,?)')
          .bind(a.url, a.id, x.verdict || '', x.coverageState || '', x.lastCrawlTime || '', new Date().toISOString()));
      } catch { /* inspection quota or permission: try again tomorrow */ }
    }
  }
  await db.batch(stmts);
  await setSetting(db, 'google_last_sync', new Date().toISOString());
  await setSetting(db, 'google_sites_found', owned.join(','));
  await setSetting(db, 'google_last_error', owned.length ? '' : `None of ${sites(s).join(', ')} is verified for this Google login yet.`);
  return { sites: owned, rows };
}

/** Bing Webmaster query stats (Bing also feeds ChatGPT search and Copilot). Attributed by app name. */
export async function syncBing(db) {
  const s = await getSettings(db);
  if (!s.bing_api_key) return { skipped: 'no key' };
  const apps = await loadApps(db);
  const stmts = [db.prepare("DELETE FROM queries WHERE source = 'bing'")];
  for (const host of [`${ORIGIN}/`, 'https://18-0.co/']) {
    const u = `https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?siteUrl=${encodeURIComponent(host)}&apikey=${encodeURIComponent(s.bing_api_key)}`;
    const r = await fetch(u);
    if (!r.ok) { if (r.status === 400 || r.status === 404) continue; throw new Error(`Bing ${r.status}`); }
    const agg = new Map();
    for (const row of (await r.json()).d || []) {
      const q = String(row.Query || '').toLowerCase();
      const app = host.includes('18-0') ? '18-0' : (apps.find((a) => a.kind !== 'site' && q.includes(a.name.toLowerCase().split(' ')[0])) || { id: 'site' }).id;
      const k = `${app}|${q}`;
      const v = agg.get(k) || { c: 0, i: 0, p: 0 };
      agg.set(k, { c: v.c + (row.Clicks || 0), i: v.i + (row.Impressions || 0), p: row.AvgImpressionPosition || v.p });
    }
    for (const [k, v] of agg) stmts.push(db.prepare(`INSERT OR REPLACE INTO queries VALUES ('bing',?,?,?,?,?,?,?)`)
      .bind(...k.split('|'), host, v.c, v.i, v.i ? v.c / v.i : 0, v.p));
  }
  await db.batch(stmts);
  await setSetting(db, 'bing_last_sync', new Date().toISOString());
  return { rows: stmts.length - 1 };
}

/** IndexNow tells Bing, Yandex, Seznam and Naver a URL changed; Bing's index feeds ChatGPT search. */
export async function indexNow(env, urls) {
  const byHost = new Map();
  for (const u of urls) { const h = new URL(u).host; byHost.set(h, [...(byHost.get(h) || []), u]); }
  const out = {};
  for (const [host, list] of byHost) {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host, key: env.INDEXNOW_KEY, keyLocation: `https://${host}/${env.INDEXNOW_KEY}.txt`, urlList: list }),
    });
    out[host] = r.status;
  }
  return out;
}
