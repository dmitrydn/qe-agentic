# Story deck — extension: "The Journey & the Proven Value"

Slide-by-slide content to **extend `Make-the-Case-Stage7.pptx`** with the Stage 8–9 journey
(Graphify hypothesis → requirements fidelity → the reframe) and the proven value. Each slide gives a
title, the on-slide content (kept sparse), a speaker note, and a visual hint. Designed to slot in
after the existing Stage-7 "make the case" slides. Numbers are all measured; keep the caveats.

> Whole chapter's LLM spend: **~€25** total across every run — the point being *rigorous hypothesis
> testing is cheap*. Use as a recurring footer/proof-point.

---

**S0 — Section divider**
- Title: **From a hypothesis to the real constraint**
- Subtitle: We had a working QE loop and one honest weakness. Here's what fixing it taught us.
- Visual: full-bleed divider; small timeline chip "Stage 8–9 · 2026-06".

**S1 — Where Stage 7 left us**
- One open weakness: **18.2% false positives** at full breadth (vs **0%** curated).
- The hypothesis on the table: *the agent needs richer knowledge of the code.*
- Speaker note: this was the honest, actionable finding — not swept under the rug. We went to test it.
- Visual: the two bars — curated 0% vs uncurated 18.2%.

**S2 — The hypothesis: a code knowledge graph (Graphify)**
- Idea: graph the backend's dependencies/side-effects; tell the agent what each endpoint *touches*
  ("this payment mutates sender & receiver balance").
- Expectation: better grounding → fewer invented, wrong assertions → lower FP.
- Visual: small node-graph glyph (route → handler → db → balance).

**S3 — How we tested it (cheaply, honestly)**
- Built `graph-L1` (deterministic call-graph → per-endpoint side-effect hints), default-off flag,
  148/148 tests, app-agnostic boundary green.
- Controlled A/B on the 8 requirements it actually changed; reused the existing harness; ≥ noise-band
  discipline.
- Speaker note: designed to be *falsifiable and cheap* — the graph arm run itself was ~€2; the full
  experiment incl. the baseline ×3 it's compared against was ~€12 (of the ~€25 whole-chapter total).
- Visual: A/B schematic (baseline vs graph arm, everything else held constant).

**S4 — Result: it didn't work**
- False-positive rate: **unchanged.** Coverage: **−1.**
- The one bright spot (balance-delta hint de-flaked a single clean write) didn't generalize.
- Verdict: **NO-GO** — killed with evidence, not opinion.
- Visual: A/B result table; big muted "NO-GO" stamp.

**S5 — Why it *couldn't* work (first principles)**
- A test = stimulus → observed vs **expected** (the *oracle*).
- The oracle is **intent**. Intent is not in the code.
- Deriving "what it should do" from the code under test is **circular** — it catches nothing.
- Punchline: **no amount of code knowledge supplies a missing oracle.**
- Visual: the 4-part test diagram with "expected/oracle" highlighted, arrow from code → oracle crossed out.

**S6 — So what *is* the constraint? Requirement fidelity**
- The lever was never code knowledge — it's whether the **requirement is true about the app**.
- Reframes the whole problem from "smarter agent" to "faithful specification."
- Visual: pivot arrow — "more code knowledge ✗" → "requirement fidelity ✓".

**S7 — Two fidelity defects, found in our own requirements**
- **Phantom endpoints:** requirement says `GET /bankTransfer`; the app serves `/bankTransfers`;
  `POST /notifications` doesn't exist → 404s scored as defects.
- **Unenforced constraints:** "firstName required" — but that rule sits in a validator the route
  applies as *raw, unenforced* middleware. The app accepts the request; the agent's correct negative
  test "fails."
- Speaker note: both are extraction artifacts — real fidelity bugs, code-knowledge-proof.
- Visual: two side-by-side "requirement says X / app does Y" cards.

**S8 — The fix: a grounding gate (deterministic, no model)**
- Endpoint must exist in the app's real route table; only *enforced* validators contribute constraints.
- Result: FP **15.4% → 12.2%**, below the baseline noise band; gate still green; tokens down.
- Honest: a real *fidelity cleanup*, but modest — most of the drop was "stop testing endpoints that
  don't exist."
- Visual: before/after bar with the noise band shaded.

**S9 — Then we read every remaining failure (the reframe)**
- 15 residual "false positives", adjudicated one by one:
  - **~11 → real app defects** the system correctly caught
  - **~3 → brittle oracles** (over-strict "exactly one error" assertions)
  - **~1 → data-setup gap**
- Visual: donut — 11 / 3 / 1, the "11 real" segment emphasized.

**S10 — The real bugs it found (the value)**
- API **500-crashes** when a password is omitted (bcrypt on undefined).
- A **GraphQL `createBankAccount` mutation runs with no authentication** (should be 401).
- Accepts **empty account numbers** and **invalid emails** with no validation.
- **Crashes** on a contacts lookup.
- Speaker note: these are genuine, high-severity findings — surfaced from plain requirements, no test
  code written by a human.
- Visual: a "bug ticket" wall of 4–5 real findings.

**S11 — The number that matters**
- **True false-positive rate ≈ 2–3%** — not 12%, not 18%.
- The metric had been conflating *"bad test"* with *"found a real bug."*
- Visual: 18.2% → 12.2% → **~2–3%** step-down, with labels "raw / grounded / true".

**S12 — Proven value (what's now demonstrated, live)**
- Turns plain-English requirements into runnable API tests — no human test code.
- Runs, triages real-vs-flaky, and **finds genuine defects** (crashes, auth gaps, missing validation).
- True false-positive rate is **low (~2–3%)** once real findings are separated out.
- App-agnostic core held throughout (boundary green); every claim is a *measurement*.
- Visual: 4 check-marked value pillars.

**S13 — How we worked (a method worth reusing)**
- Formed a hypothesis, built it behind a flag, **A/B-tested it, and killed it on evidence.**
- Traced the failure to first principles, fixed the real defect deterministically, then **read the
  data** rather than trusting the headline.
- Whole chapter: **~€25** of model spend.
- Visual: loop — hypothesis → build → measure → reframe.

**S14 — Where next**
- The real open lever is **oracle authority**: when app and spec disagree, which is truth? (a triage
  / adjudication problem, not generation).
- Cheap finishes: relax the ~3 brittle oracles (→ true FP ~1%); normalize path-param matching before
  reusing grounding on **Conduit** (the contract-rich second app).
- Package the ~11 findings as a defect report — the demo-ready artifact.
- Visual: a short roadmap with effort/cost tags (all ≤ €1–3).

---

## Render notes (for the pptx build)
- Keep the existing deck's master/theme; these are additive slides after the Stage-7 close.
- Charts to generate: S1 two-bar, S4 A/B table, S9 donut (11/3/1), S11 three-step FP funnel.
- Tone: honest and evidence-first — the negative result (graph no-go) is a strength, not an apology.
- Every quantitative claim traces to `docs/design/graphify-decision-memo.md` or
  `requirements-first-principles.md`; cite them on a final "sources" footer if the audience is technical.
