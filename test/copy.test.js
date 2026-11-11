import { describe, it, expect } from 'vitest';
import { eligible, inputHash, prompt, parseDraft, checkDraft, copyUpdates, copyHash, careful } from '../src/lib/copy.js';
import { run, body } from '../scripts/draft-copy.mjs';

const kin = { slug: 'kin', name: 'KIN', tagline: 'A tiny creature that hops between screens.', keywords: ['kin creature pet'], kind: 'game', audience: 'kids', surfaces: ['playbill'], ids: { playbill: 'kin' } };
const hearth = { slug: 'hearth', name: 'Hearth', tagline: 'One remote for every TV in the house.', keywords: ['tv remote'], kind: 'app', audience: 'general', surfaces: ['playbill'], ids: { playbill: 'hearth' } };
const moon = { slug: 'moon-club', name: 'Moon Club', tagline: 'Money and charts for kids.', audience: 'kids', ads: false, surfaces: ['dock'], ids: {}, notOn: { playbill: 'Its page is the grown-up gate in front of the download.' } };
const good = { title: 'KIN: A Tiny Creature That Hops Between Your Screens', description: 'Hatch a small creature that lives under your real sky, then slide a finger across two screens and watch it hop over.' };

describe('search copy drafts', () => {
  it('drafts only for apps Cast List puts on Playbill', () => {
    expect(eligible([kin, hearth, moon]).map((a) => a.slug)).toEqual(['kin', 'hearth']);
    expect(eligible([{ ...hearth, notOn: { playbill: 'a reason that is long enough' } }])).toEqual([]);
  });
  it('kids and no-ads apps are told the rule, and the word check refuses ad, tracking, money and bait copy', () => {
    expect(careful(kin) && careful(moon) && !careful(hearth)).toBe(true);
    expect(prompt(kin)[0].content).toMatch(/Never mention ads, sponsors, tracking/);
    expect(prompt(hearth)[0].content).not.toMatch(/kids and families/);
    expect(checkDraft(good, kin)).toEqual([]);
    for (const bad of ['Free with no ads, ever', 'Earn rewards as you play', 'An addictive pet game', 'Download it now', 'No tracking or analytics', 'Buy coins in the shop']) {
      expect(checkDraft({ ...good, description: `${good.description.slice(0, 100)} ${bad}.` }, kin).join(' '), bad).toMatch(/not for a kids or no-ads app/);
    }
    // the same words are fine for a general app (Playbill's own rules still apply)
    expect(checkDraft({ title: 'Hearth: One Remote for Every TV in the House', description: 'Turn any phone into a fast remote for the LG and Samsung TVs on your Wi-Fi, with no ads and no account to make.' }, hearth)).toEqual([]);
  });
  it('refuses drafts that break the lengths, the name, or Playbill\'s truth rules', () => {
    expect(checkDraft(null, kin)[0]).toMatch(/JSON/);
    expect(checkDraft({ ...good, title: 'Short' }, kin).join()).toMatch(/title is 5/);
    expect(checkDraft({ ...good, title: 'A Tiny Creature: KIN hops between screens' }, kin).join()).toMatch(/start with "KIN"/);
    expect(checkDraft({ ...good, description: good.description + ' Rated 4.9 stars by players everywhere, honestly!' }, kin).join()).toMatch(/characters|ratings|exclamation/);
    expect(parseDraft('Sure! ```json\n{"title":" KIN:  x ","description":"y"}\n```')).toEqual({ title: 'KIN: x', description: 'y' });
    expect(parseDraft('no json')).toBe(null);
  });
  it('drafts again only when the facts change, retries once with the reason, and keeps copy it cannot improve', async () => {
    const cat = [{ id: 'kin', title: 'Old KIN title for the test', description: 'old' }, { id: 'hearth', title: 'Old Hearth', description: 'old' }];
    const answers = ['{"title":"KIN: Addictive pet","description":"x"}', JSON.stringify(good), 'not json', 'still not json'];
    const asked = [];
    const out = await run({ apps: [kin, hearth, moon], catalog: cat, sources: {}, ask: async (m) => { asked.push(m); return answers.shift(); } });
    expect(asked[1].at(-1).content).toMatch(/refused/);
    expect(out.catalog[0].title).toBe(good.title);
    expect(out.catalog[1].title).toBe('Old Hearth');
    expect(out.sources).toEqual({ kin: { inputs: inputHash(kin) } });
    expect(out.rows.find((r) => r.id === 'hearth').note).toMatch(/kept the current copy/);
    expect(cat[0].title).toBe('Old KIN title for the test'); // input untouched
    const again = await run({ apps: [kin], catalog: out.catalog, sources: out.sources, ask: async () => { throw new Error('should not be asked'); } });
    expect(again.rows).toEqual([]);
    const changed = await run({ apps: [{ ...kin, tagline: 'New tagline.' }], catalog: out.catalog, sources: out.sources, ask: async () => JSON.stringify(good) });
    expect(changed.rows).toHaveLength(1);
    expect(body(out.rows)).toMatch(/<!-- drafts:kin=/);
  });
  it('a merged copy change publishes on deploy; a first sighting is only a baseline', () => {
    const seed = [{ id: 'a', title: 'T', description: 'D' }, { id: 'b', title: 'T2', description: 'D2' }];
    expect(copyUpdates(seed, [])).toEqual({ baseline: [{ id: 'a', hash: copyHash(seed[0]) }, { id: 'b', hash: copyHash(seed[1]) }], apply: [] });
    const seen = [{ id: 'a', hash: copyHash(seed[0]) }, { id: 'b', hash: 'old' }];
    expect(copyUpdates(seed, seen)).toEqual({ baseline: [], apply: [{ id: 'b', hash: copyHash(seed[1]), title: 'T2', description: 'D2' }] });
  });
});
