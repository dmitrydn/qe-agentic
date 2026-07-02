# Verification

What was checked, exactly how, and what's left unverified. All commands
below were actually run on this build machine (macOS, Apple Silicon, no
preinstalled container runtime) during construction of this sandbox.

## Environment note

No Docker/Colima/Podman was preinstalled. Installed for this work:
`brew install colima docker` then `colima start --cpu 4 --memory 6 --disk
30`. This is a one-time environment cost, not specific to this sandbox —
documented here because it's the kind of recurring-setup-cost surprise this
whole project is trying to eliminate for the actual app runtime.

## 1. Reproducibility (Phase 1)

**Claim:** build + boot the container from a clean checkout; the two oracle
commands pass inside it.

**What was actually done:**
1. First build (with Docker's normal layer cache):
   `./agentic-qe-sandbox/docker/run.sh build` — succeeded, ~8.5 min
   (dominated by `yarn install`, ~149s, and apt package install for
   Cypress's Linux deps).
2. `./agentic-qe-sandbox/docker/run.sh verify` — **44 unit tests passed**
   (vitest, `yarn test:unit:ci`) and **13/13 Cypress API tests passed**
   (`cypress run --spec cypress/tests/api/api-users.spec.ts`), inside the
   container, against the freshly-booted, auto-seeded app.
3. To rule out "it only worked because of stale local `node_modules` leaking
   into the image," re-ran with `docker build --no-cache -f
   agentic-qe-sandbox/docker/Dockerfile -t agentic-qe/cypress-rwa:clean-check
   .` from the repo root — full rebuild, no cache, no host `node_modules`
   (excluded via root `.dockerignore`). Re-ran `verify`'s two commands
   against that image: **same result, 44 unit + 13/13 Cypress, passing.**
4. Confirmed clean teardown: after running the adapter's full
   run->seed->auth->teardown lifecycle (see Phase 2 below), `docker ps -a
   --filter name=agentic-qe-cypress-rwa` showed no leftover container.

**Holds.** The `--no-cache` rebuild is the strongest form of "clean
checkout" achievable without re-cloning the app repo itself (which was
already cloned into `sandbox-eval/cypress-realworld-app` in an earlier
phase of this project — see `../PROGRESS.md`); the Docker build does not
read from or depend on that clone's installed `node_modules` (excluded via
`.dockerignore`), only its source files.

## 2. App-agnosticism (Phase 2)

**Claim:** wiring app #2's requirements required only adapter/config, zero
core changes — state plainly if this held or broke.

**Holds**, verified mechanically, not just asserted:

1. Wrote `core/adapter/types.js`, `core/normalizer/normalize.js`,
   `core/normalizer/render-markdown.js`, `core/workflow.js` — the entire
   core. None of these files import or reference "openapi", "hurl", "ts
   model", "cypress", "vite", or any app name.
2. Built **Source A** first (`adapters/conduit/{adapter,extract-requirements,config}.*`,
   realworld-spec parser) and ran `buildUnifiedRequirements([conduitAdapter])`
   standalone — produced 147 unified requirements with zero core edits.
3. Snapshotted SHA-256 checksums of every file under `core/` at that point.
4. Built **Source B** (`adapters/cypress-rwa/{adapter,extract-requirements,config}.*`)
   and re-ran the combined build (`requirements/build.js`, both adapters).
5. Re-checksummed every file under `core/` — **identical to the Source-A-only
   snapshot.** (`diff` of the two checksum files: no output, i.e. no
   differences.)

So the claim isn't just "I didn't happen to touch core" — it's "the core
files are byte-for-byte identical before and after adding the second
requirements format."

## 3. Traceability spot-checks

**Claim:** spot-check that >=2 emitted acceptance criteria match real
app/spec behavior.

**Two static spot-checks** (traceability pointer -> real file content):
- `CYPRESS-RWA-USERS-001` ("gets a list of users") points to
  `cypress/tests/api/api-users.spec.ts:31`. Actual line 31:
  `it("gets a list of users", function () {` — exact match.
- `CONDUIT-FEED-001` ("Register main user") points to
  `specs/api/hurl/feed.hurl:1`. Actual line 1: `# Register main user` —
  exact match.

**One live, dynamic spot-check** (ran the actual request against the
booted, seeded container, via the adapter):
```
GET /users (authenticated as a seeded user via cypressRwaAdapter.auth())
-> status 200   (CYPRESS-RWA-USERS-001 expects: response status 200)
-> results.length = 4   (the underlying Cypress test asserts length > 1)
```
Both match. (A first attempt without authentication correctly got `401`,
which incidentally confirms the auth-gating behavior the requirement
implies, rather than being a failure of the check.)

## 4. What was NOT verified

- **Conduit runtime** was never built, booted, seeded, or authenticated
  against — by design (Phase 3, deferred). Its `requirementsSource()` *was*
  exercised (147 extracted items came from real file parsing), but
  `run()`/`seed()`/`auth()`/`teardown()` are unverified beyond "they throw
  `NotImplementedError` as designed," which was checked.
- **Cypress E2E/Playwright UI-level tests** (as opposed to API tests) were
  not run inside the container — only `cypress/tests/api/api-users.spec.ts`
  per the acceptance bar. The other seven `cypress/tests/api/*.spec.ts`
  files were used as *requirements source* (extracted, in
  `unified-requirements.md`) but not executed as an oracle.
- **realworld-spec's Playwright e2e specs, OpenAPI contract file, and
  SELECTORS.md** were not parsed by the extractor — only `specs/api/hurl/*`
  was, since Hurl's request/status/jsonpath-assert structure maps onto
  Given/When/Then most directly and was sufficient to clear the
  >=3-features-per-app bar (13 features, 147 items). The other three
  artifact kinds remain available under `sandbox-eval/realworld-spec/` for
  a future extension of the same extractor — adding them should be a change
  inside `adapters/conduit/extract-requirements.js` only, per the same
  app-agnosticism guarantee checked above.
- **Multi-platform image builds** (`linux/amd64` vs. `linux/arm64`) were
  not tested — the image was only built and verified for the host's native
  `linux/arm64` (Cypress 15.x ships Linux ARM64 Electron binaries, which is
  why this worked without QEMU emulation; this would need re-verification
  if targeting an amd64-only CI runner).

## 5. One-time vs. recurring costs (for a future user of this sandbox)

**One-time:**
- Installing a container runtime (Colima/Docker Desktop) if not already
  present (~1 min install + VM start).
- First `docker build` of the Cypress RWA image: ~8.5 min, dominated by
  `apt-get install` (Cypress's Linux deps) and `yarn install` (~150s).
- Cloning `sandbox-eval/{cypress-realworld-app,conduit-realworld,realworld-spec}`
  (already done; see `../PROGRESS.md`).

**Recurring (per run), and how this sandbox amortizes them:**
- App boot + seed: a few seconds (`yarn dev`'s `predev` hook + the
  container's readiness wait in `entrypoint.sh`) — this used to also carry
  the ~20-minute Electron-heavy `yarn install` and Node-version-pin
  brittleness every time a fresh environment ran the app; now that's baked
  into the image and only re-paid when the Dockerfile or app source changes
  (Docker layer caching keeps subsequent builds fast unless `package.json`/
  `yarn.lock` change).
- Requirements extraction + normalization: sub-second, pure file I/O and
  regex (`node agentic-qe-sandbox/requirements/build.js` completes near-
  instantly for 191 items across 2 apps).
- Container teardown: near-instant (`docker rm -f`).

---

# Stage 6 — Agentic QE Workflow

Built on top of the stage-5 sandbox above. Adds `workflow/` (app-agnostic
GENERATE/RUN/TRIAGE/REPORT core), `adapters/cypress-rwa/{test-runner,
fault-injector,workflow-adapter}.js`, `eval/` (seeded-defect scoring), and
`tools/check-boundaries.js`. Full spec: `../stage6-build-prompt.md`,
`../stage6-core-spec.md`, `../stage6-agentic-qe-design.md`.

**Environment used for this run:** Colima (already running from stage 5),
the same `agentic-qe/cypress-rwa:latest` image, model
`anthropic/claude-sonnet-4.5` via OpenRouter, `OPENROUTER_API_KEY` supplied
interactively for this session and kept only in a local, gitignored `.env`
(never printed, never committed).

## 1. Import-boundary guardrail (`tools/check-boundaries.js`)

**Positive (current tree):**
```
$ npm run check:boundaries
check-boundaries: OK — core/ and workflow/ are free of adapter imports and denylisted identifiers.
```

**Negative test (required by the build prompt — "a guardrail that can't fail
proves nothing")):** temporarily appended
`import { cypressRwaAdapter } from "../adapters/cypress-rwa/adapter.js";` to
`core/workflow.js`, re-ran the check, then reverted:
```
$ node tools/check-boundaries.js
check-boundaries: FAILED — 2 violation(s):
  core/workflow.js:47  [no-adapter-import]  import { cypressRwaAdapter } from "../adapters/cypress-rwa/adapter.js"; // TEMP negative-test violation
  core/workflow.js:47  [no-app-identifier]  found denylisted term "cypress" in: import { cypressRwaAdapter } from "../adapters/cypress-rwa/adapter.js"; // TEMP negative-test violation
EXIT:1
```
Reverted; `check:boundaries` passes again (confirmed by re-running it). Both
the dependency-direction rule and the identifier-denylist rule fired
correctly, each with the exact `file:line`.

One legitimate, non-cheating change was required to get the *positive* case
green in the first place: stage-5's `core/adapter/types.js` and
`core/normalizer/normalize.js` had doc-comment examples naming real apps
("Cypress RWA", "Conduit", `jwt`, "OpenAPI") — accurate at the time, written
before this automated guardrail existed. These were genericized (e.g.
`"cookie"|"jwt"` → `"cookie"|"bearer-token"`) with no behavior change; this
is exactly the kind of legitimate core change the guardrail is designed to
allow through, as opposed to an app-specific *leak*.

## 2. Workflow unit tests

`node --test` (wired into `npm test` ahead of the unit tests, and into
`verify.sh` step 2): **47/47 passing** — covers `select`, `run-harness`
(decision rule + reset-before-every-run ordering), `report` (coverage,
false-positive rate, orphan detection, file output), `generate` (using a
mock `LlmClient`, including the placeholder-repair retry described below),
the LLM JSON-validation helper, the prompt renderer, the markdown
requirements parser, and the adapter's pure request-building helpers
(`getByJsonPath`, `resolveTemplate`, `buildPath`, `buildQueryString`).

## 3. Clean run (false-positive rate)

**Deliberate, visible scope** (documented in `verify.sh`, not hidden): the
gate's clean run and eval target 4 of the 44 `cypress-rwa` requirements —
`CYPRESS-RWA-TRANSACTIONS-007`, `CYPRESS-RWA-TRANSACTIONS-001`,
`CYPRESS-RWA-USERS-001`, `CYPRESS-RWA-BANK-ACCOUNTS-001` — the ones with
curated, field-level `apiHints` (see `CURATED_API_HINTS` in
`adapters/cypress-rwa/workflow-adapter.js`). The base extractor only carries
generic Given/When/Then text (e.g. "creates a new payment" / "status 200"),
with no request-body field names; without curated hints, Generate would
have to *invent* field names, which the system prompt explicitly forbids and
which would inflate false positives on ungrounded tests. `npm run workflow
-- --all` still exercises the full 44-requirement set on demand; the gate
itself stays bounded, fast, and deterministic by design. This mirrors the
existing `MAX_FALSE_POSITIVE_RATE` pattern: a committed, visible config
choice rather than a silent allowance.

Result of `node run-workflow.js --requirement ... --out reports` (3
consecutive full runs during development, after the fixes in §5 below; all
green):
```
"requirements": { "total": 4, "covered": 4 },
"tests": { "generated": 8, "passed": 8, "failed": 0, "quarantinedFlaky": 0 },
"falsePositiveRate": 0,
"traceability": { "orphanTestIds": [] }
```
**False-positive rate: 0%** (threshold `MAX_FALSE_POSITIVE_RATE=0`, met).

## 4. Seeded defects (catch rate)

`node eval/run-eval.js` replays the 8 persisted `generated-tests/*.json`
TestCases — no regeneration, Generate never sees a defect — against each
catalog defect (`apply()` → re-run → `revert()` → re-run again to confirm
green):

| Defect id | Caught | Catching test(s) | Reverted cleanly |
|---|---|---|---|
| `payment-amount-cents` | yes | `CYPRESS-RWA-TRANSACTIONS-007-positive-001` | yes |
| `auth-gate-post-transactions` | yes | `CYPRESS-RWA-TRANSACTIONS-007-auth-001` | yes |
| `receiver-balance-not-credited` | yes | `CYPRESS-RWA-TRANSACTIONS-007-positive-001` | yes |

**Catch rate: 100% (3/3).** Each defect: green on the clean app → flips to
`FAIL` (all 3 runs) with the defect applied → green again after revert —
confirmed by the harness, not just observed once: e.g. for
`payment-amount-cents`, the positive payment test asserts
`transaction.amount == 5000` (a $50 payment in cents); with
`backend/database.ts`'s `* 100` removed, the same assertion observes `50`
and fails identically across all 3 runs, then passes again once reverted.

## 5. Traceability spot-checks (>=2 required)

- `CYPRESS-RWA-TRANSACTIONS-007` → `cypress/tests/api/api-transactions.spec.ts:113`.
  Actual line 113: `it("creates a new payment", function () {` — exact match.
- `CYPRESS-RWA-USERS-001` → `cypress/tests/api/api-users.spec.ts:31`. Actual
  line 31: `it("gets a list of users", function () {` — exact match (same
  spot-check stage 5 already made; re-confirmed here since stage 6 re-derives
  the pointer through `workflow/requirements-md.js`'s independent markdown
  parser, not stage 5's normalizer object).
- Every one of the 8 generated `TestCase`s carries the exact `requirementId`
  it was generated for (enforced in `generate.js`, which throws on mismatch);
  `scorecard.json`'s `traceability.orphanTestIds` is `[]`.

## 6. Flakiness (N-run decision rule)

`RUN_N=3` (default), `adapter.reset()` called before every run (enforced by
`run-harness.js` and covered by a dedicated unit test asserting the exact
call order `reset, run, reset, run, ...`). In the live runs captured above,
every test decided `PASS` (`runs=[pass,pass,pass]`) — 0 quarantined, so the
**mixed → FLAKY → quarantine, excluded from scoring** branch was not
naturally observed against the live app (a *good* sign for test stability,
not a gap: it means the decision rule had nothing to quarantine). That
branch is verified by a direct unit test (`run-harness.test.js`: `mixed ->
FLAKY`) feeding a synthetic pass/fail/pass sequence into the same decision
function the live run uses — same code path, deterministic input. The
all-fail → `FAIL` → triage branch *was* exercised live (every seeded-defect
run produced `runs=[fail,fail,fail] -> FAIL` before triage/eval scoring).

## 7. A real LLM-reliability issue found and fixed during this build

Across development runs, the model (temperature 0, but OpenRouter does not
guarantee bit-for-bit determinism) twice emitted a non-conformant
placeholder for a captured value — once as `<name>`, once as `<<name>>` —
despite the system prompt explicitly specifying `{{name}}` with a worked
example. One such case made it past the schema validator (angle brackets are
valid JSON string content) and surfaced as a real-looking `500` from the
app's Dinero.js money library, which `triage()` then (reasonably, given only
that evidence) classified as `real_defect` — a genuine false positive in the
clean-run sense, caught by the `MAX_FALSE_POSITIVE_RATE=0` gate exactly as
designed.

Fix: `generate.js` now deterministically scans every generated `TestCase`
for any angle-bracket-style placeholder (`STRAY_PLACEHOLDER_RE`) — which can
never be legitimate API data in this app — and, if found, retries the same
LLM call (bounded, `MAX_PLACEHOLDER_REPAIR_RETRIES=2`) with the exact
violating locations appended to the prompt. This is a structural-grounding
check on the artifact's contract (the test runner's *only* placeholder
syntax is `{{name}}`), not a relaxation of scoring — it fires before a test
is ever run, and is covered by 5 unit tests in `generate.test.js`, including
one confirming it still throws (rather than silently passing) if the model
never recovers. Two more full gate runs after the fix were green and stable
across `MAX_FALSE_POSITIVE_RATE=0`.

## 8. Stage-5 container readiness, revisited for Stage 6's API-only scope

The container's frontend (Vite, port 3000) binds to loopback *inside* the
container — reachable from Cypress when it runs in-container (as stage 5's
`docker/run.sh verify` does), but not via Docker's host port mapping from
outside. Stage 5 never hit this because nothing in its verification curled
port 3000 from the host. Stage 6 is explicitly API-level-only scope (per
`stage6-build-prompt.md`), so `adapters/cypress-rwa/workflow-adapter.js`'s
`run()` overrides stage 5's `ready()` (which waits on both ports) with one
that only waits on the API (port 3001) — `docker/run.sh` and the container
image are unchanged. Documented here rather than worked around silently.

## 9. What was NOT verified

- **The full 44-requirement `cypress-rwa` set** was not run through the live
  LLM end-to-end (only the 4 curated requirements above) — see the scope
  rationale in §3. `npm run workflow -- --all` is wired and would attempt
  it, but Generate would need either richer auto-extracted `apiHints` or
  more curated entries to keep the false-positive rate at 0 across the full
  set; untested.
- **Conduit** is unchanged from stage 5 (still `NotImplementedError` runtime
  stubs) — Stage 6 only targets the one live runtime, per scope.
- **Long-run flake stability** (hundreds of repeated runs to surface a rare
  flake) was not attempted — only the 3-run-per-test decision rule specified
  by the design, exercised across 5 full gate runs during development.
- **Multi-platform / CI-runner execution** of `verify.sh` (e.g. on an
  amd64-only Linux CI box) was not attempted — built and run only on the
  same Apple Silicon / Colima host as stage 5; the same caveat stage 5
  recorded for the Docker image applies here too.
- **Triage's classification accuracy in the general case** (beyond the
  specific false positive in §7, which was caught and fixed) was not
  exhaustively tested against a battery of synthetic ambiguous failures —
  only validated against the 3 real seeded defects (correctly `real_defect`,
  high confidence each time) and the one real false positive encountered
  live.

## 10. Final gate output

```
$ ./verify.sh
=== 1/6 check:boundaries ===
check-boundaries: OK — core/ and workflow/ are free of adapter imports and denylisted identifiers.
=== 2/6 workflow unit tests ===
ℹ tests 47
ℹ pass 47
ℹ fail 0
=== 3/6 stage-5 container smoke check ===
app reachable (api:3001)
=== 4/6 clean run (generate -> N-run+reset -> triage -> report) ===
false-positive rate: 0 (threshold <= 0)
quarantined (flaky, excluded from scoring): 0
orphan test ids: []
=== 5/6 seeded-defect eval (catch rate) ===
[eval] catch rate: 100%
catch rate: 1 [{"id":"payment-amount-cents","caught":true,...},{"id":"auth-gate-post-transactions","caught":true,...},{"id":"receiver-balance-not-credited","caught":true,...}]
=== 6/6 done ===
All Stage 6 gate checks passed.
```
Exit code: `0`.

---

# Stage 6b — Hardening (breadth & robustness)

Closes the breadth/robustness gaps named in `stage6-hardening-prompt.md`: Stage
6's headline numbers were over a narrow slice (4/44 requirements, all curated;
3 seeded defects, all payments). This section covers all four workstreams (A
auto-extracted apiHints, B expanded defect catalog, C uncurated `--all` run, D
triage stress test), what was found, what was fixed, and what was NOT fixed
(reported as a genuine limit instead).

## Workstream A — auto-extracted apiHints (removing the curation dependency)

**New adapter module:** `adapters/cypress-rwa/extract-api-hints.js` — a
mechanical (regex-over-real-source, no LLM) static reader of:
- `backend/validators.ts` — every `body()`/`query()`/`check()` field rule,
  parsed into `{ name, kind, type, optional }` per named validator export;
- every `backend/*-routes.ts` **and** any root-mounted file like `auth.ts`
  (driven by `app.ts`'s own `app.use(...)` mount table, not a filename
  convention) — method, path, whether `ensureAuthenticated` gates it, and
  which `*Validator` middleware it registers;
- `backend/app.ts` — the mount table (`import X from "./Y"` + `app.use(...)`)
  that turns a routes file into a real top-level path prefix (including the
  no-prefix form, `app.use(auth)`, which is how `POST /login` is mounted).

This produces a `specId ("METHOD /path") -> apiHint` map with real field
names/types/auth, fed into `workflow-adapter.js`'s `loadRequirements()` with
this precedence: **curated (rare, business semantics) > auto-extracted
(default) > core's generic method+path-only inference** (the pre-existing
fallback in `workflow/requirements-md.js`, used only when neither of the
above has anything).

**Result, run against the real `sandbox-eval/cypress-realworld-app` source:**
33 routes extracted across 9 backend files. Matched against the 44
cypress-rwa requirements' recorded specIds (the `context("METHOD /path", ...)`
title each requirement traces back to): **38/44 (86%) now get real,
field-level apiHints purely from auto-extraction** — zero curation. The 6
that don't are explainable, not extractor bugs:
- `GET /graphql` (×3 contexts) — out of scope for a REST route/validator
  reader; this app's GraphQL surface isn't expressed as `body()`/`query()`
  validators at all.
- `DELETE /contacts/:bankAccountId` — the cypress spec's own `context()`
  title has a typo (the real route is `DELETE /bankAccounts/:bankAccountId`);
  the extractor correctly reports no match rather than silently guessing.
- `GET /bankTransfer` (singular) — the real mount is `/bankTransfers`
  (plural); same kind of spec/route naming mismatch.
- `POST /notifications` — the real route is `POST /notifications/bulk`; the
  spec's `context()` title omits the `/bulk` suffix.

**`CURATED_API_HINTS` shrunk from 4 entries to 1.** `CYPRESS-RWA-USERS-001`,
`CYPRESS-RWA-TRANSACTIONS-001`, and `CYPRESS-RWA-BANK-ACCOUNTS-001` now run
entirely on auto-extracted hints. Only `CYPRESS-RWA-TRANSACTIONS-007` keeps a
curated entry — it encodes business semantics (the dollars→cents storage
conversion, balance-crediting on a completed payment) that live in
`database.ts`'s business logic, not in `validators.ts`'s input-shape rules,
so they are genuinely not mechanically extractable by this kind of reader;
reported as a coverage limit rather than papered over with more curation.

**Live re-verification of the unchanged 4-requirement gate**, after the hint
source swap, against the real container + `anthropic/claude-sonnet-4.5`:
```
"requirements": { "total": 4, "covered": 4 },
"tests": { "generated": 8, "passed": 8, "failed": 0, "quarantinedFlaky": 0 },
"falsePositiveRate": 0,
```
8/8 tests pass, 0% false-positive rate, 0 quarantined — same headline numbers
as Stage 6, now with 3 of the 4 requirements grounded in zero curation. The
seeded-defect eval (original 3 defects) was re-run against this regenerated
suite and still scored **100% catch rate** — confirming the hint-source swap
didn't regress detection power.

**A real bug found and fixed along the way** (the same "honesty over a green
checkmark" pattern as Stage 6 §7): a side effect of also fixing
`extract-requirements.js`'s acceptance-criteria extraction (see below) was
that Generate started receiving a real criterion from the cypress-rwa spec
itself — `expect(response.body.transaction.requestStatus).to.eq(undefined)`
— and wrote a `TestCase` asserting `{ op: "eq", value: null }` (JSON has no
`undefined`). `adapters/cypress-rwa/test-runner.js`'s `eq` comparator used
strict `!==`, so a genuinely-absent field (`actual === undefined`) never
matched `value: null`, producing a real false-positive run on the *clean*
app. Fixed by normalizing both sides of `eq`/`neq` (`undefined -> null`)
before comparing — covered by 2 new unit tests in `test-runner.test.js`
(`eq(null)` passes when the field is absent; still fails when the field has
a real, different value). This is a representational gap in the test
runner, not a relaxation of any assertion's strictness for real values.

**Two bugs found and fixed in `extract-requirements.js` itself**, needed to
get the richer acceptance criteria (and therefore the richer downstream
behavior above) at all:
1. `EXTRA_EXPECT_RE` had no global flag and the code took only the *first*
   regex match in a test body — which was almost always the same
   `expect(response.status)...` line already captured by `STATUS_RE`, so
   every *other* real assertion in the test (response-body shape, specific
   field values) was silently dropped. Fixed to collect all `expect(...)`
   matches and emit each one not already covered by the status assertion.
2. The regex itself only matched a single bare word after `.to.` (e.g.
   `.to.eq(`), missing real chains like `.to.have.property(...)` or
   `.length.to.be.greaterThan(...)`. Broadened to match any `.word` chain
   between `expect(...)` and the trailing call.
3. `blockBody`'s fixed 16-line lookahead window could read past a short
   `it()` block into the *next* sibling block's assertions (verified: this
   happened for `CYPRESS-RWA-USERS-001`, which picked up an assertion that
   actually belonged to the next test, "gets a user"). Fixed by stopping the
   window at the next `it(`/`context(`/`describe(` line.

## Workstream B — expanded & spread the seeded-defect catalog

`DEFECT_CATALOG` (`adapters/cypress-rwa/fault-injector.js`) grew from 3 to
**12 entries**, spanning all four domains with generated tests
(transactions-007, bank-accounts, users, transactions-001):

| Defect id | Domain | Severity | expectCaught |
|---|---|---|---|
| payment-amount-cents | transactions-007 | blatant | true |
| auth-gate-post-transactions | transactions-007 | blatant | true |
| receiver-balance-not-credited | transactions-007 | blatant | true |
| payment-amount-rounding-shaved-cent | transactions-007 | subtle | true |
| auth-gate-get-bankaccounts | bank-accounts | blatant | true |
| bankaccounts-missing-userid-field | bank-accounts | moderate | true |
| bankaccounts-routingnumber-hardcoded | bank-accounts | moderate | **false (negative control)** |
| auth-gate-get-users | users | blatant | true |
| users-results-not-array | users | moderate | true |
| users-self-not-excluded | users | subtle | **false (negative control)** |
| auth-gate-get-transactions | transactions-001 | blatant | true |
| transactions-pagination-off-by-one | transactions-001 | subtle | true |

Each `find` string was confirmed unique (`grep -c`) in the actual running
container's source before being added.

**Result (live, against the 8-test suite regenerated in workstream A):**
```
catch rate (real defects): 90% (9/10)
negative controls correctly uncaught: 2/2
unmeasured test ids: CYPRESS-RWA-TRANSACTIONS-001-TC1
```
- **Every one of the 8 generated tests is now targeted by at least one
  real defect** except `CYPRESS-RWA-TRANSACTIONS-001-TC1` (down from 6
  unmeasured tests at the end of Stage 6).
- **Both negative controls were correctly NOT caught**, as designed:
  `bankaccounts-routingnumber-hardcoded` (no generated test calls
  `POST /bankAccounts` at all) and `users-self-not-excluded` (the generated
  test only asserts `results` exists and is an array — never result count or
  self-exclusion). This is what makes the 90/100% numbers a measurement,
  not a foregone conclusion from a catalog that only contains things the
  suite happens to already check.
- **The one missed real defect, `transactions-pagination-off-by-one`, was
  investigated and is a genuine, reported coverage limit, not a tooling
  bug:** the defect (`offset = (page - 1) * limit` → `offset = page * limit`,
  a textbook off-by-one) does shift `GET /transactions` to the next page of
  results — but `CYPRESS-RWA-TRANSACTIONS-001-TC1`'s assertions are
  `results` exists + `isType array` + `results[0]` exists. None of those
  check *which* items come back or a total count, and the seeded user has
  enough transactions that `results[0]` is still populated after the page
  shift — so the defect doesn't violate anything the test actually asserts.
  This is exactly the kind of shallow-test gap the catalog is supposed to
  surface, and it's left unmeasured rather than replaced with a more
  blatant defect that would have hidden the finding.
- **A real bug found and fixed while authoring the catalog:** the first
  version of `bankaccounts-missing-userid-field`
  (`.map(({ userId, ...rest }) => rest)`) crashed the live backend —
  ts-node failed to compile under this project's `strict: true`
  (`TS7031: Binding element 'userId' implicitly has an 'any' type`), and
  nodemon then sat "waiting for file changes" with **no server process at
  all**, which the eval harness correctly surfaced as `waitForBackendReady`
  timing out. Recovered by restoring the file from the pristine source via
  `docker cp` and fixed the catalog entry by casting to `any[]` before the
  destructure. Documented here because it's a real, generalizable hazard for
  any future TS-source-patching fault injector in a `strict: true` project,
  not specific to this one defect.

`eval/run-eval.js` was extended (not weakened): the headline `catchRate` is
now computed **only over `expectCaught !== false` entries**, so adding more
negative controls in the future can't silently move the number; negative
controls are scored separately (`negativeControls.correctlyUncaught`) and
never fail the run on their own. `scorecard.json` gained `unmeasuredTestIds`
and `negativeControls` (schema updated in
`workflow/schemas/scorecard.schema.json`, additive/optional fields only).

## Workstream C — uncurated `--all` run (full 44-requirement breadth)

§9 of the Stage 6 section flagged this as explicitly untested: *"Generate
would need either richer auto-extracted `apiHints` or more curated entries
to keep the false-positive rate at 0 across the full set; untested."*
Workstream A's auto-extraction closed part of that gap; this run measures
what's left, live, against all 44 `cypress-rwa` requirements with **no
curation and no seeded defects** — `node run-workflow.js --all --out
reports-all`, `n=3`, model `anthropic/claude-sonnet-4.5`.

**Result (`reports-all/scorecard.json`):**
```json
{
  "requirements": { "total": 44, "covered": 38 },
  "tests": { "generated": 132, "passed": 70, "failed": 24, "quarantinedFlaky": 38, "errored": 0 },
  "falsePositiveRate": 0.18181818181818182,
  "traceability": { "orphanTestIds": [] },
  "errors": []
}
```

- **False-positive rate is 18.2% (24/132), not the curated set's 0%** — this
  is the number §9 predicted would move once the full, messier requirement
  set was exercised. Every one of the 24 is a clean-run `FAIL` that `triage()`
  classified `real_defect` against the unmodified app, i.e. a false positive
  in the same clean-run sense defined in §7 — not a tooling crash, and not
  evidence of 24 distinct triage mistakes (with `n=3` and no seeded fault,
  each one means the *generated test itself*, not the live app, was wrong:
  most commonly a bad request body shape, status-code or field-name
  assumption not actually present in the real API, inferred from a
  requirement's prose where auto-extracted `apiHints` were thin).
- **38 of 132 tests (28.8%) were quarantined** — flaky/bad and never
  resolved within `MAX_REGEN_RETRIES=2` (3 attempts total). This is a
  materially higher rate than the curated 4-requirement set ever showed (0
  quarantined there, per §6 of the Stage 6 section) and is the more
  actionable finding of this run: it means GENERATE's bounded regeneration
  loop, not just the harness's flake guard, is hitting its ceiling on a
  meaningful fraction of auto-extracted requirements — most visibly
  `CYPRESS-RWA-TEST-DATA-001`, which alone produced 8 quarantined attempts at
  a single intended test case before the harness gave up and moved on.
- **6 of 44 requirements (13.6%) ended up with zero passing test** —
  `CYPRESS-RWA-BANK-ACCOUNTS-005`, `CYPRESS-RWA-BANK-TRANSFER-001`,
  `CYPRESS-RWA-CONTACTS-001`, `CYPRESS-RWA-NOTIFICATIONS-002`,
  `CYPRESS-RWA-NOTIFICATIONS-004`, `CYPRESS-RWA-USERS-012` — which is what
  `requirements.covered: 38` (not 44) counts. Two distinct failure shapes:
  `BANK-ACCOUNTS-005` produced only quarantined attempts (regeneration never
  converged); the other five produced only `defect`-classified (false
  positive, per above) outcomes — the generated test was consistently wrong
  in the same way across every regeneration attempt, suggesting the
  requirement's prose or auto-extracted `apiHints` pointed GENERATE at an
  incorrect assumption it kept reproducing rather than a one-off mistake.
- **Traceability held at full scale**: zero orphan test ids across all 132
  generated tests — every one carries a `requirementId` that resolves to one
  of the 44 known requirements, confirming Workstream A's auto-extraction
  didn't introduce any requirement-id drift.
- **Zero requirement-level errors** (`tests.errored: 0`) — the
  per-requirement try/catch in `orchestrator.js` (added specifically so one
  bad requirement in a 44-wide sweep can't take down the rest) was never
  exercised by a real failure in this run; every requirement produced at
  least an attempted test case.
- This run is **intentionally not gated** — `verify.sh`'s step 7 reads
  `reports-all/scorecard.json` if present and reports these numbers with no
  pass/fail threshold (see "`verify.sh` extensions" below), because a 0%
  false-positive bar across an uncurated, auto-extracted 44-requirement set
  is not a realistic target with the current GENERATE prompt — reporting the
  real number (18.2%, not 0%) is the point of this workstream, not a
  regression to fix before shipping it.

## Workstream D — triage stress test

New: `eval/triage-battery.js` (12 labelled cases) + `eval/run-triage-battery.js`
(runner + confusion matrix). Mix of:
- **4 "real-defect" cases** — an actual catalog defect from workstream B
  applied live, the persisted `TestCase` replayed, the real `FAIL` run
  output fed to the real `triage()` step, then reverted.
- **2 "real-bad-test" cases** — hand-written, deliberately bad `TestCase`s
  (e.g. expects `201` where the requirement says `200`; asserts a bank name
  never specified anywhere) run live against the **clean, undefective** app,
  so the real failure is genuinely the test's fault, not the app's.
- **6 synthetic cases** (3 `environment` — ECONNREFUSED/504-gateway-timeout/
  DNS-failure-shaped `RunResult`s; 2 `flaky_or_bad_test`; 1 `real_defect`) —
  hand-crafted `RunResult` triples fed straight to `triage()`, used for
  failure shapes impractical to manufacture live.

Triage is never told the ground truth or which kind of case it's looking at
— same blindness as production.

**First run: 92% (11/12).** The one miss was informative, not noise:
`real-defect-payment-cents` (ground truth `real_defect`) was classified
`flaky_or_bad_test`, with a coherent rationale — `triage.user.md` never
included `requirement.apiHints`, so triage had **strictly less context than
Generate had** when the test was written. The cents-conversion fact lives
only in `CURATED_API_HINTS`' notes, not in the bare acceptance criteria
triage was shown, so triage reasonably (but wrongly) concluded the test's
`amount` assertion was invented rather than documented.

**Fixed at the prompt level** (`workflow/prompts/triage.user.md` and
`triage.system.md` — both app-agnostic core, scanned by
`check-boundaries`): triage's user prompt now includes
`requirement.apiHints` (the exact same data Generate already receives), and
the system prompt's grounding rule now says an assertion grounded in a
documented apiHint note is not an invented one. This is a generalizable
fix — closing an information asymmetry between Generate and Triage — not a
fix targeted at this one battery case.

**Re-running surfaced a second, different finding:** the fix flipped one of
my own *synthetic* cases (`synthetic-real-defect-stacktrace-500`) from
correct to incorrect, because that case's hand-written request body
(`{ amount: 50 }`) was missing required fields per the documented contract —
once triage could see the apiHints, calling that test "bad" was the more
defensible read than my assumed ground truth. This was a flaw in the
battery fixture, not in triage; fixed by giving that case (and the
similarly-incomplete `synthetic-environment-gateway-timeout` case) a
complete, contract-compliant body.

**Final result: 100% (12/12), confusion matrix:**
| ground truth \ predicted | real_defect | flaky_or_bad_test | environment |
|---|---|---|---|
| real_defect | 5 | 0 | 0 |
| flaky_or_bad_test | 0 | 4 | 0 |
| environment | 0 | 0 | 3 |

A perfect score on a 12-case battery is reported as exactly that — evidence
on this battery, not a claim that triage is infallible in general; the
battery composition (and the one real miss found and fixed along the way) is
documented in full above rather than presented as a clean pass from the
start.

## `verify.sh` extensions (Definition of Done)

The existing curated-slice gate (steps 1-4, unchanged) stays the hard pass.
Added, as recorded gate output:
- **Step 5** now also reports `negativeControls` and `unmeasuredTestIds` from
  the expanded catalog, and gates on a committed `MIN_CATCH_RATE` (default
  `0.8`, set deliberately below the measured 90% to leave headroom for LLM
  nondeterminism while still catching a real regression) — computed only
  over real (non-negative-control) defects, same reasoning as above. A
  missed real defect still fails the gate exactly as before; an uncaught
  negative control does not (that's the expected, correct outcome).
- **Step 6** runs the triage battery and gates on a committed
  `MIN_TRIAGE_ACCURACY` (default `0.8`, measured 100%).
- **Step 7** reports the uncurated `--all` breadth snapshot (workstream C,
  below) from a committed `reports-all/scorecard.json` file — **read-only,
  no threshold, and not re-executed on every gate run**: re-running the full
  44-requirement sweep against the live LLM on every `./verify.sh`
  invocation would make the standing gate slow, costly, and non-deterministic
  in a way the original Stage 6 gate explicitly avoided by scoping to 4
  requirements (see Stage 6 §3 above) — the same tradeoff, made visible
  rather than silently expanding the gate's cost. Regenerate
  `reports-all/scorecard.json` by re-running
  `node run-workflow.js --all --out reports-all` when intentionally
  re-measuring breadth.

`tools/check-boundaries.js`, the catalog's patch mechanics, and the
pre-existing thresholds were not weakened anywhere in this stage.

## Gate status: `./verify.sh` currently FAILS at step 5 (run twice, both runs, same result)

This was discovered running the full gate end-to-end for the first time since
Workstream B expanded the catalog to 12 defects — the "Final gate output"
captured in §10 above predates that expansion (it shows the original 3-defect
catalog, 100% catch rate). Workstream B's own 90%/9-of-10 measurement was run
directly against `eval/run-eval.js`, not through `./verify.sh`.

`./verify.sh` step 5 contains two independent checks: a soft floor
(`MIN_CATCH_RATE`, default 0.8) and a separate, unconditional check — "any
`expectCaught:true` defect not caught is a hard failure," no threshold,
regardless of `MIN_CATCH_RATE`. Workstream B documented exactly one
structural, permanent miss (`transactions-pagination-off-by-one` — the
generated `TRANSACTIONS-001-TC1`'s assertions, by design of that requirement's
apiHints, cannot distinguish a page-shifted result set; see Workstream B
above for the full investigation). That single documented miss is enough to
trip the unconditional check every time, independent of the 90% catch rate
clearing the 0.8 floor. Run twice (back to back, fresh LLM generation each
time, see command below) with an identical outcome both times — this is the
catalog's stable, structural behavior, not LLM-call variance:

```
node run-workflow.js --requirement CYPRESS-RWA-TRANSACTIONS-007 --requirement CYPRESS-RWA-USERS-001 --requirement CYPRESS-RWA-TRANSACTIONS-001 --requirement CYPRESS-RWA-BANK-ACCOUNTS-001 --out reports
node eval/run-eval.js
# [eval] catch rate (real defects): 90%
# [eval] negative controls correctly uncaught: 2/2
# [eval] MISSED real defects: transactions-pagination-off-by-one
```

This is a real, pre-existing gap between this document's own narrative
(Workstream B: 90% is "left unmeasured" by deliberate choice, framed as an
accepted finding) and `verify.sh`'s literal step-5 code (any miss is an
unconditional hard failure, full stop). Per `verify.sh`'s own header — never
edit it, or the defect catalog, to force a pass — that conflict is left
unresolved here rather than papered over: **the standing gate does not
currently exit 0**, and fixing that for real means either earning a genuine
catch (a richer apiHint for `TRANSACTIONS-001` so the generated test can
distinguish a page shift) or deliberately reclassifying this defect as a
documented negative control — both substantive decisions outside this
workstream's scope, not a one-line patch.
