# LinkedIn Content Plan — Agentic Quality Engineering

**Goal:** Establish high-signal technical credibility for a self-directed R&D project, in a way that is employer-safe (this was your own-initiative research), attracts engineering leaders and technical recruiters through demonstrated rigor, and never once asks for a job.

**Positioning:** You are an engineer sharing rigorous R&D in public. Not job-hunting. The recruiter appeal is entirely *demonstrated* — the work speaks; your profile's "Open to work" recruiter-only setting does the asking silently. This is the higher-status play and it protects you with your current employer.

**Cadence:** 3 core posts, one per week. Two optional follow-ups held in reserve, deployed only if engagement is strong.

**Source of truth:** every metric below traces to `MAKE-THE-CASE.md` (the Stage 7 evidence package). Numbers are quoted with the same caveats the evidence doc uses. Run live against the Cypress Real World App (a full-stack banking demo) with Claude Sonnet 4.5 via OpenRouter — not mocked.

**Tone rules (non-negotiable):**

- Empirical, authoritative, slightly witty, deeply technical.
- Metrics always carry caveats. No number appears without its scope.
- Banned words: *game-changing, revolutionize, unlock, supercharge, disrupt, paradigm, magic, insane, crazy, 10x* (as hype).
- Every strong claim is falsifiable — link the evidence.

---

## 1. Campaign strategy & narrative arcs

Three arcs run underneath the posts. Each post foregrounds one but nods to the others.

**Arc 1 — The First-Principles Engineer.**
You don't add features because they sound smart; you form hypotheses, build negative controls, and kill your own ideas with evidence. The knowledge-graph story is the proof: you built the "obvious" fix, A/B tested it, it failed, and the *why* was a first-principles insight. Signal to leaders: *this person reasons from definitions, not trends.*

**Arc 2 — Metrics vs. Reality (the plot twist).**
The 18.2% → ~2–3% reframe. You distrusted your own headline number enough to adjudicate every failure by hand — and found the system was catching real vulnerabilities (unauthenticated mutations, 500-crashes, missing validation). Signal: *this person interrogates their own results and finds the truth in the residuals.*

**Arc 3 — The Craftsman's Standing Red Gate.**
Your acceptance gate (`verify.sh`) is genuinely red because of one structurally-unfixable pagination miss — and you report it rather than fake green. Signal: *this person's definition of "done" is honest, not convenient.* This is the arc recruiters remember. *(Restructured: this is no longer a standalone post — it lands as the closing, falsifiable one-liner inside the Post 3 finale, which avoids spending the highest-value week defending "standing red" as a thesis.)*

The throughline across all three: **rigor as a personality.** Not "I built an AI thing," but "I built an AI thing and then spent most of my effort trying to prove it wrong."

---

## 2. The posts

Each post has a **3-line hook** engineered to force the "…see more" click (curiosity gap, no payoff in the visible portion). Fill `[BRACKETED]` placeholders before publishing.

Formatting for LinkedIn: keep line breaks generous, one idea per line, use `—` and `↓` sparingly, put the link in the *first comment* (LinkedIn suppresses reach on posts with outbound links in the body — reference "link in comments").

---

### POST 1 — What it is & how the loop works (anchor)
**Week 1. Arc: 1 (with a nod to 3). Foldable evidence: the live dollar-to-cents demo.**

