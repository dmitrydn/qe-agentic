# Claude Code prompt — run the graph-L1 A/B and return raw results

> Paste everything below the line into Claude Code, from the repo root
> (`agentic-qe-sandbox/`). This is an **execution / measurement** task — the
> implementation already exists. Do not design, refactor, or interpret. Run the
> experiment and hand back raw numbers and file paths. A separate analysis pass
> (not yours) will judge pass/fail against the decision memo's §7 criteria.

---

You are running a controlled A/B measurement in the agentic-QE sandbox. The only
independent variable is the source of `apiHints`: **baseline** vs **graph-L1**
(env flag `AQE_API_HINTS_MODE=graph-l1`, already wired in
`adapters/cypress-rwa/workflow-adapter.js`, default off). Everything else is held
identical.

## Hard rules

- **Do not edit** anything under `core/`, `workflow/`, `verify.sh`,
  `tools/check-boundaries.*`, the seeded-defect catalog, or the prompts. The only
  knob you touch is the `AQE_API_HINTS_MODE` env var and `--out` / `GENERATED_TESTS_DIR`.
- **Do not analyze.** No deltas, averages-as-conclusions, pass/fail calls, or
  recommendations. Collect raw per-run numbers and paths. Stop at the results table.
- **Do not retry-to-green.** If a sweep errors, record that it errored (with the
  message) and move on. Honest partial results beat doctored complete ones.
- Keep the model and temperature at the repo defaults (`.env` `LLM_MODEL`,
  temp 0). Do not switch models.

## Preconditions (verify, then proceed)

1. `.env` exists with a working `OPENROUTER_API_KEY` (and the usual `LLM_MODEL`).
   Load it: `set -a; source .env; set +a`.
2. A container runtime is up (Colima or Docker Desktop) and the cypress-rwa image
   is built. If unsure, follow `docs/guide/operations-guide.md` for the runtime/
   container steps. `node run-workflow.js` boots, seeds, and tears down the app
   itself per run — you do not hand-manage the server.
3. The deterministic code graph exists. If
   `sandbox-eval/cypress-realworld-app/backend/graphify-out/graph.json` is missing,
   build it once (no API key, no running app needed):
   ```bash
   pip install --break-system-packages graphifyy   # if graphify not installed
   graphify update sandbox-eval/cypress-realworld-app/backend --no-cluster
   ```
4. Sanity-check the offline pieces are green before spending any tokens:
   ```bash
   npm test && npm run check:boundaries
   node --test adapters/cypress-rwa/graph-api-hints.test.js
   ```

## Cost warning

The primary matrix is **6 full 44-requirement sweeps** (3 baseline + 3 graph-L1),
each making many real OpenRouter calls. This costs real money and time. Confirm
the budget is acceptable before starting, then run it.

## Run matrix

Two clarifications so you don't conflate them:
- **`config.runN`** (default 3) = how many times each *individual test* is re-run
  for flake-guard. Leave it at the default. Do **not** change it.
- **Experiment repetitions** = run the *whole sweep* 3× per arm, because OpenRouter
  is not bit-deterministic at temp 0. These are the `run1/2/3` below.

```bash
set -a; source .env; set +a

# Primary signal — uncurated, all 44 requirements
for k in 1 2 3; do
  GENERATED_TESTS_DIR="generated-tests-ab-base-$k" \
    node run-workflow.js --all --out "reports/ab/baseline/run$k"
done
for k in 1 2 3; do
  AQE_API_HINTS_MODE=graph-l1 GENERATED_TESTS_DIR="generated-tests-ab-l1-$k" \
    node run-workflow.js --all --out "reports/ab/graph-l1/run$k"
done

# Regression guard — curated 4-requirement slice (the GATE_REQUIREMENTS in
# verify.sh). graph-L1 does NOT augment curated hints, so this should be
# unchanged; one run per arm is enough to confirm no accidental drift.
# (The 4 ids below are verify.sh's GATE_REQUIREMENTS.)
GENERATED_TESTS_DIR="generated-tests-ab-base-curated" \
  node run-workflow.js --requirement CYPRESS-RWA-TRANSACTIONS-007 CYPRESS-RWA-USERS-001 CYPRESS-RWA-TRANSACTIONS-001 CYPRESS-RWA-BANK-ACCOUNTS-001 --out "reports/ab/baseline/curated"
AQE_API_HINTS_MODE=graph-l1 GENERATED_TESTS_DIR="generated-tests-ab-l1-curated" \
  node run-workflow.js --requirement CYPRESS-RWA-TRANSACTIONS-007 CYPRESS-RWA-USERS-001 CYPRESS-RWA-TRANSACTIONS-001 CYPRESS-RWA-BANK-ACCOUNTS-001 --out "reports/ab/graph-l1/curated"
```

## What to extract (per run, from each `<out>/scorecard.json`)

Read these exact fields — do not recompute them:

| Field in scorecard.json | Report as |
|---|---|
| `model`, `n` | run metadata |
| `requirements.covered` / `requirements.total` | coverage |
| `falsePositiveRate` | FP rate |
| `tests.quarantinedFlaky` / `tests.generated` | quarantine + generated |
| `tests.passed`, `tests.failed`, `tests.errored` | test outcomes |
| `traceability.orphanTestIds` (length) | orphans (expect 0) |
| `cost.byPhase.generate.promptTokens` + `.completionTokens` | generate-phase tokens |
| `cost.totalUsd` | run cost |

## Deliverable

Write `reports/ab/RESULTS.md` containing **only**:

1. A metadata line: date, model string, `config.runN`, and whether the graph
   existed or was rebuilt.
2. One raw table, one row per run (arm, run#, every metric above). Curated rows
   included and labelled.
3. A short list of the absolute paths to every `scorecard.json` and the
   `reports/ab/<arm>/run*/defects/` + `clarifications/` directories produced.
4. A "failures / anomalies" subsection: any sweep that errored, any non-zero
   `errored` count, any orphan > 0, with the raw message — no interpretation.

Then stop. Do not summarize trends or judge the result. Reply in chat with the
contents of `reports/ab/RESULTS.md` and confirm the scorecard paths exist.
