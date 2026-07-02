# Task: Build the Stage 6 Agentic QE workflow (generate → run → triage)

## Context
The sandbox in `agentic-qe-sandbox/` is built and verified (stage 5): Cypress RealWorld
App runs containerized, and `requirements/unified-requirements.md` holds 191 unified
requirements ingested through an app-agnostic core, with per-app adapters. Read
`agentic-qe-sandbox/VERIFICATION.md`, `stage6-agentic-qe-design.md`, and
`stage6-core-spec.md` before starting. **`stage6-core-spec.md` is the detailed build spec
for everything under `workflow/`** (directory layout, adapter contract, data schemas,
LlmClient over OpenRouter, prompts, steps, orchestrator loop) — follow it.

Now build the agentic QE workflow that consumes those requirements and the live app.

## Scope (locked — do not expand)
- Full loop: GENERATE → RUN → TRIAGE.
- API-level tests only (UI/E2E is a later fast-follow).
- Success metric: seeded-defect detection (catch rate + false-positive rate).
- Hybrid form factor: the GENERATE and TRIAGE steps are agent/LLM-driven; SELECT, RUN,
  scoring, and REPORT are deterministic code so the measurement is reproducible.

## Hard design constraint (unchanged from stage 5 — do not violate)
`workflow/` (the core) must be APP-AGNOSTIC: no app names, no framework names, no
"cypress"/"openapi"/"vite" strings. Everything app-specific lives in the adapter. Adding
fault injection or another app must be adapter-only.

## Automated guardrail: import-boundary rule (make app-agnosticism a standing test)
Replace the stage-5 manual checksum check with an automated, CI-triggered rule so the
boundary is enforced continuously while still allowing the core to evolve legitimately.

Build `tools/check-boundaries.*` (runnable locally and in CI) that scans `core/` and
`workflow/` and FAILS with the offending `file:line` if any of these hold:
- a file imports/requires from `adapters/` or any app-specific module (dependency
  direction must be one-way: adapters import from core, never the reverse);
- a file contains an app/framework identifier from a denylist (case-insensitive), e.g.
  `cypress`, `conduit`, `realworld`, `openapi`, `hurl`, `playwright`, `vite`, `sequelize`,
  `lowdb`, `jwt`, `supertest` — keep the list in one obvious place so it's easy to extend.

Wire it in: add an npm script (e.g. `npm run check:boundaries`), include it in the default
test/CI command so every PR runs it, and note how to run it locally. Unlike a checksum
manifest, this rule constrains *dependencies and identifiers*, not arbitrary edits — so a
legitimate core change passes, while any app-specific leak fails. No manifest to bump.

## The loop to implement
1. SELECT (deterministic): read a requirement + acceptance criteria + traceability id from
   `requirements/unified-requirements.md`.
2. GENERATE (agent): emit executable API test(s) for the acceptance criteria, including
   negative/auth cases (e.g. unauthenticated → 401). Tag each test with its requirement id.
3. RUN (deterministic): execute via the adapter's `testRunner` against the live
   containerized app. Run **N times — N configurable, default 3** — calling the adapter's
   `seed()/reset()` BEFORE each run so no state leaks across runs (the flake check is
   meaningless without this). Decision rule: all-pass → pass; all-fail → real signal (to
   triage); mixed → quarantine as flaky and do NOT score it.
4. TRIAGE (agent): classify each failure as real defect / bad-or-flaky test / env issue.
   Real defect → write a repro-bearing defect report. Bad test → regenerate, max 2 retries.
5. REPORT (deterministic): scorecard with requirements covered, pass/fail, defects found,
   triage outcomes, quarantine list.

## Adapter extensions (in `adapters/cypress-rwa/` only)
- `testRunner(generatedTest) -> {pass, output}` — executes a framework-neutral `TestCase`.
  **Default: plain `fetch`** (Node 22 built-in) + a small assertion helper for the
  declarative status/JSON-path checks; no extra test dependency. The framework choice lives
  here, never in Core.
- `faultInjector(defectId) -> { apply(), revert() }` — patch/restore backend source to
  inject a known defect. Must cleanly revert.
- Reuse existing `run() / seed() / auth() / teardown()`.

## Seeded-defect catalog (eval/) — at least these three
- Payment amount stored without the dollars→cents (×100) conversion.
- Auth gate removed from `POST /transactions` (unauthenticated should be 401).
- Receiver balance not credited on a completed payment.
For each: a deterministic scoring harness that (a) runs the generated suite on the CLEAN
app and records false positives, (b) applies the defect, re-runs, and records whether a
targeting test flips to red, then reverts.

## Reuse these already-discovered environment facts (don't rediscover)
- App runs via the stage-5 container: `./agentic-qe-sandbox/docker/run.sh` (build / verify).
- Node pinned to 22; `.yarnrc` has `ignore-engines true`; ensure `ELECTRON_RUN_AS_NODE`
  is unset before any Cypress invocation; seeded user password is `s3cret`; backend on
  :3001, frontend on :3000; auth is session-cookie for Cypress RWA.

## Deliverables (under `agentic-qe-sandbox/`)
- `workflow/` — app-agnostic orchestrator (select, orchestrate, triage-scoring, report).
- `adapters/cypress-rwa/` — `testRunner` + `faultInjector` added.
- `eval/` — seeded-defect catalog + scoring harness.
- `tools/check-boundaries.*` — the import-boundary rule + npm script + CI wiring.
- `generated-tests/`, `reports/` — outputs (agent-generated tests + scorecard + defect reports).
- Update `agentic-qe-sandbox/README.md`; write a stage-6 section in `VERIFICATION.md`.

