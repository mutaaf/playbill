# Search competitive baseline: November 2026

Run date: 2026-11-01. Source catalog: https://mutaafaziz.com/llms-full.txt (each app's "Good answer for" list).
Method: 24 non-brand target searches (3 per app) through the WebSearch tool in `standard` mode, plus 9 supporting searches (3 brand checks, 6 to find listicles). "Top 5" means the first five results in the order the tool returned them. That order is the engine's ranking, not a Google SERP, so treat positions as approximate. GitHub list data comes from the GitHub API on the same day. This was read-only: nothing was posted, submitted or opened.

## Headline findings

1. **No mutaafaziz.com or 18-0.co URL appeared in any of the 33 searches.** That includes three exact-brand checks ("OUTATIME 88" racing game; 18-0 football roster game 18-0.co; Hearth universal TV remote self-hosted LG Samsung mutaaf). Every page is technically indexable: robots.txt allows `*`, Googlebot and Bingbot; each app page sends `index, follow` and a canonical; the sitemap lists every app. The pages are 2 to 6 weeks old and simply aren't in the index yet. Indexing comes before ranking.
2. **18-0.co's sitemap lists only `/` and `/llms.txt`.** Any other pages on 18-0.co can't be discovered from the sitemap.
3. **Spam pages fill many SERPs.** University, government and corporate subdomains host scraped "printable" pages (lboro.ac.uk, dhis2.org, ctrader.com, icmbio.gov.br, manchester.ac.uk). They took 3 of the top 5 for the flag-football and soccer searches and 4 of 5 for the Immaculate Grid search. Real competition is thin there.
4. **Launch directories and itch.io rank for game searches.** Product Hunt, hunted.space (a Product Hunt mirror) and peerpush.com pages rank for competitor games (MyPetGrow, 38-0.io, Eleven DNA, Drafted XI, Perfect 20, WeatherPets). itch.io tag pages dominate the synthwave, OutRun and Tamagotchi searches. All of these accept free listings.
5. **Open-source lists are blocked by repo hygiene.** outatime-88, openaero-dfw, cold-gas and kin have **no LICENSE file**, so open-source-game lists can't accept them. **No repo except 18-0 has a GitHub release.** awesome-selfhosted counts its 4-month age rule from the first tagged release, so Hearth's clock hasn't started.
6. **18-0 has a crowded set of direct competitors:** 20-0.com (app, plus its own "roster-building-games" guide that ranks), 82-0-challenge.com (17-0 and 20-0 modes), Perfect 20, NFL Squad Builder, RotoWire's 17-0 game, 17-0 Football Manager, and the Gauntlet iOS app.
7. **The catalog contradicts itself on 18-0.** The top summary says "2,994 real seasons"; the full entry says "4,872 rated seasons". Fix this before answer engines quote either number.

---

## OUTATIME 88 (kids)

Targets chosen: "free racing game for kids in browser no download", "neon synthwave arcade racer online free", "racing game like outrun in browser".

### 1. free racing game for kids in browser no download
| # | Domain | Page type |
|---|---|---|
| 1 | gamer-ai-nexgen.duckdns.org | Scraper game portal on a dynamic-DNS host |
| 2 | pcgamecheck.com | "Play X online" aggregator page |
| 3 | studybreak-cup.pages.dev | "Unblocked games" mirror |
| 4 | app.cinevva.com | Arcade portal tag page |
| 5 | stealbrainrotapp.pages.dev | Unblocked-games mirror |

Ours present: no. Also ranking: plays.org, fastplaygames.com (category page and a listicle, "Best Racing Games You Can Play Free in Your Browser"), ubg4school.gitlab.io.
**Kids flag:** #1, #3 and #5, plus ubg4school, are unvetted scraper or "unblocked" mirrors with no clear operator. They aren't family-appropriate targets; don't seek links from them.
**Verdict: winnable with links.** The incumbents are weak, but portals have domain strength and thousands of pages; we need indexing plus one or two family-oriented listings.

### 2. neon synthwave arcade racer online free
| # | Domain | Page type |
|---|---|---|
| 1 | apps.apple.com | iOS app listing |
| 2 | store.steampowered.com | Steam store page |
| 3 | store.steampowered.com | Steam store page |
| 4 | store.steampowered.com | Steam store page |
| 5 | xelifon.itch.io | Indie game page (Neon Overdrive) |

Ours present: no. Also ranking: a toucharcade.com forum thread ("Any good neon/synthwave racers?"), producthunt.com (Road Rage: Fury Lane), dekudeals.com.
**Verdict: winnable soon.** No free browser game holds the top results; they're downloads and store pages, which don't match the "online free" intent. An indexed page titled with this phrase, plus an itch.io page, should place.

