# Playbill agent API

Base URL: `https://mutaafaziz.com/playbill/api/admin/`. Send `Authorization: Bearer $PLAYBILL_AGENT_TOKEN` on every call.

| Call | What it does |
|---|---|
| `GET report?days=28` | Returns: <ul><li>`connections`</li><li>`totals`</li><li>`apps[]`: search clicks and impressions, `top_queries` with position and CTR, Google `index` verdict, `crawlers` (AI and search visits by family), and `answers` (AI-answer share plus the misses, each with the domains the engines cited instead)</li><li>`opportunities[]`: impact, app, title, detail, `action`</li></ul> |
| `GET catalog` | Every app's live entry: the title, description, summary, features, intents, FAQs and keywords that Playbill renders |
| `GET state` | The catalog, including pending drafts, plus recent changes and connection status. Keys are masked. |
| `PUT apps/<id>` | Any of `title` (10–65 chars), `description` (70–170), `summary`, `features[]`, `intents[]`, `faqs[{q,a}]`, `keywords[]`, `related[]`, `extra_urls[]`, `links[{label,url}]`, `image`, `video`, `genres[]`. On a general app the change is live within a minute and IndexNow is pinged. On a kids app it becomes a **draft** for the operator. |

**Refused:**
- unknown fields;
- ratings, rankings and player counts;
- keyword stuffing;
- for agents: settings, google, bing, probe, and approve.

## Suggested weekly loop

1. Run `report` and work through the high-impact `opportunities` first.
2. **Page-2 queries** (position 8–20): answer the query directly in the `summary` or an FAQ, word for word.
3. **High rank, low CTR:** rewrite the `title` and `description` to promise exactly what the searcher typed.
4. **AI-answer misses:**
   - Add an FAQ that answers the exact question.
   - The `sources` the engines cited instead are your outreach list: get the app listed or mentioned there. Draft it; a human posts it.
5. Write the summary: changes made, what moved since last week, and what needs the human.
