# Playbill: agent + contributor guide

How every app at mutaafaziz.com (and 18-0.co) introduces itself to search engines and AI assistants.
One Cloudflare Worker; D1 `playbill` holds the catalog, crawler counts, search data and AI-answer probes.

**Edge decoration, with no app changes.** Exact-path routes beat each app's `mutaafaziz.com/<app>*` route. Playbill fetches the app's own page through a service binding, then adds:
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
3. **Kids apps** (OUTATIME, OpenAero, KIN): an agent's edit is saved as a draft, and only the operator can publish it.
4. **Agents get 403 on these:** `settings`, `google/*`, `bing/*`, `probe` (it spends API credit), and approving drafts.
5. **Counts are aggregates only:** `day|app|crawler family|kind → n`. No IP addresses and no visitor ids.

## Adding an app

1. Add an entry to `catalog.json`; `test/render.test.js` checks its shape.
2. If it lives on mutaafaziz.com:
   - add a service binding and add the id to `BINDINGS` in `src/worker.js`;
   - add routes `mutaafaziz.com/<app>/` and `mutaafaziz.com/<app>/llms.txt` in `wrangler.jsonc`.
3. Deploy. A new id is seeded into D1 automatically. Existing rows aren't overwritten, because D1 is the live copy, so change those through the console or API.

See `docs/AGENT_API.md` for the agent loop.