### 3. racing game like outrun in browser
| # | Domain | Page type |
|---|---|---|
| 1 | itch.io | Devlog post |
| 2 | chrome.google.com | Chrome Web Store extension ("Outrun Offline Game") |
| 3 | pistonudos.com | Blog article (Turbo OutRun in the browser) |
| 4 | monsterofcookie.itch.io | Indie game page |
| 5 | chrome.google.com | Same extension's reviews page |

Ours present: no. Also ranking: dinogame.gg listicle ("Best Browser Driving Games to Play Free Online"), itch.io/games/tag-outrun, korben.info, gamepix.com/play/outrun, plus open-source repos on github.com (twin-racer, Pseudo-3d-Racer).
**Verdict: winnable with links.** itch.io holds 3 of the top 5, so an itch.io page tagged `outrun` is the fastest entry, and the dinogame.gg listicle is a realistic add.

### Outreach and listing targets: OUTATIME 88
| Target | URL | How to get on it | Cost | Kids |
|---|---|---|---|---|
| itch.io game page (tags: outrun, synthwave, racing, html5) | https://itch.io/games/tag-outrun | Create a free creator account and publish an HTML5 page (embed or link out) | Free (optional revenue share) | itch.io hosts NSFW titles (filtered by default). Fine as a listing, but don't send kids to itch.io browse pages |
| dinogame.gg listicle | https://dinogame.gg/blog/best-browser-driving-games/ | Contact the site or author and ask to be added | Free | Unverified: check the site's ads before linking from kids pages |
| fastplaygames.com listicle | https://fastplaygames.com/blog/best-racing-games-free-browser | Contact the author | Free | Ad-supported portal; check before linking |
| hemanth/awesome-pwa (Games and Entertainment) | https://github.com/hemanth/awesome-pwa | PR (see the PR appendix). Low odds: the last 8 closed PRs, all additions, were closed unmerged | Free | OK |
| GamePix developer submission | https://www.gamepix.com/play/outrun (ranks) | Free developer submission | Free, but GamePix serves its own ads | **Flag:** third-party ads conflict with OUTATIME's child-directed-ads policy |
| michelpereira/awesome-open-source-games (Browser-Based > Racing) | https://github.com/michelpereira/awesome-open-source-games | PR, but **not eligible yet**: needs a repo at least 30 days old with 40+ stars, and the repo needs a LICENSE | Free | OK |

---

## OpenAero DFW (kids)

Targets: "free flight simulator in browser", "flight simulator for kids free online", "flight simulator dallas fort worth".

### 4. free flight simulator in browser
| # | Domain | Page type |
|---|---|---|
| 1 | sites.google.com | Fan guide to GeoFS |
| 2 | racunalniske-novice.com | News article |
| 3 | groups.google.com | Group post ("Fly Anywhere for Free...") |
| 4 | feedbagel.com | News aggregator (Google Earth flight sim) |
| 5 | androidheadlines.com | News article |

Ours present: no. Also ranking: pcworld.com (Google Earth flight sim), skyline-flight-sim.pages.dev (a browser-sim competitor), mikeshouts.com (GeoFS), helisimmer.com, pacogames.com.
**Verdict: long shot.** GeoFS and Google Earth's simulator own this search, with news coverage behind them.

### 5. flight simulator for kids free online
| # | Domain | Page type |
|---|---|---|
| 1 | flyawaysimulation.com | Q&A listicle: "best free flight simulators for kids" |
| 2 | status.penumbra.zone | Parasite spam page |
| 3 | mgmt.pabau.com | Parasite spam page |
| 4 | extads.monetize.software | Parasite spam page |
| 5 | edugeek.net | Forum thread (teachers on free flight sims) |

Ours present: no. Also ranking: a second flyawaysimulation.com kids page, toucharcade.com app pages, apps.apple.com, digikidz-com.pages.dev ("Best Aviation Apps for Kids").
**Kids flag:** #2 to #4 are spam, not targets. flyawaysimulation.com is an established flight-sim site and family-appropriate.
**Verdict: winnable with links.** One real listicle sits above three spam pages. Getting OpenAero named in the flyawaysimulation answer, which already lists GeoFS and "Free Flight Sim", covers the top spot.

### 6. flight simulator dallas fort worth
| # | Domain | Page type |
|---|---|---|
| 1 | flyawaysimulation.com | Guide: KDFW in flight sims |
| 2 | flightsim.to | MSFS add-on listing (Dallas City Enhanced) |
| 3 | afgsim.com | Real-world flight training center |
| 4 | fsnews.eu | Sim news (Tower!3D Dallas) |
| 5 | flight.wiki.gg | Game wiki page (DFW airport) |

Ours present: no. Also ranking: thresholdx.net, inibuilds.com (paid KDFW scenery), fselite.net, msfsaddons.com, msfsmarket.place, dallasobserver.com.
**Verdict: winnable soon.** It's a niche, geographic search and nothing on it is a free browser product. OpenAero's title ("Free Browser Flight Simulator Over Dallas") matches it exactly once indexed.

