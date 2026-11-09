import { describe, it, expect } from 'vitest';
import { jsonLd, headPlan, aboutHtml, llmsTxt, llmsFull, sitemap, robots, classify, validateEdit, appForUrl, llmsUrl } from '../src/lib/render.js';
import { sample, score, isoWeek } from '../src/probe.js';
import catalog from '../catalog.json';

const game = {
  id: 'outatime', name: 'OUTATIME 88', url: 'https://mutaafaziz.com/outatime/', kind: 'game', schema_type: 'VideoGame',
  audience: 'kids', title: 'OUTATIME 88: free neon time-travel racer', description: 'Race a neon time machine to 88 mph in your browser.',
  summary: 'A free arcade racer.', genres: ['racing'], platforms: ['Web browser'], price: 'free', features: ['Daily race'],
  intents: ['time travel racing game browser', 'outatime 88', 'free racing game for kids'], faqs: [{ q: 'Is it free?', a: 'Yes.' }],
  image: 'https://mutaafaziz.com/outatime/og.png', repo: 'https://github.com/mutaaf/outatime-88', related: ['openaero'], released: '2026-10-01',
};
const sib = { id: 'openaero', name: 'OpenAero DFW', url: 'https://mutaafaziz.com/openaero/', kind: 'game', description: 'Fly DFW.' };
const ext = { id: '18-0', name: '18-0', url: 'https://18-0.co/', kind: 'game', description: 'Roster game.' };

