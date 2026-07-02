# Claude Code prompt — Step 2: ground requirements in the app's real contract

> Paste below the line into Claude Code from `agentic-qe-sandbox/`. This is a **build + verify** task.
> It implements the two deterministic fixes the Step-1 diagnostic proved (see
> `docs/design/requirements-first-principles.md` §8.1): (1) gate phantom endpoints, (2) stop
> over-claiming unenforced field constraints. Both are adapter-local, no LLM, no graph. Keep the
> app-agnostic boundary green. Return raw before/after numbers; do not over-claim.

---

You are reducing the agentic-QE false-positive rate by fixing **requirement fidelity**, not the agent.
The Step-1 diagnostic showed the dominant false positives come from requirements that assert things the
running app doesn't do: **phantom endpoints** (404) and **unenforced field constraints**. Implement two
deterministic fixes and measure the effect.

## Hard rules
- Stay app-agnostic: `core/` and `workflow/` must not import an adapter or name an app — keep
  `npm run check:boundaries` green. All new logic is adapter-local.
- Do not edit `verify.sh`, the seeded-defect catalog, or the prompts.
- Both fixes go behind a single flag `AQE_GROUNDING=1` (default off) so baseline stays byte-identical
  and the acceptance gate is unaffected.
- Do not analyze/tune to a target. Build, test, run, report raw numbers.

## Fix 1 — Endpoint grounding gate

**Problem:** requirements like `GET /bankTransfer` (real route is `/bankTransfers`) and
`POST /notifications` (that prefix serves only GET/PATCH) hit 404 and are triaged as defects.

**Implement:**
- `adapters/cypress-rwa/grounding.js`, exporting `partitionByGrounding(requirements, { appRoot })`.
  Build the real route set from `buildAutoApiHintsBySpecId({ appRoot })` (its keys are the app's real
  `"METHOD /path"` routes). A requirement is **grounded** if at least one of its `apiHints`
  endpoints (`` `${h.method} ${h.path}` ``) is in that set (curated requirements are grounded by
  definition). Return `{ grounded, ungrounded }`, and for each ungrounded one attach the nearest real
  route (simple path/edit-distance match) for the clarification message.
- Wire it in `workflow-adapter.js` `loadRequirements`: when `AQE_GROUNDING` is set, exclude ungrounded
  requirements from what `requirementsSource()` returns and write one `reports/.../clarifications/<id>.md`
  each ("endpoint `METHOD /path` not found in application route table; nearest real route: `…`").
  Flag off → return everything, unchanged.

## Fix 2 — Enforcement-aware constraint extraction

**Problem:** `POST /users` applies `userFieldsValidator` as **raw middleware** (not wrapped in
`validateMiddleware`), so its `.exists()` rules are declared but never enforced — yet
`extract-api-hints.js` harvests field rules from **every** `*Validator` in the route block, so it
reports `firstName (must exist)`. The agent's negative tests then "fail" because the app returns 201.

**Implement (behind the same `AQE_GROUNDING` flag to keep it A/B-clean):**
- In `extract-api-hints.js parseRouteFile`, change validator collection so a validator's fields are
  attributed to the route **only if that validator identifier appears inside a `validateMiddleware(...)`
  call** in the route block. Validators applied as bare middleware (e.g. `userFieldsValidator` directly)
  are ignored. (Today `VALIDATOR_IDENT_RE` scans the whole block indiscriminately — scope it to the
  `validateMiddleware(` argument list instead.)
- Update `extract-api-hints.test.js` accordingly.

## Verify (offline first, then the A/B)

1. Hermetic unit tests — add and run:
   - grounding: `partitionByGrounding` puts `CYPRESS-RWA-BANK-TRANSFER-001` and
     `CYPRESS-RWA-NOTIFICATIONS-002` in `ungrounded`, and a normal one (e.g. `…BANK-ACCOUNTS-001`) in
     `grounded`. (Enumerate the full ungrounded set and print it.)
   - enforcement: for `POST /users`, the extracted fields no longer include `firstName` as
     `must exist` (userFieldsValidator is raw/unenforced); enforced validators still contribute.
   - `npm test && npm run check:boundaries` stay green.
2. A/B on the affected requirements. Baseline is already on disk at `reports/ab/baseline/run*`
   (extract per-req results for the ids below). Run the grounded arm:
   ```bash
   set -a; source .env; set +a
   for k in 1 2 3; do
     AQE_GROUNDING=1 GENERATED_TESTS_DIR="generated-tests-grounded-$k" \
       node run-workflow.js --all --out "reports/grounded/run$k"
   done
   ```
   (Full `--all`, because Fix 1 changes the requirement *set* — phantom ones drop out — so a
   suite-level number is the honest measure here.)

## Deliverable

Write `reports/grounded/RESULTS.md` with only: (1) the list of requirements Fix 1 gated as ungrounded;
(2) confirmation Fix 2 dropped `firstName`-required (and any other unenforced fields) from the affected
routes; (3) a raw table — baseline vs grounded, per run: requirements covered/total, generated,
defects (FP), quarantined, FP rate, generate-phase tokens; (4) any errored sweeps. Then stop — no
interpretation. Reply in chat with the table and confirm `check:boundaries` and `npm test` are green.