### Outreach and listing targets: OpenAero DFW
| Target | URL | How | Cost | Kids |
|---|---|---|---|---|
| flyawaysimulation.com kids listicle | https://flyawaysimulation.com/ask/answers/best-free-flight-simulators-kids/ | Contact the editors (site contact form) and propose OpenAero as a no-install browser option | Free | OK |
| flyawaysimulation.com KDFW guide | https://flyawaysimulation.com/ask/answers/kdfw-dallas-fort-worth-flight-sim-guide/ | Same contact: "free browser way to fly KDFW and KDAL" | Free | OK |
| flyawaysimulation.com free-sims listicle | https://flyawaysimulation.com/ask/answers/best-free-flight-simulators/ | Same contact | Free | OK |
| appuals.com / windowsreport.com browser-sim listicles | https://appuals.com/browser-flight-simulator , https://windowsreport.com/browser-airplane-games/ | Contact the author | Free | Ad-heavy tech blogs; fine as links, not as destinations for kids |
| Dallas Observer (local press) | https://www.dallasobserver.com | Pitch a local story ("fly DFW in your browser, built in Coppell") | Free | OK |
| itch.io page (tags: flight-simulator, aviation) | https://itch.io | Free creator page | Free | Same itch.io caveat as above |

---

## COLD GAS

Targets: "car stunt jump game browser free", "3d stunt driving game no download", "car flip landing game like trials in browser".

### 7. car stunt jump game browser free
| # | Domain | Page type |
|---|---|---|
| 1 | eduquests.onrender.com | Unblocked-games mirror |
| 2 | crazygamesonline.com | Copycat game portal (not crazygames.com) |
| 3 | crazygamesonline.com | Copycat game portal |
| 4 | racinglimitsio.pages.dev | Unblocked mirror |
| 5 | crazygamesonline.com | Copycat game portal |

Ours present: no. Also ranking: pcgamecheck.com (several pages), chromewebstore.google.com (Madalin Stunt Cars 2), community.monogame.net (dev forum thread).
**Verdict: long shot.** Portals and mirrors with hundreds of clone stunt games fill it. Mid-tier portals often outrank a single-game page here.

### 8. 3d stunt driving game no download
| # | Domain | Page type |
|---|---|---|
| 1 | pcgamecheck.com | Aggregator play page |
| 2 | pcgamecheck.com | Aggregator play page |
| 3 | studybreak-cup.pages.dev | Unblocked mirror |
| 4 | mac.softpedia.com | Download directory (Stunt Playground) |
| 5 | freebie.games | Free-games portal |

Ours present: no. Also ranking: toucharcade.com, itch.io pages, rawg.io, gamepix.com (Ado Stunt Cars 3), kinggames.org, crazygames.fr.
**Verdict: long shot.** Same portal pattern; only a portal listing would compete.

### 9. car flip landing game like trials in browser
| # | Domain | Page type |
|---|---|---|
| 1 | seeles.ai | AI game portal page |
| 2 | bkrivdbkriqs.pages.dev | Mirror |
| 3 | poki.com | Portal game page (Drive Mad) |
| 4 | crazygames.cz | Portal game page (Car Flip) |
| 5 | escapedrive-com.pages.dev | Mirror |

Ours present: no. Also ranking: itch.io (Hovercar Playground, Flippy Car, car stunt mania), crazygames.com/game/car-flip.
**Verdict: winnable with links.** It's a long-tail search with no dominant page, and COLD GAS's flip-and-land mechanic matches exactly. An itch.io page plus one listicle mention could place it.

### Outreach and listing targets: COLD GAS
| Target | URL | How | Cost |
|---|---|---|---|
| itch.io page (tags: stunt, physics, driving, threejs) | https://itch.io | Free creator page | Free |
| CrazyGames developer portal | https://www.crazygames.com/game/car-flip (ranks) | Free developer submission; requires their SDK and ads | Free |
| dinogame.gg driving listicle | https://dinogame.gg/blog/best-browser-driving-games/ | Contact the author | Free |
| Poki | https://poki.com/en/g/drive-mad (ranks) | Developer submission; curated and selective | Free |

COLD GAS isn't flagged as a kids app, so portal ads are acceptable here.

---

## KIN (kids)

Targets: "virtual pet game in browser free no signup", "tamagotchi like game for kids in browser", "virtual pet with real weather".

### 10. virtual pet game in browser free no signup
| # | Domain | Page type |
|---|---|---|
| 1 | gamepix.com | Portal tag page (animal games) |
| 2 | producthunt.com | Launch page (MyPetGrow) |
| 3 | visitriverton.com | Competitor browser pet/ranch game |
| 4 | frvr.com | Portal tag page (virtual pet) |
| 5 | crazygamesonline.com | Copycat portal |

