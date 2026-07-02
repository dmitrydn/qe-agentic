# Agentic QE — Progress Tracker

_Last updated: 2026-06-30_

## North-star goal
Implement an agentic Quality Engineering (QE) architecture and **make the case** for it.
That requires a sandbox with two inputs: a runnable full-stack app (test target) and a
requirements set the agent consumes to generate/run tests.

## Plan & status

| # | Stage | Status | Notes |
|---|-------|--------|-------|
| 1 | Scope the sandbox | ✅ Done | Node, full-stack, user stories + acceptance criteria, ranked shortlist. |
| 2 | Research & shortlist candidate apps | ✅ Done | RealWorld Conduit, Cypress RWA, OWASP Juice Shop. |
| 3 | Hands-on comparison of the two finalists | ✅ Done | Claude Code cloned/ran both. Score: Cypress RWA 27/30 vs Conduit 18/30. |
| 4 | Strategy: one app vs multi-app | ✅ Done | Chose **decoupled two-app**: one live runtime + two requirements inputs. |
| 5 | **Build the phased sandbox** | ✅ Done | `agentic-qe-sandbox/` built + verified — see its `VERIFICATION.md`. |
| 6 | Build the agentic QE workflow (the architecture itself) | ✅ Done (gate green, scoped) | `./verify.sh` exits 0. FP 0% · catch 100% (3/3) · 0 orphans · 47/47 unit tests — but over a curated 4-of-44 slice (see caveats below). |
| 6b | Hardening — close breadth & robustness gaps | ✅ Done (gaps measured & documented, not all closed) | Auto-extract apiHints (workstream A) · expanded defect catalog to 12 (B) · uncurated `--all` 44-req run (C): 38/44 covered, FP 18.2%, 28.8% quarantined · triage stress battery 100% (12/12) (D). `./verify.sh` currently **fails** at the defect-catch step on one documented, structural miss — see `VERIFICATION.md` "Gate status," not fixed (deliberate choice, see below). |
| 7 | Validate & demo — "make the case" | ✅ Done | Live one-requirement walkthrough (`demo/run-demo.js`) + leadership-facing writeup: `MAKE-THE-CASE.md`. |
| 8 | **Test the Graphify hypothesis** (would a code knowledge graph improve test-gen?) | ✅ Done — **NO-GO** | Built graph-L1 (deterministic call-graph side-effect hints) + LLM-inferred Layer-2 design. Differential A/B on the 8 augmented requirements: **no FP reduction, coverage −1** — dependency knowledge did not help. Killed with evidence, cheaply. See `docs/design/graphify-decision-memo.md`. |
| 9 | **Root-cause the accuracy gap** (first principles) → requirements fidelity | ✅ Done — **big reframe** | The lever is requirement *fidelity/oracle*, not code knowledge. Built a grounding gate (phantom endpoints + unenforced constraints): FP 15.4%→12.2% (below baseline noise band). Then adjudicated the residual: **~11 of 15 "false positives" are real app bugs the system correctly found; true FP ≈ 2–3%.** See `docs/design/requirements-first-principles.md`. |

## Where we are right now
All 7 planned stages are done. The full generate → run → triage → score loop is built,
proven live on a real app, measured at two different scopes (curated 4-requirement slice and
the full uncurated 44-requirement set), and written up for both a technical audience
(`agentic-qe-sandbox/VERIFICATION.md`) and a non-technical one
(`agentic-qe-sandbox/MAKE-THE-CASE.md`).

**Headline numbers, with the caveats that bound them (never present these without the
caveat):**
- **Curated 4-of-44 slice**: FP rate 0%, catch rate 90% (9/10 real defects, 12-defect
  catalog incl. 2 negative controls both correctly missed), triage accuracy 100% (12/12
  labelled battery), 0 orphan tests.
- **Uncurated, all 44 requirements** (Stage 6b workstream C): 38/44 requirements covered,
  132 tests generated, FP rate 18.2%, 28.8% quarantined as flaky/unresolved, 0 orphans.
  This is the real cost of removing curation — accuracy drops without richer auto-extracted
  API hints, which is the main remaining limitation, not a fundamental flaw.
- **`./verify.sh` does not currently exit 0** — it fails at the defect-catch step on one
  defect (`transactions-pagination-off-by-one`) that the generated test's assertions are
  structurally unable to catch. Confirmed twice (same result both times, not LLM flakiness).
  Deliberately documented rather than fixed by editing the gate or the catalog — see
  `VERIFICATION.md`, "Gate status," for the full account and what a real fix would require.
- Ran on `anthropic/claude-sonnet-4.5` (not the 4.6 originally pinned); OpenRouter isn't
  bit-deterministic at temp 0 (stable across the curated-slice gate runs, not guaranteed
  at full breadth — see the quarantine rate above).

The app-agnostic boundary (`tools/check-boundaries.js` over `core/**` + `workflow/**`) held
at full scale: zero adapter imports or denylisted identifiers, zero orphan test ids across
all 132 generated tests in the uncurated run.

## Update 2026-06-30 — Graphify experiment → the requirements-fidelity finding (Stages 8–9)

