# Playbill

SEO and answer-engine optimization for every app at [mutaafaziz.com](https://mutaafaziz.com/) and [18-0.co](https://18-0.co/). It's the companion to [Marquee](https://github.com/mutaaf/marquee): Marquee sells the show, Playbill tells everyone what's playing.

- **One catalog** (`catalog.json`, then live in D1): what each app is, who it's for, and the questions it answers.
- **Edge-decorated pages:** canonical, Open Graph, JSON-LD and an accessible description, added by a Cloudflare Worker in front of each app. No app code changes.
- **Files for AI agents:** `llms.txt` per app, `llms-full.txt`, plus a sitemap and robots.txt that welcome AI crawlers.
- **Freshness:** a daily change check pings IndexNow (Bing, which feeds ChatGPT search and Copilot).
- **Measurement:**
  - Search Console: queries, positions, indexing;
  - Bing Webmaster;
  - aggregate AI-crawler visits;
  - a weekly probe of ChatGPT, Perplexity and Claude that checks whether they cite the apps.
- **An agent API** so an agent (Hermes) can run the improve-measure loop, with guardrails: no fake ratings, no stuffing, and kids-app edits need human sign-off.

See `AGENTS.md` and `docs/AGENT_API.md`.