Ours present: no. Also ranking: sz-games-5w2.pages.dev (mirror), itch.io pages, aftermath.site (article on a Neopets-style browser game), **virtualpetlist.com** (virtual-pet community showcase).
**Kids flag:** crazygamesonline.com and the pages.dev mirror aren't family-appropriate targets.
**Verdict: winnable with links.** A Product Hunt launch is already ranking here (MyPetGrow), which is a proven, free path.

### 11. tamagotchi like game for kids in browser
| # | Domain | Page type |
|---|---|---|
| 1 | itch.io | Event page |
| 2 | robinslevel.github.io | Competitor hobby project |
| 3 | itch.io | Tag page (html5, tamagotchi) |
| 4 | gigazine.net | Article (Handheld History emulator) |
| 5 | gigazine.net (mirror subdomain) | Same article |

Ours present: no. Also ranking: about 12 more itch.io tag, collection and game pages, including the itch.io Virtual Pet Jam 2025, and github.com (xtonyyu/tamagotchi-game).
**Kids flag:** itch.io tag pages aren't age-vetted. List KIN there, but don't link kids to itch.io browse pages.
**Verdict: winnable soon.** itch.io holds most of the results, so an itch.io page tagged `tamagotchi` and `virtual-pet` (playable in browser) enters the set directly.

### 12. virtual pet with real weather
| # | Domain | Page type |
|---|---|---|
| 1 | apps.apple.com | Competitor iOS app (Cats & Dogs Weather) |
| 2 | patentarcade.com | Patent page (Sony US 6,748,326) |
| 3 | patents.google.com | Same patent |
| 4 | apps.apple.com | Competitor iOS app (WeatherPets) |
| 5 | patents.justia.com | Same patent |

Ours present: no. Also ranking: peerpush.com (WeatherPets), mergeek.com, nighthawk469.github.io (PocketPup), appspy.com.
**Verdict: winnable soon.** Three patent pages in the top 5 is a thin SERP, and there's no browser competitor. KIN's real-sky feature matches this search exactly.

### Outreach and listing targets: KIN
| Target | URL | How | Cost | Kids |
|---|---|---|---|---|
| Product Hunt launch | https://www.producthunt.com | Free launch (MyPetGrow's page ranks #2) | Free | OK |
| PeerPush | https://peerpush.com/p/weatherpets (ranks) | Free submission joins a "long" queue; $39 publishes instantly | Free or $39 | OK |
| virtualpetlist.com showcase | https://www.virtualpetlist.com/showcase/mesozoic-manor.286/ | Forum showcase post (needs a free account) | Free | Community forum; check its moderation before linking kids |
| itch.io page (tags: virtual-pet, tamagotchi, cute) | https://itch.io/games/platform-web/tag-virtual-pet | Free creator page | Free | Same itch.io caveat |
| FRVR / GamePix | https://frvr.com/tags/virtual-pet/ , https://gamepix.com/t/animal | Portal submission | Free | **Flag:** third-party portal ads conflict with KIN's child-directed-ads policy |

---

## Chalk Talk

Targets: "basketball play drawing app free", "flag football play designer 7v7 free", "youth soccer play diagram tool 7v7 9v9".

### 13. basketball play drawing app free
| # | Domain | Page type |
|---|---|---|
| 1 | thehoopsgeek.com | Competitor (blog plus free play creator) |
| 2 | thehoopsgeek.com | Guide: "How to Draw & Read Basketball Plays" |
| 3 | appfollow.io | App analytics page (Easy4Coach) |
| 4 | apps.apple.com | Competitor app (Hoops Geek Play Designer) |
| 5 | live.museum.manchester.ac.uk | Parasite spam template page |

Ours present: no. Also ranking: apps.apple.com (Basketball Chalk Free), fastbreak.playbooktech.com (paid competitor), marlvel.ai, and several spam template pages.
**Verdict: winnable with links.** The Hoops Geek is entrenched at #1 and #2, but #5 onward is weak.

### 14. flag football play designer 7v7 free
| # | Domain | Page type |
|---|---|---|
| 1 | alternativeto.net | Directory entry (RC Football) |
| 2 | weee.roadtech.co.uk | Parasite spam |
| 3 | chw.dhis2.org | Parasite spam |
| 4 | lbas.lboro.ac.uk | Parasite spam |
| 5 | writingmate.ai | Blog listicle ("free football playbook designer") |

Ours present: no. Also ranking: football-playbook-sage.vercel.app ("How to draw football plays for free" and "best football playbook software 2025"), alternativeto.net (Playwrist), stork.ai (RC Football), contentmavericks.com ("best football playbook maker").
**Verdict: winnable soon.** Three of the top five are spam, and two competitors (RC Football, Playwrist) rank only through free AlternativeTo entries. The same move works for Chalk Talk.

### 15. youth soccer play diagram tool 7v7 9v9
| # | Domain | Page type |
|---|---|---|
| 1 | msoid.icmbio.gov.br | Parasite spam |
| 2 | internals.basemark.com | Parasite spam |
| 3 | tactical-board.com | Competitor tool (youth 7v7/9v9 board) |
| 4 | ftb-football-tactics-board.pages.dev | Competitor landing page |
| 5 | educationsurvey.steelcase.com | Parasite spam |

