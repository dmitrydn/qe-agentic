# Agentic QE Sandbox

An app‑agnostic agentic Quality‑Engineering loop: an LLM agent turns requirements
into API tests; deterministic code runs them, triages failures, and scores the
result. Everything app‑specific lives behind a per‑app adapter (today: the Cypress
RealWorld App). Guarantees live in software, not in prompts.

The loop, per requirement: **Select → Generate (agent) → Run ×N (engine) → Triage
(agent) → Report (engine)**.

## Documentation

- **[User guide](../docs/guide/user-guide.md)** — setup + every flow with commands.
- **[Operations guide](../docs/guide/operations-guide.md)** — requirements, cost, CI, troubleshooting.
- **[Configuration reference](../docs/guide/configuration.md)** — every variable and flag.
- Design specs: [`docs/design/`](../docs/design). Verification record: [`VERIFICATION.md`](VERIFICATION.md). Project narrative: [`../PROGRESS.md`](../PROGRESS.md).

## Prerequisites

- **Node.js ≥ 18.18** (global `fetch`). The core is dependency‑free ESM — no `npm install`.
- **A container runtime** (Colima or Docker Desktop) — only for flows that boot the app under test.
- **An OpenRouter API key** — only for flows that call the model.

## Quick start

```bash
cd agentic-qe-sandbox
echo "OPENROUTER_API_KEY=sk-or-..." > .env     # git-ignored

npm test                                        # boundary check + unit tests (free, offline)
./verify.sh                                     # full acceptance gate (Docker + LLM)
set -a; source .env; set +a                     # load key for the entry points below
node run-workflow.js --all                      # generate + run + triage + score the suite
```

See the [User guide](../docs/guide/user-guide.md) for the rest (requirement sync,
testability gate, release validation, eval batteries).

## Layout

```
workflow/        app-agnostic core: select · generate · run-harness · triage · report
                 + config, prompts, schemas, the LlmClient, cost + testability logic
adapters/        per-app adapters (cypress-rwa live; conduit requirements-only)
ops/             operate the suite: sync-requirements · validate-release · assess-requirements
eval/            grade the suite: run-eval · triage-battery · testability-battery
requirements/    build.js (adapters -> core) + generated unified-requirements.md
tools/           check-boundaries.js (the import-boundary rule)
docker/          Dockerfile + run.sh for the Cypress RWA runtime
run-workflow.js  the one place a concrete adapter is named (wires adapter + LLM into workflow/)
verify.sh        the acceptance gate
generated-tests/ the durable, persisted test suite
reports/         scorecards, defect/clarification reports, eval/release/testability output
```

## Design principles (enforced, not aspirational)

- **App‑agnostic core.** `workflow/` and `core/` may not import an adapter or name an app/framework; `npm run check:boundaries` fails CI if they do.
- **Hybrid.** The agent (LLM) does judgement — generate, triage, assess. The engine (deterministic code) does select, run, score, report, and every gating *decision*.
- **Measured, not asserted.** Quality is established by seeded‑defect catch rate, a triage battery, and a testability battery — see [`VERIFICATION.md`](VERIFICATION.md).
