# Launch calendar: Nov 19 to Dec 20, 2026

Campaign tag on every link: `utm_campaign=launch-nov26`. Written 2026-11-18. Nothing in this folder has been posted anywhere; every post is a draft for the owner to publish by hand.

The two anchors:

- **Thanksgiving, Thu Nov 26.** 17-0 (at 18-0.co) has a Gameday mode that only exists while the league is playing. On Thanksgiving it opens at 10:00 am ET (three hours before the first kickoff) and closes at 2:20 am ET Friday. The wheel narrows to the six franchises on the field that day: Chicago, Detroit, Philadelphia, Dallas, Kansas City and Buffalo. That day's seasons rank on a board for that date only. Source: the bundled schedule in `18-0/packages/data/generated/schedule.json`, which matches the published slate (Bears at Lions 1:00 pm ET, Eagles at Cowboys 4:30 pm ET, Chiefs at Bills 8:20 pm ET).
- **Fantasy playoffs, Week 15 (Dec 17 to 21).** Most leagues on default settings start their playoffs in Week 15. The Week 15 gamedays are Thu Dec 17 (San Francisco at Los Angeles), Sat Dec 19 (Seattle at Philadelphia, Chicago at Buffalo) and Sun Dec 20.

## Before anything goes out (Nov 19)

1. **Read each subreddit's live rules yourself.** Reddit blocked every automated read of its rules pages for this kit (WebFetch, curl and the browser extension all refused), so the rule notes in `reddit.md` come from search results and mirrors that may be out of date. Each post there says what to check.
2. **Box Office view.** In PostHog (org "mutaafaziz.com", project 732590), add a breakdown on the Portfolio dashboard: pageviews filtered to `utm_campaign = launch-nov26`, broken down by `utm_source` and `utm_content`. PostHog's web snippet records UTM parameters on the pageview automatically, and every page linked here loads `/boxoffice/v1/insights.js` (checked live on 18-0.co, /coldgas/, /hingepop/, /hingepop/play/, /manifest/, the home page and digitalcraftai.com).
3. **Link 18-0.co, never the GitHub Pages mirror.** Box Office is a no-op on mutaaf.github.io/18-0 by design, so mirror traffic is invisible.
4. **Check the TestFlight builds.** As of Nov 16 the public Hinge Pop beta group still served the Nov 4 build (0.1.0) while 0.4.0 waited on Beta App Review. Don't promise app features in a post until the public build has them.
5. **Re-read the manifest numbers on the morning of the HN post.** The page is live and its figures move.

## The calendar

Times are Eastern. "Gameday" means the 17-0 Gameday window is open.

| Date | Day | Channel | Post (file) | Project |
|---|---|---|---|---|
| Nov 19 | Thu | LinkedIn | LI-1 "Put your website in" (`linkedin.md`) | Digital Craft |
| Nov 19 | Thu | X + Bluesky | Thread A, 17-0 intro, soft test on the Thursday night Gameday (opens 5:15 pm) (`x-bluesky.md`) | 17-0 |
| Nov 20 | Fri | Reddit | r/WebGames, Hinge Pop (`reddit.md`) | Hinge Pop |
| Nov 22 | Sun | (watch) | Sunday Gameday is live; reply to Thread A, no new post | 17-0 |
| Nov 24 | Tue | LinkedIn | LI-2 "Answers every call over the holiday" | Digital Craft |
| Nov 24 | Tue | Reddit | r/playmygame, COLD GAS | COLD GAS |
| Nov 25 | Wed | X + Bluesky | Thread A follow-up: "Thanksgiving wheel opens tomorrow at 10 am" (one post, quote Thread A) | 17-0 |
| **Nov 26** | **Thu** | **Reddit** | **r/fantasyfootball (see verdict) and r/nfl (see verdict), morning, before the 1 pm kickoff** | **17-0** |
| **Nov 26** | **Thu** | **X + Bluesky** | **Thread A again with the six-franchise wheel; reply between games with the day's board** | **17-0** |
| Nov 27 | Fri | (watch) | Black Friday Gameday (Denver, Pittsburgh, opens noon). Reply only. | 17-0 |
| Dec 1 | Tue | Hacker News | Show HN: AI-Native Starter, 8 to 9 am ET (`hacker-news.md`) | Manifest |
| Dec 1 | Tue | LinkedIn | LI-3 "Quotes in minutes" | Digital Craft |
| Dec 2 | Wed | X + Bluesky | Thread C, one person and his agents (`x-bluesky.md`) | Manifest |
| Dec 3 | Thu | LinkedIn | LI-4 "The price, in public" | Digital Craft |
| Dec 5 | Sat | Reddit | r/IndieGaming, COLD GAS clip | COLD GAS |
| Dec 8 | Tue | Product Hunt | COLD GAS launch, goes live 12:01 am PT (`product-hunt.md`) | COLD GAS |
| Dec 8 | Tue | LinkedIn | LI-5 "Questions to ask an AI vendor" | Digital Craft |
| Dec 9 | Wed | X + Bluesky | Thread B, COLD GAS (`x-bluesky.md`) | COLD GAS |
| Dec 10 | Thu | LinkedIn | LI-6 "What the AI is not allowed to make up" | Digital Craft |
| Dec 15 | Tue | LinkedIn | LI-7 "Real estate: try the deal analyzer" | Digital Craft |
| Dec 17 | Thu | LinkedIn | LI-8 "Before January: what missed calls cost you" | Digital Craft |
| Dec 17 | Thu | X + Bluesky | Fantasy playoffs post: "Week 15 starts tonight; tonight's wheel is two franchises" (one post, quote Thread A) | 17-0 |
| Dec 19 | Sat | X + Bluesky | Saturday Gameday reminder (Seattle, Philadelphia, Chicago, Buffalo), one post | 17-0 |
| Dec 20 | Sun | (review) | Pull the Box Office breakdown; note what worked in this file | All |

