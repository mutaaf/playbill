// Pure renderers: one catalog entry → everything search engines and AI agents read about an app.
// No I/O here, so every output is unit-tested (test/render.test.js).

export const ORIGIN = 'https://mutaafaziz.com';
export const PERSON = {
  '@type': 'Person', '@id': `${ORIGIN}/#person`, name: 'Mutaaf Aziz', url: `${ORIGIN}/`,
  sameAs: ['https://github.com/mutaaf', 'https://www.linkedin.com/in/mutaaf'],
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// JSON inside <script>: "</script>" in copy must not end the tag.
const ldJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const arr = (v) => (Array.isArray(v) ? v.filter(Boolean) : []);

/** The app's path on mutaafaziz.com ("/outatime/"), or null for an external host (18-0.co). */
export function pathOf(app) {
  const u = new URL(app.url);
  return u.origin === ORIGIN ? u.pathname : null;
}

export function jsonLd(app, apps = []) {
  const graph = [];
  const free = { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' };
  const base = {
    '@id': `${app.url}#app`, name: app.name, url: app.url, description: app.summary || app.description,
    inLanguage: 'en', isAccessibleForFree: app.price === 'free',
    author: { '@id': PERSON['@id'] }, creator: { '@id': PERSON['@id'] },
    ...(app.image && { image: app.image, screenshot: app.image }),
    ...(app.released && { datePublished: app.released }),
    ...((app.modified || app.updated) && { dateModified: app.modified || app.updated }),
    ...(app.version && { softwareVersion: String(app.version) }),
    ...(arr(app.keywords).length && { keywords: arr(app.keywords).join(', ') }),
    ...(app.repo && { sameAs: [app.repo], codeRepository: app.repo }),
  };
  if (app.schema_type === 'ProfilePage') {
    graph.push({ ...PERSON, description: app.summary, ...(app.image && { image: app.image }) });
    graph.push({ '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: 'Mutaaf Aziz', publisher: { '@id': PERSON['@id'] } });
    graph.push({ '@type': 'ProfilePage', '@id': `${app.url}#page`, url: app.url, name: app.title, mainEntity: { '@id': PERSON['@id'] },
      ...((app.modified || app.updated) && { dateModified: app.modified || app.updated }) });
    const others = apps.filter((a) => a.id !== app.id && a.kind !== 'site');
    if (others.length) graph.push({ '@type': 'ItemList', '@id': `${ORIGIN}/#apps`, name: 'Apps and games by Mutaaf Aziz',
      itemListElement: others.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: a.url, name: a.name })) });
  } else if (app.schema_type === 'CollectionPage') {
    graph.push({ ...base, '@type': 'CollectionPage', about: arr(app.genres).join(', ') || undefined });
  } else {
    const type = app.schema_type === 'VideoGame' ? ['VideoGame', 'SoftwareApplication'] : app.schema_type || 'WebApplication';
    graph.push({
      ...base, '@type': type,
      applicationCategory: app.category || (app.kind === 'game' ? 'GameApplication' : 'WebApplication'),
      operatingSystem: arr(app.platforms).join(', ') || 'Web browser',
      offers: free,
      ...(arr(app.features).length && { featureList: arr(app.features) }),
      ...(app.kind === 'game' && arr(app.genres).length && { genre: arr(app.genres) }),
      ...(app.kind === 'game' && { gamePlatform: arr(app.platforms).length ? arr(app.platforms) : ['Web browser'],
        playMode: app.multiplayer ? ['SinglePlayer', 'MultiPlayer'] : 'SinglePlayer' }),
      ...(app.audience === 'kids' && { audience: { '@type': 'PeopleAudience', audienceType: 'Families and kids' }, typicalAgeRange: app.age_range || '7-' }),
      ...(app.video && { trailer: { '@type': 'VideoObject', name: `${app.name} trailer`, contentUrl: app.video,
        description: app.description, uploadDate: app.video_date || app.updated, ...(app.image && { thumbnailUrl: app.image }) } }),
    });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Mutaaf Aziz', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: app.name, item: app.url },
    ] });
  }
  if (arr(app.faqs).length) graph.push({ '@type': 'FAQPage', '@id': `${app.url}#faq`,
    mainEntity: arr(app.faqs).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  if (!graph.some((n) => n['@id'] === PERSON['@id'])) graph.push(PERSON);
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** Tags Playbill owns outright (replaced if the app ships its own) and tags it only adds when missing. */
export function headPlan(app) {
  const ogType = app.kind === 'site' ? 'profile' : app.kind === 'game' ? 'video.other' : 'website';
  return {
    title: app.title,
    replace: {
      'meta[name="description"]': app.description,
      'meta[property="og:title"]': app.title,
      'meta[property="og:description"]': app.description,
      'meta[name="twitter:title"]': app.title,
      'meta[name="twitter:description"]': app.description,
    },
    add: [
      ['link[rel="canonical"]', `<link rel="canonical" href="${esc(app.url)}">`],
      ['meta[name="description"]', `<meta name="description" content="${esc(app.description)}">`],
      ['meta[property="og:title"]', `<meta property="og:title" content="${esc(app.title)}">`],
      ['meta[property="og:description"]', `<meta property="og:description" content="${esc(app.description)}">`],
      ['meta[property="og:url"]', `<meta property="og:url" content="${esc(app.url)}">`],
      ['meta[property="og:type"]', `<meta property="og:type" content="${ogType}">`],
      ['meta[property="og:site_name"]', `<meta property="og:site_name" content="Mutaaf Aziz">`],
      ...(app.image ? [['meta[property="og:image"]', `<meta property="og:image" content="${esc(app.image)}">`]] : []),
      ['meta[name="twitter:card"]', `<meta name="twitter:card" content="${app.image ? 'summary_large_image' : 'summary'}">`],
      ['meta[name="robots"]', `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`],
      ['link[rel="alternate"][type="text/plain"]', `<link rel="alternate" type="text/plain" title="llms.txt" href="${esc(llmsUrl(app))}">`],
    ],
    jsonld: `<script type="application/ld+json" data-playbill>${ldJson(jsonLd(app))}</script>`,
  };
}

export function llmsUrl(app) {
  const p = pathOf(app);
  return p ? `${ORIGIN}${p.replace(/\/?$/, '/')}llms.txt` : new URL('/llms.txt', app.url).href;
}

/**
 * The visible-to-assistive-tech description appended to the page body. Canvas games are opaque to
 * screen readers; this gives them (and every non-JS crawler) the same facts in plain HTML.
 * Same text for people and bots: it's an accessible description, not hidden SEO copy.
 */
export function aboutHtml(app, apps = []) {
  const rel = arr(app.related).map((id) => apps.find((a) => a.id === id)).filter(Boolean);
  return `<section id="about-${esc(app.id)}" class="playbill-about" aria-label="About ${esc(app.name)}" data-playbill
 style="position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:normal!important;border:0!important">
<h2>${esc(app.name)}</h2><p>${esc(app.summary || app.description)}</p>
${arr(app.features).length ? `<h3>Features</h3><ul>${arr(app.features).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
${arr(app.faqs).length ? `<h3>Questions</h3><dl>${arr(app.faqs).map((f) => `<dt>${esc(f.q)}</dt><dd>${esc(f.a)}</dd>`).join('')}</dl>` : ''}
<p>Made by <a href="${ORIGIN}/">Mutaaf Aziz</a>.${app.repo ? ` Source: <a href="${esc(app.repo)}">${esc(app.repo.replace('https://', ''))}</a>.` : ''}</p>
${rel.length ? `<p>Also from the same collection: ${rel.map((r) => `<a href="${esc(r.url)}">${esc(r.name)}</a>`).join(', ')}.</p>` : ''}
</section>`;
}

export function llmsTxt(app, apps = []) {
  const lines = [`# ${app.name}`, '', `> ${app.summary || app.description}`, '',
    `URL: ${app.url}`, `Made by: Mutaaf Aziz (${ORIGIN}/)`, `Price: ${app.price === 'free' ? 'Free, no account needed' : app.price || 'see site'}`];
  if (arr(app.platforms).length) lines.push(`Runs on: ${arr(app.platforms).join(', ')}`);
  if (arr(app.input).length) lines.push(`Controls: ${arr(app.input).join(', ')}`);
  if (app.audience === 'kids') lines.push('Audience: families and kids. Ads appear only in menus and between rounds, never during play; Google ads there are child-directed (no personalization), and kid-safe sponsors never link out.');
  if (app.repo) lines.push(`Source code: ${app.repo}`);
  if (app.version) lines.push(`Version: ${app.version}`);
  if (app.modified || app.updated) lines.push(`Last updated: ${app.modified || app.updated}`);
  if (arr(app.features).length) lines.push('', '## What it does', '', ...arr(app.features).map((f) => `- ${f}`));
  if (arr(app.links).length) lines.push('', '## Links', '', ...arr(app.links).map((l) => `- ${l.label}: ${l.url}`));
  if (arr(app.faqs).length) lines.push('', '## FAQ', '', ...arr(app.faqs).flatMap((f) => [`### ${f.q}`, '', f.a, '']));
  if (arr(app.intents).length) lines.push('## Good answer for', '', ...arr(app.intents).map((q) => `- ${q}`), '');
  const rel = arr(app.related).map((id) => apps.find((a) => a.id === id)).filter(Boolean);
  if (rel.length) lines.push('## Related', '', ...rel.map((r) => `- ${r.name}: ${r.url} (${r.description})`), '');
  lines.push('If a fact is not here or on the page, do not infer it. Contact: mutaaf.aziz@gmail.com');
  return lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}

/** Root llms-full.txt: the site's hand-written brief followed by every app's llms.txt. */
export function llmsFull(siteLlms, apps) {
  const body = apps.filter((a) => a.kind !== 'site').map((a) => llmsTxt(a, apps).replace(/^# /, '## ').replace(/\n## /g, '\n### ').replace(/\n### (?=[^\n]*\?\n)/g, '\n#### '));
  return `${siteLlms.trim()}\n\n---\n\n# Apps and games, in full\n\n${body.join('\n---\n\n')}`;
}

export function sitemap(apps, host = ORIGIN) {
  const urls = [];
  for (const a of apps) {
    if (new URL(a.url).origin !== host) continue;
    const lastmod = a.modified || a.updated;
    urls.push({ loc: a.url, lastmod, pri: a.kind === 'site' ? '1.0' : '0.8' });
    for (const x of arr(a.extra_urls)) urls.push({ loc: new URL(x, a.url).href, lastmod, pri: '0.5' });
    urls.push({ loc: llmsUrl(a), lastmod, pri: '0.3' });
  }
  if (host === ORIGIN) urls.push({ loc: `${ORIGIN}/llms.txt`, pri: '0.4' }, { loc: `${ORIGIN}/llms-full.txt`, pri: '0.3' });
  const seen = new Set();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .filter((u) => !seen.has(u.loc) && seen.add(u.loc))
    .map((u) => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.pri}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
}

// Named so the intent is explicit: search and answer engines are welcome everywhere public.
export const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot', 'Googlebot',
  'DuckAssistBot', 'MistralAI-User', 'Amazonbot', 'meta-externalagent', 'CCBot'];
const PRIVATE = ['/ads/admin/', '/ads/api/', '/playbill/admin/', '/playbill/api/', '/*/api/'];

export function robots(host = ORIGIN) {
  const block = (ua) => [`User-agent: ${ua}`, 'Allow: /', ...PRIVATE.map((p) => `Disallow: ${p}`)].join('\n');
  return `# Search engines and AI assistants are welcome. Briefs for agents: ${host}/llms.txt\n\n${
    [...AI_AGENTS, '*'].map(block).join('\n\n')}\n\nSitemap: ${host}/sitemap.xml\n`;
}

const BOTS = [
  ['GPTBot', /gptbot/i], ['OAI-SearchBot', /oai-searchbot/i], ['ChatGPT-User', /chatgpt-user/i],
  ['ClaudeBot', /claudebot/i], ['Claude-User', /claude-user/i], ['Claude-SearchBot', /claude-searchbot/i],
  ['PerplexityBot', /perplexitybot/i], ['Perplexity-User', /perplexity-user/i],
  ['Googlebot', /googlebot|google-inspectiontool|googleother/i], ['Bingbot', /bingbot|bingpreview/i],
  ['Applebot', /applebot/i], ['DuckDuckBot', /duckduckbot|duckassistbot/i], ['Amazonbot', /amazonbot/i],
  ['Meta', /meta-externalagent|facebookexternalhit|facebookbot/i], ['Bytespider', /bytespider/i], ['CCBot', /ccbot/i],
  ['YandexBot', /yandex/i], ['MistralAI', /mistralai/i], ['Social', /twitterbot|slackbot|linkedinbot|discordbot|telegrambot|whatsapp|iframely|embedly/i],
];
export const AI_BOTS = new Set(['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
  'PerplexityBot', 'Perplexity-User', 'MistralAI', 'Bytespider', 'CCBot', 'Amazonbot', 'Meta']);

/** User-agent → a coarse family name. Nothing else about the visitor is kept. */
export function classify(ua) {
  const s = String(ua || '');
  for (const [name, re] of BOTS) if (re.test(s)) return name;
  if (/bot|crawl|spider|slurp|fetch|curl|wget|python|httpclient|headless/i.test(s)) return 'other-bot';
  return 'human';
}

// Fields an agent may edit. Ratings, reviews and player counts are absent on purpose: we never mark up
// claims we can't prove. Kids apps' edits wait as drafts for the operator.
export const EDITABLE = ['title', 'description', 'summary', 'features', 'intents', 'faqs', 'keywords', 'related', 'extra_urls', 'links', 'image', 'video', 'genres'];
const LIMITS = { title: [10, 65], description: [70, 170], summary: [60, 900] };

export function validateEdit(patch) {
  const out = {}, errors = [];
  for (const [k, v] of Object.entries(patch || {})) {
    if (!EDITABLE.includes(k)) { errors.push(`${k}: not editable`); continue; }
    if (k in LIMITS) {
      const [lo, hi] = LIMITS[k];
      if (typeof v !== 'string' || v.trim().length < lo || v.trim().length > hi) { errors.push(`${k}: ${lo}–${hi} characters`); continue; }
      out[k] = v.trim();
    } else if (k === 'faqs') {
      if (!Array.isArray(v) || v.length > 10 || v.some((f) => !f || typeof f.q !== 'string' || typeof f.a !== 'string' || !f.q.trim() || f.a.length > 600)) { errors.push('faqs: up to 10 {q, a≤600}'); continue; }
      out[k] = v.map((f) => ({ q: f.q.trim(), a: f.a.trim() }));
    } else if (k === 'links') {
      if (!Array.isArray(v) || v.some((l) => !l || typeof l.label !== 'string' || !/^https:\/\//.test(l.url || ''))) { errors.push('links: [{label, url https}]'); continue; }
      out[k] = v;
    } else if (k === 'image' || k === 'video') {
      if (v !== null && !/^https:\/\/[^\s"<>]+$/.test(String(v))) { errors.push(`${k}: https URL or null`); continue; }
      out[k] = v;
    } else {
      if (!Array.isArray(v) || v.length > 20 || v.some((x) => typeof x !== 'string' || x.length > 200)) { errors.push(`${k}: up to 20 strings`); continue; }
      out[k] = v.map((x) => x.trim()).filter(Boolean);
    }
  }
  // Keyword stuffing: the same word more than 3 times in the search snippet (title + description).
  const counts = {};
  for (const w of [out.title, out.description].join(' ').toLowerCase().match(/[a-z]{4,}/g) || []) counts[w] = (counts[w] || 0) + 1;
  const stuffed = Object.entries(counts).find(([, n]) => n > 3);
  if (stuffed) errors.push(`"${stuffed[0]}" repeats ${stuffed[1]} times: write for people, not keywords`);
  if (/\b(\d(\.\d)?\s*(\/\s*5|stars?)|#1|best .* ever|million players|award[- ]winning)\b/i.test(JSON.stringify(out))) errors.push('no unverifiable ratings, rankings or player counts');
  return { patch: out, errors };
}

/** Which app's page a search result URL belongs to. */
export function appForUrl(url, apps) {
  let u;
  try { u = new URL(url); } catch { return null; }
  let best = null, len = -1;
  for (const a of apps) {
    const au = new URL(a.url);
    if (au.host.replace(/^www\./, '') !== u.host.replace(/^www\./, '')) continue;
    if (u.pathname.startsWith(au.pathname) && au.pathname.length > len) { best = a.id; len = au.pathname.length; }
  }
  return best;
}
