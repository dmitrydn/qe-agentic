# B. Implementation Audit — Agentic QE Sandbox vs. Claimed Architecture

**Scope:** Static review only. I read code, prompts, schemas, committed reports and generated TestCase JSON. I did not run anything except a read-only Python script over the generated tests (see §4). All paths are relative to `agentic-qe-sandbox/` unless they start with `text/`.
**Baseline:** `text/Agentic-QE-Architecture.pptx.md` (deck v2), plus the System Architecture Spec v1, Proposal, Technical Spec & Implementation Plan, and Test Design Agent Spec.
**Date:** 2026-10-06

---

## 0. Executive summary

The sandbox does contain a real, readable implementation of the deck's **implemented-loop slice**: Select → Generate → Run×N (with reset) → Triage → Report. It also has the testability gate, requirement sync and the release-replay tool. Several design choices are good:

- the testability score and verdict really are computed in code;
- generated tests are a declarative JSON DSL interpreted by a fixed runner, not arbitrary code;
- the core really is free of adapter imports.

Three things undercut the deck's claims:

1. **The headline measurements are not valid measurements as built.**
   - *Triage (12/12) and testability (16/16) batteries:* the case ids and titles passed into the prompts contain the expected answer.
   - *90% catch rate:* produced mainly by one curated hint block that names the exact seeded defects ("assert this exactly"), on 4 requirements / 8 tests. The negative controls are excluded from the denominator.
   - *Acceptance gate:* `verify.sh` currently exits non-zero, as VERIFICATION.md itself records.
2. **Several "guarantees in software" are still prompt-only, or the LLM decides them.**
   - The release gate's pass/fail is the LLM's triage label, and the gate fails open.
   - "Only use the given endpoints" and "include repro" are prompt rules with no code check.
   - A FLAKY result triggers LLM regeneration instead of quarantine.
3. **The durable suite has integrity defects.**
   - LLM-chosen test ids collide and overwrite each other: 7 ids are duplicated in the 44-requirement sweep, one of them 8 times.
   - Ids are used unsanitized as file names, which allows path traversal.
   - About a third of the grounded suite uses Express `:param` paths that the runner never substitutes.
   - Over half the tests assert only a status code.

**Matrix totals (48 rows):** Implemented **14** · Partial **14** · Stub/scaffold **1** · Not implemented **13** · Implemented differently **6**.

---

## 1. Implemented-vs-NOT matrix

Legend: **I** = Implemented · **P** = Partial · **S** = Stub/scaffold · **N** = Not implemented · **D** = Implemented differently

### 1.1 Platform layer (Layer 1)