Ours present: no. Also ranking: icoachfootball.net (formation maker), renderfoot.com (7v7 lineup builder).
**Verdict: winnable soon.** The SERP is almost entirely spam, and the search tool itself noted that no established dedicated tool surfaced.

### Outreach and listing targets: Chalk Talk
| Target | URL | How | Cost |
|---|---|---|---|
| AlternativeTo: add Chalk Talk as an alternative to RC Football, Playwrist, FastDraw and The Hoops Geek | https://alternativeto.net/software/rc-football/about/ | Free account, then "Suggest new application" | Free |
| writingmate.ai listicle | https://writingmate.ai/blog/free-football-playbook-designer | Contact the author | Free |
| contentmavericks.com listicle | https://contentmavericks.com/best-football-playbook-maker/ | Contact the author | Free |
| football-playbook-sage.vercel.app resources | https://football-playbook-sage.vercel.app/resources/best-football-playbook-software-2025 | Contact the owner (may be a competitor) | Free |
| Product Hunt launch | https://www.producthunt.com | Free launch | Free |

No sports-coaching awesome-list on GitHub was active or relevant: the "awesome sports" and "awesome basketball" search hits are analytics or abandoned.

---

## Hearth

Targets: "universal tv remote app for lg and samsung", "open source tv remote self hosted", "remote app like logitech harmony for phones free".

### 16. universal tv remote app for lg and samsung
| # | Domain | Page type |
|---|---|---|
| 1 | apps.apple.com | Competitor app |
| 2 | apps.apple.com | Competitor app |
| 3 | apps.apple.com | Competitor app |
| 4 | apps.apple.com | Competitor app |
| 5 | apps.apple.com | Competitor app |

Ours present: no. Every one of the 15 results was an App Store listing, apart from two mwm.ai pages.
**Verdict: long shot.** App stores fill the whole SERP, and the intent is "install an app", not "self-host a server".

### 17. open source tv remote self hosted
| # | Domain | Page type |
|---|---|---|
| 1 | github.com | Repo (Liohtml/openstream, a self-hosted streaming UI) |
| 2 | github.com | Repo (owncast) |
| 3 | pkg.go.dev | Package page (owncast) |
| 4 | apt.izzysoft.de | F-Droid repo listing (com.porter.tvremote) |
| 5 | git.logal.dev | Mirror of the owncast README |

Ours present: no; github.com/mutaaf/hearth didn't appear either. Only 7 results came back, and most are off-topic.
**Verdict: winnable soon.** This is the thinnest SERP in the baseline. The Hearth repo already has the right topics; it needs indexing plus a couple of awesome-list links.

### 18. remote app like logitech harmony for phones free
| # | Domain | Page type |
|---|---|---|
| 1 | hothardware.com | Old news (Harmony Hub) |
| 2 | blog.logitech.com | Vendor blog |
| 3 | digitec.ch | Retail product page |
| 4 | mactrast.com | 2013 news |
| 5 | mactrast.com | Same article (AMP) |

Ours present: no. Also ranking: hometheaterreview.com ("check out these smartphone TV remotes", 2021), 9to5mac.com universal remote guide, imore.com, techcrunch.com (2011), walmart.com.
**Verdict: winnable with links.** The SERP is stale (2011 to 2021), and Logitech has discontinued Harmony. A "free Harmony alternative" section on the Hearth page plus one fresh link can beat decade-old news.

### Outreach and listing targets: Hearth
| Target | URL | How | Cost |
|---|---|---|---|
| **vitalets/awesome-smart-tv** (1.5k stars), Cross-platform tools | https://github.com/vitalets/awesome-smart-tv | PR. Rule: "wait at least a couple of weeks" after creation (repo created 2026-10-21, so eligible from about 2026-11-04). Merges new tools readily (smartest-tv landed in the same section in Apr 2026) | Free |
| **tolgakurtuluss/awesome-webos**, Remote control | https://github.com/tolgakurtuluss/awesome-webos | PR. Very active: 8 PRs merged in the past week | Free |
| awesome-selfhosted (333k stars) | https://github.com/awesome-selfhosted/awesome-selfhosted-data | PR to the data repo. **Not eligible** until the first tagged release is 4 months old. Tag v0.15.0 now, then the earliest submission is about early March 2027 | Free |
| frenck/awesome-home-assistant | https://github.com/frenck/awesome-home-assistant | Only if Hearth exposes a Home Assistant integration (not confirmed) | Free |
| AlternativeTo: alternative to Logitech Harmony | https://alternativeto.net | Free account, then suggest the app | Free |
| hometheaterreview.com smartphone-remotes article | https://images2.hometheaterreview.com/check-out-these-smartphone-tv-remotes/ | Contact the author for an update | Free |
| 9to5mac universal remote guide | https://9to5mac.com/guides/universal-remote/ | Tips line | Free |
| Reddit r/smarttv (linked from awesome-smart-tv), r/webos (linked from awesome-webos), r/selfhosted, r/homelab (a homelab multi-TV CLI post surfaced in search) | https://www.reddit.com/r/webos/ etc. | Read each sub's self-promotion rules first | Free |