describe('catalog.json', () => {
  it('has every app with the fields Playbill renders', () => {
    const ids = catalog.map((a) => a.id);
    expect(ids).toEqual(expect.arrayContaining(['site', 'outatime', 'openaero', 'coldgas', 'kin', 'chalktalk', 'hearth', 'library', '18-0']));
    for (const a of catalog) {
      expect(a.title.length, a.id).toBeLessThanOrEqual(65);
      expect(a.description.length, a.id).toBeGreaterThanOrEqual(70);
      expect(a.description.length, a.id).toBeLessThanOrEqual(170);
      expect(a.url).toMatch(/^https:\/\//);
      expect(validateEdit({ title: a.title, description: a.description, summary: a.summary, faqs: a.faqs, intents: a.intents }).errors, a.id).toEqual([]);
    }
  });
});

describe('jsonLd', () => {
  it('marks a game up as a free VideoGame with FAQ and breadcrumbs, and never a rating', () => {
    const g = jsonLd(game)['@graph'];
    const app = g.find((n) => n['@id'] === `${game.url}#app`);
    expect(app['@type']).toEqual(['VideoGame', 'SoftwareApplication']);
    expect(app.offers.price).toBe('0');
    expect(app.audience.audienceType).toMatch(/kids/);
    expect(g.some((n) => n['@type'] === 'FAQPage')).toBe(true);
    expect(g.some((n) => n['@type'] === 'BreadcrumbList')).toBe(true);
    expect(JSON.stringify(g)).not.toMatch(/aggregateRating|review/i);
  });
  it('makes the site a ProfilePage about the person, listing the apps', () => {
    const g = jsonLd({ id: 'site', name: 'Mutaaf Aziz', url: 'https://mutaafaziz.com/', kind: 'site', schema_type: 'ProfilePage', title: 'Mutaaf Aziz' }, [game])['@graph'];
    expect(g.find((n) => n['@type'] === 'ProfilePage').mainEntity['@id']).toBe('https://mutaafaziz.com/#person');
    expect(g.find((n) => n['@type'] === 'ItemList').itemListElement[0].url).toBe(game.url);
  });
});

describe('headPlan', () => {
  it('escapes copy and keeps </script> out of JSON-LD', () => {
    const p = headPlan({ ...game, title: 'A "quoted" <title>', summary: '</script><script>alert(1)</script>' });
    expect(p.add.find(([s]) => s.includes('og:title'))[1]).toContain('&quot;quoted&quot; &lt;title&gt;');
    expect(p.jsonld).not.toContain('</script><script>');
    expect(p.add.find(([s]) => s.includes('canonical'))[1]).toContain(game.url);
  });
  it('points agents at the per-app llms.txt', () => {
    expect(llmsUrl(game)).toBe('https://mutaafaziz.com/outatime/llms.txt');
    expect(llmsUrl(ext)).toBe('https://18-0.co/llms.txt');
  });
});

describe('aboutHtml + llmsTxt', () => {
  it('describes the app and links its siblings', () => {
    const h = aboutHtml(game, [game, sib]);
    expect(h).toContain('OUTATIME 88');
    expect(h).toContain('href="https://mutaafaziz.com/openaero/"');
    expect(h).toContain('Is it free?');
  });
  it('tells agents the kids ad policy and not to infer', () => {
    const t = llmsTxt(game, [game, sib]);
    expect(t).toMatch(/^# OUTATIME 88/);
    expect(t).toMatch(/never during play/);
    expect(t).toMatch(/do not infer/);
  });
  it('llms-full keeps the site brief first', () => {
    const t = llmsFull('# Mutaaf Aziz\n\n> brief', [{ id: 'site', kind: 'site' }, game]);
    expect(t.startsWith('# Mutaaf Aziz')).toBe(true);
    expect(t).toContain('## OUTATIME 88');
  });
});

describe('sitemap + robots', () => {
  it('lists every same-host app once with lastmod, and nothing from another host', () => {
    const x = sitemap([{ ...game, modified: '2026-10-30', extra_urls: ['/outatime/about/'] }, sib, ext]);
    expect(x).toContain('<loc>https://mutaafaziz.com/outatime/</loc><lastmod>2026-10-30</lastmod>');
    expect(x).toContain('https://mutaafaziz.com/outatime/about/');
    expect(x).not.toContain('18-0.co');
    expect(sitemap([game, ext], 'https://18-0.co')).toContain('<loc>https://18-0.co/</loc>');
  });
  it('lists pages only, never llms.txt or JSON files', () => {
    const x = sitemap([{ ...game, extra_urls: ['/outatime/guide/', '/resume.json', '/notes.txt'] }]);
    expect(x).toContain('https://mutaafaziz.com/outatime/guide/');
    expect(x).not.toMatch(/llms|\.json|\.txt/);
  });
  it('welcomes AI crawlers and keeps consoles out', () => {
    const r = robots();
    expect(r).toMatch(/User-agent: GPTBot\nAllow: \//);
    expect(r).toMatch(/User-agent: ClaudeBot/);
    expect(r).toContain('Disallow: /ads/admin/');
    expect(r).toContain('Sitemap: https://mutaafaziz.com/sitemap.xml');
  });
});

describe('classify', () => {
  it('names crawler families and nothing more', () => {
    expect(classify('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)')).toBe('GPTBot');
    expect(classify('Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)')).toBe('ClaudeBot');
    expect(classify('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toBe('Googlebot');
    expect(classify('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15')).toBe('human');
    expect(classify('curl/8.4')).toBe('other-bot');
  });
});

describe('validateEdit', () => {
  it('accepts good copy, refuses ratings, stuffing and unknown fields', () => {
    expect(validateEdit({ title: 'OpenAero DFW: free browser flight simulator' }).errors).toEqual([]);
    expect(validateEdit({ aggregateRating: 5 }).errors[0]).toMatch(/not editable/);
    expect(validateEdit({ description: 'Rated 4.9 stars by players: the free browser flight simulator over Dallas Fort Worth.' }).errors.join()).toMatch(/ratings/);
    expect(validateEdit({ description: 'flight sim flight sim flight sim flight sim flight sim flight sim, flight in the browser now' }).errors.join()).toMatch(/repeats/);
    expect(validateEdit({ title: 'short' }).errors[0]).toMatch(/10–65/);
  });
});

describe('appForUrl', () => {
  it('attributes a result URL to the longest matching app path', () => {
    const apps = [{ id: 'site', url: 'https://mutaafaziz.com/' }, game, ext];
    expect(appForUrl('https://mutaafaziz.com/outatime/?play=quick', apps)).toBe('outatime');
    expect(appForUrl('https://www.mutaafaziz.com/work', apps)).toBe('site');
    expect(appForUrl('https://18-0.co/privacy', apps)).toBe('18-0');
    expect(appForUrl('https://example.com/', apps)).toBe(null);
  });
});

describe('probe', () => {
  it('samples non-brand intents and rotates weekly', () => {
    const w1 = sample([game], '2026-W44', 1), w2 = sample([game], '2026-W45', 1);
    expect(w1[0].query).not.toBe('outatime 88');
    expect(w1[0].query).not.toBe(w2[0].query);
    expect(isoWeek(new Date('2026-10-31T12:00:00Z'))).toBe('2026-W44');
  });
  it('scores a citation by URL and a mention by name', () => {
    expect(score({ text: 'Try OUTATIME 88.', urls: ['https://mutaafaziz.com/outatime/'] }, game, [game])).toMatchObject({ cited: 1, mentioned: 1 });
    expect(score({ text: 'Try Asphalt.', urls: ['https://poki.com/en/g/x'] }, game, [game])).toMatchObject({ cited: 0, mentioned: 0, sources: ['poki.com'] });
  });
});