| # | Component / claim | Source | Status | Evidence (file:line) | Note |
|---|---|---|---|---|---|
| 1 | Workflow engine: event-driven FSM, persisted `story_state`, deterministic transitions | Deck s5; Spec §3.2 | **D** | `workflow/orchestrator.js:35-94` | An in-memory `for` loop with a `while(true)` retry. No FSM table, no persisted state, no resume after a crash, no state-transition audit. |
| 2 | Loop Select → Generate → Run×3 → Triage → Report | Deck s6-7 | **I** | `workflow/orchestrator.js:24-103` | Works end-to-end for one adapter. Deviations are covered in rows 5 and 7. |
| 3 | Select (deterministic, schema-validated) | Deck s7 | **I** | `workflow/steps/select.js:14-31` | ajv-validates every Requirement and throws on the first invalid one, which aborts the whole run. |
| 4 | Run ×N with reset between runs | Deck s7 | **I** | `workflow/steps/run-harness.js:30-36`; `adapters/cypress-rwa/adapter.js:46-53` | `reset()` = `POST /testData/seed` before every run. Re-login and fixture lookup also happen on every run (`workflow-adapter.js:238-242`). |
| 5 | Flake guard: all-pass→PASS, all-fail→FAIL, mixed→quarantine | Deck s6 | **D** | `run-harness.js:38-42` computes FLAKY; `orchestrator.js:65-84` treats FLAKY like a triaged non-defect | Mixed results trigger **LLM regeneration** (up to `MAX_REGEN_RETRIES=2`). A test is quarantined only after the retries are exhausted. |
| 6 | Triage only on FAIL | Deck s7 | **I** | `orchestrator.js:70-71` | Correct. |
| 7 | Triage blind to the injected defect | Deck s6 | **P** | `triage.js:38-53`; `run-eval.js:55-66` | In production no fault is ever present. The catch-rate eval never calls triage at all. The triage battery leaks ground truth through test ids and titles (finding C1). |
| 8 | Report: scorecard (catch, FP, cost) | Deck s6, s9 | **I** | `workflow/steps/report.js:57-146`; `eval/run-eval.js:105-117` | Catch rate is back-filled into the scorecard by eval. The FP definition is questionable (finding M6). |
| 9 | Defect reports "with repro" | Deck s6 | **P** | `report.js:148-165`; `triage.schema.json:13` | Repro is LLM prose and optional in the schema. No captured request or response evidence is attached. |
| 10 | Traceability DB | Deck s5, T6; Spec §3.1 | **N** | — | Files only. The deck (s10) admits this. |
| 11 | Traceability chain req → test → result → defect | Deck s10 | **P** | `testcase.schema.json:9`; `report.js:78` | Only `requirementId` exists. No acceptance-criterion (AC) link, no run history, no model or prompt provenance on a test. The orphan check is set membership. |
| 12 | Automated check: format validation | Spec §3.3.2 | **I** | `workflow/llm/json.js:80-84`; `generate.js:26-67` | ajv plus a stray-placeholder check, with repair retries. |
| 13 | Automated check: duplicate detection | Proposal L1; Spec §3.3.1 | **N** | — | Nothing hashes or compares test bodies. Duplicate ids are not even detected (H2). |
| 14 | Automated check: AC coverage arithmetic | Spec §3.3.2 | **N** | `report.js:77` | "Covered" means at least one passing test per requirement. ACs carry no ids. |
| 15 | Boundary validation "in both directions" | Spec §0.2 | **P** | `select.js:17-24`; `llm-client.js:154-165` | Inputs and outputs are validated. `scorecard.schema.json` is never used and already disagrees with the emitted scorecard (no `cost`, `additionalProperties:false`). |
| 16 | Adapter contract (single decoupling boundary) | Deck s6 | **I** | `workflow/adapter/contract.js:39-65` | Shape check only. There is a second, conflicting `AppAdapter` contract in `core/adapter/types.js:61` (L1). |
| 17 | Cypress RWA adapter | Deck s6 | **I** | `adapters/cypress-rwa/workflow-adapter.js:214-252` | API-level only. |
| 18 | Conduit adapter | Specs | **S** | `adapters/conduit/adapter.js:25-66`; `DEFERRAL.md` | `requirementsSource` only. run, seed, reset, auth and teardown throw `NotImplementedError`. |
| 19 | Jira / Xray / Zephyr adapters | Proposal L1; Deck s10-11 | **N** | — | Deck lists these as "Next". |
| 20 | Git-Ops intake (webhook, debounce, publish `.feature`, questions PR) | Spec §0.3, §1.2, §1.5 | **N** | — | Requirements come from a generated Markdown file. Clarifications are written as local `.md` files. |
| 21 | UI / E2E execution | Specs | **N** | `workflow-adapter.js:219-223` | Explicitly API-only. The Cypress/Electron image is built but never used by the loop. |
| 22 | Eval harness (scores every prompt/model change) | Deck s5; Proposal L1 | **P** | `eval/run-eval.js`, `run-triage-battery.js`, `run-testability-battery.js` | Exists, but it is bound to cypress-rwa (`eval/defects.js:7`), not tied to prompt or model versions, and its metrics are contaminated (C1, C2). |
| 23 | Golden set (signed off by SMEs) | Spec §5 Ph0; Tech Spec Ph0 | **D** | `fault-injector.js:65-189` | Replaced by 12 seeded source patches plus two small labelled batteries. |
| 24 | Triage battery (12/12) | Deck s9 | **P** | `eval/triage-battery.js`; `run-triage-battery.js` | Built, but 8 of the 12 cases leak their label into the prompt (C1). |
| 25 | Testability battery (16/16) | Deck s8 | **P** | `eval/testability-battery.js` | Built, but 14 of the 16 cases use label-bearing ids. Two cases duplicate the prompt's own worked examples (C1). |
| 26 | Cost tracking (~$0.05/run, "auto-tracked") | Deck s9 | **I** | `llm-client.js:97-109,143`; `cost.js:17-66`; `report.js:85-90` | Real token counts × statically configured prices. The ~$0.05 figure is not in the committed curated scorecard (`reports/scorecard.json`: `cost: null`). See M4. |
| 27 | App-agnostic core "enforced in CI" | Deck s6 | **P** | `tools/check-boundaries.js:25-105`; `package.json` `test`; `verify.sh:49-50` | A regex and denylist line scan, easy to bypass (M1). No CI config is present in the reviewed tree. `verify.sh` currently fails (C3). |
| 28 | Requirement sync (delta + prune) | Deck s11 | **I** | `workflow/steps/diff-requirements.js:32-106`; `prune.js:17-32`; `apply-sync.js:26-75`; `ops/sync-requirements.js` | SHA-256 content hash per requirement. Regenerated tests are persisted without being run (H2). |
| 29 | Release gate | Deck s11 | **I** | `workflow/steps/release.js:17-51`; `ops/validate-release.js:65-109` | Fails open, and the LLM decides the outcome (H1). |
| 30 | Durable suite | Deck s11 | **P** | `orchestrator.js:87-88,113-115` | Holds quarantined and failing tests, id collisions overwrite files, and the manifest has drifted (L6). |
| 31 | Testability gate D1–D6; D1 and D4 blocking; "LLM rates, code decides" | Deck s8 | **I** | `workflow/steps/testability.js:8-13,50-98`; `assess.js:69-72`; `assess.system.md:42` | Genuinely in code. The model emits only per-dimension ratings. Score, verdict and blockedBy are computed. |
| 32 | Gate off by default; `TESTABILITY_GATE=on` | Deck s8 | **I** | `config.js:60`; `orchestrator.js:31,43-51` | Correct. |
| 33 | Gate "calibrated" | Deck s8 | **P** | `config.js:54-57`; `orchestrator.js:44` vs `assess.js:75-89` | The threshold is commented as "a placeholder until that calibration happens". The gate uses single-shot `assess`, not the stabilised `assessStable`. |
| 34 | Below threshold: questions returned to the author | Deck s8; Spec §4.A.3 | **D** | `report.js:24-48,133-140` | Written to `reports/clarifications/*.md`. No PR, no status check, no Jira. |
| 35 | Risk-tier override (regulated/core halts on any blocking question) | Spec §4.A.3 | **N** | `requirement.schema.json` has no risk field | — |

### 1.2 AI roles (Layer 2)

