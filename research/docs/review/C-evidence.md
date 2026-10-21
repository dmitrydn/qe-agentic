# C — Evidence Audit of Headline Metrics (static review)

Scope: static reading of the deck text, project docs and committed artifacts under `/home/claude/review`. Nothing was executed against the sandbox, Docker or an LLM. All recomputation is Python over committed report and scorecard files. Paths below are relative to `/home/claude/review/agentic-qe-sandbox/` unless they start with `../`. File times are mtimes in the tarball, in local time (UTC+3). The JSON `generatedAt` values are UTC.

## 0. Summary verdict table

| # | Claim (deck slide) | Stated value | Artifact found | Recomputed / 95% CI | Verdict |
|---|---|---|---|---|---|
| 1 | Defects caught, curated (s9) | 90%, 9/10 seeded | `reports/scorecard.json` → `catchRate: 0.9`, `defects[]` (12 entries, 2 `expectCaught:false`); `reports/eval-report.md` | 9/10, Wilson 59.6–98.2%. **9/12 = 75% (46.8–91.1%)** if the 2 "negative controls" (also real injected bugs) are counted. Single run, n=8 tests, 4 requirements. 4 of 9 catches are removed auth gates. 3 of 9 are asserted because the hand-written curated hint tells Generate to assert them (§2). | **Weakly supported** (true for this artifact, but the catalog was built with knowledge of the tests and the result does not generalise) |
| 2 | 0% FP curated vs 18% uncurated, "Proof of T2" (s7, s9) | 0% / 18% | `reports/scorecard.json` `falsePositiveRate: 0` (0/8); `reports-all/scorecard.json` `0.1818` (24/132) | 0/8 → CI 0–32.4% (upper bound is above 18%). Fisher p = **0.35**. **The same 4 "curated" requirements score 8/8 pass, 0 FP inside the uncurated run too** (reports-all and all 3 baseline sweeps). Curated hints apply in both modes. The gap comes from *which requirements* were run, not from where the hints came from. | **Contradicted** as a causal "curated vs uncurated hints" proof. Not significant. |
| 3 | Triage accuracy (s9) | 100%, 12/12 labelled | **No artifact.** `reports/triage-battery.json` is written by `eval/run-triage-battery.js:160` but is missing. The number appears only in prose (VERIFICATION.md:659–664, MAKE-THE-CASE, verify.sh comment). | 12/12 → CI 75.8–100%. First run was 11/12. The prompt was then changed and 2 fixture cases were rewritten until the score reached 12/12. | **Unsupported** (prose only; tuned on the test set) |
| 4 | ~$0.05 per curated run (s9) | ~$0.05 | `reports/ab/graph-l1/curated/scorecard.json` `cost.totalUsd: 0.049962` (4 generate calls, 0 triage, 0 assess) | This is the **graph-L1-flag** curated run of 06-30, not the headline 06-26 run. The headline scorecard has **no cost field**: it was generated 15:17Z, and `workflow/llm/cost.js` was created 15:40Z. Covers generate only, on an all-pass run, at configured list prices ($3/$15 per MTok), not billed amounts. A full 44-requirement sweep costs $3.91–4.09 (≈$0.093 per requirement, 7.4× the curated slice's $0.0125 per requirement). | **Weakly supported** (number exists; the label "per curated run" is misleading and the scope is narrow) |
| 5 | Testability battery (s8, s10) | 100% (16/16) | `reports/testability-battery.json` `accuracy: 1, correct: 16`; `.md` confusion matrix | CI 80.6–100%. **3 of the 8 "untestable" ground-truth labels were relabelled from needs_clarification to untestable after the gate produced them** (`eval/testability-battery.js:91,165,201`, comments "Relabeled…"; battery file mtime 21:08 falls between assess runs at 20:44 and 21:21). With the original labels: 13/16 = 81% (57–93%). | **Weakly supported / label leakage** |
| 6 | 20 testable / 17 clarify / 7 untestable across 44 (s8) | 20/17/7 | `reports/testability-report.md` (run 2026-06-27T18-57-01); counts verified 20/17/7; 24 clarification files = 17+7 | Third of 3 single runs with different settings (24/12/8 → 7/29/8 → 20/17/7, `reports/testability/history.md`). The prompt (D2) was re-tuned on these same 44. No ground truth. `BANK-TRANSFER-001`, a phantom endpoint (404), was rated **testable 1.00** with D4 = pass. | **Supported as a descriptive count. Unvalidated as accuracy** |
| 7 | Catch 100% (3/3) (PROGRESS stage 6, VERIFICATION §4/§10) | 3/3 | Superseded; overwritten artifact | 3/3 → CI 43.9–100% | **Contradicted / stale** (inconsistent with 9/10) |
| 8 | Uncurated: 38/44 covered, 132 tests, 28.8% quarantined | as stated | `reports-all/scorecard.json`, `report.md` | 132 rows contain 116 unique test ids. 16 rows are regeneration attempts counted as "generated", which inflates the FP denominator. FP over unique ids = 20.7%; over decisive (pass+defect) outcomes = 25.8%. | **Supported** (the metric definition is loose) |
| 9 | Grounding gate FP 15.4% → 12.2%, "below noise band" (PROGRESS s9, req-first-principles §8.2) | 15.4 → 12.2 | `reports/ab/baseline/run1/scorecard.json` (21/136); `reports/grounded/run1/scorecard.json` (15/123, **41** requirements) | Fisher p = 0.48 vs run1 and p = 0.17 vs the pooled baseline (72/404). Baseline run-to-run spread is 15.4/19.0/19.1% (SD 2.1 pts; the binomial SD of a single run is about 3.4 pts). **Like-for-like on the same 41 requirements, baseline run1 = 16/128 = 12.5%, essentially equal to grounded at 12.2%.** The whole drop comes from removing 3 requirements (5 defects / 8 tests) from the denominator. Detecting 15.4 vs 12.2 at 80% power needs about 1,800 tests per arm. Grounded n = 1 (runs 2–3 cancelled). | **Weakly supported** (the set-reduction effect is real; "signal not noise" is not shown) |
| 10 | True FP ≈ 2–3% ("~11 of 15 are real app bugs") | 2–3% | Prose only: `../docs/design/requirements-first-principles.md` §8.3. No adjudication artifact. | Their own buckets (3 brittle + 1 state) give 4/123 = **3.3%** (1.3–8.1%), or **4.8%** over decisive outcomes. The adjudication is the author reading the **triage agent's own rationales** (stated caveat §8.3). Several "real bugs" are invented oracles or harness artifacts (§5). | **Unsupported** (circular adjudication; some items contradicted) |
| 11 | Graphify A/B: "no FP reduction, coverage −1", "disproven" | 0.315 → 0.328; 8 → 7 | `reports/ab/baseline/run{1..3}`, `reports/ab/graph-l1/run{1..3}` report tables | Reproduced exactly: base 34/108, L1 38/116, Fisher p = 0.89. L1 run1 and run2 are byte-identical, so there are about 2 effective samples. The test detects only large effects. | **Supported as "no detectable benefit". "Disproven" overstated** |
| 12 | Stage 10: rich oracle **NEGATIVE** (FP 12.1 → 15.1%, catch 40 → 50%) | as stated | `reports/s10/analysis.json`, `decision-memo.md`, per-dose scorecards | N = 1 per dose, so the "noise band" is 0 and every delta gets called WORSE or BETTER. Pre-registered N = 5 (§6.1). FP is pre-adjudication; the blind worksheet `reports/s10/worksheet.md` is unfilled and its key sits next to it. Fisher FP p = 0.81, catch p = 1.0. The per-requirement sign test (9/9 discordant) gives p = 0.004, but rich produced 86 tests vs 58, so it had more chances to fail. | **Weakly supported / deviates from pre-registration** |

## 1. Tracing each headline number

| Number | File and field | Denominator | Selection procedure | Runs |
|---|---|---|---|---|
| 90% (9/10) | `reports/scorecard.json` `.catchRate`, `.defects[]`; `reports/eval-report.md` L3 | 10 catalog defects with `expectCaught!==false`, over 8 baseline-eligible tests | 4 requirements chosen because they had curated hints (`verify.sh` GATE_REQUIREMENTS). The catalog was authored only against those 4 requirements' endpoints. | One persisted run. VERIFICATION "Gate status" says it was "run twice… identical", but only one artifact is kept (overwritten). |
| 0% FP curated | `reports/scorecard.json` `.falsePositiveRate` = failed/generated = 0/8 | 8 tests | Same 4 requirements. VERIFICATION §3 claims "3 consecutive full runs… 5 gate runs", none of them retained. | 1 artifact |
| 18% uncurated | `reports-all/scorecard.json` `.falsePositiveRate` = 24/132 | 132 rows (116 unique ids), quarantined rows included | All 44 requirements. Note: generated 15:09Z, **before** the curated run (15:17Z). | 1 run. The A/B baselines (06-30) give 15.4/19.0/19.1%. |
| 100% triage | none (prose) | 12 cases: 4 live catalog defects, 2 hand-written bad tests, 6 synthetic | Hand-built by the same author. Prompt and fixtures edited after a miss. | Final run not persisted |
| ~$0.05 | `reports/ab/graph-l1/curated/scorecard.json` `.cost.totalUsd` 0.049962 | 4 generate calls | Curated slice under the graph-L1 flag | 1 |
| 16/16 | `reports/testability-battery.json` `.accuracy/.correct/.total` | 16 (2 real + 14 synthetic) | Hand-crafted. 3 labels changed to match model output. | 1 |
| 20/17/7 | `reports/testability-report.md` Summary | 44 | 3rd calibration run after prompt re-tuning | 1 per setting |
| 15.4% → 12.2% | `reports/ab/baseline/run1/scorecard.json`; `reports/grounded/run1/scorecard.json` | 136 vs 123 tests; **44 vs 41 requirements** | Baseline run1 is the *lowest* of 3 baselines | 1 vs 1 |
| ≈2–3% true FP | prose only | 123 | Author adjudication of LLM rationales | — |
| n=8 A/B | `reports/ab/*/run*/report.md` tables | 108 vs 116 tests on 8 requirements | The 8 requirements graph-L1 augments | 3 vs 3 (≈2 distinct) |

Prose-only numbers: 12/12 triage, 3/3 catch (artifact overwritten), "3 consecutive green runs" and "5 gate runs", "true FP ≈ 2–3%", "~11 real bugs".

## 2. Seeded-defect catalog (`adapters/cypress-rwa/fault-injector.js` `DEFECT_CATALOG`; `eval/defects.js` re-exports it)

| id | Mutation (find → replace) | Layer | Operator class | Caught by |
|---|---|---|---|---|
| payment-amount-cents | `amount * 100` → `amount` | business logic (database.ts) | arithmetic operator deletion | TX-007 positive (asserts `amount == 5000`, as the curated hint instructs) |
| payment-amount-rounding-shaved-cent | `*100` → `*100 - 1` | business logic | constant/arith perturbation | same test, same hint |
| receiver-balance-not-credited | comment out `creditPayAppBalance` | business logic | statement deletion | TX-007 positive (balance deltas, as the curated hint instructs) |
| auth-gate-post-transactions | drop `ensureAuthenticated` | route/middleware | middleware deletion | TX-007 auth test (hint: "must receive 401") |
| auth-gate-get-bankaccounts / -get-users / -get-transactions | drop `ensureAuthenticated` | route | middleware deletion (×3) | each requirement's auth test |
| bankaccounts-missing-userid-field | strip `userId` from list | response shape | field deletion | BANK-ACCOUNTS-001 TC-001 |
| users-results-not-array | `results: users` → `users[0]` | response shape | collection→element | USERS-001 TC-001 |
| transactions-pagination-off-by-one | `(page-1)*limit` → `page*limit` | util | off-by-one (ROR/AOR) | **missed** |
| bankaccounts-routingnumber-hardcoded (NC) | persist constant | persistence | constant replacement | not caught, excluded from denominator |
| users-self-not-excluded (NC) | drop `removeUserFromResults` | query filter / data-exposure | statement deletion | not caught, excluded from denominator |

Observations:

- **All 12 are single-line, hand-picked, mutation-style edits.** They cover only the 4 gated requirements' endpoints. 4 of 12 are the same operator (delete `ensureAuthenticated`), and any test with an anonymous 401 check catches all of them.
- **The author had the tests in view.** The negative-control descriptions say "no generated test calls POST /bankAccounts… no generated test asserts on result count". So the catalog author saw the generated tests and labelled the ones they knew would be missed as "expected not caught". Those are then excluded from the denominator. The NCs are real, injected bugs. Excluding them from "catch rate" is a design choice that makes the number go up (9/12 = 75% otherwise).
- **Ordering.** `fault-injector.js` mtime is 06-26 15:10 local. The eval suite in `generated-tests/` was regenerated at 18:17 local (15:17Z), after the catalog was frozen. That is good for the final run. But the catalog itself was designed with knowledge of an earlier generation from the same pipeline, and the hints did not change between the two.
- **Same author as the oracle.** `CURATED_API_HINTS["CYPRESS-RWA-TRANSACTIONS-007"]` (`adapters/cypress-rwa/workflow-adapter.js:65–105`) is hand-written. It says *"assert this exactly"* for `amount × 100`, *"capture both balances before and after and assert both deltas"*, and *"unauthenticated… must receive status 401"*. Those are the exact oracles for 4 of the 9 caught defects. So MAKE-THE-CASE's line "Nobody told it to check balances — it inferred that" is **contradicted by the code**.
- **Stage 10 strips all apiHints**, and catch then falls to **4/10 (40%)**, with only the auth gates caught (value/shape 0%). This is direct evidence that the 90% depends on the hint content.
- **Compared with mutation-testing practice.** Mutation testing generates mutants mechanically from a full operator set over the code under test. It reports a mutation score over all non-equivalent mutants, usually tens to hundreds per module. It deals with equivalent mutants explicitly, rather than labelling misses "expected". Here there are 12 hand-selected mutants with an author-defined denominator. A meaningful step up would be Stryker-style mutants over `backend/*.ts` scoped to the exercised routes.
- **Representativeness.** The catalog has no authorization (IDOR / ownership) defects. It has authentication-gate removal only, although Stage 10 rich triage actually surfaced IDOR-like findings. It has no concurrency or race defects, no transactional or data-integrity defects beyond one balance credit, and no integration or contract-drift defects across services. It has no performance defects, no input-validation regressions, no error-handling (500) defects, and no UI defects. Severity tags ("blatant / moderate / subtle") are author-assigned and informational.

## 3. Triage (12) and testability (16) batteries

**Triage (`eval/triage-battery.js`, mtime 06-26 15:21, 11 minutes after the catalog was frozen):**
- Who labelled: the same build agent/author that wrote the prompts. Single rater. No inter-rater reliability.
- Composition: 5 real_defect (4 are the curated-slice catalog defects, which are blatant by construction; 1 synthetic 500 with a stack trace), 4 bad-test (2 hand-written blatant errors such as "expects 201", 2 synthetic), and 3 environment cases (ECONNREFUSED / 504 nginx / DNS). These are textbook-separable cases.
- **Tuning on the test set** (VERIFICATION 631–664). The first run scored 11/12. The prompt was changed (apiHints added to triage). That flipped a synthetic case, which was then judged a "flaw in the battery fixture" and **rewritten**, together with a second case. The final score was 12/12. No held-out set. **No persisted result file.**
- **Transfer evidence against it:** across live runs, every defect report is "Confidence: high" (15/15 in grounded run1). Triage labelled harness artifacts as `real_defect`, for example unsubstituted path parameters (`'{8NnQy36xaMtB}'`, `':notificationId'`) in s10 rich and in grounded run1 NOTIFICATIONS-004-002. One rationale contradicts itself (s10 TRANSACTIONS-002-TC1).

**Testability (`eval/testability-battery.js`, mtime 06-27 21:08; assess runs 20:44, 21:21, 21:57; battery report 21:46):**
- 2 real "good" requirements plus 14 synthetic weak ones written by the same author as the rubric and prompt.
- **3 of 16 labels were changed to agree with the gate** (epic-payments-module, ambiguous-fast-export, contradiction-conflicting-status: needs_clarification → untestable). The comment at line 91 even says "Flip back if you decide…". The original label distribution would have been 5/6/5, not 5/3/8. Accuracy against the original labels is 13/16 = 81%.
- The 20/17/7 distribution comes after re-tuning the D2 prompt *on the same 44* ("moved Phase-A from 7 → 20 testable"). There is no ground truth for the 44. The gate passed BANK-TRANSFER-001 (phantom endpoint) as testable 1.00.

## 4. A/B experiments, noise floor, and CIs

Per-arm reconstruction from the `report.md` outcome tables. The base-1..3 / l1-1..3 `generated-tests*` directories are **not present**; only `generated-tests/`, `-ab-l1-curated`, and `-grounded-1` exist.

| run | rows | unique ids | pass | defect | quar | FP | cost $ |
|---|---|---|---|---|---|---|---|
| uncurated 06-26 | 132 | 116 | 70 | 24 | 38 | 18.2% | n/a |
| baseline run1 | 136 | 115 | 72 | 21 | 43 | 15.4% | 4.08 |
| baseline run2 | 137 | 117 | 70 | 26 | 41 | 19.0% | 4.09 |
| baseline run3 | 131 | 111 | 66 | 25 | 40 | 19.1% | 3.91 |
| grounded run1 (41 req) | 123 | 105 | 69 | 15 | 39 | 12.2% | 3.84 |
| graph-L1 run1/2/3 (8 req) | 39/39/38 | 36/36/35 | 19/19/20 | 13/13/12 | 7/7/6 | 33/33/32% | 0.95/1.01/0.90 |

**Noise floor across the 3 baseline sweeps:**
- Test-id Jaccard is 0.80–0.87.
- Status agreement on shared ids is 97–100%. Ids are generic (`positive-001`), so id overlap does not show the same test content.
- Generated count per requirement differs across runs for 12/44 requirements, and defect count differs for 4/44 (USERS-009 alone swings 1/5/4).
- Coverage flipped for 1 requirement.
- FP: mean 17.8%, SD 2.1 pts.

**Graphify, 8 augmented requirements** (reproduces the memo exactly). Baseline P/D/Q summed: USERS-008 7/18/0 vs 6/18/0. USERS-008 has 6 defects in **every** run of both arms and accounts for 18 of the 34 baseline defects. TRANSACTIONS-010 goes from 3/3/3 to 0/0/6. The aggregate 34/108 vs 38/116 gives p = 0.89. Within-arm swing in baseline USERS-009 (1–5 defects) is as large as the between-arm differences. Verdict: no detectable benefit, which supports NO-GO. With about 2 effective L1 samples, "disproven" is too strong.

**Grounding:** see table row 9. On the same 41 requirements the baselines are 12.5 / 16.3 / 16.3%, and grounded is 12.2%. The improvement equals removing the 3 phantom-endpoint requirements.

**Stage 10 (24-requirement slice):** sparse 58 tests / 7 defects / catch 4/10; rich 86 / 13 / 5/10. Rich costs $1.74 vs $0.46. N = 1 against a pre-registered N = 5. The adjudicated FP that was pre-registered as primary was not produced.

**CIs and tests (Wilson 95%, Fisher two-sided):**
- 9/10: 59.6–98.2
- 0/8: 0–32.4
- 24/132: 12.5–25.6
- 12/12: 75.8–100
- 16/16: 80.6–100
- 15/123: 7.5–19.1
- 21/136: 10.3–22.5
- 3/123: 0.8–6.9
- 4/123: 1.3–8.1
- 0/8 vs 24/132: p = 0.35
- 21/136 vs 15/123: p = 0.48
- 34/108 vs 38/116: p = 0.89
- s10 FP 7/58 vs 13/86: p = 0.81

## 5. The "true FP ≈ 2–3%" reframe

- **Who and how:** the author, reading "the triage agent's defect rationales" (§8.3 caveat). This uses the system's own classifier to validate itself. There is no second rater, no rubric artifact, no per-item table and no reproduction against the app's source or its own Cypress suite.
- **Cases that do not survive scrutiny:**
  - `BANK-ACCOUNTS-002-negative-001` (non-existent id → expects 404, gets 200). The requirement (unified-requirements.md:2052–2063) says nothing about non-existent ids. The generator invented this REST-convention oracle, so it is an opinion, not a specification violation.
  - `CONTACTS-001` ×3 "500 crash". The generated tests use `pathTemplate: "/contacts/:username"`, and `buildPath` (`adapters/cypress-rwa/test-runner.js:160–172`) substitutes only `{param}` and `{{capture}}`. Express-style `:param` is sent literally, so the app looks up the user ":username", which matches the observed `getUserId` TypeError. 33 of 105 grounded test files use `:param` templates. Of their positive variants, nearly all are quarantined or `defect`. The current runner's mtime (07-21) is after the run, so the run-time version cannot be confirmed statically, but no `:param` handling exists in any shipped version.
  - `USERS-004-negative-001` also uses a `:username` template.
  - "Missing validation" items (USERS-010 invalid email, BANK-ACCOUNTS-003 empty account number, CONTACTS-003) are disagreements between a requirement-derived oracle and an app that the app's own Cypress tests accept. Whether those count as bugs is exactly the "oracle authority" question the doc says is unresolved.
- **Arithmetic:** the doc's own buckets give 3 + 1 = 4 genuine FPs, so 3.3%, not "2–3%". Quarantined tests (39, 31.7%) are excluded from the FP numerator, but many are bad tests by the doc's own account (VERIFICATION Workstream C). VERIFICATION states that a clean-run FAIL "means the generated test itself… was wrong". The reframe reverses that definition after the fact.
- **Defensibility:** relabelling FPs as findings after the fact, by the person who benefits from the relabel, is not defensible as a headline. A defensible version needs:
  - a frozen rubric written before adjudication;
  - two independent human raters, blind to arm and hypothesis, with Cohen's κ reported;
  - reproduction of each "real bug" by a hand-written request or a failing assertion added to the app's own Cypress API suite, plus a source-line root cause;
  - the harness-artifact class (unsubstituted params, invented oracles) separated out;
  - reporting both the raw FP and the adjudicated FP, with CIs.

## 6. Consistency across documents

| Metric | Values seen | Where |
|---|---|---|
| Catch rate | 100% (3/3); 90% (9/10); 40% / 50% (hints stripped) | VERIFICATION §4/§10 and PROGRESS stage-6 row ("catch 100% (3/3)"); deck, PROGRESS "headline", eval-report; s10 scorecards |
| Gate status | "gate green, exits 0" vs "currently FAILS at step 5" | PROGRESS row 6 and VERIFICATION §10 vs PROGRESS row 6b, VERIFICATION "Gate status", MAKE-THE-CASE. The deck says "Measured, not asserted" and does not mention the red gate. |
| Unit tests | 47/47 vs 148 | PROGRESS row 6 vs PROGRESS row 8 / req-first-principles §8.2 |
| Curated vs uncurated | "No curated hints" in Run B | MAKE-THE-CASE. Contradicted: `CURATED_API_HINTS` applies in `--all`, and since Workstream A only TX-007 is curated in either mode. "the same fix that took the curated slice to 0%" is also wrong, because those 4 requirements are 0% FP in the uncurated runs too. |
| "Nobody told it to check balances" | — | MAKE-THE-CASE step 2, contradicted by the curated hint text |
| FP 18% | 18% (deck) / 18.2% / 15.4–19.1% band / 12.2% / "true 2–3%" | deck s7/s9 vs PROGRESS Stages 8–9 |
| Lever | "API hints are the lever" (deck s7); "richer auto-extracted API hints… the main remaining limitation" (PROGRESS 6b) | vs Stage 8 (richer code-derived hints: no effect), Stage 9 ("lever is requirement fidelity, not code knowledge"), Stage 10 (richer oracles: NEGATIVE on FP). Deck v2 ("June 2026") already quotes the 06-30 $0.05 artifact but does not reflect the 06-30 Stage 8/9 conclusions or Stage 10 (07-21). |
| Model | sonnet-4.5 in all 12 scorecards and config default | PROGRESS: "not the 4.6 originally pinned". The artifacts are consistent. The originally pinned 4.6 appears only in prose. |
| Testability "calibrated" | 16/16 | Labels were relabelled to fit (§3) |
| Defect catalog | "12-defect catalog incl. 2 negative controls" | consistent in counts, but "catch rate" excludes 2 of the 12 |
| A/B artifacts | memo cites base-1..3 / l1-1..3 tests | `generated-tests-*` directories for those arms are absent. Defect dirs disagree with scorecards (graph-l1 run1: 14 files vs 13 failed; baseline run3: 24 vs 25). |
| `../agentic-qe-sandbox/MAKE-THE-CASE.md` | referenced by PROGRESS | does not exist; only `../MAKE-THE-CASE.md` |

## 7. Cost claim

- **Mechanism:** `workflow/llm/llm-client.js:97–110` records tokens for every completed call, including JSON/schema repair retries. Failed HTTP attempts are not recorded, which is fine because they are likely unbilled. `workflow/llm/cost.js` multiplies by `config.llmInputUsdPerMTok` / `llmOutputUsdPerMTok`, which default to 3 and 15 in `workflow/config.js:48–49`. These are configured list prices, not OpenRouter billed cost.
- **What $0.05 includes:** 4 generate calls only. That run had no triage (all passed), no assess (gate off), and no placeholder-repair retries. The eval replay and the triage battery are not included.
- **What it excludes:** the testability assess pass ($0.18 for the battery, $0.51–0.54 per 44-requirement assess), triage on failures (≈30% of sweep cost: $1.24–1.31 of ≈$4.0), Docker/compute, the iterative development runs (≥5 gate runs, battery iterations, 3+3+1+2 sweeps ≈ $25+ visible in artifacts), and all **human** time: review of tests, adjudication of "real bugs" and catalog authoring. Human time is the dominant term in slide 9's own value equation ("cost to create, review, run, maintain").
- **Scale:** $0.0125 per requirement on the curated 4, about $0.093 per requirement on full sweeps, and about $0.072 per requirement for the s10 rich dose.
- **Value equation:** the P(catch real defect) term is supported only by 9/10 seeded defects on 4 hint-assisted requirements. Defect cost and review/maintenance cost are not measured, so the equation still has no real numbers except the LLM line item.

## 8. Python used (abridged)

```python
# Wilson CI
def wilson(k,n,z=1.959964):
    p=k/n; d=1+z*z/n; c=(p+z*z/(2*n))/d; h=z*sqrt(p*(1-p)/n+z*z/(4*n*n))/d
    return max(0,c-h), min(1,c+h)
# Parse per-test outcome tables from report.md
rows=[re.match(r'\| (CYPRESS\S+) \| (CYPRESS\S+) \| (\w+) \|',l).groups() for l in open(p) if l.startswith('| CYPRESS')]
# Curated-4 inside uncurated runs; baseline restricted to 41 grounded reqs; per-req A/B sums
CUR={'...TRANSACTIONS-007','...TRANSACTIONS-001','...USERS-001','...BANK-ACCOUNTS-001'}
sub=[x for x in rows if x[1] in CUR]            # -> 8 rows, all 'pass', in every uncurated sweep
G={'...BANK-TRANSFER-001','...NOTIFICATIONS-002','...BANK-ACCOUNTS-004'}
base41=[x for x in base1 if x[1] not in G]      # -> 16/128 = 12.5%
fisher_exact([[21,115],[15,108]])               # p=0.477
binomtest(9,9,0.5)                              # s10 sign test p=0.0039
# Colon-param templates in grounded tests
any(re.search(r'/:\w+', r['pathTemplate']) for r in tc['requests'])   # 33/105 files
```

## 9. What would make these numbers defensible

1. Persist every run's scorecard, including the triage battery, under run-id directories. Report mean ± SD over at least 5 runs for each headline.
2. Split the catch-rate evidence into three parts: auth-gate removals, hint-prescribed oracles, and unprompted catches. Add mechanically generated mutants and keep negative controls in a reported score.
3. Use held-out batteries authored by a second person, with labels frozen and hashed before any model run. Report κ.
4. Re-state "0% vs 18%" as a requirement-selection effect, or run a true ablation: the same 44 requirements with curated hints on and off.
5. Fix the runner's `:param` substitution, then re-run before any FP adjudication. Adjudicate with two blind humans and reproduction.
6. Report cost per requirement for a full sweep, including assess and triage, with billed amounts. Track the human review minutes the value equation needs.