```
I gave an agent a plain-English requirement and no test code.

It wrote an API test that checks money actually moves — in cents.

Nobody told it to check the balances. Here's the loop. ↓

—

The setup: point the agent at a user story + acceptance criteria for a
real banking app. No test code. It's never shown the app's source.

One requirement — "creates a new payment" — start to finish:

→ It writes a 4-step test: fetch two seeded users, fetch a bank account,
  send a payment, then RE-FETCH both balances and assert the money moved
  by the right amount, in cents. It inferred the balance check from the
  domain. Nobody wrote that assertion.
→ Run 3x against the untouched app: pass, pass, pass.
→ Then I break the backend on purpose — one line:
    - amount: transactionDetails.amount * 100,
    + amount: transactionDetails.amount,
→ Same test, no changes: fail, fail, fail.
→ A SECOND agent triages the failure, seeing only request/response
  evidence — never told anything was broken. Its verdict:
  "not performing the documented dollar-to-cents conversion... a clear
  violation of the documented contract." Classified real_defect, high
  confidence, with a 5-step repro.
→ Revert the one line: pass, pass, pass. The app, not the test, was the
  variable the whole time.

Every stage kills one class of false positive:
run-3x-with-reset removes flakes. blind triage removes self-confirmation.
the repro script forces falsifiability.

On a controlled 4-requirement slice (with field hints), measured against
a 12-defect catalog: 0% false positives, 90% defect catch (9 of 10),
100% triage accuracy (12 of 12) — and the 2 negative controls it was
NOT supposed to catch, it correctly ignored.

Caveat, because it matters: that's the ceiling under good conditions —
a narrow slice with hints against a KNOWN defect list. The messy
full-breadth numbers, and the plot twist inside them, are next week.

Live demo + full write-up in comments. Real app, real LLM, not scripted.

What would you attack first in a loop like this?
```

*Hook length check: first 3 lines ≈ 165 chars, under the ~210 fold.*
*Comment to pin:* the demo MP4/GIF is attached as the post's native media; the first comment links the live dashboard, evidence doc, and repo. Ready-to-paste comment in `PUBLISH-PACKAGE.md`.
*Folded-in theme 4 (guardrails):* the "every stage kills one class of false positive" framing carries the flake-guard architecture without a separate post.

---

### POST 2 — The 18.2% "lie" (best hook / most shareable)
**Week 2. Arc: 2 (with a nod to 1).**

```
My test system said 18.2% of its results were false alarms.

I almost "fixed" that number. Instead I opened every single one by hand.

Most of them weren't false alarms. They were real bugs. ↓

—

Quick recap: last week I showed a system that writes its own API tests,
runs each one 3× to kill flukes, and has a second AI judge the failures.
On a small, careful slice it looked near-perfect. Then I turned it loose
on everything — and the numbers got messy. Here's what happened.

The full run: all 44 requirements, no hand-holding. The system wrote 132
tests. 24 of them failed against an app I knew was clean — an 18.2%
false-alarm rate.

The easy move is to quietly tune the system down until that number looks
good. The number improves. The system gets worse. So I did the opposite:
I opened all 24 and read them, one by one.

Two things fell out.

First, a dead-simple check: does the endpoint the test is calling even
exist in the app? A chunk of the "failures" were tests hitting routes
that aren't there. I gated those out — you shouldn't test a door that
isn't in the building.

Then I read every remaining failure by hand. About 11 were REAL bugs the
system had correctly caught in the banking app:

→ the app crashes with a 500 error when you leave out the password
  (instead of politely rejecting it)
→ you can create a bank account without being logged in at all
→ it accepts empty account numbers and invalid emails without complaint
→ it crashes on a simple contacts lookup

Only ~3 were genuine false alarms (the test was too fussy). ~1 was on
me — a test that assumed seeded data that wasn't there.

Take the real bugs back out of the "false alarm" pile, and the true rate
is about 2–3% — not 18.2%.

Honest caveat: I checked these by hand, on one app, so 2–3% is a careful
estimate, not a law of nature. But the direction is clear — most of the
"accuracy problem" was the system doing its job against an app with weak
checks.

The lesson I keep relearning: your headline number is a guess until you
read what's underneath it. Go read your failures. The truth is usually
hiding there.

Full breakdown in the comments.

Next week, the finale: the fix I was sure would work — and the controlled
experiment that killed it.

What's the most "wrong" number you've ever trusted?
```

*Hook length check: first 3 lines ≈ 160 chars.*
*Comment to pin:* link to `MAKE-THE-CASE.md` ("After Stage 7" chapter) + `docs/design/requirements-first-principles.md`.
*Accuracy note:* post body deliberately omits the 15.4%/12.2% figures — those come from a *separate* grounding A/B run (baseline band 15.4–19.1%, grounded 12.2%), NOT the 132-test/24-fail breadth run, so citing them inline created an unreconciled denominator (24/132=18.2%, not 15.4%; the 15 residuals are 15/123, not 15/132). Public arc kept single-threaded and un-attackable on arithmetic: 18.2% (24/132) raw → gate out phantom-route tests → adjudicate the residuals (~15) → ~11 real → ≈2–3% true. Full multi-run detail lives in `docs/design/requirements-first-principles.md` §8.2–8.3 and is linked in the first comment for anyone who digs.