| # | Component / claim | Source | Status | Evidence (file:line) | Note |
|---|---|---|---|---|---|
| 36 | Analyst–Designer (one role: testability then design) | Deck s5; Spec §1.3 (single merged call) | **D** | `steps/assess.js`; `steps/generate.js` | Two independent prompts and calls. Generate never sees the assessment's assumptions or clarifications. |
| 37 | Implementation role (approved cases → executable scripts + test-data list) | Deck s5; Spec §4.B | **D** | `generate.js` emits an executable TestCase DSL; `adapters/cypress-rwa/test-runner.js:188-261` interprets it | No separate role exists. The declarative DSL is a reasonable safety choice, since no LLM code is executed. There is no test-data-requirements output and no script generation. |
| 38 | Failure Analyst (classify, group failures, draft defects, record missed scenarios) | Deck s5; Proposal L2 | **P** | `steps/triage.js`; `triage.schema.json` | Three-class verdict plus repro only. No grouping, no "scenario we missed" capture, no human triage hand-off. |

### 1.3 Human review (Layer 3)

| # | Component / claim | Source | Status | Evidence (file:line) | Note |
|---|---|---|---|---|---|
| 39 | Risk-tiered review queue | Deck s5 | **N** | — | The deck admits this (s10). |
| 40 | Reasoning shown with each item | Deck s5 | **P** | `report.js:148-165` (defects); `report.js:24-48` (clarifications) | Generated TestCases carry no rationale, no AC link and no assumptions. |
| 41 | One-click accept / edit | Deck s5 | **N** | — | There is no UI and no ReviewLog capture. |

### 1.4 Cross-cutting guarantees

| # | Component / claim | Source | Status | Evidence (file:line) | Note |
|---|---|---|---|---|---|
| 42 | Model and temperature pinned and recorded with outputs | Spec §1.1 | **P** | `config.js:32-33`; `report.js:109`; `sync-requirements.js:111` | Temperature 0 by default (env-overridable), no seed, no provider pin. A floating alias is recorded in the scorecard and manifest, but not on the TestCases. |
| 43 | Prompts versioned (a change requires a green harness run) | Spec §1.1 | **N** | `generate.js:15-16`; `triage.js:15-16` | Templates are read from disk. No version, hash or provenance is recorded anywhere. |
| 44 | LLM output validation with bounded retries | Spec §1.3 | **I** | `llm-client.js:129-168`; `json.js:31-84` | Brace-scan JSON extraction, ajv validation, and up to 2 repair re-prompts with error feedback. On exhaustion it throws, and the orchestrator records the requirement as `errored`. |
| 45 | Learning loop and metrics (AR, rework rate, escaped defects, missed scenarios) | Spec §2; Tech Spec §1.4 | **N** | — | Reviewer Acceptance Rate, the spec's primary KPI, cannot be computed because there is no review. |
| 46 | Observability: trace per LLM call | — | **N** | `llm-client.js:65-67` | One stdout line with token counts. Prompts and responses are not persisted, and there is no run id. |
| 47 | Bounded retries and cost guard | Spec §3.2 | **P** | `llm-client.js:31,133`; `generate.js:19,57`; `orchestrator.js:79` | Each loop is bounded, but nested retries multiply and there is no budget cap (M4). |
| 48 | Churn interception and debounce (SUPERSEDED state) | Spec §3.2.1 | **N** | — | Batch hash-diff sync (row 28) is the only change handling. |

**Totals:** I = 14 (rows 2, 3, 4, 6, 8, 12, 16, 17, 26, 28, 29, 31, 32, 44) · P = 14 (7, 9, 11, 15, 22, 24, 25, 27, 30, 33, 38, 40, 42, 47) · S = 1 (18) · N = 13 (10, 13, 14, 19, 20, 21, 35, 39, 41, 43, 45, 46, 48) · D = 6 (1, 5, 23, 34, 36, 37).

Layer 3 is entirely absent (0 of 3 features fully implemented). The deck is candid about this on slide 10. The phrase "Three layers, three AI roles" on slide 5 describes the target architecture, not what exists.

---

## 2. Verification of the "guarantees live in software" claims

