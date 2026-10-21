# A — Assumption Ledger and First-Principles Audit: Agentic QE Architecture (deck v2, June 2026)

Static review only. Nothing was executed except a local Python script to compute confidence intervals. Paths are relative to `/home/claude/review/`. Quotes are verbatim, 15 words or fewer.

**Verdict in one paragraph.** The deck's architecture rationale (slides 2–5) is mostly sound, conventional QE thinking. The empirical half (slides 7–11) does not survive its own evidence. The project's own records already falsify or weaken the four headline numbers (90% catch, 0% vs 18% FP as "Proof of T2", 100% triage, 16/16 testability). Every one of them was produced on builder-authored, post-hoc-adjusted, small-n instruments. Two were produced on instruments whose ground truth was edited after seeing the model's output. The single pre-registered, controlled test of an "input quality → output quality" lever (Stage 10, July 2026) returned **NEGATIVE** on false positives, and the deck never mentions it. Its "DONE" claims contradict the project's own definition of done, which `./verify.sh` fails.

---

## 0. Statistical recomputation (95% Wilson intervals, computed for this review)

| Claim (source) | k/n | Point | 95% Wilson CI | Comment |
|---|---|---|---|---|
| Defect catch, curated slice (deck s9; VERIFICATION WS-B) | 9/10 | 90.0% | **59.6–98.2%** | Lower bound is below the gate's own `MIN_CATCH_RATE=0.8` |
| Negative controls uncaught | 2/2 | 100% | 34.2–100% | Uninformative by construction (see L-21) |
| Stage-6 catch | 3/3 | 100% | 43.9–100% | |
| Triage battery, final | 12/12 | 100% | **75.8–100%** | After prompt change plus fixture edits on the same battery |
| Triage battery, first run | 11/12 | 91.7% | 64.6–98.5% | The only pre-tuning measurement |
| Triage, real_defect class only | 5/5 | 100% | 56.6–100% | |
| Testability battery (deck s8) | 16/16 | 100% | **80.6–100%** | 2 labels changed to match gate output; 14/16 synthetic |
| Testability battery, real cases only | 2/2 | 100% | 34.2–100% | |
| Curated FP, tests (deck s7/s9 "0%") | 0/8 | 0% | **0–32.4%** | |
| Curated FP, requirements | 0/4 | 0% | 0–49.0% | |
| Uncurated FP, deck denominator | 24/132 | 18.2% | 12.5–25.6% | Denominator includes 38 quarantined tests |
| Uncurated FP, per build-prompt definition ("excluding quarantined") | 24/94 | **25.5%** | 17.8–35.2% | The deck understates its own metric |
| Uncurated quarantine | 38/132 | 28.8% | 21.8–37.0% | |
| Uncurated coverage | 38/44 | 86.4% | 73.3–93.6% | |
| Baseline run1 FP | 21/136 | 15.4% | 10.3–22.5% | Excluding quarantined: 21/93 = 22.6% |
| Grounded run1 FP | 15/123 | 12.2% | 7.5–19.1% | Excluding quarantined: 15/84 = 17.9% |
| "True FP ≈ 2–3%" | 3/123 | 2.4% | 0.8–6.9% | 3/84 = 3.6% (1.2–10.0%) under the build-prompt definition; adjudication not independent |
| "~11 of 15 are real defects" | 11/15 | 73.3% | 48.0–89.1% | Self-adjudicated from LLM rationales |
| Graph A/B baseline vs graph-L1 FP | 34/108 vs 38/116 | 31.5% vs 32.8% | 23.5–40.7 vs 24.9–41.7 | |
| Stage 10 FP sparse vs rich | 7/58 vs 13/86 | 12.1% vs 15.1% | 6.0–22.9 vs 9.1–24.2 | |
| Stage 10 catch sparse vs rich | 4/10 vs 5/10 | 40% vs 50% | 16.8–68.7 vs 23.7–76.3 | |
| Testability Phase-A "testable" | 20/44 | 45.5% | 31.7–59.9% | After prompt tuning on these same 44 (7/44 before) |

**Differences (Newcombe hybrid score CI; Fisher exact two-sided):**

| Comparison | Δ | 95% CI | Fisher p |
|---|---|---|---|
| "Proof of T2": uncurated 24/132 vs curated 0/8 | +18.2 pt | **−14.7 to +25.6** | **0.35** (0.19 using the excl-quarantine denominator) |
| Grounding: baseline 21/136 vs grounded 15/123 ("below noise band") | +3.2 pt | **−5.4 to +11.7** | **0.48** |
| Stage 10 FP: rich vs sparse | +3.0 pt | −9.3 to +14.0 | n/a |
| Graph-L1 vs baseline FP | +1.3 pt | −10.9 to +13.3 | n/a |
| Stage 10 catch: rich vs sparse | +10 pt | −29 to +45 | n/a |

Two of the deck's headline claims rest on these differences: the "0% vs 18%" Proof of T2 and the grounding "win". **Neither is statistically distinguishable from zero**, even before accounting for confounding.

---

## 1. Assumption ledger