---

### POST 3 — I was sure it would work; the experiment killed it (finale / the crown jewel)
**Week 3. Arc: 1 (the first-principles engineer), closing on 3 (honest "done"). Image: the A/B chart.**

```
Last week: my system's "false alarms" turned out to be mostly real bugs.

So I built the obvious fix — and I was sure it would work.

I ran a controlled experiment to prove it. It failed. ↓

—

Recap: a system that writes its own API tests flagged an 18.2% false-alarm
rate at full breadth. I read those failures by hand — most were real bugs
in the app. But a residual ~3% were genuine false positives: the tests
themselves being wrong. The obvious cause? The agent doesn't understand the
app's code well enough.

So I built the fix I believed in: a code knowledge graph. A dependency and
side-effect map of the backend, feeding the agent what each endpoint actually
touches — "this payment mutates the sender and receiver balance." More code
knowledge → better tests. Obvious. I was sure.

Then I did the part that's easy to skip: I ran a controlled A/B before
trusting it. Baseline vs. graph, on the exact write-flow requirements the
graph was built to help — three runs each.

The result:

→ False positives: 31.5% → 32.8%. It didn't move. If anything, slightly worse.
→ Coverage: 8 of 8 requirements → 7 of 8. The graph cost me one.

The fix I was certain about did nothing. So I killed it — cheaply, before it
shipped, instead of defending it because I'd built it.

Then the part that mattered: WHY it couldn't work, from first principles.

A test checks the app's actual behaviour against its EXPECTED behaviour — the
oracle. The oracle is a statement of intent. And intent is not in the code.
Deriving "what it should do" from the code under test is circular — it just
asserts the code does what it does, which catches nothing. No amount of code
knowledge can supply a missing oracle. The lever was never code knowledge.
It's the fidelity of the requirement itself.

That one insight reframed the entire roadmap — and it only exists because the
experiment was allowed to fail.

The same discipline runs through the rest of the project: I keep my own
acceptance gate red over one pagination bug I won't paper over. A green light
that lies makes every future green meaningless. It's still red as of posting —
if I ever quietly turn it green, call me out.

Cheap experiments that can prove me wrong beat expensive features I'm attached
to. Every time.

A/B write-up + the first-principles memo in comments.

What's a fix you were certain about that the data killed?
```

*Hook length check: first 3 lines ≈ 165 chars, under the ~210 fold.*
*Comment to pin:* `docs/design/graphify-decision-memo.md` (the A/B, §12) + `docs/design/requirements-first-principles.md` (the first-principles why) + `MAKE-THE-CASE.md` ("Where the gate currently stands") for the red gate.
*Accuracy / anti-seam note:* the A/B figures (31.5% → 32.8%) are the **differential on the 8 write-flow requirements graph-L1 augmented** (3 runs/arm, `graphify-decision-memo.md` §12) — a harder subset than the 18.2% full-breadth number, which is why they're higher. Post scopes them explicitly ("the write-flow requirements the graph was built to help") so 18.2% and 31.5% never read as a contradiction. Honest limits per the memo: small sample (8 reqs), directional signal not a significance test. The red gate is demoted from a standalone post to a one-line falsifiable commitment — its strongest, least-attackable form.
*Retired:* the standalone "Standing Red Gate" post. Its content survives as the closing beat above; no separate Week-4 post needed.

---

### ~~OPTIONAL FOLLOW-UP A~~ — PROMOTED TO POST 3 (do not double-ship)
**This content is now the Post 3 finale above.** The graphify A/B kill is no longer an optional extra — it is the crown-jewel finale, with the A/B chart as its image. The draft below is kept only as a shorter alternate phrasing / raw material; do not publish it as a separate post.
**Arc: 1.** Expands the graphify kill into its own post.

