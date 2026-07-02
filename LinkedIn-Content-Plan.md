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
Your acceptance gate (`verify.sh`) is genuinely red because of one structurally-unfixable pagination miss — and you report it rather than fake green. Signal: *this person's definition of "done" is honest, not convenient.* This is the arc recruiters remember.

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
*Comment to pin:* link to `[DEMO VIDEO/GIF]` (the `demo/run-demo.js` walkthrough) and `[REPO]`.
*Folded-in theme 4 (guardrails):* the "every stage kills one class of false positive" framing carries the flake-guard architecture without a separate post.

---

### POST 2 — The 18.2% "lie" (best hook / most shareable)
**Week 2. Arc: 2 (with a nod to 1).**

```
My test system reported 18.2% false positives at full scale.

I almost "fixed" it. Instead I adjudicated every failure by hand.

Most of them weren't false positives. They were real bugs. ↓

—

Full breadth: all 44 requirements, no field hints, just auto-extracted
text. 132 tests generated. 24 failed against the clean app — an 18.2%
false-positive rate. The lazy move is to tune the system down until
that number drops. The number improves. The system gets worse.

So I did two things instead.

First, a small deterministic grounding gate: an endpoint has to exist in
the app's real route table before a test can assert against it. That
alone took the rate from 15.4% to 12.2% — a chunk of the "failures" were
tests asserting against routes that don't exist.

Then I adjudicated the 15 remaining failures one by one. About 11 were
REAL bugs the system correctly caught in the banking app, including:

→ the API 500-crashes when a password is omitted (instead of a clean 4xx)
→ a GraphQL createBankAccount mutation runs with NO authentication
→ empty account numbers and invalid emails accepted without validation
→ a crash on a contacts lookup

Only ~3 were true false positives (over-strict "exactly one error"
assertions) and ~1 was a data-setup gap.

Reclassify the real bugs and the true false-positive rate is ≈ 2–3%,
not 18.2%.

The caveat I owe you: this is human adjudication on one specific app;
2–3% is a bounded estimate, not a constant. But the direction isn't in
doubt — the "accuracy problem" was, in large part, the system doing
exactly its job against a backend with weak validation.

The lesson: your headline metric is a hypothesis, not a fact.
Adjudicate your residuals. The truth is usually hiding in them.

Full failure-by-failure breakdown in comments.
```

*Hook length check: first 3 lines ≈ 160 chars.*
*Comment to pin:* link to `MAKE-THE-CASE.md` ("After Stage 7" chapter) + `docs/design/requirements-first-principles.md`.
*Accuracy note:* the chain is now correct — 18.2% (24/132) raw → grounding gate 15.4%→12.2% → 15 residuals adjudicated → ~11 real → ~2–3% true.

---

### POST 3 — The Standing Red Gate (craftsmanship flex / recruiter magnet)
**Week 3. Arc: 3 (with a nod to 1).**

```
My project's acceptance gate is red. I could make it green in minutes.

I won't — and leaving it red is the more honest engineering.

Here's the bug I refuse to paper over. ↓

—

Run end-to-end, my own gate (verify.sh) fails at the defect-catch step.
The cause: one deliberately subtle off-by-one in pagination that the
generated test's assertions structurally can't see. I found it while
preparing the evidence package, ran it twice to confirm it wasn't a
flaky LLM call — identical both times.

The tempting move: special-case that one assertion, get the green
checkmark, ship. Everyone's happy. Nobody knows.

I left it red.

A green gate that lies is worse than a red gate that's honest. The whole
point of a verification layer is that "green" means something. The first
time you fake it, green means nothing forever after.

A red gate is a to-do list with integrity: here is a real gap,
unresolved, visible, not swept under a conditional. Fixing it for real
means either earning a genuine catch or deliberately reclassifying it as
an accepted gap — both real work, not a checkbox to tick.

Same discipline ran through the whole project:
→ a second agent triages failures BLIND, so nothing marks its own homework
→ I A/B tested a knowledge-graph feature I was excited about; it failed,
  and I killed it instead of keeping it because I'd built it

Rigor isn't the tests you write. It's the results you refuse to fake.

Write-up in comments.

Have you ever kept something red on principle? What was it?
```

*Hook length check: first 3 lines ≈ 150 chars.*
*Comment to pin:* link to `MAKE-THE-CASE.md` ("Where the gate currently stands") + the graphify decision memo.
*Folded-in theme 2 (killed knowledge graph):* the A/B kill lands here as supporting proof, no standalone post needed.

---

### OPTIONAL FOLLOW-UP A — The knowledge-graph that failed (deploy only if Post 3 lands well)
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
- **Put links in the first comment, not the post body.** Outbound links in the body suppress reach. Post the body, then immediately drop the `[REPO]` / `MAKE-THE-CASE.md` / demo link as your own first comment and say "link in comments" in the post.
- **Seed one genuine question at the end of each post** (already written in). Questions that invite war stories ("have you ever kept something red on principle?") outperform yes/no prompts.
- **Handle skeptics as gifts.** If someone challenges a metric, agree on the caveat first, then show the evidence. "Fair — 2–3% is a bounded estimate from hand-adjudicating one app's failures; here's exactly how I got there" converts critics into credibility. Never get defensive; your whole brand here is that you audit yourself harder than they will.
- **You have the receipts.** Every number in these posts is in `MAKE-THE-CASE.md` and `VERIFICATION.md`. When pushed, link the line — the depth of the audit trail is itself the flex.

**Profile "Featured" section — your evidence wall.**

Add, in this order:
1. **`MAKE-THE-CASE.md`** (or a rendered version) — the evidence anchor. This is what a VP of Engineering or recruiter opens after your post hooks them.
2. **The repo** — clean README, runnable loop (`demo/run-demo.js`), the A/B and adjudication visible.
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