| Claim | Verdict | Detail |
|---|---|---|
| **Testability gate: code decides** | **TRUE** | `testability.js:50-98` computes a weighted mean of pass/partial/fail. A `fail` on D1 or D4 forces `untestable`. A `fail` on D2, D3 or D5 forces `needs_clarification` (`config.js:76`). The threshold is compared in code. The prompt tells the model not to emit a score (`assess.system.md:42`), and the schema has no score field (`testability.schema.json`). Caveat: the code decides from LLM ratings, so the gate is only as stable as those ratings. The stabiliser exists but the gate does not use it (`orchestrator.js:44`). |
| **Flake guard: all-pass / all-fail / mixed→quarantine** | **PARTLY** | The decision rule is correct (`run-harness.js:38-42`). The orchestrator then sends FLAKY into the regeneration branch (`orchestrator.js:65-84`): a fresh `generate()` for the whole requirement, taking `regenerated[0]`, up to 2 times, and only then `quarantined`. The same branch handles triage verdicts `flaky_or_bad_test` and `environment`. An environment failure should trigger a retry, not a rewritten test. The test that is eventually quarantined or passed may be a different test from the one that flaked. |
| **State truly reset between runs** | **MOSTLY** | `adapter.reset()` runs before every run (`run-harness.js:33`) and maps to `POST /testData/seed` (`adapter.js:46-53`), which reseeds the app DB. Each run also re-authenticates (`workflow-adapter.js:239`) and re-reads fixtures. Not reset: backend process state outside the DB, and source patches (intended for eval). Reset success is only the HTTP 200 of the seed call; there is no state checksum. Fixture identity depends on `/testData/users` ordering being stable (`workflow-adapter.js:190-191`; `ambient-fixtures.js:25-26`). |
| **Triage blind to the injected defect** | **TRUE in production; MOOT for catch rate; FALSE for the battery** | Triage receives the requirement, apiHints notes, the TestCase JSON and the deduplicated run results (`triage.js:46-53`; `triage.user.md`). The defect id, description, patched file and diff are never passed. Patch comments such as `// seeded-defect: receiver-balance-not-credited` (`fault-injector.js:94`) sit in server source and do not reach responses. **However:** (a) `run-eval.js` never calls triage, so "caught" means "a baseline-PASS test now all-FAILs" (`run-eval.js:61-65`) and triage blindness plays no part in the 90%. (b) The triage battery's hand-written TestCases carry their label in the id and title, which are rendered into the prompt. Examples: `"STRESS-SYN-real-defect-500"` (`triage-battery.js:256`), `"STRESS-SYN-env-timeout"` (:138), and the title `"...(test typo, not an app bug)"` (:224). (c) App response bodies (up to 2000 chars per request, `test-runner.js:254`) go verbatim into the triage prompt, which is an injection channel (H1). |
| **LLM output validation** | **TRUE** | `extractJson` parses or brace-scans with string awareness (`json.js:31-77`). ajv uses `allErrors` (`json.js:8`). On a parse or schema failure the client re-prompts with the error appended, up to `LLM_JSON_REPAIR_RETRIES=2` (`llm-client.js:133-165`). Exhaustion throws `InvalidLlmJsonError`, which the orchestrator catches per requirement (`orchestrator.js:90-93`). Generate adds a placeholder-syntax repair loop (2 more) and a `requirementId` equality check (`generate.js:57-79`). Triage, by contrast, **silently overwrites** a mismatched `requirementId` (`triage.js:63-65`), as does assess (`assess.js:65-67`). Note that `response_format: json_object` (`llm-client.js:27`) asks for an object while Generate expects an array. |
| **Model, temperature and seed pinned and recorded** | **PARTIAL** | Temperature defaults to 0 (`config.js:33`). There is no `seed`, no `top_p` and no OpenRouter provider pin. The model is the floating alias `anthropic/claude-sonnet-4.5` (`config.js:32`). The model is recorded in the scorecard (`report.js:109`) and sync manifest (`sync-requirements.js:111`), but **not on any TestCase**: 0/129 persisted tests carry model, prompt version, requirement hash or timestamp. |
| **Prompts versioned** | **NO** | Plain `.md` templates loaded at import (`generate.js:15-16`, `triage.js:15-16`, `assess.js:18-19`). Nothing hashes them or records which version produced an artifact, and no CI link ties a prompt change to an eval run. |
| **Cost from real token usage** | **YES, with caveats** | Token counts come from the provider response `usage` (`llm-client.js:62-64`) and are accumulated per phase, including repair retries (`llm-client.js:97-109`). Dollars use **static configured prices** (`config.js:48-49`, default $3/$15 per million tokens), not OpenRouter's billed cost. Missing usage counts as 0 (`llm-client.js:63-64`), which under-reports. |

---

## 3. Boundary checker (`tools/check-boundaries.js`)

**What it enforces:**

1. A per-line regex `from "…/adapters/` or `require("…/adapters/` (`:41`).
2. A case-insensitive word-boundary denylist of 11 terms: cypress, conduit, realworld, openapi, hurl, playwright, vite, sequelize, lowdb, jwt, supertest (`:25-37,63-66`).

It scans only `core/**` and `workflow/**`, including prompts and `.test.js` files (`:39-40`). It does not build an import graph.

**Bypasses I confirmed by running the same regexes in Python against sample strings:**

| Bypass | Caught? |
|---|---|
| camelCase or underscore identifiers: `cypressRwaWorkflowAdapter`, `CYPRESS_RWA`, `RealWorldApp`, `jwtToken`, `realworld_spec` (`\b` does not split on case changes or `_`) | No |
| Dynamic `await import("../adapters/a.js")` (the regex needs `from` or `require(`) | No |
| Transitive imports: `workflow/` importing `../eval/defects.js`, which re-exports the adapter's `DEFECT_CATALOG` (`eval/defects.js:7`). `eval/`, `ops/` and `requirements/` are never scanned and all name the adapter. | No |
| String-built paths (`"../adap"+"ters/a.js"`) | No |
| Domain vocabulary not on the list (rwa, bankAccounts, testData, transactions, express, nodemon) | No |

**Runtime content defeats the static check entirely.** Requirement text flowing into the core prompts contains framework identifiers. For example: `cy.task("db:seed")`, `cy.loginByApi`, `As a user of cypress-rwa…`, and `expect(response.body.results[0]).to.satisfy(isSenderOrReceiver)` (`requirements/unified-requirements.md:2361-2369`). The prompt *templates* are clean (I grepped and found no app terms in `workflow/prompts/*.md`), but the *rendered* prompts are app- and framework-specific.

**Core still embeds adapter knowledge.** The actor vocabulary `["anonymous","primaryUser","secondaryUser"]` is hard-coded in `generate.js:18` and `assess.js:21`. The cypress adapter's `auth()` throws on anything else (`workflow-adapter.js:192`). Actors should come from the adapter.

**"Enforced in CI".** I found no CI configuration in the reviewed tree. Enforcement is `npm test` (`package.json`) and `verify.sh:49-50`, and the full `verify.sh` currently fails (C3).

---

## 4. Generated tests — quantitative inspection

Method: a Python script (read-only) over every TestCase JSON. A test is "status-only" if no request has any `jsonPath` assertion, and "shape-only" if its only `jsonPath` ops are `exists` and `isType`. "Semantic" means at least one `eq`, `neq`, `gte` or `lte` with a literal or captured value.