## Verify before finalizing (record in VERIFICATION.md, stage-6 section)
- Clean run: generated suite green except quarantined flaky tests; report the
  false-positive rate.
- Seeded defects: for EACH catalog defect, confirm at least one generated test flips red
  with the defect applied and back to green after revert; report the catch rate.
- Traceability: every generated test names its source requirement id; spot-check ≥2.
- Flakiness: show the N-run (default 3) stability results, confirm reset ran between
  runs, and that the decision rule (all-pass / all-fail / mixed→quarantine) behaved
  correctly with quarantined tests excluded from scoring.
- App-agnosticism: the import-boundary check passes on the current tree. Then run a
  NEGATIVE test — temporarily add an app-specific import into `core/`, confirm the check
  FAILS with the right file:line, and revert. Report both results (a guardrail that can't
  fail proves nothing).
- State explicitly anything you could NOT verify.

## Ordered execution plan (do these in order)
0. **Preflight** — bring up the stage-5 sandbox: build/boot the containerized Cypress RWA
   (Node 22, auto-seeded), confirm it's reachable. Read `VERIFICATION.md` +
   `stage6-agentic-qe-design.md`. Stand up the import-boundary rule FIRST (step 1) so the
   core is guarded from line one.
1. **Boundary guardrail** — build `tools/check-boundaries.*`, add `npm run check:boundaries`,
   wire it into the default test/CI command. Confirm it runs (green on an empty core).
2. **Scaffold** — create `workflow/`, `adapters/cypress-rwa/`, `eval/`, `tools/`,
   `generated-tests/`, `reports/`. Define the adapter interface/types in `workflow/`.
3. **Adapter extensions** — implement `testRunner()` and `faultInjector()` in
   `adapters/cypress-rwa/`; wire reuse of existing `run/seed/auth/reset`.
4. **Core: SELECT (deterministic)** — read a requirement + AC + traceability id from
   `requirements/unified-requirements.md`. No app names.
5. **Core: GENERATE (agent)** — from AC, emit API test(s) incl. negative/auth cases,
   each tagged with its requirement id.
6. **Core: RUN (deterministic)** — N runs (default 3) with `seed()/reset()` before each;
   apply the decision rule (all-pass / all-fail / mixed→quarantine).
7. **Core: TRIAGE (agent)** — classify failures (real defect / bad-flaky test / env);
   write defect reports; regenerate bad tests, max 2 retries.
8. **Core: REPORT (deterministic)** — scorecard: requirements covered, pass/fail, defects,
   catch rate, false-positive rate, quarantine list.
9. **Eval harness** — build the seeded-defect catalog (≥3 defects) + scoring harness that
   runs clean baseline, then per defect: apply → re-run → record flip → revert.
10. **Acceptance gate** — build `verify.sh` (see Definition of Done) that runs everything
    and exits 0 only when all checks pass.
11. **Run end-to-end** on the clean app; iterate until the gate is green.
12. **Run the seeded-defect eval**; record catch rate + false-positive rate.
13. **Document** — write the stage-6 section of `VERIFICATION.md`; update
    `agentic-qe-sandbox/README.md`.
14. **Finalize** — run `./verify.sh`, paste its output, confirm exit 0.

## Definition of Done & autonomous execution
**You are DONE only when `./verify.sh` exits 0 and you have pasted its final output.**
Work autonomously: after each change, run the gate; if it fails, read the output, fix the
root cause, and re-run. Do NOT pause for confirmation between steps. Do NOT declare success
on judgment alone — only the green gate counts.

`verify.sh` must run and assert ALL of the following, exiting non-zero on the first failure:
- `npm run check:boundaries` exits 0 (core/workflow free of app/framework identifiers and
  of any `adapters/` import).
- The workflow's own unit tests pass.
- The stage-5 container boots and the app is reachable (smoke check).
- **Clean run:** the generated suite runs with N-run + reset; false-positive rate (failures
  on the clean app, excluding quarantined) must be **≤ the configured threshold, which
  defaults to 0**. Keep the threshold in one committed config value (e.g.
  `MAX_FALSE_POSITIVE_RATE=0`); raising it above 0 must be a deliberate, visible config
  change, never a silent allowance.
- **Seeded defects:** for EACH catalog defect, the targeting test is green clean, flips red
  with the defect applied, and is green again after revert. Gate fails if any defect is
  missed. Prints the catch rate.
- **Traceability:** every generated test references a valid requirement id (no orphans).
- **Flake decision rule:** prints the N-run outcomes and the quarantine list; quarantined
  tests are excluded from scoring.

**Guardrails (do not violate):**
- Do NOT edit, weaken, or delete `verify.sh`, `tools/check-boundaries.*`, or the
  seeded-defect catalog to make the gate pass. The gate must stay honest — a gamed gate
  produces a fake catch rate, which defeats the entire purpose.
- Cap iterations at ~10. If the gate still fails, STOP and report exactly which check fails
  and what you tried — do not loop indefinitely or fabricate a pass.
- Surface blockers explicitly rather than working around them silently.

(To run truly unattended, this can be driven headless: re-invoke `claude -p` while
`./verify.sh` is non-zero, feeding the failing output back each round, until it exits 0 or
the iteration cap is hit.)
