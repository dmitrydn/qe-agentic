# Task: Stage 6 hardening — close the breadth & robustness gaps before the Stage 7 demo

## Context
Stage 6 is built and its gate is green, BUT the headline numbers (0% false-positive, 100%
catch) are over a deliberately narrow slice: **4 of 44 requirements, the only ones with
hand-curated field-level `apiHints` (`CURATED_API_HINTS` in
`adapters/cypress-rwa/workflow-adapter.js`), and 3 seeded defects all in the payments
domain — two of them caught by the same single test.** So the end-to-end loop and the honest
gate are proven, but breadth (coverage across domains) and the robustness of the agent steps
are not. This stage closes those gaps so the catch-rate number is credible to leadership.
Read `agentic-qe-sandbox/VERIFICATION.md` (Stage 6 section), `stage6-core-spec.md`, and
`stage6-build-prompt.md` first.

## Repo facts to build on (verified against the code)
- Core lives in two app-agnostic dirs, both guarded by `tools/check-boundaries.js`:
  `core/**` (stage-5 normalizer) and `workflow/**` (stage-6 agentic loop, incl. `prompts/**`).
- `TestCase` is framework-neutral JSON; `adapters/cypress-rwa/test-runner.js` executes it via
  plain `fetch`.
- The **defect catalog is `DEFECT_CATALOG` in `adapters/cypress-rwa/fault-injector.js`**
  (single source of truth, re-exported by `eval/defects.js`). Edit it THERE.
- Config env: `RUN_N` (default 3), `MAX_FALSE_POSITIVE_RATE`, `MAX_REGEN_RETRIES`,
  `LLM_MODEL`, `LLM_TEMPERATURE`, `LLM_JSON_REPAIR_RETRIES`, `REQUEST_TIMEOUT_MS`.
- Scripts: `npm run workflow -- ...`, `npm run check:boundaries`, `npm run eval`,
  `npm test` (= check:boundaries + `node --test`). Gate: `./verify.sh`.

## Non-negotiable constraints (carry forward — do not regress)
- **App-agnostic core:** `check-boundaries` must stay green over `core/**` and `workflow/**`
  incl. `prompts/**`. All app specifics stay in the adapter/data.
- **Honest metric:** generate-once against the clean app, replay the persisted suite under
  defects; Generate never sees a defect. Do NOT game the gate, weaken thresholds, or edit
  the defect catalog to inflate a number.
- **Structured `TestCase` data**, N-run (default 3) + `reset()` before every run, decision
  rule unchanged.

## Workstreams (do all four)

### A. Auto-extract field-level `apiHints` (remove the curation dependency)
The 0% false-positive rate currently depends on `CURATED_API_HINTS`. Make the per-app
**adapter extractor** (`adapters/cypress-rwa/extract-requirements.js`) derive field-level
hints (HTTP method, path, request-body field names, auth actor) automatically from the app's
real contract (its API specs / backend validators / TS models), feeding them into the
normalized requirements. Adapter-side — core and prompts stay app-agnostic.
- Acceptance: Generate produces tests for requirements **without any curated hints** at a
  false-positive rate ≤ `MAX_FALSE_POSITIVE_RATE`. Shrink `CURATED_API_HINTS` toward empty;
  report how many requirements now work purely from auto-extracted hints.
- Do NOT just hand-add more curated hints — that defeats the purpose. If a requirement
  genuinely lacks extractable field info, report it as a coverage limit, don't paper over it.

### B. Expand & spread the seeded-defect catalog
Grow `DEFECT_CATALOG` (in `adapters/cypress-rwa/fault-injector.js`) from 3 to **≥12 defects
spanning every domain that has generated tests** (bank-accounts, users, transactions-001,
transactions-007, and any added), so **every generated test's fault-detection power is
exercised by ≥1 targeting defect** (today 6 of 8 tests are unmeasured as detectors). Include:
- a range of severities, including **subtle** defects (off-by-one, wrong rounding, missing
  response field) not just blatant ones;
- at least **2 negative-control defects** that current tests legitimately should NOT catch —
  expected-uncaught, to make the catch rate informative rather than a foregone 100%.
- Report catch rate over the full catalog AND list any tests still unmeasured.

### C. Run the full uncurated set once (honest breadth signal)
Run `npm run workflow -- --all` (all 44 cypress-rwa requirements) end-to-end through the live
model and **report the real, uncurated false-positive rate and coverage** — even if it's
poor. Do not curate it to 0; the true number is the signal. Capture it in VERIFICATION.

### D. Stress-test triage
Triage was only validated on 3 clear defects + 1 real false positive. Build a small battery
of labelled failures (real_defect / flaky_or_bad_test / environment / bad-test) — mix real
and synthetic — and **measure triage classification accuracy** (a confusion matrix). Report
accuracy and the misclassifications.

## Definition of Done (extend `verify.sh`, keep it honest)
The existing curated-slice gate stays as the hard pass. ADD, as recorded gate output:
- uncurated `--all` false-positive rate + coverage (reported; committed threshold optional);
- expanded-catalog catch rate with a **committed** minimum threshold (set it deliberately,
  e.g. `MIN_CATCH_RATE`), plus the unmeasured-tests list;
- triage accuracy from the battery, with a committed minimum.
Same rules as before: do not edit/weaken `verify.sh`, `check-boundaries`, or the catalog to
pass; cap iterations ~10; stop and report blockers rather than faking a pass. Record
everything in a **Stage 6b** section of `agentic-qe-sandbox/VERIFICATION.md`, including what
was NOT verified.

## Suggested order
1. Auto-extract `apiHints` (A) — unblocks breadth.
2. Expand catalog (B).
3. Triage battery (D).
4. Full `--all` run (C) and capture numbers.
5. Extend `verify.sh`, document, finalize (run gate, paste output, exit 0).
