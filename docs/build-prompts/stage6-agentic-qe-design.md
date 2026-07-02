# Stage 6 — Agentic QE Workflow: Design

_Status: design locked, build not started. Substrate = `agentic-qe-sandbox/` (stage 5)._

## What we're building
An agent that, given (a) the unified requirements doc and (b) a live app target via its
adapter, **generates API tests, runs them against the app, and triages the results** —
with success measured by how many seeded defects the generated tests catch.

## Scope decisions (locked)
- **Loop:** full — generate → run → triage.
- **Test layer:** API-level first (matches the verified oracle and current requirements
  coverage). UI/E2E is a fast-follow.
- **Success metric:** seeded-defect detection (inject known bugs, measure catch rate).
- **Form factor:** hybrid. Agent (Claude Code / Agent SDK) does the *judgment* steps
  (generate, triage); deterministic code does selection, execution, scoring, reporting.
  Rationale: the "make the case" claim rests on a credible, reproducible measurement, so
  the scoring path must not itself be an LLM.

## The loop (per requirement, or small batch)
1. **SELECT** _(deterministic)_ — pull a requirement + its acceptance criteria +
   traceability pointer from `requirements/unified-requirements.md` via the core.
2. **GENERATE** _(agent)_ — from the acceptance criteria, emit executable API test(s),
   including the implied negative/auth cases (e.g. unauthenticated → 401). Each generated
   test is tagged with its source requirement id.
3. **RUN** _(deterministic)_ — execute the generated test against the live containerized
   app through the adapter's runner; capture pass/fail + raw output. Run **N times
   (configurable, default 3)** with a clean **seed/reset between every run** (via the
   adapter) so the flake check is meaningful — no shared state leaking across runs.
   Decision rule: **all-pass → pass**; **all-fail → real signal, send to triage**;
   **mixed → quarantine as flaky, do not score**. (N=3 is the cheap minimum giving both a
   majority vote and a stability signal; it detects frequent/moderate flakiness, not rare
   — raise N for the flakier UI/E2E layer later.)
4. **TRIAGE** _(agent)_ — classify each failure as: (a) real app defect, (b) bad/flaky
   generated test, or (c) environment issue. Real defect → emit a defect report with
   repro steps. Bad test → regenerate, bounded to 2 retries.
5. **REPORT** _(deterministic)_ — aggregate: requirements covered, pass/fail, defects
   found, triage outcomes, flaky-quarantine list.

## App-agnostic boundary (carry forward the proven stage-5 principle)
- **Core / workflow (no app names):** requirement selection, prompt assembly, loop
  orchestration, retry/flake policy, triage scoring, reporting.
- **Adapter (extend existing per-app adapter):**
  - `testRunner(generatedTest) -> {pass, output}` — how to execute a generated test and
    parse its result (framework choice lives here, not in core).
  - `faultInjector(defectId) -> apply()/revert()` — used only by the eval harness.
  - reuse existing `run() / seed() / auth() / teardown()`.
- Guardrail: adding fault injection or a new app must be **adapter-only** — zero core
  changes, same as the stage-5 guarantee.

## Success harness — seeded-defect detection ("make the case")
- A small catalog of known defects injected into the Cypress RWA backend, e.g.:
  - payment amount stored without the dollars→cents (×100) conversion,
  - auth gate removed from `POST /transactions` (should be 401 when unauthenticated),
  - a balance not updated on the receiver side.
- Procedure: run the agent's generated suite on the **clean** app (expect green, modulo
  quarantined flaky tests = false-positive check), then re-run with **each** defect active
  and record whether the targeting test goes red.
- Headline metrics: **catch rate** (true positives over seeded defects) and
  **false-positive rate** (failures on the clean app).

## Deliverables (under `agentic-qe-sandbox/`)
- `workflow/` — app-agnostic loop orchestrator (select / orchestrate / triage-scoring /
  report).
- `adapters/cypress-rwa/` — extend with `testRunner` + `faultInjector`.
- `eval/` — seeded-defect catalog + deterministic scoring harness.
- `generated-tests/` — agent output (gitignored or kept as evidence).
- `reports/` — run report, per-defect reports, and the scorecard.
- `README.md` + `VERIFICATION.md`.

## How stage 6 gets verified
- **Clean run:** generated suite is green except known-quarantined flaky tests
  (false-positive rate reported).
- **Seeded defects:** for each injected defect, at least one generated test flips to red;
  report the catch rate.
- **Traceability:** every generated test names the requirement id it came from.
- **Flakiness:** N-run stability check (default 3) with reset between runs; confirm the
  decision rule fires correctly (all-pass / all-fail / mixed→quarantine) and that
  quarantined tests are excluded from scoring.
- **App-agnosticism preserved:** enforced by an automated **import-boundary rule**
  (`tools/check-boundaries`, run in CI) — `core/`/`workflow/` may not import from
  `adapters/` or contain app/framework identifiers. Verified by a passing run plus a
  negative test (inject a violation → check fails → revert). This replaces the stage-5
  manual checksum as the standing guardrail.
