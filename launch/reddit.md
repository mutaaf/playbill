# Reddit

Five drafts. Post them by hand, from the owner's own account, on the dates in `calendar.md`. Reply to every comment for the first two hours; that matters more than the post.

**Rules status, read this first.** Reddit refused every automated read of its rules pages while this kit was written (WebFetch, curl and the Chrome extension were all blocked). The notes under each post come from search results and third-party mirrors of the subreddits, some from 2022 to 2024. Before posting, open `old.reddit.com/r/<sub>/about/rules` and the sidebar yourself and check the specific items listed under each post. If a rule forbids the post, skip it.

General rules that apply everywhere:

- Say plainly that you made it. Never use a second account, never ask friends to upvote.
- Don't post the same text to several subs in one day. These are spread over three weekends on purpose.
- If a sub wants a GIF or video, use one recorded from the real game (COLD GAS has capture scripts, `scripts/shots.mjs`).

---

## 1. r/WebGames: Hinge Pop

**When:** Fri Nov 20, late morning ET.
**Self-promo:** Unconfirmed. A 2026 third-party guide says r/WebGames expects members to have taken part in the community before posting their own work. Check the sidebar for a developer or self-promotion rule and any required title tag (some browser-game subs want `[Browser]` or similar).
**Flair / day limits:** Unknown; check.
**Link:** https://mutaafaziz.com/hingepop/play/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-webgames

**Title:**
Hinge Pop: split bubbles and keep them off the hinge (free, no account, two players on one screen)

**Body:**

I made this. It's a small arcade game about a glowing hinge across the middle of the screen and bubbles that keep drifting into it.

- Tap a bubble to split it. Tap the smallest size to pop it. Flick to aim the pieces.
- A big bubble that crosses the hinge splits for free but charges an overload meter. A full meter costs you a shield.
- Eight taps in a row without a crossing wins a shield back.
- Each size has its own mass and bounce, and they collide, so a heavy bubble can shove a light one into the hinge.
- Two players: each of you owns one side of the hinge. Whatever you let through lands on your opponent.

It runs in the browser on a phone or a laptop. No account, no install.

Play: [link above]

I'm a solo developer and I build with a lot of AI help. I'd like to hear where the difficulty feels wrong, in either direction.

---

## 2. r/playmygame: COLD GAS

**When:** Tue Nov 24, evening ET.
**Self-promo:** Allowed. The sub exists for developers to share their own games.
**Flair:** Required, and (per mirrored mod notes) added *after* you submit. Use the web/browser flair. Posts without flair are removed.
**Limits:** Mirrored rules say one post per month. That is why only COLD GAS goes here, and Hinge Pop goes to r/WebGames.
**Check:** whether the current rules require a specific description format or a feedback request in the post; the draft below includes both.
**Link:** https://mutaafaziz.com/coldgas/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-playmygame

**Title:**
COLD GAS: drive a roadster up a ramp, fire ten thrusters over a row of parked cars, roll it, stick the landing (free, browser)

**Body:**

**Game:** COLD GAS
**Platform:** Browser (keyboard, gamepad or touch). There's also an iPhone/iPad beta on TestFlight, linked from the page.
**Price:** Free, no account.
**Link:** [link above]

**What it is:** A 3D stunt game. You drive up a kicker, fire cold-gas nozzles to clear a row of parked EVs, roll the car 360 degrees in the air and try to land on a pad. A panel of three judges scores the jump.

**What might be interesting:**
- The physics is a deterministic simulation at 240 Hz, so the same inputs always give the same jump.
- That's what makes the leaderboard honest: the server replays your input log and scores it again before it accepts the run.
- The judges' numbers come from that scorer. The AI only writes their comments.
- Three control tiers: Assist, Pro, and Advanced, where you work all ten valves by hand.
- Beyond the stunt courses there's Free Drive on real mountain and coastal roads, an endless seeded road, and a sandbox for building ramps.

**What I'd like feedback on:** whether the first jump makes sense without reading anything, and whether touch controls feel fair on your phone.

It's an independent fan game inspired by a roadster reveal in October, not affiliated with any automaker. I'm one developer building with AI help.

---

## 3. r/IndieGaming: COLD GAS (clip)