| Suite | Tests | Kinds (pos / neg / auth) | Status-only | Shape-only | Semantic | Requests | DELETE / PATCH | Traceability metadata beyond requirementId |
|---|---|---|---|---|---|---|---|---|
| `generated-tests/` (curated gate slice) | 16 | 7 / 2 / 7 | **9 (56%)** | 5 (31%) | **2 (13%)** | 20 | 2 | **0 / 16** |
| `generated-tests-grounded-1/` (41 reqs) | 105 | 47 / 28 / 30 | **55 (52%)** | 31 (30%) | **19 (18%)** | 113 | 18 | **0 / 105** |
| `generated-tests-ab-l1-curated/` | 8 | 4 / 0 / 4 | 4 (50%) | 3 (38%) | 1 (13%) | 11 | 0 | 0 / 8 |

**Assertion op counts (grounded):** `exists` 54, `eq` 27 (23 literal, 3 captured), `isType` 21, `statusIn` 24. **Assertion op counts (curated):** `exists` 15, `eq` 6, `isType` 4.

**Specific defects found in the generated tests:**

- **Unsubstituted path params (33 of 105 grounded tests, 31%).** Auto-extracted hints use Express `:param` paths, but `buildPath` only substitutes `{name}` (`test-runner.js:168`). The literal is sent, e.g. `DELETE /contacts/:contactId` with `pathParams.contactId:"1"` ignored (`CYPRESS-RWA-CONTACTS-004-positive-001.json`). Result: quarantined (`reports/grounded/run1/report.md:56`).
  - **Auth tests pass vacuously.** The sibling auth test passes with the same broken path, because the 401 comes before routing (`:57`).
- **Unsupported placeholder forms (7 tests).** `{{primaryUser.id}}`, `{{primaryUser.username}}` and `{{primaryUser.bankAccountId}}` do not match `\{\{(\w+)\}\}` (`test-runner.js:142,149,151`). Whole-string matches send the literal text; partial matches resolve to `""`.
- **Hard-coded seeded and invented data.** Seed user id `t45AiwidW` (2 occurrences), literal passwords `Password12` and `AlicePass7`, and invented ids such as `contactId:"1"`.
- **Brittle exact values.** `errors.length eq 1` in 8 tests (validator error count). `bankName eq "Test Bank"` and similar echo checks.
- **Oracle source.** The strong oracles (`transaction.amount eq 5000`, `{{senderBalanceBefore - 5000}}`, `{{receiverBalanceBefore + 5000}}`) appear only in `TRANSACTIONS-007-positive-001`. They are copied from the curated hint text that names those defects (`workflow-adapter.js:85-89`) (C2). Elsewhere the oracle is the requirement's status code, mined from the app's own Cypress specs.
- **Schema permits a vacuous test.** `expect` has no `required` keys and `jsonPath` may be empty (`testcase.schema.json:33-52`). A request with `expect:{}` always passes (`test-runner.js:233-242`).
- **Traceability.** Every test has `requirementId` (129/129). None has an AC reference, prompt version or hash, model, requirement content hash, generation timestamp or rationale.

---

## 5. Findings ranked by severity

### Critical

**C1. The triage and testability "accuracy" batteries leak ground truth into the prompt.**
- **Mechanism.** `triage()` renders the full TestCase JSON (`triage.js:50`; `triage.user.md:17`). `assess()` renders `requirement.id` and `title` (`assess.user.md:1-2`).
- **Triage battery examples.** `id:"STRESS-BAD-TEST-users-201"`, `title:"(stress-test bad test) expects 201 instead of the documented 200"` (`eval/triage-battery.js:73-75`). `"(stress-test bad test) asserts a bank name never specified by the requirement"` (:89-91). `"STRESS-SYN-env-connrefused"`, `"STRESS-SYN-env-timeout"`, `"STRESS-SYN-env-dns"` (:117, :138, :173). `"(stress-test) … (test typo, not an app bug)"` (:224). `"STRESS-SYN-real-defect-500"` (:256).
  - In total, **8 of 12** triage cases carry their class in the id or title.
- **Testability battery examples.** `SYN-AMBIGUOUS-LINK-EXPIRY`, `SYN-NO-ORACLE-FORM-SUBMIT`, `SYN-NO-INTERFACE-LOYALTY-POINTS`, `SYN-EPIC-SECURITY`, `SYN-CONTRADICTION-STATUS`, `SYN-CLEAR-LIST-USERS`, and so on (`eval/testability-battery.js:26-257`).
  - **14 of 16** cases. Worse, the system prompt's two worked examples, "link expires after 24 hours" and "List users" (`assess.system.md:33-37`), are battery items. This is train/test contamination.
- **Impact.** The deck's "100% triage accuracy (12/12)" and "Battery 100% (16/16)" cannot be treated as measurements. `verify.sh` gates on the triage number (`verify.sh:124-138`).
- **Fix.** Use opaque ids and neutral titles, keep a held-out set, and remove prompt examples from the battery.