---

## The Leadership Library

Targets: "best books for engineering managers", "engineering leadership reading list", "books every new engineering manager should read".

### 19. best books for engineering managers
| # | Domain | Page type |
|---|---|---|
| 1 | x-team.com | Listicle (12 essential books) |
| 2 | x-team.com | Same listicle (alternate URL) |
| 3 | leaddev.com | Listicle |
| 4 | leaddev.com | Listicle (10 essential books for new EMs) |
| 5 | leaddev.com | Same listicle (alternate URL) |

Ours present: no. Also ranking: manager.dev, github.com/jesselpalmer/the-engineering-managers-booklist, blog.pragmaticengineer.com, dzone.com, karllhughes.com.
**Verdict: long shot.** Established media and listicles hold it; at best the Library gets cited inside one of them.

### 20. engineering leadership reading list
| # | Domain | Page type |
|---|---|---|
| 1 | sneely.opalstacked.com | Personal reading list |
| 2 | github.com | Awesome-style book list (jesselpalmer) |
| 3 | dev.to | Personal post |
| 4 | medium.com | Engineering-blog listicle (Storyblocks, 50 reads) |
| 5 | go.intervue.io | Vendor listicle |

Ours present: no. Also ranking: adrianchang.notion.site (personal list), awesome.ecosyste.ms (reiver technology-executive list), engineered.at, freecodecamp.org, staysaasy.com.
**Verdict: winnable with links.** Personal reading lists rank #1 and #3 here, and the Library is exactly that format, with more depth than most.

### 21. books every new engineering manager should read
| # | Domain | Page type |
|---|---|---|
| 1 | betterprogramming.pub | Medium listicle (member-only) |
| 2 | freecodecamp.org | Listicle |
| 3 | dzone.com | Listicle |
| 4 | medium.freecodecamp.org | Same freeCodeCamp listicle |
| 5 | dzone.com | Same DZone listicle |

Ours present: no. Also ranking: x-team.com, manager.dev, jacobian.org (personal), leaddev.com, mentorcruise.com, leadershipintech.com, phildini.dev (personal).
**Verdict: long shot.** High-authority publishers fill it.

### Outreach and listing targets: Leadership Library
| Target | URL | How | Cost |
|---|---|---|---|
| **engineering-management/awesome-engineering-management** (2.8k stars), "Useful resources" table | https://github.com/engineering-management/awesome-engineering-management | PR. Accepting: 4 additions merged on 2026-10-12 | Free |
| charlax/engineering-management (8.4k stars), "Book reading lists" | https://github.com/charlax/engineering-management | PR. Low odds: most recent outside additions were closed unmerged | Free |
| jesselpalmer/the-engineering-managers-booklist | https://github.com/jesselpalmer/the-engineering-managers-booklist | Ranks for 2 of the 3 searches but was last pushed in Jan 2024, so likely unmaintained | Free |
| Leadership in Tech newsletter | https://leadershipintech.com | Already listed in awesome-engineering-management; ranks for search 21. Pitch to the curator | Free |
| manager.dev / Anton Zaides (Substack) | https://www.manager.dev/blog/7-best-engineering-management-books | Contact the author | Free |
| kdeldycke/awesome-engineering-team-management | https://github.com/kdeldycke/awesome-engineering-team-management | Poor fit: recent additions rejected and no reading-list section | Free |

---

## 18-0

Targets: "nfl roster builder game like immaculate grid", "build the perfect nfl roster game", "football history draft game browser".

### 22. nfl roster builder game like immaculate grid
| # | Domain | Page type |
|---|---|---|
| 1 | apps.apple.com | Competitor app (Gauntlet: Immaculate Grid x fantasy draft) |
| 2 | ftp.ccar-nyc.org | Parasite spam |
| 3 | agrariansolutions.edencreative.co | Parasite spam |
| 4 | db.raceface.com | Parasite spam |
| 5 | sanandres.uep.edu.py | Spam PDF |

Ours present: no. Also ranking: sportsdle.com (competitor blog comparison), mwm.ai (20-0 app page), **20-0.com/guides/roster-building-games** (competitor-owned listicle), renderfoot.com NFL grid, abc10.com, cbssports.com.
**Verdict: winnable soon.** After #1 the SERP is spam. The only real threat is 20-0.com's own guide.

