# Playbill: agent + contributor guide

How every app at mutaafaziz.com (and 18-0.co) introduces itself to search engines and AI assistants.
One Cloudflare Worker; D1 `playbill` holds the catalog, crawler counts, search data and AI-answer probes.

**Edge decoration, with no app changes.** Exact-path routes (generated from Cast List, see below) beat each app's `mutaafaziz.com/<app>*` route. Playbill fetches the app's own page through a service binding, then adds:
- `<title>` and the meta description (from the catalog);
- canonical and Open Graph tags;
- JSON-LD (VideoGame/WebApplication, FAQPage, BreadcrumbList, Person);
- an accessible description section.

If decorating throws, the page is served untouched.

| Path | What |
|---|---|
| `/`, `/<app>/` | The app's page, decorated |
| `/<app>/llms.txt`, `/llms-full.txt` | Briefs for AI agents. The root `/llms.txt` stays hand-written in mutaafaziz-site. |
| `/robots.txt`, `/sitemap.xml` | Generated from the catalog; AI crawlers are named and welcomed |
| `/<INDEXNOW_KEY>.txt` | IndexNow key file |
| `/playbill/ext/<app>/…` | robots, sitemap and llms.txt for apps on other hosts. 18-0.co rewrites to these. |
| `/playbill/admin/` | Console: Program, Catalog, Setup |
| `/playbill/api/admin/*` | Operator (cookie, same password as Marquee) or agent (`Authorization: Bearer $AGENT_TOKEN`) |

**Crons:**
- Daily `23 6 * * *`: hash every front page and IndexNow-ping the changed ones, then sync Search Console (queries, indexing, sitemaps) and Bing.
- Hourly `41 * * * *`: run a chunk of the weekly AI-answer probe. The chunking keeps each run under the Workers subrequest cap.

`npm run up` installs and runs `wrangler dev`. `npm run check` runs the gate. `npm run deploy` deploys.

## Policy (enforced in `src/lib/render.js` and `src/worker.js`)

1. **Truth only.**
   - Never mark up ratings, reviews, player counts or awards. `aggregateRating` isn't an editable field, and `validateEdit` refuses copy that claims them.
   - Keyword stuffing (the same word more than 3 times in the title plus description) is refused.
2. **Same content for people and bots.**
   - The about section is an accessible description of a canvas app (screen readers get it too), not hidden copy.
   - Never serve crawlers something different.
3. **Kids apps** (OUTATIME, OpenAero, KIN): an agent's edit goes live like any other, so it must follow the kids policy (no ads during play, no click-outs, nothing a parent would not want a child to read).
4. **Agents get 403 on these:** `settings`, `google/*`, `bing/*`, `probe` (it spends API credit), and approving drafts.
5. **Counts are aggregates only:** `day|app|crawler family|kind → n`. No IP addresses and no visitor ids.

## Adding an app

Which pages Playbill fronts is decided by Cast List (mutaaf/cast-list), the portfolio's one app catalog, not here.
1. In Cast List, give the app `worker` (the Worker serving its page) and `ids.playbill`. Its own CI refuses a live page on mutaafaziz.com that is neither on Playbill nor has a `notOn.playbill` reason.
2. Here, run `npm run sync`. It rewrites the service bindings and app routes in `wrangler.jsonc` and `src/cast.js`. Don't edit those by hand.
3. Write the app's search copy as an entry in `catalog.json`. The tests fail until it exists, and its `url` and `audience` must match Cast List's.
4. `npm run deploy` (it runs `sync --check` first). A new id is seeded into D1 automatically. Existing rows aren't overwritten, because D1 is the live copy, so change copy through the console or API. URL and audience always come from Cast List, whatever D1 says.

CI also runs `sync --check` daily, so if Cast List moves on and Playbill hasn't followed, a red build emails the owner.

See `docs/AGENT_API.md` for the agent loop.