**C2. The 90% catch rate is driven by hints written against the defect catalog, with a favourable denominator.**
- **Curated hints mirror the seeded defects.** `CURATED_API_HINTS["…TRANSACTIONS-007"]` instructs: "the persisted/returned transaction.amount equals the submitted dollar amount multiplied by 100 … **assert this exactly**" and "sender's balance … decreases and the receiver's balance increases … **assert both deltas**" (`workflow-adapter.js:85-89`). These map one-to-one onto the seeded defects `payment-amount-cents`, `payment-amount-rounding-shaved-cent` and `receiver-balance-not-credited` (`fault-injector.js:67-104`). The comment at `workflow-adapter.js:61-63` says "never the seeded defects".
- **One test does most of the work.** That single test, `TRANSACTIONS-007-positive-001`, accounts for **4 of the 9** catches (`reports/eval-report.md:11-20`). The remaining 5 are auth-gate removals or gross shape breaks, which status-code and existence checks catch.
- **Negative controls are excluded from the denominator.** They are labelled `expectCaught:false` *because* "no generated test asserts on" them (`fault-injector.js:131,161`), and then excluded (`run-eval.js:86-94`). With them included, the rate is 9/12 = 75%.
- **The slice is tiny and needs no LLM judgement.** Scope is 4 requirements / 8 tests (`verify.sh:40-45`). "Caught" needs no triage (`run-eval.js:64`).
- **Fix.** Freeze hints before authoring defects, have the defects authored blind by a second person, include all defects in the denominator, and report a per-test attribution spread.

**C3. The standing acceptance gate does not pass, but the deck reports "enforced in CI" and phases "DONE".**
- VERIFICATION.md records: "**`./verify.sh` currently FAILS at step 5** (run twice … same result)" (`VERIFICATION.md:700-739`).
- The cause is the unconditional "any missed real defect fails" check (`verify.sh:113-117`; `run-eval.js:197-207`) against the structural miss `transactions-pagination-off-by-one`.
- `MIN_CATCH_RATE=0.8` (`verify.sh:23`) is therefore dead configuration.
- No CI workflow file exists in the reviewed tree.

### High

**H1. The release gate is LLM-decided and fails open, and the app under test can steer it.**
- **Fail-open logic.** `validateRelease` marks a FAIL as a regression only if triage returns `real_defect` (`release.js:35-38`). The process exits non-zero only on regressions (`validate-release.js:108`). A genuine regression that the LLM calls `flaky_or_bad_test` or `environment`, or any FLAKY result, exits 0.
- **Injection channel.** Response bodies (up to 2000 chars each, `test-runner.js:254`) are rendered verbatim into the triage prompt (`triage.user.md:21`). A response such as an error string that reads like instructions can steer the verdict.
- **Why it matters.** This contradicts "the LLM rates; code decides" at the one point where it matters most.
- **Fix.** Any deterministic FAIL on a previously-green test should block, and triage should only annotate. Treat inconclusive as blocking by default. Delimit or escape app output in prompts.

**H2. The durable suite has integrity defects.**
- **Id collisions overwrite tests.**
  - Regeneration replaces a failing test with `regenerated[0]` of a fresh whole-requirement generation (`orchestrator.js:83-84`), and tests are persisted under the LLM-chosen `id` (`orchestrator.js:113-114`).
  - `generate()` deduplicates ids only within one response (`generate.js:69-79`), not across loop iterations.
  - In `reports-all/report.md` there are **7 duplicated test ids**: `TEST-DATA-001-positive-users` ×8, `USERS-011-positive-01` ×5, and 5 others ×2. So "132 generated" maps to about 116 files, and per-test results attach to overwritten files. The grounded run has 8 duplicated ids.
- **Quarantined and failing tests enter the durable suite.** `persistTestCase` runs for every outcome (`orchestrator.js:87-88`).
- **Unvalidated tests enter the durable suite.** `sync-requirements --apply` persists generated tests **without executing them** (`sync-requirements.js:93-94`; `apply-sync.js:57-61`). The release gate later replays them as if they were trusted.

**H3. Path traversal and arbitrary file write via LLM-controlled test ids.**
- The file name is `` `${testCase.id}.json` `` with no sanitisation (`orchestrator.js:114`; `sync-requirements.js:94`). The schema only requires `minLength:1` (`testcase.schema.json:12`).
- An id of `../package` overwrites `package.json`; `../workflow/schemas/testcase.schema` overwrites a schema.
- The id is produced by the LLM from requirement text, which is an untrusted input (repository files, and in the target design, Jira).
- **Fix.** Enforce `^[A-Za-z0-9._-]+$`, derive ids deterministically from requirement id + index + content hash, and assert that the resolved path stays inside the directory.

**H4. LLM-generated tests execute against the target without an allowlist.**
- **No constraints on what a test can call.** Any of GET/POST/PUT/PATCH/DELETE (`testcase.schema.json:26`). Arbitrary request headers merged *after* auth headers, so a test can replace `Cookie` (`test-runner.js:203-207`). Arbitrary `pathTemplate`, which may hit `/testData/seed` or any route. The "only use given endpoints" rule is prompt-only (`generate.system.md:7`).
- **No host check.** The URL is a string concatenation, `` `${baseUrl}${path}${qs}` `` (`test-runner.js:202`). With the current `http://localhost:3001` the URL parser blocks host-suffix tricks. With a port-less base URL (e.g. a shared staging host), a `pathTemplate` of `.attacker.net/x` would send the session cookie off-host.
- **Destructive operations.** The grounded suite contains 18 DELETE/PATCH requests.
- **Weak isolation.** Process isolation is only "it's a local container". Ports are published on all interfaces (`docker/run.sh` `start`: `-p 3000:3000 -p 3001:3001`), exposing the unauthenticated reseed endpoint to the LAN.
- **Fix.** Validate each request's method and path against the requirement's apiHints or route table in code, deny overrides of auth headers, and resolve with `new URL(path, base)` plus an origin equality check.

