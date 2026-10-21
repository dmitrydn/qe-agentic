# User guide

How to install the framework and run each flow. For what every knob does see the
[Configuration reference](configuration.md); for operational depth (cost, CI,
troubleshooting) see the [Operations guide](operations-guide.md).

## What this is

An agentic Quality‑Engineering loop: an LLM agent turns requirements into API
tests; deterministic code runs them, triages failures, and scores the result.
The core is app‑agnostic; everything app‑specific lives behind a per‑app adapter
(today: the Cypress RealWorld App).

The loop, per requirement: **Select → Generate (agent) → Run ×N (engine) →
Triage (agent) → Report (engine)**.

## Prerequisites

- **Node.js** ≥ 18.18 (global `fetch`). No `npm install` needed for the core; `node --test` runs the unit tests.
- **A container runtime** (Colima or Docker Desktop) — required only for flows that boot the app under test.
- **An OpenRouter account + key** — required only for flows that call the model.

## Setup

```bash
cd agentic-qe-sandbox
echo "OPENROUTER_API_KEY=sk-or-..." > .env        # never committed
```

Most entry points do **not** auto‑load `.env`. Load it into your shell before running them:

```bash
set -a; source .env; set +a
```

(`./verify.sh` sources `.env` itself, so the gate is the exception.)

## Verify the install (free, offline)

```bash
npm test            # import-boundary check + unit tests — no Docker, no LLM
```

## The flows

> Cost figures are rough, at the default Sonnet rates; the exact number is printed
> after every LLM run and recorded in the relevant report.

### 1. Generate a test suite

Builds tests for the requirements and runs them against the live app.

```bash
node run-workflow.js --all                 # all requirements
node run-workflow.js --requirement CYPRESS-RWA-USERS-001    # one
```

Needs Docker + LLM. Writes the suite to `generated-tests/` and the scorecard,
defect reports, and `report.md` to `reports/`. Full breadth (`--all`) is ~$1–3.

### 2. Keep the suite in step with requirements

```bash
node ops/sync-requirements.js --init-manifest   # once: record a baseline (free)
node ops/sync-requirements.js --dry-run         # preview what changed (free)
node ops/sync-requirements.js --apply           # regenerate only the delta (spends)
```

No Docker. `--apply` regenerates added/changed/missing requirements and prunes
stale tests; cost is proportional to the delta. See the
[SDLC flows design](../design/sdlc-flows.md).

### 3. Gate input quality (testability)

```bash
node ops/assess-requirements.js --all     # score every requirement (~$0.5 for 44)
```

No Docker. Writes `reports/testability-report.md` (with a `D1–D6` column),
appends a row to `reports/testability/history.md`, and writes a clarification
file per non‑testable requirement to `reports/clarifications/`. To make the gate
actually block generation, set `TESTABILITY_GATE=on` (see below). See the
[Testability gate design](../design/testability-gate.md).

### 4. Validate a release

Replays the existing suite against the current build and reports regressions.

```bash
node ops/validate-release.js              # exits non-zero if any regression
```

Needs Docker. Near‑zero LLM cost (a triage call only on a failing test). Writes
`reports/release-report.md`.

### 5. Measure quality (eval / batteries)

```bash
node eval/run-eval.js                     # seeded-defect catch rate (Docker, free)
node eval/run-triage-battery.js           # triage accuracy (Docker + LLM)
node eval/run-testability-battery.js      # testability accuracy (LLM, no Docker)
```

### 6. The acceptance gate

```bash
./verify.sh        # boundary + unit tests + container smoke + curated run + evals
```

Needs Docker + LLM. Runs in its own scratch suite dir (`generated-tests-gate`),
so it never touches your durable `generated-tests/`. Exits non‑zero on any gate
failure.

## Turning the testability gate on

By default the gate only *measures*. To make `run-workflow` skip generation for
weak requirements and return clarifying questions instead:

```bash
TESTABILITY_GATE=on node run-workflow.js --all
```

Leave it off while requirements are still being cleaned up; turn it on when you
want to enforce input quality. See the [Configuration reference](configuration.md).

## Where things land

| Path | What |
|---|---|
| `generated-tests/` | the durable, persisted test suite |
| `reports/` | scorecard, `report.md`, `defects/`, `clarifications/`, eval/release reports |
| `reports/testability/` | timestamped testability runs + `history.md` |
| `state/suite-manifest.json` | requirement‑sync baseline (committed) |
| `reports-all/` | committed snapshot of the full `--all` run |
