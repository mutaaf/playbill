// Search copy drafting. Prompter drafts a title and description for each app Cast List puts on Playbill,
// from the catalog's own facts (name, tagline, keywords). Drafts land in catalog.json through a pull request;
// nothing publishes until the owner merges it. On deploy, a merged change to an app's title or description in
// catalog.json is applied to the live copy in D1 (copyUpdates). Pure functions: the script and the Worker share them.
import { validateEdit } from './render.js';

export const TITLE = [20, 60];
export const DESC = [70, 155];

// Kids apps and apps that carry no ads get copy a parent would be glad a child read: nothing about ads,
// tracking, money or urgency, and no engagement bait. The prompt asks for it; this check enforces it.
export const BAIT = /\b(ads?|ad-free|advert\w*|sponsor\w*|tracking|tracker\w*|analytics|personali[sz]ed|data|moneti[sz]\w*|purchases?|in-app|buy|shop\w*|store|coins?|gems?|rewards?|prizes?|earn\w*|cash|money|deals?|offers?|discount\w*|addict\w*|viral|obsess\w*|binge\w*|click\w*|hurry|now|today only|limited|don'?t miss|must[- ]play|act fast|subscribe\w*|sign[- ]?up|download|best|#1|top[- ]rated)\b/i;

export const careful = (a) => a.audience === 'kids' || a.ads === false;

/** Cast List apps that get copy here: on the Playbill surface with an id, and not excused from it. */
export const eligible = (apps) => apps.filter((a) => (a.surfaces || []).includes('playbill') && a.ids?.playbill && !a.notOn?.playbill);

/** The facts a draft is written from. A change in any of them is a reason to draft again. */
export const inputsOf = (a) => ({ name: a.name, tagline: a.tagline, keywords: a.keywords || [], kind: a.kind, audience: a.audience, ads: a.ads !== false });

export function fnv(s) {
  let h = 2166136261;
  for (const c of String(s)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
export const inputHash = (a) => fnv(JSON.stringify(inputsOf(a)));
export const copyHash = (e) => fnv(`${e.title}\n${e.description}`);

export function prompt(a, retry = null) {
  const rules = [
    'You write the search-result copy for one web app: the HTML <title> and the meta description.',
    'Reply with JSON only, exactly {"title": "...", "description": "..."} and nothing else.',
    `title: ${TITLE[0]} to ${TITLE[1]} characters. Start with the app's name exactly as given, then a colon, then what it is.`,
    `description: ${DESC[0]} to ${DESC[1]} characters, one or two plain sentences: what it is and what you do with it.`,
    'Use only the facts given. Never claim ratings, rankings, awards, player counts or "best". No exclamation marks, no emoji.',
    'Write for people, not keywords: no word more than twice.',
  ];
  if (careful(a)) rules.push('The audience is kids and families. Never mention ads, sponsors, tracking, analytics, data, money, purchases, prices, prizes or rewards, and never use urgency or engagement bait ("addictive", "now", "hurry", "don\'t miss", "download", "sign up"). Write something a parent would be glad a child read.');
  const facts = { name: a.name, tagline: a.tagline, keywords: (a.keywords || []).join(' '), kind: a.kind, audience: a.audience };
  const messages = [{ role: 'system', content: rules.join('\n') }, { role: 'user', content: JSON.stringify(facts) }];
  if (retry) messages.push({ role: 'user', content: `Your last draft was refused: ${retry}. Write it again, following every rule.` });
  return messages;
}

/** The first JSON object in a model's answer, as { title, description }, or null. */
export function parseDraft(text) {
  const m = /\{[\s\S]*\}/.exec(String(text || ''));
  if (!m) return null;
  try {
    const j = JSON.parse(m[0]);
    if (typeof j.title !== 'string' || typeof j.description !== 'string') return null;
    return { title: j.title.replace(/\s+/g, ' ').trim(), description: j.description.replace(/\s+/g, ' ').trim() };
  } catch { return null; }
}

/** Why a draft can't be used, or [] when it can. */
export function checkDraft(d, a) {
  if (!d) return ['the answer was not {"title", "description"} JSON'];
  const errors = [];
  if (d.title.length < TITLE[0] || d.title.length > TITLE[1]) errors.push(`title is ${d.title.length} characters, not ${TITLE[0]}–${TITLE[1]}`);
  if (d.description.length < DESC[0] || d.description.length > DESC[1]) errors.push(`description is ${d.description.length} characters, not ${DESC[0]}–${DESC[1]}`);
  if (!d.title.toLowerCase().startsWith(String(a.name).toLowerCase())) errors.push(`title must start with "${a.name}"`);
  if (/[!]|\p{Extended_Pictographic}/u.test(`${d.title} ${d.description}`)) errors.push('no exclamation marks or emoji');
  errors.push(...validateEdit({ title: d.title, description: d.description }).errors);
  if (careful(a)) { const m = BAIT.exec(`${d.title} ${d.description}`); if (m) errors.push(`"${m[0]}" is not for a kids or no-ads app`); }
  return errors;
}

/**
 * What a deploy does to D1 for the catalog's copy. seen: [{ id, hash }] from the copy_seen table.
 * An app never seen is a baseline (its D1 copy, maybe edited in the console, is left alone). An app whose
 * catalog.json title or description changed since was merged by the owner, so it is applied.
 */
export function copyUpdates(seed, seen) {
  const was = new Map(seen.map((r) => [r.id, r.hash]));
  const baseline = [], apply = [];
  for (const e of seed) {
    if (!e.title || !e.description) continue;
    const hash = copyHash(e);
    if (!was.has(e.id)) baseline.push({ id: e.id, hash });
    else if (was.get(e.id) !== hash) apply.push({ id: e.id, hash, title: e.title, description: e.description });
  }
  return { baseline, apply };
}