Verdicts: **PROVEN** means independent evidence with an adequate sample. **PARTIALLY PROVEN**, **UNPROVEN** (asserted, no evidence) and **CONTRADICTED** (the project's own evidence or logic contradicts it) follow the brief.

### 1a. First principles T1–T9 (deck slide 4; Proposal §2, lines 91–134)

| ID | Claim | Where | Type | Verdict | Evidence (path · locus · quote) | Reasoning |
|---|---|---|---|---|---|---|
| T1 | Knowing the right answer is the hard part; intent must be written, not guessed | Deck s4 l.58; Proposal l.91–94 | First principle | **PARTIALLY PROVEN (overstated)** | `docs/design/requirements-first-principles.md` §8.3 l.320: "a 500 or missing auth is never acceptable" | The oracle problem is real and well established. "Must be written" is false as an absolute. The project's own most-touted findings (500 crashes, unauthenticated mutation) came from implicit and generic oracles that no requirement wrote down. The project's own T3 (req-first-principles l.43–44) also lists "a prior version" as an oracle source. |
| T2 | Output quality is capped by input quality; no technique recovers missing information | Deck s2 l.25–26, s4; Proposal l.96–99 | First principle (de facto empirical) | **CONTRADICTED as stated; unfalsifiable as framed** | req-first-principles l.328–333: "true false-positive rate is ~3/123 ≈ 2–3%"; `reports/s10/decision-memo.md` l.6: "Verdict: NEGATIVE" | "Capped" has no operational definition, so nothing can falsify it. In letter: the uncurated, poorer input produced *more* real-defect findings (by the project's own reclassification) via LLM-supplied REST conventions that were not in the input. The only controlled dose test of input richness found rich input *worse* on FP. |
| T3 | Generating is cheap; reviewing, running and maintaining are not | Deck s4; Proposal l.101–104 | Empirical/economic claim presented as an axiom | **UNPROVEN (half-measured)** | `reports/ab/baseline/run1/report.md` l.13: "Total: $4.0784 over 337 LLM call(s)"; no review-time data anywhere | Generation cost is measured: ~$0.09/requirement uncurated, ~$0.07 Stage 10 rich, plus up to 3 regeneration attempts. Review, run and maintenance cost is never measured. This is half of the claim and the half that matters. |
| T4 | A test's value is economic: P(catch) × cost − cost to create/review/run/maintain | Deck s4, s9 l.256 | Normative definition | **UNPROVEN (never instantiated)** | Deck s9 l.256: "We track cost per run so the equation has real numbers" | Only one of the five terms (LLM token cost) is measured. P(catches a *real* defect) is unknown because seeded ≠ real. Defect cost, review cost and maintenance cost are absent. The equation also ignores compliance/audit-evidence value, which is first-order in "regulated SAP". |
| T5 | Prompts are requests, not enforcement | Deck s4; Proposal l.112–114 | First principle | **PROVEN (by the project's own incidents) but violated by the implementation** | VERIFICATION.md §7 l.283–286: "twice emitted a non-conformant placeholder … despite the system prompt" | Consistent with the observed failures. However, the FP gate's verdicts *are* LLM triage outputs, the testability verdict is a function of LLM ratings, and the triage "grounding rule" is prompt text (`workflow/prompts/triage.system.md`). Guarantees therefore still live in model judgment. |
| T6 | Agents have no memory; traceability lives in a database | Deck s4 l.67; Proposal l.116–118 | First half fact, second half design decision | **PARTIALLY PROVEN / non sequitur** | Deck s10 l.291: "(files, not yet a DB)" | Statelessness is true. "Therefore a database" does not follow: Git plus files is equally deterministic, and the project's own System Spec v1.1 (l.13) moves requirements and tests *to Git*. Calling this a "fact" is a design decision dressed as an axiom. |
| T7 | Use ordinary software wherever it suffices | Deck s4; Proposal l.120–123 | Engineering heuristic | **PARTIALLY PROVEN** | VERIFICATION §7 (placeholder scanner); grounding gate; `reports/testability-report.md` BANK-TRANSFER-001 row | A sound heuristic, and the deterministic grounding gate caught the phantom endpoint that the LLM-rated D4 passed ("testable 1.00, + + + + + +"). It is a heuristic, not a first principle. |
| T8 | A feedback loop is real only if outcomes are measured | Deck s4; Proposal l.125–128 | First principle | **PROVEN as logic; UNMET in implementation** | Proposal l.52: "Escaped defect … ultimate outcome measure" | No escaped-defect data exists, and none can on a demo app. The "measured outcomes" are seeded mutations and LLM labels, which are proxies (see T4 and L-20). |
| T9 | Humans stay in the loop for regulated work | Deck s4; Proposal l.130–134 | Policy/regulatory constraint, not a fact | **UNPROVEN in practice (not implemented)** | Deck s10 l.294: "Not yet — by design: human-review queue (Layer 3 · T9)" | A constraint, not a truth. The implemented loop has zero human steps. Every "accuracy" number was produced without the human gate the architecture says is mandatory. |

### 1b. Deck-level claims

| ID | Claim | Where | Type | Verdict | Evidence | Reasoning |
|---|---|---|---|---|---|---|
| L-01 | Problem: requirements outrun tests; manual design uneven; escaped defects costly in regulated SAP | Deck s2 l.17–22 | Empirical problem statement | **UNPROVEN** | Proposal l.384: Phase 0 "Baseline today's manual effort and escaped-defect rate" | No baseline of current throughput, unevenness or escaped-defect cost exists in any input. Phase 0, which was meant to produce it, was never done. Plausible, but asserted. |
| L-02 | "No generation technique recovers missing information" (s2) | Deck s2 l.26 | Restated T2 | **CONTRADICTED** | See T2; `reports/s10/worksheet.md` rows: REST-convention 404/403 expectations not in requirement | The LLM routinely injected information not present in the input (conventions, negative cases). Sometimes this was right (500s) and sometimes wrong (×100 rule). |
| L-03 | Outcome 1: every change verified to an explicit, auditable confidence level | Deck s3 l.45 | Design goal | **UNPROVEN, no mechanism** | No confidence model in any spec or in code | No "level of confidence" is defined, computed or reported per requirement. The scorecard has FP, catch and coverage only. N=3 flake guard: a test that fails 10% of the time is classified PASS 72.9% of the time (0.9³). |
| L-04 | Outcome 2: human attention only where judgment is required | Deck s3 l.46 | Design goal | **UNPROVEN** | Deck s10 l.294 (review queue not built) | Untestable without a review queue. Not measured. |
| L-05 | Outcome 3: cost of one more requirement → cost of reviewing it | Deck s3 l.34, 47 | Economic hypothesis | **UNPROVEN** | Proposal l.50 (acceptance rate = primary measure) vs no acceptance data anywhere | Review cost is never measured. The 28.8% quarantine rate and the 17/44 needs-clarification rate imply rework *before* review, which is unpriced. |
| L-06 | Three layers / three AI roles derived from the work | Deck s5; Proposal l.179–236 | Design decision | **UNPROVEN; implementation diverges** | `docs/build-prompts/stage6-build-prompt.md` l.46: "GENERATE (agent): emit executable API test(s)" | Generate merges Analyst–Designer and Implementation. The proposal's own A13 says that merge is "Unproven" and must be tested in the pilot. Slide 10 maps Generate to Analyst–Designer only and leaves Implementation unmapped. The number of roles (3) is not entailed by T1–T9. |
| L-07 | Platform = ordinary software (no AI) | Deck s5 l.114 | Design decision | **CONTRADICTED by the implementation** | `workflow/steps/triage.js` feeds the FP metric; testability verdict depends on `assess.js` LLM ratings | Platform gates (FP threshold, testability) consume LLM classifications as inputs. A deterministic function of an LLM label is not "no AI". |
| L-08 | "API hints are the lever" | Deck s7 l.156, 163 | Empirical claim | **CONTRADICTED** | `docs/design/graphify-decision-memo.md` §12 l.364: "did not reduce false positives"; req-first-principles §8.2 l.291–293: "~3-point fidelity cleanup" | The project's own hint-enrichment experiment (graph-L1) failed. Grounding of hints moved FP 3.2 pt (CI −5.4 to +11.7). Stage 9 relocates the lever to "requirement fidelity / oracle authority", and Stage 10 then found richer oracles NEGATIVE on FP. |
| L-09 | "Proof of T2: 0% FP on curated hints vs 18% uncurated" | Deck s7 l.183; testability-gate.md l.15 | Empirical claim | **CONTRADICTED (confounded, under-powered, and mislabelled)** | VERIFICATION l.415: "`CURATED_API_HINTS` shrunk from 4 entries to 1"; `reports-all/report.md`: all 8 slice tests "pass" in the uncurated run too | (a) After Workstream A, 3 of the 4 "curated" requirements run on *auto-extracted* hints, so the label is false. (b) The same 4 requirements had 0 FP inside the uncurated run, so the 0 vs 18 gap is entirely *requirement selection* (4 hand-picked vs 40 others), not hint type. (c) p = 0.35. (d) By the project's own Stage 9 reclassification, most of the "18%" are real defects, not bad output. |
| L-10 | Testability gate "built & calibrated" | Deck s8 l.191 | Empirical claim | **PARTIALLY PROVEN (built); calibration circular** | testability-gate.md l.224: "moved Phase-A from 7 → 20 testable"; `eval/testability-battery.js` l.91: "Relabeled needs_clarification -> untestable" | The prompt was tuned on the same 44 requirements it was then "calibrated" on. Battery ground truth was changed to match the gate's output. No held-out set. Single run (`TESTABILITY_RUNS=1`). |
| L-11 | Battery 100% (16/16) | Deck s8 l.221; s10 l.277 | Empirical | **CONTRADICTED as evidence of accuracy** | `eval/testability-battery.js` l.91–96, l.165–168 (two relabels: "The gate's `untestable` is the correct call") | The labels were edited to agree with predictions, and 14/16 cases are synthetic, written by the builder. CI 80.6–100% is computed on a self-fitted battery and is meaningless. |
| L-12 | "Enforces T1 & T2 in software: no oracle (D1) or no interface (D4) → untestable" | Deck s8 l.226 | Design claim | **CONTRADICTED** | `reports/testability-report.md`: "CYPRESS-RWA-BANK-TRANSFER-001 \| testable \| 1.00 \| + + + + + +"; testability-gate.md l.216: "`TESTABILITY_GATE=off`" | D1 and D4 are *LLM ratings*. D4 passed the canonical phantom endpoint (`GET /bankTransfer`, FP 1.0) that the deterministic grounding gate later caught. The gate is off by default. "In software" means a threshold over model opinion. |
| L-13 | 20 testable / 17 clarify / 7 untestable across the 44 | Deck s8 l.221 | Empirical | **UNPROVEN as a quality measurement** | testability-gate.md l.212: "the 44 are mostly decent" | Single-run labels from one LLM with no human agreement check. They contradict the doc's own prior that the 44 are "mostly decent" (24/44 not testable). They were never correlated with downstream FP, which is the only validation that would matter. The gate would also have blocked `BANK-ACCOUNTS-006` ("untestable", D1+D4), the source of the touted unauthenticated-GraphQL "real defect". |
| L-14 | 90% defects caught (9/10 seeded, curated) | Deck s9 l.240, 248 | Empirical | **PARTIALLY PROVEN on a circular instrument** | `docs/build-prompts/stage6-hardening-prompt.md` l.49–51: "so every generated test's fault-detection power is exercised"; `reports/eval-report.md` | The catalog was authored *after* seeing the 8 generated tests, specifically to target what they assert. 4/10 are auth-gate removals. 4 of the 9 catches come from one test (`TRANSACTIONS-007-positive-001`) built on the one remaining hand-curated hint. Without hints (Stage 10) catch fell to 4/10–5/10, and both blatant payment defects were missed. CI 59.6–98.2%. |
| L-15 | 0% false positives (curated) | Deck s9 l.241, 249 | Empirical | **PARTIALLY PROVEN, n too small** | `reports/report.md`: "8 generated, 8 passed" | 0/8 tests, upper bound 32.4%. The FP metric is itself an LLM-triage output (see L-20). |
| L-16 | 100% triage accuracy (12/12 labelled) | Deck s9 l.242, 250 | Empirical | **CONTRADICTED by field evidence; battery self-fitted** | VERIFICATION l.649–657: "the fix flipped one of my own *synthetic* cases … fixed by giving that case … a complete … body"; `reports/s10/worksheet.md` l.32: ×100 amount labelled defect "Confidence: high" | Prompt changed after the battery miss, then re-scored on the same battery (train = test). Two fixtures edited after disagreement. 6/12 synthetic. In Stage 10, triage labelled the app's *correct* ×100 cents behaviour a high-confidence real defect, and labelled the runner's own unsubstituted `{J5Fd3dlBEBu}` path-template bug an app defect (worksheet rows COMMENTS-002-negative-001, NOTIFICATIONS-004-TC3). |
| L-17 | ~$0.05 per curated run, "now auto-tracked" | Deck s9 l.243, 251 | Empirical | **CONTRADICTED / cherry-picked** | `reports/ab/graph-l1/curated/report.md` l.13: "Total: $0.0500 over 4 LLM call(s)"; `reports/report.md` (the headline curated run) has no cost section | The figure comes from a graph-L1 arm run on an all-pass slice (4 generate calls, 0 triage, 0 regenerations). Realistic per-run figures in the same repo: $3.84–$4.09 (44 requirements) and $1.74 (Stage 10 rich, 24 requirements). It excludes testability assess (~$0.51/run), eval, and all human time. |
| L-18 | Honest caveat: "full breadth trades accuracy for coverage" | Deck s9 l.255 | Framing | **CONTRADICTED by later evidence the deck omits** | MAKE-THE-CASE l.123–127: "this '18.2%' reading was tested and substantially revised" | The deck's caveat predates and ignores Stage 9 (FP metric conflates real defects) and Stage 10 (NEGATIVE). |
| L-19 | "Every piece traces to the proposal" | Deck s10 l.262 | Governance claim | **CONTRADICTED** | Proposal l.47–48: golden set = "real requirements together with test suites designed by our best engineers"; Proposal l.385: Phase 1 platform "Deliberately no AI in this phase" | "Scorecard + seeded defects" is not a golden set. The proposal's primary metric (acceptance rate, l.50) is absent. Review queue and traceability store were Phase 1, *before* AI. |
| L-20 | Scorecard measures FP objectively | Deck s6 l.147, s10 l.283 | Implicit | **CONTRADICTED** | graphify memo l.354–355: "'False positive' = a test triaged as a `defect` against the known-clean app"; req-first-principles l.330–332: "the 'FP' number cannot separate 'bad test' from 'real bug'" | FP is defined as "LLM triage says real_defect on an app assumed clean". The app is not clean (the project's own finding), so the metric has no ground truth. Every decision taken on it is suspect: graph NO-GO, grounding GO, the Stage 10 verdict, the curated vs uncurated "proof". |
| L-21 | Negative controls make the catch rate "a real measurement" | MAKE-THE-CASE l.95–97; VERIFICATION l.504–510 | Methodological claim | **CONTRADICTED** | `agentic-qe-sandbox/verify.sh` l.109–111: "an unexpectedly-caught one is reported … but also not a failure" | Controls were selected *because* no test touches them ("no generated test calls `POST /bankAccounts`"). They cannot fail in either direction, so they constrain nothing. |
| L-22 | Roadmap: Measurement / Platform core / Agent / Operate the suite all "DONE" | Deck s11 l.305–319 | Status claim | **CONTRADICTED** | VERIFICATION l.700: "`./verify.sh` currently FAILS at step 5"; stage6-build-prompt l.136: "DONE only when `./verify.sh` exits 0"; `docs/design/sdlc-flows.md` l.3: "Design sketch. Not yet built." | By the project's own definition of done, Measurement is not done. "Operate the suite" has code in `ops/` but no verification record in VERIFICATION or PROGRESS. Its design doc still says unbuilt. |
| L-23 | "Build order matches the proposal" | Deck s11 l.300 | Governance claim | **CONTRADICTED** | Proposal l.385 (Phase 1 includes "review queue, audit log"; "no AI"); deck s10 l.294 (both "Not yet") | The AI agents were built and evaluated before the proposal's Phase 0 (golden set, baselines) and Phase 1 (review queue, traceability store). |
| L-24 | "A working slice, proven on a real app" | Deck s6 l.120 | Empirical | **PARTIALLY PROVEN (works); "real" overstated** | COMPARISON.md l.16: "no formal spec artifact … 'tests-as-requirements'" | Cypress RWA is a public demo with a lowdb JSON store and weak validation by design. "Requirements extracted from the app's specs" (s6 l.141–143) is false: they were reverse-engineered from its Cypress tests. |
| L-25 | App-agnostic core "enforced in CI" ⇒ generalizes | Deck s6 l.125 | Design/empirical | **UNPROVEN** | VERIFICATION §4 l.97: "Conduit runtime was never built, booted, seeded, or authenticated" | The boundary check is a denylist grep. Generalization requires a second live app, which never happened. A grep proves absence of names, not portability. |

### 1c. Implicit assumptions (never stated, load-bearing)

| ID | Implicit assumption | Relied on by | Verdict | Evidence | Reasoning |
|---|---|---|---|---|---|
| I-01 | Seeded defects are representative of real defects | Catch rate s9; T4 P(catch) | **UNPROVEN, likely false** | `adapters/cypress-rwa/fault-injector.js` (12 single-line mutations); hardening prompt l.49–51 | Single-line, builder-chosen mutations targeting asserted fields, of which 4/10 are "delete the auth middleware". No mutation-operator sampling, no real-defect history, no SAP-class defects (config, integration, data migration, authorization roles). |
| I-02 | One LLM call is a sufficient generator | s7 loop | **PARTIALLY PROVEN for simple REST; CONTRADICTED at breadth** | VERIFICATION l.575–583: "38 of 132 tests (28.8%) were quarantined" | The bounded regeneration loop hit its ceiling on a material fraction. `TEST-DATA-001` used 8 attempts for one test case. |
| I-03 | Temperature 0 = reproducible | Gate design; N=1 decisions | **CONTRADICTED** | PROGRESS l.46–48: "OpenRouter isn't bit-deterministic at temp 0"; VERIFICATION §7 | Admitted, yet Stage 9 grounding (n=1 per arm, `reports/grounded/RESULTS.md` l.3–6) and Stage 10 (N=1, band "±0.0pt") decisions treat single runs as decisive. |
| I-04 | API-level testing of a Node demo generalizes to the "regulated SAP landscape" of s2 | Entire value case | **UNPROVEN; no bridge argument** | Deck s2 l.22 vs PROGRESS l.118–121: "Coverage is currently API-centric … oracle is API-only" | SAP S/4 and CALM test surfaces are dominated by business-process, configuration, role/authorization, IDoc/integration and UI (Fiori/GUI) flows. None is exercised. The proposal's own stop rule (l.394–396) concedes "stories backed by API specifications" are where the agent does best, i.e. the easy case is the only case measured. |
| I-05 | Cypress RWA is representative | All numbers | **CONTRADICTED** | req-first-principles l.331: "cypress-realworld-app has weak server-side validation and several crash bugs" | Its weakness is both what produced the "real defects" and what makes FP unmeasurable. Training-data contamination is also unaddressed: a 5.9k-star public repo (COMPARISON l.19) whose `api-*.spec.ts` the requirements were extracted from is likely in model pretraining. |
| I-06 | An LLM can judge testability | s8 | **CONTRADICTED** | `reports/testability-report.md` BANK-TRANSFER-001 "testable 1.00" (phantom endpoint) | The LLM passed D4 on the one requirement the deterministic gate proved ungrounded. |
| I-07 | Triage-by-LLM labels are trustworthy ground truth for FP | FP metric, Stage 9 adjudication | **CONTRADICTED** | `reports/s10/worksheet.md` l.32 (×100 rule flagged as defect, "Confidence: high"); l.21, l.26 (runner template bug flagged as app defect) | The triager defers to whatever oracle the test asserts. It cannot arbitrate oracle authority, which the project names as the open lever. |
| I-08 | ~$0.05 is a meaningful cost figure | s9 | **CONTRADICTED** | See L-17 | Off by 1–2 orders of magnitude vs realistic runs. Excludes the deck's own named bottleneck (review). |
| I-09 | The builder can adjudicate their own FPs | Stage 9 reframe | **CONTRADICTED by own caveat** | req-first-principles l.344–345: "adjudication is based on the triage agent's defect rationales … warrant a quick human confirm" | The confirmation was never done, yet MAKE-THE-CASE l.194–203 states it as settled. The Stage 10 "arm-blinded worksheet" is still unfilled (`reports/s10/worksheet.md`, verdict column empty). |
| I-10 | Agent-invented negative tests count as valid oracles when the app disagrees | Stage 9 "~11 real defects" | **CONTRADICTED by project's own T5** | req-first-principles l.48–51: "Generate both *decides* the expected value and *writes the assertion*… grading its own homework" | Invented expectations ("invalid email → 4xx", "non-existent id → 404") become "real defects" when convenient and "FPs" otherwise. This is selective application of the project's own stated flaw. |
| I-11 | N=3 identical runs rule out flakiness | s7 Run ×3; MAKE-THE-CASE l.18 | **PARTIALLY PROVEN (frequent flakes only)** | MAKE-THE-CASE l.162–163 concedes rare flakes | P(PASS-classified | 10% flake) = 72.9%; P(PASS | 20%) = 51.2%. |
| I-12 | Builder-authored eval is independent evaluation (T5) | Eval harness s10 | **CONTRADICTED** | text/Agentic_QE_Technical_Spec_and_Implementation_Plan.docx.md l.302: "Default the golden set to senior-engineer-authored suites only" | The same agent/session that built the generator wrote the defects, batteries, labels and adjudication. |
| I-13 | Requirements reverse-engineered from passing tests are a fair "requirement" input | s6, s7 | **UNPROVEN, structurally biased** | req-first-principles l.212–216: extraction "dropped the **setup and the bound values that made it true**" | The task becomes "reconstruct an existing test suite", which says nothing about the stated problem (requirements arriving faster than tests). |

---

## 2. First-principles check of T1–T9

### 2.1 Are they first principles?

| T | Irreducible? | True? | Classification |
|---|---|---|---|
| T1 | Yes (oracle problem) | True in spirit; false as "must be written" (implicit, differential, metamorphic and invariant oracles exist and produced the project's best findings) | Genuine principle, overstated |
| T2 | No: a restatement of T1 plus an unfalsifiable "cap" | Unfalsifiable as worded; contradicted in letter by LLM priors adding information | **Belief dressed as axiom** |
| T3 | No: depends on prices and tooling | Empirical; unmeasured on the review side | **Economic hypothesis** |
| T4 | No: a definition | Definitional; ignores compliance-evidence value | Normative model |
| T5 | Yes | True and confirmed by own incidents | Genuine principle |
| T6 | Half: "stateless" is a fact, "therefore a database" is a choice | Mixed | Fact + design decision |
| T7 | No | A good heuristic | **Heuristic** |
| T8 | Yes | True | Genuine principle |
| T9 | No: a regulatory/organizational constraint ("for the foreseeable future") | Contingent | **Policy constraint** |

Only T1 (narrowed), T5 and T8 are first principles. T2, T3, T7 and T9 are heuristics, hypotheses or policies. T4 and T6 are definitions or design choices. The slide-4 header "Derived from nine load-bearing facts … the design follows only from what must be true" is therefore not accurate.

### 2.2 Missing principles

The project discovered several of these itself and then did not promote them into T1–T9 in deck v2.

1. **Oracle independence.** The expected result must come from a source independent of both the SUT and the generator. The project discovered this in Stage 9 (req-first-principles T3/T5, l.43–51) but the deck still lists the weaker T1. The implementation violates it: Generate authors the expectation it asserts.
2. **Measurement independence.** The party that builds the system must not author the ground truth that grades it. Violated by every battery, the defect catalog and the adjudication (I-12).
3. **Evaluator diversity.** The judge must not share the generator's blind spots. Triage uses the same model and, after the WS-D fix, the same apiHints as Generate (VERIFICATION l.640–646). It therefore inherits Generate's misbeliefs, as the ×100 case shows (L-16).
4. **Non-determinism must be budgeted.** Every metric needs a stated run-to-run distribution before a decision is taken. The graphify memo states this rule (l.236–239: "≥3 times … distributions, not single numbers"), and Stages 9 and 10 then broke it.
5. **Asymmetric error costs.** In regulated work, a false negative (escaped defect) and a false positive (wasted review plus credibility loss) have different costs. The architecture tunes to a single FP threshold of 0 and has no FN budget or risk weighting.
6. **Adversarial inputs and prompt-injection safety.** SUT response bodies and requirement text are pasted verbatim into the triage prompt (`workflow/prompts/triage.user.md`: `{{runsJson}}`). A hostile or merely odd payload can steer the classification. No principle, no control.
7. **Data governance.** Requirements, test data and response payloads go to a third-party model router (OpenRouter). For "regulated SAP" this is a first-order constraint and it is absent.
8. **Model drift.** The run used Sonnet 4.5 instead of the pinned 4.6 (PROGRESS l.46). There is no principle that pins and re-certifies the model version against the eval harness, even though the proposal's harness exists for exactly this.
9. **Construct validity of metrics.** A metric must measure what it is named for. The FP metric does not (L-20).

### 2.3 Tensions between principles and outcomes

- **T3 vs T1.** If the oracle is the hard part, cheap generation is not cheap: every generated assertion carries an invented oracle that someone must validate. Stage 9 shows that validating 15 failures took a manual adjudication pass, which the project then skipped confirming.
- **T9 vs Outcome 3.** If regulated work always gets full human review, the marginal cost of a requirement is bounded below by review cost, as Outcome 3 says. But the deck never measures review cost, and T3 says review is the expensive part. Outcome 3 therefore restates the bottleneck rather than relieving it. Nothing shows review gets cheaper per requirement.
- **T2 (gate on input) vs "value = real defects found".** Stage 9's touted value (BANK-ACCOUNTS-006, unauthenticated GraphQL) came from a requirement the testability gate marks *untestable*. Turning on the T2 gate removes evidence for the value claim.
- **T5 vs the FP gate.** "Prompts are not enforcement", yet the platform's hard FP gate is computed from an LLM classification.
- **T7 vs the testability gate.** The deterministic grounding gate beat the LLM-rated D4. T7 implies D4 should be deterministic, but the deck presents the LLM-rated version as "in software".

### 2.4 Validity of the chain T1–T9 → 3-layer design

- **T5 + T7 → deterministic platform**: valid.
- **T6 → traceability DB**: non sequitur (files or Git suffice; the System Spec chose Git).
- **T1/T2 → testability gate as Analyst–Designer's first action**: valid in intent. The implementation delegates the gate decision to the same model class it is meant to protect against.
- **Anything → exactly three AI roles**: unsupported. "Derived from the work" is asserted. Role count is a design choice, and the implementation already collapsed two roles into one call without testing A13.
- **T9 → Layer 3 for everything**: T9 is scoped to regulated work, while Layer 3 is universal. That is defensible but not derived.
- **T8 → eval harness**: valid. The harness built is not the proposal's golden set, so the derived component is not the one implemented.

---

## 3. Logic and reasoning flaws

1. **Self-grading at every level.** Generate writes the expectation, Triage (same model and context) adjudicates, the builder authors the defect catalog *against the generated tests*, the builder writes and then relabels the batteries, and the builder adjudicates the FPs from the triage rationales.
   - `stage6-hardening-prompt.md` l.49–51
   - `eval/testability-battery.js` l.91, l.165
   - VERIFICATION l.649–657
   - req-first-principles l.344–345
2. **Ground truth edited after observing the model.** The testability battery has 2 relabels "to match the gate". The triage battery has 2 fixtures rewritten after triage disagreed, plus a prompt change, then a re-score on the same 12. Reported accuracies are training-set fit.
3. **Confounding in "Proof of T2".** Curated vs uncurated also differs in:
   - requirement set (4 hand-picked vs 44);
   - size;
   - domain mix (the slice has no POST /users, which is the FP hotspot `USERS-008` with 18 FPs);
   - hint source (after WS-A, 3/4 of the slice used auto hints).

   The four slice requirements had 0 FP in the uncurated run too (`reports-all/report.md`), so the difference is attributable to selection, not hints.
4. **Survivorship / selection.** The "curated 4-of-44 slice" is the subset chosen *because* it had rich hints. Headline numbers are reported on the survivors, and breadth numbers are relegated to a caveat line.
5. **Metric invalidated, decisions retained.** Stage 9 declares the FP metric conflated ("cannot separate 'bad test' from 'real bug'"). The graph NO-GO (decided on that metric), the grounding GO (decided on it), and the deck's Proof of T2 (computed on it) are all kept. MAKE-THE-CASE l.210 even upgrades the graph result to "disproven".
6. **Goalpost moves.**
   - FP definition: build prompt "excluding quarantined" (stage6-build-prompt l.146–147) vs reported 24/132 including quarantined. The understated version is the one shown.
   - Catch: "100% (3/3)", then "90% (9/10)"; the gate fails but the deck shows DONE.
   - Requirement quality: "the 44 are mostly decent" (testability-gate l.212), then 24/44 not testable after prompt tuning.
   - The 18% FP is "bad tests" (VERIFICATION l.570–574: "the *generated test itself*, not the live app, was wrong") and then "~11 of 15 are real bugs" (req-first-principles l.316).
   - Stage 10 pre-registered N=5 and "Power (why 15 …)" vs locked slice 24 vs executed N=1.
   - Graphify go/no-go required "≥3 runs" and "improvement exceeds spread"; grounding was then accepted at n=1 per arm because it was "below the band". The band was measured on full-set runs while grounded ran on a set reduced by gating (41 vs 44 requirements), so the comparison is not like-for-like.
7. **Numbers without denominators or CIs.** Every deck percentage on slides 7–9 lacks a CI. The deck's "18%" has no denominator. "~$0.05" has no run definition. "True FP ≈ 2–3%" has no stated denominator in MAKE-THE-CASE. The Stage 10 "band = ±0.0pt" at N=1 turns any non-zero delta into "beyond the band", which is a degenerate decision rule.
8. **Circular cost claim.** "We track cost per run so the equation has real numbers" (s9). Only one of the five terms has a number.
9. **Demo narrative contradicts the record.** MAKE-THE-CASE l.43–45 says "Nobody told it to check balances" and "From that prose alone". VERIFICATION l.418–420 says the curated hint for this very requirement encodes "balance-crediting on a completed payment" and the ×100 rule. The triage quote "documented dollar-to-cents conversion" (MAKE-THE-CASE l.60) cites that hint.
10. **Overloaded "real defect".** Without oracle authority (the project's own named open problem), labelling demo-app behaviour such as "accepts invalid email" a "real defect" is an opinion. Counting those as system value while admitting oracle authority is unresolved is circular.
11. **Under-reported negative result.** Stage 10 (2026-07-21, `reports/s10/decision-memo.md`) is the only pre-registered, controlled dose test in the corpus. It returned NEGATIVE on FP (rich worse, Wilcoxon p=0.009 on 9 non-zero pairs, N=1). Catch was 4/10 vs 5/10 with the value/shape class at 0/6 vs 1/6. Without hints, the blatant `payment-amount-cents` and `receiver-balance-not-credited` were missed in *both* arms. This directly undercuts slides 7 and 9 and appears in neither the deck nor PROGRESS.
12. **The "intent not code" rule broken by its own experiment.** Stage 10 spec l.309–311 says "never from observed responses … oracle = intent, never expected-from-code". The RICH author read `backend/*-routes.ts`, `validators.ts` and `helpers.ts` to set status codes and error shapes (`experiments/stage10-oracle/rich/AUTHORING-NOTES.md` l.13–19). The same author then *departed* from documented business intent on ×100 (rich oracle asserted `amount == 1500`), producing a false "defect".

---

## 4. Cross-document contradictions

| # | Statement A (location) | Statement B (location) |
|---|---|---|
| C-01 | "0% false positives on curated hints vs 18% uncurated" (Deck s7 l.183) | "`CURATED_API_HINTS` shrunk from 4 entries to 1." (VERIFICATION l.415) |
| C-02 | "Proof of T2 … input quality, measured." (Deck s7 l.183) | "The true false-positive rate is ≈ 2–3%, not 12%." (PROGRESS l.78–79; MAKE-THE-CASE l.201–202) |
| C-03 | Uncurated failures: "the *generated test itself*, not the live app, was wrong" (VERIFICATION l.571) | "~11 are real defects the system correctly caught" (PROGRESS l.75–76) |
| C-04 | Measurement "DONE" (Deck s11 l.305–308) | "`./verify.sh` currently FAILS at step 5" (VERIFICATION l.700); "DONE only when `./verify.sh` exits 0" (stage6-build-prompt l.136) |
| C-05 | Stage 6b "✅ Done" (PROGRESS l.20) | Same row: "`./verify.sh` currently **fails**" (PROGRESS l.20) |
| C-06 | Operate the suite "DONE" (Deck s11 l.317–319) | "Design sketch. Not yet built." (docs/design/sdlc-flows.md l.3); no ops verification in VERIFICATION or PROGRESS |
| C-07 | "Build order matches the proposal" (Deck s11 l.300) | Phase 1: "review queue, audit log. Deliberately no AI in this phase." (Proposal l.385) vs "Not yet — by design: human-review queue" (Deck s10 l.294) |
| C-08 | "Scorecard + seeded defects → Evaluation harness / golden set" (Deck s10 l.283–284) | Golden set: "real requirements together with test suites designed by our best engineers" (Proposal l.48) |
| C-09 | Deck metrics: catch / FP / triage (s9) | "Acceptance rate … Our primary quality measure." (Proposal l.50); never measured |
| C-10 | "Jira / Xray adapters" are NEXT (Deck s10 l.294, s11 l.321) | "Git repository, Docs-as-Code — replaces Jira/Zephyr/Xray" (System Spec v1.1 l.13–14) |
| C-11 | "Nobody told it to check balances" / "From that prose alone" (MAKE-THE-CASE l.40–45) | Curated hint encodes "balance-crediting on a completed payment" (VERIFICATION l.419–420) |
| C-12 | "100% (12/12)" triage (Deck s9 l.242) | "not exhaustively tested against a battery" (VERIFICATION §9 l.335–337; pre-6b) and "First run: 92% (11/12)" plus fixture edits (VERIFICATION l.631, 649–657) |
| C-13 | Testability battery "epic → `needs_clarification`" (testability-gate.md §9 l.183) | `epic-payments-module` expectedVerdict "untestable", "Relabeled" (eval/testability-battery.js l.91–96) |
| C-14 | "the 44 are mostly decent" (testability-gate.md l.212) | "20 testable / 17 needs-clarification / 7 untestable" (same doc l.219) |
| C-15 | "Enforces T1 & T2 in software" (Deck s8 l.226) | "`TESTABILITY_GATE=off` (opt-in per run)" (testability-gate.md l.216); D4 LLM-rated pass on phantom endpoint (reports/testability-report.md) |
| C-16 | "~$0.05 per curated run … now auto-tracked" (Deck s9 l.243, 251) | Headline curated run has no cost block (reports/report.md); $0.05 is from `reports/ab/graph-l1/curated/report.md` l.13 |
| C-17 | "FP 15.4%→12.2% (below baseline noise band)" (PROGRESS l.23) | "only run1 … run2 and run3 were cancelled" (reports/grounded/RESULTS.md l.3–4); "Run each arm ≥3 times" (graphify memo l.237) |
| C-18 | "Requirements extracted from the app's specs" (Deck s6 l.141–143) | "no formal spec artifact … 'tests-as-requirements'" (COMPARISON.md l.16) |
| C-19 | "In a regulated SAP landscape" (Deck s2 l.22) | "Coverage is currently API-centric … oracle is API-only" (PROGRESS l.118–121) |
| C-20 | "the headline numbers are a measurement, not a marketing claim" (MAKE-THE-CASE l.23–24) | "so the catch-rate number is credible to leadership" (stage6-hardening-prompt l.10); defects designed to target existing tests (l.49–51) |
| C-21 | FP = "failures on the clean app, excluding quarantined" (stage6-build-prompt l.146–147) | `falsePositiveRate: 0.1818` = 24/132 incl. 38 quarantined (VERIFICATION l.558–559) |
| C-22 | Stage 10: "oracle = intent, never expected-from-code" (stage10 spec l.309–311) | RICH authored from `backend/*-routes.ts`, `validators.ts`, `helpers.ts` (AUTHORING-NOTES l.13–30) |
| C-23 | Stage 10: pre-registered "N=5" and "§6.1 Power (why 15 …)" (stage10 spec l.440, 467) | "N=1 runs/dose · slice=24" (reports/s10/decision-memo.md l.3) |
| C-24 | "'Give it more code knowledge' is **disproven**" (MAKE-THE-CASE l.210) | NO-GO decided on FP, a metric later declared unable to "separate 'bad test' from 'real bug'" (req-first-principles l.330–332); Layer 2 never run |
| C-25 | "All 7 planned stages are done" (PROGRESS l.26) | The table lists 9 stages, and Stage 10 exists with a NEGATIVE verdict but is absent from PROGRESS and the deck |
| C-26 | Deck s9 "0% false positives" and "Honest caveat … curated 4-requirement slice" | MAKE-THE-CASE adopts "true FP ≈ 2–3%" for breadth: two incompatible FP definitions presented to the same leadership audience |

---

## 5. What would be required for each headline to stand

Each item is the minimum change that would make the corresponding claim defensible.

- **Catch rate**: a defect set authored by someone who has not seen the generated tests (or sampled mutation operators), plus at least 30 real defects drawn from a real project's history, reported with CI.
- **FP**: a human-adjudicated, arm-blind label on every clean-run failure, with the oracle authority defined *before* adjudication. Report quarantine-excluded and -included rates, with N ≥ 3 runs per arm.
- **Triage and testability accuracy**: a held-out labelled set, frozen before any prompt change, at least 50 cases, more than half real, with inter-rater agreement for the labels.
- **"Proof of T2"**: the same requirements under both hint conditions (paired), with N ≥ 3. Stage 10's design is the right shape and its result must be reported.
- **Value equation**: measured reviewer minutes per accepted test, using the proposal's acceptance rate and rework rate.
- **SAP generalization**: at least one non-REST, configuration- or process-centric target. Until then, slide 2's framing is aspirational.