```
I built the "obvious" fix for my system's false positives. It failed.

Failing it produced the strongest evidence in the whole project. ↓

—

The weakness was named honestly: 18.2% false positives at full breadth.
The obvious hypothesis: the agent doesn't understand the code well
enough. So I built a code knowledge graph — a dependency/side-effect map
of the backend — and fed the agent what each endpoint actually touches
("this payment mutates sender and receiver balance").

Intuition said: more code knowledge → better judgment.

I ran a controlled A/B against the baseline. The false-positive rate did
not move. Coverage even slipped by one. Measured, not assumed — and
killed cheaply rather than shipped on faith.

Then I worked out WHY, from first principles:

A test checks observed behaviour against an EXPECTED behaviour — the
oracle. The oracle is a statement of INTENT, and intent is not present in
the implementation. Deriving "what it should do" from the code under test
is circular — it just asserts the code does what the code does, which
catches nothing. No amount of code knowledge can supply a missing oracle.

The real lever was never code knowledge. It's the fidelity of the
requirement itself. That reframed the entire roadmap.

Cheap experiments that can prove me wrong beat expensive features I'm
attached to. Every time.

A/B write-up + the first-principles memo in comments.
```

---

### OPTIONAL FOLLOW-UP B — App-agnostic guardrails (deploy for the deeply technical crowd)
**Arc: 1/3.** For when the audience wants architecture depth.

```
The hardest part of an agentic test loop isn't the agent.

It's stopping the agent from lying to itself. Four guardrails did it. ↓

—

An agent that generates AND judges its own tests will confirm itself into
nonsense. The architecture that prevents it:

→ IMPORT BOUNDARIES: the loop is app-agnostic (core/adapter split). The
  agent gets the requirement and the API surface — never the test code,
  never the implementation. It can't cheat by reading the code.

→ 3x FLAKE-GUARD with state reset: every test runs three times against
  reset state. Nondeterministic results are excluded from scoring before
  they ever reach a report (28.8% were flagged flaky/inconclusive at full
  breadth and set aside, not counted as passes OR failures).

→ BLIND TRIAGE: a separate agent judges failures without the generator's
  reasoning, and is never told a defect was injected. Separation of
  powers, applied to agents.

→ FALSIFIABLE OUTPUT: every reported bug ships with a 5-step repro a human
  can run. No repro, no report.

None of these are clever. All of them are boring on purpose.
Boring guardrails are what let you trust an interesting system.

Architecture notes in comments.
```

---

## 3. Engagement & CTA strategy

**Comments section — the real reach engine.**

- **Reply to every substantive comment within the first 90 minutes.** LinkedIn's algorithm weights early engagement heavily; your own replies count. Draft 3–4 anticipated replies before posting.
- **Put links in the first comment, not the post body.** Outbound links in the body suppress reach. Post the body, then immediately drop the repo / `MAKE-THE-CASE.md` / demo link as your own first comment and say "link in comments" in the post.
- **Seed one genuine question at the end of each post** (already written in). Questions that invite war stories ("have you ever kept something red on principle?") outperform yes/no prompts.
- **Handle skeptics as gifts.** If someone challenges a metric, agree on the caveat first, then show the evidence. "Fair — 2–3% is a bounded estimate from hand-adjudicating one app's failures; here's exactly how I got there" converts critics into credibility. Never get defensive; your whole brand here is that you audit yourself harder than they will.
- **You have the receipts.** Every number in these posts is in `MAKE-THE-CASE.md` and `VERIFICATION.md`. When pushed, link the line — the depth of the audit trail is itself the flex.

**Profile "Featured" section — your evidence wall.**

Add, in this order:
1. **The live evidence dashboard** (`https://dmitrydn.github.io/qe-agentic/evidence-dashboard/`) — the polished one-page anchor a VP of Engineering or recruiter opens after your post hooks them. (`MAKE-THE-CASE.md` in the repo is the same content, if you prefer that.)
2. **The repo** (`https://github.com/dmitrydn/qe-agentic`) — clean README, runnable loop (`demo/run-demo.js`), the A/B and adjudication visible.
3. **The demo video/GIF** — the loop running end to end (the dollar-to-cents walkthrough).

Pin Post 2 (the 18.2% plot twist) or Post 3 (standing red gate) to the top of your profile once it performs — those two do the most positioning work.

**The subtle recruiter signal (no availability lines, employer-safe).**