**H5. Mismatch between hint path syntax and runner syntax silently breaks about a third of the broad suite.**
- See §4: 33 of 105 grounded tests use `:param`, and 7 use dotted placeholders.
- These deterministic failures are routed to triage, then regenerated, then quarantined or reported as FP. That inflates both the 18% uncurated FP figure and the ~30% quarantine rate (`reports-all/report.md`: 38/132 quarantined).
- Auth tests can pass while hitting a non-existent route.
- The engine should reject unresolved `:x`, `{x}` or `{{x.y}}` tokens before execution. They are structural errors, not something to triage.

**H6. Generated tests are weak oracles, and the schema allows vacuous tests.**
- About 52–56% of tests are status-only and only 13–18% assert a value (§4).
- `expect:{}` is schema-valid and always passes (`testcase.schema.json:33-52`; `test-runner.js:233-242`).
- No code-level check requires at least one assertion, or a value assertion on positive tests.
- This undermines "known confidence" (deck s3) and the catch-rate generalisation.

### Medium

**M1. The boundary checker is shallow** (§3). It misses camelCase identifiers, dynamic imports and transitive imports, and does not scan `eval/` or `ops/`. App and framework text reaches the core prompts at runtime via the requirements, and actor names are hard-coded in core (`generate.js:18`, `assess.js:21`).

**M2. Prompt-only rules that the architecture says belong in software (T5).**
- "Never invent a path, method, or field" (`generate.system.md:7`): no code check of generated requests against `apiHints`. `grounding.js` checks requirements against routes, not generated tests.
- "If real_defect, include repro" (`triage.system.md:6`): `repro` is optional (`triage.schema.json:13`). Use a JSON-Schema `if/then`.
- "Include negative and auth cases" (`generate.system.md:6`): no code check on kinds.
- `requirementId` mismatches are silently patched in triage and assess (`triage.js:63-65`; `assess.js:65-67`) instead of being rejected.

**M3. Reproducibility and observability.**
- No prompt hash or version, and no TestCase provenance (model, prompt hash, requirement hash, timestamp).
- Model alias not pinned to a snapshot or provider; no seed.
- No per-call trace store: prompt, response, latency and attempt number are lost. Only one stdout line is emitted (`llm-client.js:65-67`). The raw output of an invalid response survives only inside a thrown error.
- No run id correlates logs, scorecards and persisted tests.

**M4. Cost tracking caveats.**
- **Prices.** Static env prices (`config.js:48-49`) instead of provider-reported cost. Changing `LLM_MODEL` without updating prices mis-states cost.
- **Headline not reproducible.** The "~$0.05 per curated run" is not in the committed curated scorecard (`reports/scorecard.json` → `cost: null`). The one committed full-sweep cost is $3.84 for 41 requirements, about $0.094 per requirement (`reports/grounded/run1/scorecard.json`), with triage at 28% of spend.
- **No budget cap; retries multiply.** One `generate` can cost up to (1+2 JSON repairs) × (1+2 placeholder repairs) = 9 calls. Each test can regenerate twice more, and each FAIL adds a triage call (`llm-client.js:133`; `generate.js:57-67`; `orchestrator.js:79-84`).

**M5. Eval harness robustness and coupling.**
- `apply()` and `revert()` are not wrapped in `try/finally` (`run-eval.js:59-66`; `run-triage-battery.js:43-49`). An exception leaves a defect patched into the running container. The next `adapter.run()` recreates it, but later iterations in the same process do not.
- The revert check re-runs only the catching tests (`run-eval.js:69-73`), not the whole baseline.
- `docker exec … sh -c "cat > ${path}"` interpolates a path into a shell (`fault-injector.js:21`). It is catalog-controlled today.
- The harness is hard-wired to cypress-rwa (`eval/defects.js:7`; requirement ids in `triage-battery.js:22-24`; `run-eval.js:175`), so the Layer-1 "eval harness" is not app-agnostic.

**M6. The false-positive metric is LLM-defined and conflated.**
- `falsePositiveRate = defect / generated` (`report.js:80`), where `defect` means triage said `real_defect` on the "clean" app.
- Tests the LLM labels bad are quarantined and do not count as FPs, so the FP rate partly measures triage's willingness to blame the test.
- The metric assumes the clean app has zero defects. Yet `USERS-008-negative-003` (`reports-all/defects/…`) shows a 500 from `bcrypt.hashSync(undefined)` on a missing password, which is plausibly a real defect counted as an FP.
- Counts include duplicate ids (H2).

**M7. Testability gate gaps.**
- The gate uses single-shot `assess` (`orchestrator.js:44`; `sync-requirements.js:102`) although `assessStable` exists for exactly this (`assess.js:75-89`).
- The threshold is a self-declared placeholder (`config.js:54-57`).
- `TESTABILITY_WEIGHTS` parse errors are swallowed silently (`config.js:19-27`).
- There is no risk-tier routing, and clarifications never leave the local filesystem.

**M8. Experiment code and flags in production paths; configuration sprawl.**
- `AQE_GROUNDING`, `AQE_STRIP_APIHINTS` and `AQE_API_HINTS_MODE` are read directly from `process.env` inside the production adapter (`workflow-adapter.js:47-50,171-182`; `api-hints-policy.js:43-44`), bypassing `config.js`.
- `requirementsSource()` parses `process.argv` for `--out` and deletes `reports/clarifications` as a side effect (`workflow-adapter.js:131-137,179-180`).
- `node --test` in the gate also runs `experiments/stage10-oracle/*.test.js`.
- About 25 knobs are spread over `config.js`, the adapter, `verify.sh` and `tests-dir.js`.

