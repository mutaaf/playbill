// Discovery report: the one read an agent (Hermes) or the console needs to decide what to change next.
// Every opportunity names the call that acts on it.
import { getSettings, loadApps } from './db.js';
import { AI_BOTS } from './lib/render.js';
import { isoWeek } from './probe.js';

const iso = (d) => d.toISOString().slice(0, 10);
const sum = (rows, k) => rows.reduce((t, r) => t + (r[k] || 0), 0);
const round = (n, p = 1) => Math.round(n * 10 ** p) / 10 ** p;

export async function report(db, days = 28) {
  const since = iso(new Date(Date.now() - days * 864e5));
  const wk = iso(new Date(Date.now() - 7 * 864e5));
  const all = (sql, ...b) => db.prepare(sql).bind(...b).all().then((r) => r.results);
  const [s, apps, crawls, queries, daily, idx, cites] = await Promise.all([
    getSettings(db), loadApps(db, { fresh: true }),
    all('SELECT * FROM crawls WHERE day >= ?', since),
    all('SELECT * FROM queries'),
    all('SELECT * FROM search_daily WHERE day >= ?', since),
    all('SELECT * FROM index_status'),
    all('SELECT * FROM citations WHERE week >= ? ORDER BY week DESC', isoWeek(new Date(Date.now() - 28 * 864e5))),
  ]);
  const thisWeek = isoWeek();
  const lastProbe = cites.find((c) => c.week === thisWeek && !c.error) ? thisWeek : cites.find((c) => !c.error)?.week;

  const rows = apps.map((a) => {
    const cr = crawls.filter((r) => r.app_id === a.id);
    const bots = {};
    for (const r of cr) if (r.bot !== 'human') bots[r.bot] = (bots[r.bot] || 0) + r.n;
    const q = queries.filter((r) => r.app_id === a.id);
    const dl = daily.filter((r) => r.app_id === a.id);
    const ix = idx.find((r) => r.app_id === a.id && r.url === a.url);
    const pc = cites.filter((c) => c.app_id === a.id && c.week === lastProbe && !c.error);
    const top = [...q].sort((x, y) => y.impressions - x.impressions).slice(0, 10)
      .map((r) => ({ query: r.query, source: r.source, clicks: r.clicks, impressions: r.impressions, ctr_pct: round(r.ctr * 100), position: round(r.position) }));
    return {
      id: a.id, name: a.name, url: a.url, audience: a.audience, kind: a.kind,
      title: a.title, description: a.description, draft_pending: !!a._draft, modified: a.modified || a.updated || null,
      search: { clicks: sum(dl, 'clicks'), impressions: sum(dl, 'impressions'), clicks_7d: sum(dl.filter((r) => r.day > wk), 'clicks'), top_queries: top },
      index: ix ? { verdict: ix.verdict, coverage: ix.coverage, last_crawl: ix.last_crawl } : null,
      crawlers: { ai: Object.entries(bots).filter(([b]) => AI_BOTS.has(b)).reduce((t, [, n]) => t + n, 0),
        search: (bots.Googlebot || 0) + (bots.Bingbot || 0) + (bots.Applebot || 0) + (bots.DuckDuckBot || 0), by_bot: bots,
        human_hits: sum(cr.filter((r) => r.bot === 'human'), 'n') },
      answers: pc.length ? { week: lastProbe, asked: pc.length, cited: sum(pc, 'cited'), mentioned: sum(pc, 'mentioned'),
        share_pct: Math.round((pc.filter((c) => c.cited || c.mentioned).length / pc.length) * 100),
        misses: pc.filter((c) => !c.cited && !c.mentioned).map((c) => ({ engine: c.engine, query: c.query, sources: JSON.parse(c.sources || '[]') })) } : null,
      intents: a.intents || [],
    };
  });

  const opp = [];
  const add = (impact, app, title, detail, action) => opp.push({ impact, app, title, detail, action });
  if (!s.google_refresh_token) add('high', null, 'Search Console not connected', 'No Google search data: rankings, clicks and indexing are invisible.', 'operator: /playbill/admin → Setup → Connect Search Console');
  else if (s.google_last_error) add('high', null, 'Search Console sync problem', s.google_last_error, 'operator: verify the property in Search Console, then Sync now');
  if (!s.bing_api_key) add('medium', null, 'Bing not connected', 'Bing powers ChatGPT search and Copilot answers; without its key there is no Bing query data.', 'operator: Setup → Bing API key');
  if (!s.probe_enabled || !(s.openai_api_key || s.perplexity_api_key || s.anthropic_api_key)) add('medium', null, 'Answer-engine probe off', 'No weekly check of whether ChatGPT, Perplexity or Claude cite the apps.', 'operator: Setup → engine keys + probe on');
  const fresh = new Set(['site']);
  for (const a of rows) {
    if (a.index && a.index.verdict && a.index.verdict !== 'PASS') add('high', a.id, `${a.name}: not indexed by Google`, a.index.coverage || a.index.verdict, 'operator: Search Console → URL inspection → Request indexing');
    if (s.google_refresh_token && !a.search.impressions && !fresh.has(a.id)) add('medium', a.id, `${a.name}: no Google impressions in ${days} days`, 'The page is not ranking for anything yet. Sharpen title/description around a searchable phrase and earn a few links (portals, directories).', `PUT /playbill/api/admin/apps/${a.id} {title, description}`);
    for (const q of a.search.top_queries) {
      if (q.position > 7 && q.position <= 20 && q.impressions >= 20) add('high', a.id, `${a.name}: "${q.query}" on page 2 (pos ${q.position})`, `${q.impressions} impressions. Answer it directly in the summary or an FAQ so the page is the best match.`, `PUT /playbill/api/admin/apps/${a.id} {faqs|summary}`);
      else if (q.position <= 5 && q.impressions >= 50 && q.ctr_pct < 2) add('medium', a.id, `${a.name}: "${q.query}" ranks ${q.position} but ${q.ctr_pct}% click`, 'The snippet isn\'t earning the click. Rewrite title/description to promise exactly that.', `PUT /playbill/api/admin/apps/${a.id} {title, description}`);
    }
    if (a.answers) {
      const competitors = {};
      for (const m of a.answers.misses) for (const d of m.sources) competitors[d] = (competitors[d] || 0) + 1;
      const topComp = Object.entries(competitors).sort((x, y) => y[1] - x[1]).slice(0, 5).map(([d]) => d);
      if (a.answers.misses.length) add(a.answers.share_pct < 25 ? 'high' : 'medium', a.id, `${a.name}: missing from ${a.answers.misses.length}/${a.answers.asked} AI answers`,
        `e.g. "${a.answers.misses[0].query}" (${a.answers.misses[0].engine}). Engines cited instead: ${topComp.join(', ') || 'nothing'}. Get listed on those, and add an FAQ that answers the question word for word.`,
        `outreach to ${topComp.slice(0, 3).join(', ') || 'directories'} + PUT /playbill/api/admin/apps/${a.id} {faqs}`);
    }
    if (!a.crawlers.ai && a.crawlers.human_hits > 20) add('low', a.id, `${a.name}: no AI crawler visits in ${days} days`, 'Answer engines have not fetched the page. Links from places they already crawl (GitHub READMEs, portals, Reddit, HN) fix this fastest.', 'off-site: listings + links');
    if (a.draft_pending) add('medium', a.id, `${a.name}: kids-app copy waiting for sign-off`, 'An edit is drafted and not live.', 'operator: /playbill/admin → Catalog → Approve');
  }
  const rank = { high: 0, medium: 1, low: 2 };
  opp.sort((x, y) => rank[x.impact] - rank[y.impact]);
  return {
    window: { from: since, to: iso(new Date()), days },
    connections: { google: !!s.google_refresh_token, google_sites: s.google_sites_found || '', google_last_sync: s.google_last_sync || null,
      bing: !!s.bing_api_key, bing_last_sync: s.bing_last_sync || null, probe: !!s.probe_enabled,
      engines: ['openai', 'perplexity', 'anthropic'].filter((e) => s[`${e}_api_key`]) },
    totals: { clicks: sum(rows.map((r) => r.search), 'clicks'), impressions: sum(rows.map((r) => r.search), 'impressions'),
      ai_crawls: sum(rows.map((r) => r.crawlers), 'ai'), search_crawls: sum(rows.map((r) => r.crawlers), 'search') },
    apps: rows,
    opportunities: opp,
  };
}