### 23. build the perfect nfl roster game
| # | Domain | Page type |
|---|---|---|
| 1 | glama.ai | MCP server directory (a "17-0" fan game) |
| 2 | africa.espn.com | ESPN feature (Barnwell perfect roster, 2018) |
| 3 | apps.rotowire.com | RotoWire 17-0 game article |
| 4 | rotowire.com | Same article |
| 5 | africa.espn.com | ESPN feature (2017) |

Ours present: no. Also ranking: thewoodreport.substack.com ("The Roster Building Game"), mwm.ai and bluestacks.com (20-0 app), 82-0-challenge.com (17-0 and 20-0 pages), nfl-squad-builder-mvp.vercel.app, **peerpush.com/p/perfect-20**.
**Verdict: winnable with links.** This is the exact concept, and several small competitors already rank, which means small sites can. RotoWire and ESPN hold the top.

### 24. football history draft game browser
| # | Domain | Page type |
|---|---|---|
| 1 | hunted.space | Launch directory (38-0.io) |
| 2 | producthunt.com | Launch page (Eleven DNA) |
| 3 | sites.cc.gatech.edu | Academic NFL-draft visualization |
| 4 | profootballarchives.com | Reference archive |
| 5 | peerpush.com | Launch directory (Drafted XI) |

Ours present: no. Also ranking: producthunt.com (Unbeatable Football), bluestacks.com (17-0 Football Manager), playerprofiler.com.
**Verdict: winnable soon.** Three of the top five are free launch-directory pages for games like 18-0. Launch on Product Hunt (hunted.space mirrors it automatically) and PeerPush.

### Outreach and listing targets: 18-0
| Target | URL | How | Cost |
|---|---|---|---|
| Product Hunt (mirrored to hunted.space) | https://www.producthunt.com | Free launch | Free |
| PeerPush | https://peerpush.com | Free queue (described as long) or $39 instant | Free or $39 |
| thewoodreport.substack.com | https://thewoodreport.substack.com/p/issue-36-the-roster-building-game | Email the newsletter author | Free |
| Sportsdle blog | https://sportsdle.com/blog/huddle-vs-sportsdle | Contact the author (comparison-style content) | Free |
| 20-0.com roster-building guide | https://www.20-0.com/guides/roster-building-games | Competitor-owned, so a listing is unlikely; track it as a rival page | n/a |
| glama.ai MCP directory | https://glama.ai/mcp/servers | Only if 18-0 ships an MCP server; a 17-0 game ranks #1 this way | Free |
| JovaniPink/awesome-nfl-data (3 stars) | https://github.com/JovaniPink/awesome-nfl-data | Tiny list, so low value | Free |

---

## Top-15 action list (ordered by expected traffic per hour of effort)

| # | Action | App(s) | Effort | Why it ranks here |
|---|---|---|---|---|
| 1 | Verify mutaafaziz.com and 18-0.co in Google Search Console and Bing Webmaster Tools, submit both sitemaps, and turn on IndexNow. Add every 18-0.co page to its sitemap | All | 45 min | Nothing ranks, not even brand searches; none of the steps below pay off until pages are indexed. Bing also feeds several answer engines |
| 2 | Publish free itch.io pages for OUTATIME 88 (tags outrun, synthwave, racing), KIN (virtual-pet, tamagotchi), COLD GAS (stunt, physics) and OpenAero (flight-simulator), each linking to the canonical page | 4 games | 2 h | itch.io pages rank in searches 2, 3, 9 and 11 today |
| 3 | PR to **vitalets/awesome-smart-tv** (from 2026-11-04) | Hearth | 20 min | Active list that accepts tools; dofollow GitHub link for the thinnest SERP (search 17) |
| 4 | PR to **tolgakurtuluss/awesome-webos** | Hearth | 20 min | Merging new entries daily |
| 5 | Add Chalk Talk to AlternativeTo (as an alternative to RC Football, Playwrist, FastDraw and The Hoops Geek) and Hearth (as an alternative to Logitech Harmony) | Chalk Talk, Hearth | 1 h | AlternativeTo is #1 for search 14; competitors rank only through it |
| 6 | Product Hunt launch for 18-0 (then KIN in a later week) | 18-0, KIN | 2 h each | Launch pages rank in searches 10 and 24, and hunted.space mirrors them automatically |
| 7 | PR to **engineering-management/awesome-engineering-management** | Library | 20 min | Accepting additions; the Library's best authority link |
| 8 | Add an MIT LICENSE to outatime-88, openaero-dfw, cold-gas and kin, and tag a GitHub release on every repo (Hearth v0.15.0 first) | 4 games, Hearth | 30 min | Opens the open-source-game lists later and starts awesome-selfhosted's 4-month clock (earliest about March 2027) |
| 9 | Email flyawaysimulation.com about its kids, free-sims and KDFW answers | OpenAero | 30 min | It holds #1 in searches 5 and 6 and is family-appropriate |
| 10 | Submit 18-0 and KIN to PeerPush on the free queue | 18-0, KIN | 20 min | PeerPush pages rank in searches 12, 23 and 24. $39 skips the queue; spend it only if the queue stalls |
| 11 | Add on-page sections that match the stale or thin SERPs: "free Logitech Harmony alternative" on Hearth, "virtual pet with real weather" on KIN, "7v7 and 9v9 soccer play diagram" on Chalk Talk | Hearth, KIN, Chalk Talk | 1.5 h | Searches 12, 15 and 18 are held by patents, spam and 2013 news |
| 12 | Email the dinogame.gg and fastplaygames.com listicle authors | OUTATIME, COLD GAS | 30 min | Real listicles on searches 1 and 3 (check their ads before linking from kids pages) |
| 13 | Email the writingmate.ai and contentmavericks.com playbook-designer listicle authors | Chalk Talk | 30 min | The only non-spam editorial pages on search 14 |
| 14 | Post KIN in the virtualpetlist.com showcase | KIN | 30 min | A virtual-pet community directory that ranks for search 10 |
| 15 | Pitch the Dallas Observer: "fly DFW in your browser" | OpenAero | 45 min | Local press link for the winnable search 6 |