Why this order:

- The Reddit game posts are spread across three weekends so they are not read as cross-post spam. COLD GAS is the only project that appears twice on Reddit, and in two different subs with different angles.
- Hacker News and Product Hunt are kept clear of Thanksgiving week, when both are quiet and the owner is busy watching football.
- LinkedIn runs Tue/Thu, two a week for four posting weeks: Nov 19 and 24, Dec 1 and 3, Dec 8 and 10, Dec 15 and 17. Nothing on Thanksgiving itself.

## Verdicts by channel

| Channel | Verdict | Why |
|---|---|---|
| r/WebGames | Post, after reading the sidebar | A browser game you can play with no install fits. One mirror-sourced note says members are expected to participate before posting their own work. |
| r/playmygame | Post | The sub exists for developers sharing their games. Mirrored rules (2022 to 2024) require a platform flair added after submitting, and one post per month. |
| r/IndieGaming | Post, after reading the sidebar | Self-promotion is common there within frequency limits; the exact limit could not be confirmed. |
| r/fantasyfootball | **Advise skip as a standalone post** | 17-0 is not fantasy advice, and tolerance for self-promotion there depends on the thread. If the live rules allow tools in a daily or off-topic thread, use the comment version in `reddit.md` instead. |
| r/nfl | **Advise skip unless the live rules allow it** | Its submission rule (as quoted in old removal notices) requires that a post "adds to discussion". A game link will likely be removed. A discussion-first version is drafted in case the rules allow it. |
| Hacker News (Show HN) | Post the starter repo, not the manifest | Show HN rules say reading material (blog posts, landing pages) cannot be a Show HN. The manifest is reading material; the AI-Native Starter template is something people can run. |
| Product Hunt | Post COLD GAS | It is free, needs no account and plays in a browser. |
| X / Bluesky | Post | Three threads plus short follow-ups. |
| LinkedIn | Post | Eight Digital Craft posts. |

## All tracked links

Every link below carries `utm_campaign=launch-nov26`. `utm_content` names the post so two posts on one channel can be told apart.

| Post | Link |
|---|---|
| r/WebGames, Hinge Pop | https://mutaafaziz.com/hingepop/play/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-webgames |
| r/playmygame, COLD GAS | https://mutaafaziz.com/coldgas/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-playmygame |
| r/IndieGaming, COLD GAS | https://mutaafaziz.com/coldgas/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-indiegaming |
| r/fantasyfootball, 17-0 | https://18-0.co/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-fantasyfootball |
| r/nfl, 17-0 | https://18-0.co/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-nfl |
| Show HN, manifest link in text | https://mutaafaziz.com/manifest/?utm_source=hackernews&utm_medium=community&utm_campaign=launch-nov26&utm_content=show-hn |
| Product Hunt, COLD GAS | https://mutaafaziz.com/coldgas/?utm_source=producthunt&utm_medium=launch&utm_campaign=launch-nov26&utm_content=ph-coldgas |
| Product Hunt first comment, manifest | https://mutaafaziz.com/manifest/?utm_source=producthunt&utm_medium=launch&utm_campaign=launch-nov26&utm_content=ph-first-comment |
| X / Bluesky threads | see `x-bluesky.md` (one link per thread per network) |
| LinkedIn LI-1 to LI-8 | see `linkedin.md` |

Notes on the links:

- **GitHub cannot be tracked.** The Show HN URL is the starter repo on GitHub, which does not run Box Office. Only clicks through to the manifest are attributable. PostHog also records the referring domain, so `news.ycombinator.com` will show up without UTMs.
- **Tagged URLs skip Playbill's edge decoration** (Cloudflare routes can't match a query string), so the page is served as the app renders it. Checked on Nov 18: each app's own HTML still carries its title and Open Graph tags, so link previews still work.
- Calendly (Book a call) is off-site, so Digital Craft posts link to digitalcraftai.com pages, where the call button lives.

## Found while writing this (fix before launch if you can)

- **Hinge Pop's search copy is stale.** The structured data Playbill serves on /hingepop/ says "No account, ads or analytics" and "50 hand-made levels". Box Office analytics have run on the page since PR #21, and the app's level count has since changed. The live copy is in D1 (console or agent API), not `catalog.json`. No post in this kit repeats either claim.
- **The 18-0 name.** The live page title and README brand the game "17-0" (a 17-game season), at the domain 18-0.co, while Playbill's about text says "18-0". The posts here say "17-0 (at 18-0.co)" to match what players will see.
- **COLD GAS README** says the judges' commentary "comes from Claude"; the live page says "a three-judge AI panel" with optional bring-your-own keys. The posts use the live page's wording.
