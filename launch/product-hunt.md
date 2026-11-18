# Product Hunt: COLD GAS

**When:** Tue Dec 8. Product Hunt days start at 12:01 am PT; schedule the launch for that time and be around from 7 am ET to answer comments.

**Why COLD GAS:** it's free, plays in a browser with no account, and its most unusual feature (a leaderboard verified by replaying each run) is easy to show. 17-0 is better saved for football audiences, and the agents story goes to Hacker News.

**Before launch:** you'll need to sign in to Product Hunt and create the post yourself. Have ready: a 240x240 PNG exported from `cold-gas/brand/icon.svg`, three to five gallery images or a short video recorded from real runs (the Show course, a Free Drive road, the judges' verdict), and the TestFlight link from https://mutaafaziz.com/coldgas/beta/ if you want to mention iOS.

## Fields

**Name:** COLD GAS

**Tagline** (60 characters max):

```
Fire ten thrusters, roll the car, stick the landing
```

**Link:**
https://mutaafaziz.com/coldgas/?utm_source=producthunt&utm_medium=launch&utm_campaign=launch-nov26&utm_content=ph-coldgas

**Topics:** Games, Web App, Artificial Intelligence

**Description** (260 characters max):

```
A free 3D stunt game in your browser. Drive up a ramp, fire cold-gas thrusters over a row of parked cars, roll 360 and land on the pad. Physics is deterministic, so the server replays your run before it trusts your score. Three AI judges add the commentary.
```

(257 characters.)

**Pricing:** Free

## First comment (post as maker, right after it goes live)

```
Hi Product Hunt, I'm Mutaaf. I'm a solo developer and I build with a lot of AI help.

COLD GAS started from a roadster reveal in October: a car that jumps on cold-gas
thrusters. I wanted to know what that would feel like to drive. It's an
independent fan game, not affiliated with any automaker.

What you do: drive up a kicker, fire the nozzles to clear a row of parked EVs,
roll the car 360 degrees in the air, and land on the mark. A panel of three
judges scores it.

The part I care about most:
- The physics runs as a deterministic simulation at 240 Hz, so a run is just a
  log of your inputs.
- Before a score goes on the leaderboard, the server replays that log and scores
  it again. If it doesn't match, it doesn't count.
- The judges' numbers come from that scorer. The AI only writes their words. You
  can plug in your own AI key if you want different judges.

There are three control tiers (Assist, Pro, and Advanced with all ten valves by
hand), and outside the stunt courses there's Free Drive on real mountain and
coastal roads, an endless seeded road, and a sandbox for building ramps.
Keyboard, gamepad and touch all work, and there's no account.

If you're curious how one person ships this: agents do a lot of the work behind
CI gates, and I wrote up how, including what went wrong:
https://mutaafaziz.com/manifest/?utm_source=producthunt&utm_medium=launch&utm_campaign=launch-nov26&utm_content=ph-first-comment

I'd love to hear where the first jump confused you.
```

## Don't

- Don't ask for upvotes in the post, by email or in group chats. Product Hunt penalizes it.
- Don't describe the judges as "Claude" or any one model; the default is a hosted model and players can bring their own key.
- Don't claim an App Store release. It's a TestFlight beta.
