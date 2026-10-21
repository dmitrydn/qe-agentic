# graph-L1 experiment arm (cypress-rwa)

Deterministic, no-LLM augmentation of `apiHints` with call-graph-derived **side-effect notes**.
Tests whether telling Generate *what each handler mutates* lowers false positives / raises coverage
vs the baseline regex hints. See `docs/design/graphify-decision-memo.md` for the rationale and the
go/no-go criteria.

## What it does

For each endpoint, it walks the code knowledge graph (route module → imported DB function → intra-file
`calls` closure) and, **only when it can prove a persisted write** (the closure reaches a `save*`
sink), appends a sentence to that endpoint's `apiHints.notes`. The payment path, for example, gets:

> _Side-effects (call-graph): this handler mutates persisted state via createTransaction,
> debitPayAppBalance, creditPayAppBalance, … It changes user pay-app balance (debit/credit) — capture
> the relevant balances before and after and assert the deltas, not just the response body._

Precision over recall: it stays silent (no note) rather than guess. It does **not** assert
"read-only", because the deterministic call-graph misses inline lowdb writes (`.write()`, lodash
`flow`) — so simple CRUD writes (update-user, delete-contact) are out of reach here. That gap is the
argument for the LLM-inferred **Layer 2**. On this backend the arm augments **5 endpoints / 8
requirements** (the rich named-function flows, incl. both balance endpoints).

## Build the graph (once)

```bash
pip install --break-system-packages graphifyy        # one-time
graphify update sandbox-eval/cypress-realworld-app/backend --no-cluster
# writes sandbox-eval/cypress-realworld-app/backend/graphify-out/graph.json
```

No API key, no running app. Re-run after backend source changes (or use `graphify watch`).

## Run the A/B

```bash
set -a; source .env; set +a

# baseline arm
node run-workflow.js --all

# graph-L1 arm (only change is this flag)
AQE_API_HINTS_MODE=graph-l1 node run-workflow.js --all
```

Run each arm ≥3× (OpenRouter is not bit-deterministic) and compare the scorecards on FP rate,
coverage, % quarantined, and generate-phase tokens. With the flag unset, hints are byte-identical to
baseline — the acceptance gate is unaffected.

## Verify offline (no key / no Docker)

```bash
node --test adapters/cypress-rwa/graph-api-hints.test.js   # hermetic: real source + committed graph fixture
npm test                                                   # full suite + boundary check stay green
```

## Files

- `graph-api-hints.js` — the translator (deterministic, adapter-local).
- `graph-api-hints.test.js` — hermetic tests (POST writes flagged, GET/CRUD never mislabelled).
- `__fixtures__/cypress-backend-graph.json` — committed graph for the test.
- `workflow-adapter.js` — reads `AQE_API_HINTS_MODE`; default off.