**M9. Requirements are synthetic, so the oracle is circular.**
- The cypress-rwa "requirements" are mined line-by-line from the app's own passing Cypress API specs (`adapters/cypress-rwa/extract-requirements.js:1-27`).
- User stories are templated: "As a user of cypress-rwa, I want "<it() title>" …" (`unified-requirements.md:2361`). Acceptance criteria restate the spec's own `expect` lines.
- Generation is therefore largely reconstruction of existing tests. The architecture's binding constraint, human-written requirement quality (T2), is not exercised by the main loop. Only the synthetic testability battery exercises it, and that battery is contaminated (C1).

### Low

- **L1. Two adapter contracts collide.** Both use the member name `requirementsSource` with different semantics: a descriptor with `extract()` (`adapters/cypress-rwa/adapter.js:77-87`, `core/adapter/types.js:61`) versus `Promise<Requirement[]>` (`workflow/adapter/contract.js:28`; `workflow-adapter.js:217`).
- **L2. `scorecard.schema.json` is dead and stale.** It is never validated and would reject the emitted scorecard (`cost` is not allowed under `additionalProperties:false`).
- **L3. LLM client edge cases.** Timeouts (`AbortError`) are not retried despite the retry loop (`llm-client.js:72-74`). Non-retryable errors embed the full provider response text in exception messages (`llm-client.js:54,60`). The key itself is only sent in the `Authorization` header and never logged (`llm-client.js:38`).
- **L4. Secrets loading.** `verify.sh` does `source .env` (`verify.sh:10-15`), which executes `.env` as shell. Prefer a dotenv parser. `.env` is described as git-ignored, but no `.gitignore` is in the reviewed tree.
- **L5. Teardown and concurrency.** In `run-workflow.js:24-32`, teardown is not in `finally`, so a thrown run leaves the container up. Every `adapter.run()` does `docker rm -f` on a fixed container name (`docker/run.sh` `start`), so two concurrent runs clobber each other. There is no locking (the spec's `locked_by` is not implemented).
- **L6. Manifest drift.** `state/suite-manifest.json` lists empty `testIds` for 40 of 44 requirements, while `generated-tests/` holds files for BANK-ACCOUNTS-002/003/004.
- **L7. README inaccuracy.** It says "dependency-free ESM — no `npm install`", but `ajv` is required (`package.json`; `json.js:6`). The reviewed copy has no `node_modules`.
- **L8. Unit test gaps.** There are 29 test files and about 195 cases, concentrated in pure functions (`testability.test.js` alone has 27). Untested: `llm-client.js` (retry, repair, usage), `fault-injector.js`, `workflow-adapter.js`, `run-eval.js`, all of `ops/`, and the orchestrator's regenerate/quarantine/FLAKY path. `orchestrator.test.js` has 3 tests, all about the testability gate.

---

## 6. Engineering-quality summary

| Area | Assessment |
|---|---|
| Test coverage of core steps | Good for pure logic (testability, diff, prune, apply-sync, report, render, json, cost). Weak for the effectful core: the orchestrator retry and quarantine loop, the LLM client, adapters and eval. |
| Error handling | Per-requirement `try/catch` isolates failures (`orchestrator.js:42-93`). `testRunner` throws are converted to failed runs (`run-harness.js:18-24`). Gaps: no `finally` around fault injection or teardown, silent config fallbacks, and select aborts the whole batch on one bad requirement. |
| Idempotency | Reports are overwritten per run. Clarifications are rebuilt only when something was gated. Persisted tests accumulate stale variants (no prune in `run-workflow`) and collide on id. The sync manifest drifts. |
| Concurrency | Single-threaded and sequential, with no locks. A fixed container name means concurrent invocations interfere. |
| Logging and observability | stdout `console.log` only. No structured logs, run ids or LLM traces. |
| Determinism | Temperature 0 only. No seed, provider pin, prompt hash or persisted transcripts, and nondeterministic regeneration sits inside the "deterministic" run loop. |
| Config sprawl | About 25 env knobs across 4 locations. Experiment flags live in the production adapter. |
| Dead or experiment code in production paths | `experiments/` tests run in the gate. Graph-L1, strip and grounding arms are inside `workflow-adapter.js`. `scorecard.schema.json` is unused. Committed snapshots (`reports-all/`, `generated-tests-*`) mix with live outputs. |
| Code readability | High. Extensive rationale comments, small modules, injected effects in sync and release. |

---

## 7. What would most improve claim-to-code fidelity (ordered)

1. **Make the metrics valid.** Re-run both batteries with opaque ids and titles and a held-out set (C1). Freeze hints before blind defect authoring and include all defects in the denominator (C2). Get `verify.sh` green honestly and wire it into an actual CI job (C3).
2. **Move gate decisions out of the LLM.** The release gate should block on any deterministic FAIL of a baseline-green test; triage only annotates (H1). Quarantine FLAKY directly, and retry on `environment` (§2).
3. **Harden the suite.** Use deterministic, sanitised ids and check for collisions (H2, H3). Never persist unexecuted or failing tests as "durable" without a status field. Add provenance to each TestCase: model, prompt hash, requirement hash and timestamp.
4. **Enforce execution policy in code.** Allowlist each request's method and path against apiHints or the route table, block auth-header overrides, enforce same-origin, and reject unresolved placeholders and `:param` paths before running (H4, H5).
5. **Raise assertion strength in code.** Require at least one assertion per request and at least one value assertion per positive test, and add `if/then` schema rules such as `repro` being required for `real_defect` (H6, M2).
6. **Upgrade the boundary check.** Replace it with a real import-graph check (e.g. dependency-cruiser or an ESLint `no-restricted-imports` rule with patterns), scan all non-adapter directories, and move the actor vocabulary into the adapter (M1).