Stage 6b left one headline open question: the 18.2% uncurated false-positive rate, hypothesised to be
a **"needs richer API hints"** problem. We chased that hypothesis to ground and it inverted twice.

1. **Graphify hypothesis — tested and killed.** Would a code knowledge graph (dependency/side-effect
   knowledge) give the agent the richer grounding to cut false positives? Built it (`graph-L1`,
   deterministic call-graph → per-endpoint side-effect hints, behind a default-off flag; 148/148 tests,
   boundary green) and ran a differential A/B. **Result: no improvement** — FP unchanged, coverage −1.
   Reason (first principles): a test's oracle is *intent*, which is not derivable from the code under
   test (deriving expected-from-code is circular). Code knowledge cannot supply a missing oracle.
   Full record: `docs/design/graphify-decision-memo.md`.

2. **Real root cause — requirement fidelity.** The defect reports showed the false positives come from
   requirements that assert things untrue of the running app: **phantom endpoints** (`GET /bankTransfer`
   vs real `/bankTransfers`; `POST /notifications` doesn't exist → 404) and **unenforced constraints**
   (fields declared in a validator the route applies as raw, unenforced middleware). A deterministic
   **grounding gate** (endpoint must exist in the real route table; only enforced validators contribute
   constraints) took FP **15.4% → 12.2%**, below the baseline noise band, gate still green.

3. **The reframe (headline).** Adjudicating the 15 residual "false positives": **~11 are real defects
   the system correctly caught** — 500-crashes (missing-password bcrypt crash, contacts crash,
   transaction-create crash), an **unauthenticated GraphQL mutation**, and multiple **missing input
   validations** — plus ~3 brittle exact-count oracles and ~1 empty-collection case. **The true
   false-positive rate is ≈ 2–3%, not 12%.** The "accuracy problem" was largely the agentic QE system
   *doing its job* on a demo backend with weak server-side validation.

**Net for the case:** the loop is more capable than the raw metric implied; the binding constraint is
requirement/oracle *fidelity* (a solvable, now-understood spec problem), not model capability; and
"more code knowledge" is proven *not* to be the lever. Full analysis: `docs/design/requirements-first-principles.md`.

## Key decisions locked
- Runtime target: **Cypress RealWorld App** (cleanest boot, verified test oracle 13/13).
- Requirements inputs: **realworld-spec** (formal: OpenAPI + Hurl + Playwright + selectors)
  AND **Cypress RWA** tests/TS models (tests-as-requirements).
- Core must stay **app-agnostic**; all app specifics behind per-app adapters.
- Stage 6 scope locked: full **generate → run → triage** loop, **API-level first**,
  measured by **seeded-defect detection**, built as a **hybrid** (agent does generate +
  triage; deterministic code does select/run/score/report). Design in
  `stage6-agentic-qe-design.md`; build prompt in `stage6-build-prompt.md`.
- App-agnosticism is now a **standing automated guardrail**, not a one-off proof: an
  **import-boundary rule** (`tools/check-boundaries`, run in CI) fails if `core/`/`workflow/`
  import from `adapters/` or contain app/framework identifiers. Replaces the stage-5 manual
  checksum; verified by a passing run + a negative test (inject violation → fails → revert).
  Watch-item: tune the identifier denylist (too short = leaks; too broad = false positives).
- Flake-guard policy locked: run each generated test **N times (configurable, default 3)**
  with **seed/reset between every run**; decision rule = all-pass → pass · all-fail → real
  signal (triage) · mixed → quarantine (excluded from scoring). N=3 catches frequent/
  moderate flakiness, not rare — raise N for UI/E2E later.
- Core implementation spec written (`stage6-core-spec.md`): Node+JS, framework-neutral
  `TestCase` data (Generate emits data, adapter executes), generate-once/replay-under-defects,
  versioned app-agnostic prompts, `LlmClient` over **OpenRouter** (configurable, default
  Sonnet-class, temp 0). Generate/Triage are programmatic LLM calls, not Claude Code itself.
- Cost control: containerize the runtime once (kills ~20-min install + Node-pin
  brittleness); defer a second live runtime (Conduit) until actually needed.

## Open risks / watch-items
- Cypress RWA: ~20-min Electron-heavy install, brittle Node 22/24 pin → mitigated by
  containerizing once.
- Conduit (TonyMckes impl): two real defects (missing userId FK migration; SQLite
  alter-sync restart fragility) → deferred; if revived, use Postgres-via-Docker or a more
  stable impl.
- Generalization test: adding app #2's requirements must need **only** adapter/config —
  any forced core change is a design-failure signal.
- Coverage is currently **API-centric**, narrower than the "191 requirements" headline:
  only Hurl API assertions parsed for Conduit (not OpenAPI / Playwright / SELECTORS.md),
  only API specs used for Cypress RWA; the oracle is API-only (13/13 api-users). UI/E2E
  execution and the richer spec artifacts are scaffolded but unexercised — close as a
  fast-follow once the stage-6 loop works. (Per VERIFICATION.md §4, broadening should be
  an extractor-only change.)
