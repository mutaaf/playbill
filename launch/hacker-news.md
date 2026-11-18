# Hacker News: Show HN

**When:** Tue Dec 1, 8 to 9 am ET. Be at the keyboard for the next four hours to answer comments.

## Why the starter repo and not the manifest

The Show HN rules (news.ycombinator.com/showhn.html, read Nov 18) say Show HN is "for something you've made that other people can play with", and that blog posts, sign-up pages "and other reading material" can't be Show HNs; post those as regular submissions. The manifest page is reading material. The thing people can run is the public template that came out of it, `mutaaf/ai-native-starter`, so that is the Show HN, and the manifest is linked from the text.

If you'd rather lead with the manifest itself, submit it as an ordinary story (no "Show HN" prefix) on a different day. Don't do both in the same week.

Other rules worth keeping: make it easy to try with no sign-up (the template needs only `gh`), don't ask anyone to upvote or comment, and be in the thread.

## Submission

**Title** (under 80 characters):

```
Show HN: AI-Native Starter, a gated loop of AI agents for one GitHub repo
```

**URL:** https://github.com/mutaaf/ai-native-starter

(GitHub can't run Box Office, so the repo click isn't attributable. The manifest link in the text is.)

**Text** (paste as the first comment right after submitting):

```
I'm a solo developer, 15+ years in. Over the last several months I've shipped a
batch of small apps and games mostly by running AI agents against my repos. The
manifest page counts it: 13 products you can open today, 10 agent-run repos,
and 1,390 agent PRs merged as of Nov 11, counted by a script.

This repo is the copyable core of that setup, for one repo:

- AGENTS.md is the contract every agent reads from a fresh checkout.
- Four roles: Scout finds work, Builder ships it, Critic reviews what shipped,
  Keeper keeps the repo healthy.
- agents/control.json holds pause, expiry, focus, caps and frozen paths, and it
  is editable from a phone.
- An agent PR merges itself only if: today <= expires, not paused, it touches no
  frozen path, it isn't a draft, and CI is green. The gate, the workflows and
  the control file are frozen paths, so agents can't loosen their own leash.
- An expiry workflow opens an issue before the agents' kill date, so they can't
  stop silently.

The idea I'd most like feedback on is the ladder: a rule is only worth the rung
it stands on (written down < prompt < workflow decision < required check <
impossible by construction), and when a rule fails, you move it up a rung.

What it doesn't do well, stated in the README too: independent review is weak
(self-review by a fresh subagent plus a Critic after merge), the daily merge cap
is only a prompt instruction, and scheduled agents need a Claude plan or API
budget.

The manifest has the receipts, including what went wrong: the first fleet ran
dark for about 5 days before I noticed, only 24% of first-generation PRs were
reviewed before the gate, and four of my apps were rejected by App Review within
the same minute under 4.3 spam. One app is on the App Store so far.

https://mutaafaziz.com/manifest/?utm_source=hackernews&utm_medium=community&utm_campaign=launch-nov26&utm_content=show-hn

Happy to answer anything about the setup, the costs, or what broke.
```

## Before posting

- Re-read https://mutaafaziz.com/manifest/ that morning and update the three figures (13 products, 10 repos, 1,390 PRs as of Nov 11) and the App Store count if the page has moved. The starter README itself says "over 1,200 agent PRs", which is older and still true.
- Check `gh repo create my-app --public --template mutaaf/ai-native-starter --clone` still works from a clean machine; HN will try it.

## Likely questions, with honest answers

- **What does it cost?** The manifest says cloud routines have no cost log yet, so the honest answer is "I don't have a per-PR figure for the current generation". The one costed working run on Nov 4 was $1.77.
- **Is the code any good?** Point at the gates (required CI, frozen paths) and at "Still broken" on the manifest. Don't claim quality you haven't measured.
- **Why not just use X?** Answer about the ladder and the expiry alarm; don't knock other tools.