### Awesome-list PRs in the top 15 (drafted lines, not submitted)

**3. Awesome Smart TV**: repo https://github.com/vitalets/awesome-smart-tv, section `## Cross-platform tools`, added at the bottom of the section. Their format is `[package](link) - Description (Programming language).`
```md
* [Hearth](https://github.com/mutaaf/hearth) - Self-hosted universal remote that finds LG webOS, Samsung Tizen, Roku, Google TV and Apple TV devices on the home network and serves a phone-friendly web remote, with no accounts or cloud (JavaScript).
```

**4. Awesome WebOS**: repo https://github.com/tolgakurtuluss/awesome-webos, section `## Remote control`, added at the bottom. Their GitHub-repo format includes the stars badge on the next line:
```md
- [Hearth](https://github.com/mutaaf/hearth) - Self-hosted web remote that controls LG webOS TVs (plus Samsung, Roku, Google TV and Apple TV) from any phone on the same Wi-Fi, with no accounts or cloud.
![Stars](https://img.shields.io/github/stars/mutaaf/hearth?style=flat-square)
```

**7. Awesome Engineering Management**: repo https://github.com/engineering-management/awesome-engineering-management, section `## Useful resources`, a table row added at the bottom:
```md
| [The Leadership Library](https://mutaafaziz.com/library/) | Engineering leadership book notes: labelled summaries of The Manager's Path, An Elegant Puzzle, Peopleware, Accelerate and more, with an engineering manager's reflections |
```

### Lower-odds PRs (not in the top 15, drafted for later)

- **awesome-pwa**: https://github.com/hemanth/awesome-pwa, `### Games and Entertainment`. The list is alphabetical, so this goes after "Othello". Recent additions have all been closed unmerged.
  ```md
  * [OUTATIME 88](https://mutaafaziz.com/outatime/): Free neon time-travel arcade racer with live races by link, a daily challenge and leaderboards, no account.
  ```
- **engineering-management (charlax)**: https://github.com/charlax/engineering-management, `### Book reading lists`:
  ```md
  - [The Leadership Library](https://mutaafaziz.com/library/), Mutaaf Aziz: engineering leadership books with labelled summaries and dated reflections
  ```
- **Awesome Open Source Games**: https://github.com/michelpereira/awesome-open-source-games, `## Browser-Based` > `### Racing`, added at the bottom. Format `[Game](link) - Description.`, and the description must not start with "A" or "An". **Blocked** until the repo has a LICENSE, is 30+ days old and has 40+ stars.
  ```md
  - [OUTATIME 88](https://github.com/mutaaf/outatime-88) - Neon time-travel arcade racer in three.js with live multiplayer by link, a daily challenge and server-checked leaderboards.
  ```
- **open-source-games (bobeff)**: https://github.com/bobeff/open-source-games, `## Racing games`, lexicographic order, so OUTATIME goes between "ManiaDrive" and "Rigs of Rods". It's a personal bookmark list, recent additions were rejected, and it needs a LICENSE.
  ```md
  - **[OUTATIME 88](https://mutaafaziz.com/outatime)** - Neon time-travel arcade racer for the browser with live multiplayer by link. [[source]](https://github.com/mutaaf/outatime-88)
  ```

## Notes for the weekly Playbill agent

- Re-run the same 24 searches each week, in the same mode, and diff the top 5. The first win to watch for is any mutaafaziz.com or 18-0.co URL appearing on the brand checks; that confirms indexing.
- Avoid unblocked-games mirrors (`*.pages.dev`, `onrender.com`, `duckdns.org`, `ubg4school`), crazygamesonline.com (a copycat of crazygames.com) and parasite spam domains for all kids apps. They show up often but are neither link targets nor family-appropriate.
- Fix the 18-0 season-count contradiction in llms-full.txt (2,994 vs 4,872).