You never say "open to roles." Instead:

- **Turn on LinkedIn's "Open to work — recruiters only" setting.** It's invisible to your network and your employer but visible to recruiters searching. This is where the actual ask lives. Silent and safe.
- **Let the *vocabulary* do the targeting.** Recruiters search on terms. Naturally seed the phrases they hunt for — "agentic," "LLM evaluation," "negative controls," "test generation," "API testing," "oracle / intent," "A/B tested a hypothesis" — inside genuine technical sentences. You're not keyword-stuffing; you're describing your work in the exact words that make you findable.
- **Headline/About framing:** describe what you *do and how you think* ("I build agentic systems and then try to prove them wrong"), never what you *want* ("seeking opportunities"). Demonstrated rigor is a stronger magnet than stated availability.
- **Frame consistently as self-directed R&D.** Every post should make clear (lightly) this was your own initiative. It protects you with your current employer and, paradoxically, reads as *more* impressive to a hiring leader — you do this for the craft, not because someone assigned it.

**Measurement — how to know if it's working.**

Track per post: impressions, "see more" click-through (the hook test), comments-to-reactions ratio (quality of engagement), and profile views + Featured-section clicks in the 48h after each post (the actual conversion signal). If profile views spike after Post 2 or 3, the positioning is landing. Deploy the optional follow-ups only if the core three sustain it.

---

*This is a personal research project shared to document method. All metrics are scoped to the target app (Cypress Real World App) and requirement set described in `MAKE-THE-CASE.md`.*

---

## POST 4 — Executive summary (added after CTO feedback: series read "too technical")
**Audience: CEO / CTO / CIO. Plain, business-language translation of the whole 3-post arc. No code, no jargon. Written in response to a CTO's "too technical" feedback — publishing it also signals coachability.**

```
For three weeks I let an AI do a job we normally trust only to senior
engineers: write and judge software tests.

Here's what actually matters about it — for anyone who leads engineers. ↓

—

For three weeks I shared a side-project: an AI system that writes, runs,
and checks its own software tests — work you'd normally trust only to
experienced engineers.

The engineers liked the details. But the people who decide whether to bet
on this wanted the "so what." Here it is — three takeaways for anyone
leading an engineering org:

1) AI can do real judgment work now — if you verify it honestly.
Pointed at a banking app, the system found genuine, serious bugs on its
own: security holes and crashes, not toy problems. The capability is real.
The catch: it's only trustworthy if you measure it against a known answer,
not against a gut feeling.

2) Your dashboards lie until you look underneath.
My system's headline error rate was 18%. Alarming — until I read every
case by hand. Most of those "errors" were it correctly finding real bugs.
The true rate was ~2–3%. The dashboard was off by 6x. How many of your
green metrics has anyone actually opened up?

3) Kill your best ideas cheaply.
I was sure one upgrade would make it better. I built it, ran one clean
experiment, and it changed nothing — so I deleted it. A day's work, not a
quarter's. The discipline that matters isn't having good ideas; it's
running the cheap test that tells you when you're wrong.

And the one I keep coming back to: a green dashboard that lies is worse
than a red one that's honest. I left my own project's final quality check
failing on purpose, because the failure was real. Faking the green would
have made every future green meaningless.

None of this needed a bigger model or a bigger budget. It needed
measurement, honesty, and cheap experiments — three things that scale to
any team.

The whole thing, with the evidence, is in the comments.

If you lead engineers: how much of what your AI tools report do you
actually verify?

#EngineeringLeadership #AI #QualityEngineering #CTO #SoftwareDelivery
```

*First comment (matches the minimalist style of Posts 1–3 — links + one R&D line, no soft-CTA "otsylka"):*

```
The receipts:

→ One-page evidence summary: https://dmitrydn.github.io/qe-agentic/evidence-dashboard/
→ Full write-up + code: https://github.com/dmitrydn/qe-agentic

A personal, own-initiative R&D project.
```

*Notes:* folds in the "standing red gate" lesson (which never got its own post) as the fourth takeaway. Zero implementation jargon by design — every technical idea is translated to a business term (risk, dashboards, cheap experiments, honesty). Employer-safe, no availability language.