**When:** Sat Dec 5, late morning ET.
**Self-promo:** Common there within frequency limits, per third-party guides; the exact ratio could not be confirmed. Check the sidebar for a self-promotion ratio, a "devs: one post per X days" rule and any required flair.
**Format:** Post a 10 to 20 second clip of a real run (the Show course: the release, the jump over the row, the roll, the landing). Put the link in the first comment if the rules prefer media posts.
**Link:** https://mutaafaziz.com/coldgas/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-indiegaming

**Title:**
I made a stunt game where the leaderboard replays your run on the server before it believes you

**Body / first comment:**

This is COLD GAS. A roadster, ten cold-gas thrusters, a row of parked cars, one roll.

The part I'm proudest of is boring on purpose: the physics is deterministic, so a run is just a log of inputs, and the server re-simulates that log before a score goes on the board. The three judges' scores come from that scorer; the AI only writes what they say.

Free in the browser, keyboard, gamepad or touch, no account: [link above]

Solo dev, lots of AI help. Happy to answer anything about how it's built.

---

## 4. r/fantasyfootball: 17-0

**Verdict: advise skip as a standalone post.** 17-0 is a football history game, not fantasy advice, and a standalone link will probably be removed or downvoted. Search results show self-promotion there is tolerated only in threads where people are asking for tools. If the live rules have a daily, off-topic or tools thread that allows it, post the short comment version below in that thread on Thanksgiving morning. Check: self-promotion rule, any "no links to your own site" rule, and which daily thread (if any) is open to it.
**Link:** https://18-0.co/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-fantasyfootball

**Comment version (for a daily or off-topic thread):**

Something for between games today, made by me: 17-0 (18-0.co). You spin a franchise and an era, take one real player season per spin, and fill seven slots (QB, two RBs, two WRs, TE, defense). The roster gets a deterministic rating that maps to a 17-game record.

Today it has a Thanksgiving wheel: only Chicago, Detroit, Philadelphia, Dallas, Kansas City and Buffalo, any era from 1980 to 2025, with its own board for today. Free, no account. [link above]

**Standalone version (only if the rules clearly allow it):**

Title: Made a game for Thanksgiving: build a roster from only today's six franchises, any era since 1980

Body: same as the comment version, plus: "Default mode shows the stat line but hides the rating, so it's a judgment call, not a memory test. If a rating looks wrong to you, the game asks after each season and I use the answers when I refit the model."

---

## 5. r/nfl: 17-0

**Verdict: advise skip unless the live rules allow it.** Old removal notices quote an r/nfl rule that a submission must "add to discussion", and personal projects posted as links tend to be removed. If you post at all, post the discussion version below as a text post, lead with the data, and only include the link if the rules permit links to your own work. Check: the self-promotion rule, the "original content" rule, whether Thanksgiving day has posting restrictions (big game days often funnel posts into game threads), and flair.
**When (if at all):** Thu Nov 26, before 11 am ET.
**Link:** https://18-0.co/?utm_source=reddit&utm_medium=community&utm_campaign=launch-nov26&utm_content=r-nfl

**Title:**
I rated 4,872 seasons (1980 to 2025) against their own era. Here's what the model says the best season at each position was.

**Body:**

Each season is scored against the same position in the same year, not by raw totals, so a 1999 receiver and a 2024 receiver can be compared. Nobody hand-picked these; they fell out of the model:

| Position | Top-rated season |
|---|---|
| QB | Peyton Manning, Indianapolis 2004 |
| RB | Priest Holmes, Kansas City 2002 |
| WR | Cooper Kupp, Los Angeles 2021 |
| TE | Todd Christensen, Las Vegas 1983 |
| DEF | Baltimore 2006 |

(Franchises are named for the city they play in now, so the 1983 Raiders read Las Vegas.)

Known limits: 1980 to 1998 come from season totals, not play-by-play, so four components are missing for those years and their weight is redistributed. It's comparable within an era; be careful across the 1999 line.

Where is it wrong? I'm especially curious about tight ends and pre-1999 defenses.

Disclosure: I built this into a free game, 17-0, where you draft seven of these seasons and get a record. On Thanksgiving the wheel only spins today's six franchises. [link above, only if allowed]
