# D — Primary-Evidence Benchmark for the Agentic QE Architecture

Prepared 2026-10-06. Scope: 2023–2026 primary sources (papers, official vendor engineering blogs/docs, standards), plus a few older foundational papers that are still the citation of record (marked "foundational"). Every source in the table at the end was opened during this research. Anything I could not open or confirm is marked **[UNVERIFIED]**.

Abbreviations used for the architecture under review: **GEN** = LLM requirement-to-TestCase generator; **RUN3** = deterministic 3x execution with state reset (all-pass / all-fail→triage / mixed→quarantine); **TRIAGE** = second LLM call classifying real_defect / bad_test / environment; **SCORE** = deterministic catch rate / FP rate against 12 seeded one-line defects; **GATE** = 6-dimension testability gate; T1–T9 = the team's stated first principles.

---

## Executive summary (decision-relevant)

1. **The strongest external evidence directly confirms the team's central conclusion (T1/T2).** RESTestBench (EASE 2026) measured LLM-generated REST API tests from natural-language requirements using requirement-level mutation testing — essentially this architecture's evaluation design. Claude Sonnet 4.5 reached a 92% mutation score on *precise* requirements; *vague* variants of the same requirements cut scores by 26–40 percentage points for every model, and no model reached 90%. When generators were allowed to observe a faulty implementation, they adapted assertions to the bug, and for four models single-step generation from precise requirements beat SUT-interactive refinement.
2. **The headline numbers are not yet statistically distinguishable from much weaker ones.** 9/10 catch has a 95% Wilson interval of roughly 60%–98%; triage 12/12 has roughly 76%–100%. Eval-methodology guidance (Anthropic, 2024) calls for standard errors, clustered SEs, paired comparisons and power analysis.
3. **3 reruns is a weak flakiness detector.** For a test that fails independently with probability 5% per run, three runs produce a "mixed" verdict only ~14% of the time. Industry and academic data show flakiness detection needs far more runs, or history-based (Bayesian) scoring.
4. **The pinned model is being retired.** Anthropic lists Claude Sonnet 4.5 as deprecated (2026-09-30) with retirement on **2026-11-30**. Separately, OpenRouter load-balances a model across providers by default unless provider routing is pinned. Both undermine "single model, temperature 0" reproducibility.
5. **Temperature 0 is not deterministic** (arXiv 2308.02828; arXiv 2408.04667; Thinking Machines 2025). Repeated-trial reporting (pass@k / pass^k) is now standard guidance.
6. **Same-model triage is a known bias risk.** Self-preference correlates with self-recognition (NeurIPS 2024). Panels of models from different families reduce intra-model bias. Percent agreement hides disagreement, so the triage judge should be calibrated with kappa against a human-labelled set.

---

## 1. LLM-based test generation — state of the art

### Key findings
| Work | Setting | Numbers |
|---|---|---|
| **TestGen-LLM** (Meta, FSE-Industry 2024) | Kotlin unit-test *extension* of existing classes; filters: builds → passes → **reliably passes (repeated runs)** → increases coverage | 75% of generated tests built; 57% passed reliably; 25% increased coverage. In test-a-thons it improved 11.5% of classes it was applied to; **73% of its recommendations accepted** by engineers |
| **ACH** (Meta, FSE 2025 industry; Meta Eng. blog Feb 2025) | Mutation-guided: LLM generates *concern-specific* mutants (e.g., privacy faults), then tests that kill them; LLM equivalent-mutant detector | 9,095 mutants, 10,795 Android Kotlin classes, 7 platforms, 571 privacy-hardening tests; **73% of tests accepted**, 36% judged privacy-relevant; equivalent-mutant detector precision 0.79 / recall 0.47 (0.95 / 0.96 with simple preprocessing) |
| **TestGenEval** (Meta/academia, ICLR 2025) | 68,647 tests, 1,210 code/test file pairs, 11 Python repos | Best model (GPT-4o) averaged **only 35.2% coverage**; main failure mode is assertion errors and reasoning about execution |
| **SWT-Bench** (NeurIPS 2024) | Generate issue-reproducing tests from GitHub issues | Code-repair agents beat dedicated test generators; generated tests used as a filter **doubled SWE-Agent precision** |
| **CoverUp** (FSE 2025) | Coverage-guided iterative prompting, Python | Per-module median line+branch coverage 80% vs 47% (CodaMosa); 89% vs 77% overall (MuTAP); the gain comes from the system components, not the LLM alone |
| **HITS** (ASE 2024) | Slices methods and generates tests slice by slice | Beats prior LLM methods and EvoSuite on line and branch coverage for complex methods (abstract gives no absolute numbers) |
| **ChatUniTest** | — | **[UNVERIFIED — not opened]** |
| **RESTGPT** (ICSE-NIER 2024) | LLM extracts rules and example values from OpenAPI descriptions | "Outperforms existing techniques" in rule extraction and value generation (abstract gives no numbers) |
| **AutoRestTest** (ICSE 2025) | Multi-agent RL + semantic dependency graph + LLM values (black-box) | Beat 4 tools on code coverage, operation coverage and faults; only tool to trigger a Spotify 500 |
| **LlamaRestTest** (FSE 2025) | Fine-tuned, quantized Llama3-8B for REST inputs | Beat RESTler, MoRest, EvoMaster and ARAT-RL on coverage and 500s across 12 services |
| **APITestGenie** (2024 preprint; extended 2026) | **Business requirements + OpenAPI → executable API tests** (closest analogue to GEN) | 2024: valid scripts 57% at 1 attempt, 80% within 3 attempts across 10 APIs. 2026 version: valid for 89% of requirements within ≤3 attempts; 8 automotive systems with ~1,000 endpoints; found real integration defects; **requirement documentation quality named a critical success factor** |
| **RESTestBench** (EASE 2026) | **NL requirements → REST tests; requirement-based mutation score**; 3 services, 106 requirements × {precise, vague}, 228 manual mutants; 10 models | Precise single-step: 13% (Llama 3.1 8B) to **92% (Sonnet 4.5)**. Vague: −26 to −40 pp, max 54%. Refinement against the SUT adds 10–29 pp on vague requirements, **but MS against mutated SUT < MS against valid SUT for every model**: stronger models "adapt assertions to match buggy implementations". For 4 models, single-step on precise requirements beat refinement against a faulty implementation |
| **Acceptance test generation, industrial** (2025) | User stories → Gherkin (AutoUAT) → Cypress (Test Flow), GPT-4 Turbo | Scenarios helpful 95% of the time; scripts: 60% usable as-is, 8% minor fixes, 24% regenerate, 8% discard |
| **Playwright Test Agents** (v1.56, Oct 2025) | Planner / generator / healer agents | Vendor release notes (no effectiveness data). The "healer" automatically repairs failing tests, which risks fixing tests to match bugs (see §2) |

### Bearing on the architecture
- **Supports T3 and the RUN3 design.** Industrial systems (TestGen-LLM, ACH) win by putting **deterministic assurance filters** around cheap generation. Meta's "reliably passes" filter is the same idea as RUN3.
- **Supports T1/T2 strongly** (RESTestBench, APITestGenie). RESTestBench also **challenges** any plan to "ground" generation by letting the agent probe the live SUT: probing a buggy SUT turns the bug into the oracle. This is consistent with the team's negative code-knowledge-graph result: more implementation context did not help.
- **Benchmarks the 90% catch claim.** 92% (Sonnet 4.5, precise requirements, 228 mutants) is the most comparable published figure. The team's 9/10 sits in the same range but on a sample about 20× smaller.
- **Acceptance rate is the industrial KPI** (73% at Meta, twice). The architecture has no "human accepted the test" metric yet; the planned review queue should produce one.

### Recommendations
1. Add the missing Meta-style filter stages to GEN output: **schema-valid → executes → reliably passes on the known-good build → kills ≥1 seeded/targeted defect** (ACH-style "fault-targeted" acceptance).
2. Keep generation **requirement-only by default**. If SUT probing is ever added, use it only for *construction* facts (endpoints, auth, payload shapes), never for expected values.
3. Track **human acceptance rate** as the north-star metric next to catch and FP rates.
4. Consider ACH's idea: let an LLM propose **requirement-specific mutants** to expand the 12-defect catalog. Pair it with an equivalent-mutant filter and human confirmation.

---

## 2. The test-oracle problem with LLMs

### Key findings
- **LLM oracles capture actual, not expected, behaviour.** Konstantinou, Degiovanni & Papadakis (2024; 24 Java repos) found that LLM test generation is "prone on generating oracles that capture the actual program behaviour rather than the expected one". LLMs were better at *generating* oracles than *classifying* them, and meaningful names improved results.
- **Unbiased-dataset study** (Molinelli, Di Grazia, Martin-Lopez, Ernst, Pezzè, ASE 2025): 13,866 oracles from 135 Java projects created after training cutoffs. LLM oracles reached a 43% average mutation score vs 45% for human oracles. The test prefix plus called methods suffice; extra code context brought no relevant benefit.
- **Documentation-only oracles** (AugmenTest, 2025): oracles inferred from docs only, not code, produced correct assertions 30% of the time in the conservative setting (vs TOGA 8.2%). RAG underperformed (18.2%).
- **Test Oracle Automation in the era of LLMs** (arXiv 2405.12766, 2024):
  - LLM oracles have high false-positive rates.
  - In *specification* (not regression) testing, deciding whether an oracle failure is a false positive or a real bug "may require a human".
  - Data leakage is a threat: models reproduce Defects4J assertions verbatim.
  - Recommended mitigations: post-generation assurance, post-cutoff datasets.
- **RESTestBench** (above): the same effect at API level. Stronger models adapt assertions to buggy implementations.
- **Oracle-independent techniques:**
  - *Property-based:* "Can LLMs Write Good Property-Based Tests?" (arXiv 2307.04346) found the best model synthesizes a valid and sound PBT in 2.4 samples on average, but covers only about one-fifth of documentable properties. A 2025 Claude-4-Sonnet study on 16 HumanEval problems found PBT 68.75%, example-based tests 68.75%, and **the combination 81.25%** bug detection.
  - *Metamorphic for REST:* ARMeta (2026) uses an LLM multi-agent workflow to derive metamorphic relations from OpenAPI and finds behaviours complementary to scenario tests (no numbers in the abstract).
  - *Differential testing:* no 2023–26 primary source was opened specifically for REST differential testing. **[UNVERIFIED]**

### Bearing
- **Strongly supports T1** ("oracle must be written, not guessed") and the decision to generate from requirements, not code.
- **Supports the GATE's "oracle" dimension** as the most important one.
- **Challenges TRIAGE.** The literature says LLMs *classify* oracles worse than they *generate* them, and spec-testing false positives need a human. A "bad_test" vs "real_defect" verdict is exactly that classification.

### Recommendations
1. In the TestCase schema, require every assertion to cite the acceptance-criterion clause it derives from (assertion→AC traceability). Reject assertions with no source clause.
2. Add **property/invariant assertions** generated from the requirement (status-code classes, idempotency, round-trip, authorization invariants) alongside example assertions. Evidence shows the two are complementary.
3. Add cheap **metamorphic relations for APIs** (e.g., filter ⊆ unfiltered, pagination concatenation = full list, create→get round-trip) as app-agnostic core checks. They need no oracle from the requirement.
4. Route every TRIAGE verdict of "real_defect" vs "bad_test" that changes a requirement's status to human confirmation until the judge is calibrated (§4).

---

## 3. Evaluation methodology

### Key findings
- **Mutants as a proxy (foundational).** Just et al., FSE 2014 (357 real faults, 5 projects): "a statistically significant correlation between mutant detection and real fault detection, independently of code coverage". *Caveat (abstract only opened):* the often-quoted "73% of real faults coupled to mutants" figure is not in the abstract. **[UNVERIFIED]**
- **Counter-evidence (foundational).** Papadakis et al., ICSE 2018: correlations between mutation score and real-fault detection are largely the "confounding effects of the test suite size". Controlling for size, the correlation is weak, though mutation-ranked suites still find significantly more faults than random suites of the same size.
- **LLM-specific replication (2026).** Zhao, Zhou & Cohen, >100k tests from 11 LLMs:
  - Mutation–bug detection correlation is moderate (r = 0.475–0.511 combined) and strong between models (r = 0.863).
  - Coverage–bug correlation is weak when the code under test is buggy.
  - "Usefulness of coverage and mutation is highly context-dependent."
- **Real-fault benchmark.** Defects4J v3.0.1 has 854 active, reproducible, isolated, minimized real bugs from 17 Java projects, each with a triggering test.
- **Nondeterminism at temperature 0:**
  - Ouyang et al. (TOSEM; arXiv 2023), 829 code tasks: the share of tasks with *zero* equal test outputs across requests was 75.76% / 51.00% / 47.56% (CodeContests / APPS / HumanEval). Temperature 0 reduces but does not eliminate this.
  - "Non-Determinism of Deterministic LLM Settings" (arXiv 2408.04667, 2024): 5 "deterministic" LLMs, 8 tasks, 10 runs. Accuracy varied up to 15%, and the best–worst gap reached up to 70%. The paper proposes TARr@N / TARa@N agreement metrics.
  - Thinking Machines (Sep 2025): 1,000 temperature-0 completions of Qwen3-235B gave **80 unique outputs**. Root cause is lack of batch invariance under varying server load. Batch-invariant kernels gave 1,000/1,000 identical outputs at about 2× latency.
- **Statistics for evals** (Miller, Anthropic, 2024):
  1. Report CLT standard errors.
  2. Use clustered SEs when items come in groups; clustering can inflate SEs about 3×.
  3. Resample answers to reduce variance.
  4. Run **paired** question-level comparisons between variants.
  5. Run power analysis before running.
  6. Do *not* rely on lowering temperature to reduce variance.
- **Repeated trials** (Anthropic "Demystifying evals for AI agents", Jan 2026): use **pass@k** when any success suffices and **pass^k** (all k succeed) for consistency-critical systems. Isolate trials in clean environments, start with 20–50 tasks from real failures, and read transcripts. Codex/HumanEval (Chen et al. 2021, foundational) shows how large the sampling effect is: 28.8% at 1 sample vs 70.2% with 100 samples.

### Bearing
- **Supports SCORE's design** (deterministic, mutation-like seeded faults). **Challenges** the inference strength:
  - 12 hand-seeded one-line defects are few. A single author may produce non-representative defects, and they are not real faults.
  - Size confounding (Papadakis) means catch rate must be normalised by test count or compared at equal suite size.
- **Sample size.** 9/10 catch → 95% Wilson CI ≈ **[0.60, 0.98]**. 12/12 triage → ≈ **[0.76, 1.00]**. 0 FP on a 4-requirement slice → by the rule of three, the upper bound is about 3/n tests and cannot rule out an FP rate in the teens. The 0% vs 18% FP contrast between curated and uncurated sets is suggestive, but it is confounded with requirement count and difficulty.
- **Temperature-0 reproducibility is an assumption, not a fact.** It is weaker still via a multi-provider router (§6).

### Recommendations
1. Expand the defect catalog to **≥50 seeded faults** across mutation operator classes (boundary, auth, validation, state, serialization, status code). Add a handful of **real historical defects** (Defects4J-style: reproducible, isolated, with triggering test) from the target apps.
2. Report every rate with **n, 95% CI, and k-trial variance** (run the full pipeline ≥5 times). Report pass@1 *and* pass^k for generation, and TAR@N for TRIAGE.
3. Use **paired comparisons** (same requirements, same defects) when testing variants such as the knowledge graph or GATE on/off, and **cluster SEs by requirement**.
4. Report catch rate **per test** and at fixed suite size to control for the size confound.

---

## 4. LLM-as-judge / LLM triage reliability

### Key findings
- **Zheng et al.** (NeurIPS 2023 D&B), "Judging LLM-as-a-judge": GPT-4 reaches >80% agreement with humans, about the human–human level. Documented biases: **position, verbosity, self-enhancement**.
- **Wang et al.** (ACL 2024), "LLMs are not fair evaluators": order alone let Vicuna-13B "beat" ChatGPT on 66/80 queries. Fixes:
  - multiple-evidence calibration (reason before scoring);
  - balanced position calibration (swap order and aggregate);
  - human-in-the-loop escalation by an uncertainty (entropy) score.
- **Panickssery et al.** (NeurIPS 2024): LLMs recognise their own outputs, and **self-recognition strength correlates linearly with self-preference**.
- **Verga et al.** (2024), PoLL: a panel of smaller judges from **disjoint model families** beats a single large judge, has less intra-model bias, and is about 7× cheaper.
- **"Judging the Judges"** (arXiv 2406.12624, 2024): high percent agreement can hide large score differences. Only the largest judges approached human alignment, still below inter-human agreement. The paper recommends chance-corrected metrics (Cohen's kappa / Scott's π) over percent agreement and notes leniency bias.
- **Anthropic** (Jan 2026): model graders need "close calibration with human experts"; read transcripts.
- **Flaky/failure classification specifically:**
  - Rahman, Dutta & Shi (OOPSLA 2025): prior flaky-test classifiers' F1 **fell from 85.38% to 56.62%** under realistic distributions and proper experiment design. Their FlakyLens reached 67.5% and outperformed general-purpose LLMs.
  - SAP HANA (2026) used LLMs-as-annotators with consistency checks to label 559 flakiness root-cause reports (23% concurrency).

### Bearing
- **Challenges** TRIAGE's 12/12 as evidence. The sample is tiny (CI lower bound about 76%), and the same model family generated the test *and* judges whether the test is bad, which is the self-preference setup.
- Realistic-distribution results (OOPSLA 2025) warn that classifier accuracy on curated sets overstates field performance.
- **Supports T5/T7.** Code decides; the LLM only rates.

### Recommendations
1. Build a **human-labelled gold set**: ≥100 failures, stratified across real_defect / bad_test / environment, double-labelled by two QE engineers. Report **Cohen's kappa** for human–human and human–LLM agreement; target kappa ≥ 0.6 before automating.
2. Use a **different model family** (or a 2–3-model panel with majority vote) for TRIAGE than for GEN. Abstain when the panel disagrees, and send those cases to the review queue.
3. Require the judge to emit **evidence first** (request/response diff, AC clause, environment signals), then a label.
4. Track **per-class precision and recall**, not just accuracy. A missed real_defect (misclassified as bad_test) is the costly error.

---

## 5. Flaky test detection

### Key findings
- **Google (2016 blog, foundational):**
  - About 1.5% of all test runs report a flaky result, and almost 16% of tests show some flakiness.
  - **About 84% of pass→fail transitions involve a flaky test.**
  - Mitigations: a test is reported failed only if it fails 3 times in a row; flaky tests are auto-quarantined with bugs filed. Google notes this "encourages developers to tolerate flakiness".
  - New flaky tests arrive as fast as old ones are fixed.
- **Rerun counts needed:**
  - Gruber et al. (ICST 2021), 22,352 Python projects: **95% confidence that a passing test is not flaky needs ~170 reruns** on average. Root causes: 59% order dependency, 28% test infrastructure, 13% network/randomness.
  - Lam et al. (ISSRE 2020) re-ran suites **4,000 times**. Alshammari et al., FlakeFlagger (ICSE 2021), re-ran 24 projects **10,000 times each**, and some known flaky tests were *still* not detected.
- **Industry 2025 (Atlassian, Dec 2025):**
  - Flaky tests caused about 21% of Jira Frontend master build failures and about 15% of Jira backend failures, costing **>150,000 developer hours/year**.
  - Flakinator combines **retry-based detection** (81% detection for some products) with **Bayesian flakiness scoring** from history, quarantines with ticket + deadline, and re-admits a test after a healthy period. It recovered 22,000+ builds and found 7,000 flaky tests.
- **Developer impact:**
  - Parry et al. (ICSE-SEIP 2022), 170 survey responses: developers who see flakiness more often are **more likely to ignore genuine failures**. Setup and teardown are the top cause.
  - Gruber & Fraser (ICST 2023), 335 practitioners: **loss of trust in outcomes** worries them more than compute cost.

### Bearing
- **RUN3 matches Google's 3-strike convention**, so it is defensible as a *gate*. As a *detector* it is weak. If a test fails independently with probability p per run, P(mixed result in 3 runs) = 1 − (1−p)³ − p³:
  - p = 1% → 3%
  - p = 5% → 14%
  - p = 10% → 27%

  Most low-rate flaky tests will show "all-pass" and enter the suite undetected.
- The **28.8% quarantine rate** is high next to Google's ~16% of tests with *any* flakiness. It suggests generated tests or environment reset are a major flakiness source; order dependency and setup/teardown are the top published causes. Classify why before tuning reruns.
- **Supports T3/T4.** Flakiness, not generation, is the dominant cost.

### Recommendations
1. Keep RUN3 as the admission gate, but add **history-based flakiness scoring** (e.g., Bayesian, Atlassian-style) across all CI runs. Admit tests on probation and promote them after N consecutive clean runs.
2. Add **order randomisation** and an isolated-vs-in-suite run to RUN3 to expose order-dependency.
3. Give quarantine an **owner, a deadline and a re-admission rule**; quarantined tests must not silently count toward coverage.
4. Record a **root-cause category** for each quarantined test (order, setup/teardown, async/timing, network, data/state reset, randomness). Report the 28.8% broken down by cause.

---

## 6. Agent architecture best practice 2025–26

### Key findings
- **Anthropic, "Building effective agents"** (Dec 2024):
  - *Workflows* (predefined code paths) vs *agents* (model-directed).
  - Patterns: chaining, routing, parallelization, orchestrator-workers, **evaluator-optimizer** (use when clear evaluation criteria exist).
  - Start simple; add complexity only when it demonstrably helps; get "ground truth from the environment at each step"; sandbox and guardrail; invest in tool documentation.
- **Anthropic, "Demystifying evals for AI agents"** (Jan 2026): code-based graders first, model graders calibrated against humans, human graders as gold standard, pass@k vs pass^k, clean isolated trials.
- **Structured outputs** (Claude platform docs): JSON-schema constrained outputs and `strict` tool use guarantee schema-valid output on supported models (incl. Sonnet 4.5). Limits:
  - unsupported constraints: `pattern`, `minimum`/`maximum`, `minLength`/`maxLength`;
  - 24 optional parameters and 16 union-typed parameters per request;
  - refusal or max-token outputs may not match the schema;
  - enums can differ in case.
- **Model versioning and deprecation** (Claude platform docs, opened 2026-10-06):
  - Dated snapshot IDs are fixed; aliases move. Use specific IDs in production.
  - **Claude Sonnet 4.5: deprecated 2026-09-30, retirement 2026-11-30**; requests after that date fail. The recommended replacement is `claude-sonnet-5-5`, with at least 60 days' notice policy.
- **OpenRouter provider routing** (docs): requests are **load-balanced across providers by default**, with fallbacks. Pin with `provider.order` / `only` + `allow_fallbacks:false`, `require_parameters`, and `quantizations` filters.
- **OpenTelemetry GenAI semantic conventions:** spans, metrics and events for GenAI clients, agents, MCP and providers (incl. Anthropic, OpenAI). Now maintained in a dedicated repo; the schema URL is still "TODO", so the conventions are evolving. A formal stability level was not confirmed. **[UNVERIFIED stability]**
- **MCP:** open protocol with a formal TypeScript/JSON-Schema spec (schema dated 2026-07-28), SEP governance and a registry. The full security-principles section was not opened. **[UNVERIFIED details]**
- **OWASP Top 10 for LLM Apps 2025:** LLM01 Prompt Injection … LLM06 Excessive Agency … LLM10 Unbounded Consumption.
  - LLM01 mitigations: constrain behaviour, **validate output format with deterministic code**, segregate untrusted content, human approval for high-risk actions, adversarial testing.
  - LLM06 root causes: excessive functionality, excessive permissions, excessive autonomy. Mitigations: minimal tools and permissions, avoid open-ended tools, **complete mediation** in downstream systems rather than trusting LLM judgement, HITL for high-impact actions, logging.
- **OWASP Agentic AI Threats & Mitigations** (Feb 2025): threats include memory poisoning, tool misuse and privilege compromise. **OWASP Top 10 for Agentic Applications 2026** was published 2025-12-09; the ASI01–ASI10 list sits in the downloadable PDF, which was not opened. **[UNVERIFIED list contents]**
- **Prompt/version management:** no vendor-neutral primary standard was found. **[UNVERIFIED]** — practice only.
- **OpenAI "A practical guide to building agents"** (2025): could not be opened (access withdrawn). **[UNVERIFIED]**

### Bearing
- **The architecture is a textbook "workflow", not an "agent"**, which Anthropic recommends for well-defined tasks. **GATE + GEN is an evaluator-optimizer variant.** This supports T7.
- **Supports T5.** OWASP explicitly recommends deterministic validation of output format, and constrained decoding now makes schema conformance a guarantee rather than a request.
- **Challenges the "single model, temperature 0, via OpenRouter" reproducibility claim on two counts:** (a) imminent model retirement; (b) provider load-balancing, which adds cross-provider variance on top of batch nondeterminism.
- **Prompt injection is relevant.** Requirements text, API responses and error bodies are *untrusted input* fed to GEN and TRIAGE. A malicious or accidental "ignore previous…" in a story or response body could steer triage.

### Recommendations
1. **Migrate off Sonnet 4.5 before 2026-11-30.** Re-run the full baseline (catch, FP, quarantine, triage) on the replacement as a paired comparison. Version the model as part of every result record.
2. **Pin the OpenRouter provider** (`only:["anthropic"]`, `allow_fallbacks:false`, `require_parameters:true`), or call the vendor API directly. Log the `provider` and response model returned per call.
3. Use **structured outputs / strict tool use** for TestCase, GATE and TRIAGE schemas. Enforce the unsupported constraints (patterns, ranges) in post-validation code.
4. Emit **OpenTelemetry GenAI spans** (model, provider, tokens, prompt version hash, latency) per LLM call. Join trace IDs to requirement / test / defect IDs to replace file-based traceability with a queryable DB (consistent with T6).
5. Treat requirement text and SUT responses as **untrusted**: delimit them, never let them select tools, and keep TRIAGE output advisory (code and human decide). Give the runner least-privilege credentials scoped to the test environment (LLM06).
6. Version prompts in git with a content hash and record the hash in every result row.

---

## 7. Requirements quality and testability

### Key findings
- **ISO/IEC/IEEE 29148:2018** (Edition 2) is the requirements engineering process standard. Its ISO status is *under revision*: confirmed 2024, with a DIS replacement expected.
- Characteristics of individual requirements, as quoted in arXiv 2408.10886 (RE 2024): **necessary, appropriate, unambiguous, complete, singular, feasible, verifiable, correct, conforming**. Set-level characteristics (complete, consistent, feasible, comprehensible, able to be validated) are from memory of the standard and were not verified from an opened source. **[UNVERIFIED]**
- **LLM as requirements QA** (arXiv 2408.10886, RE@Next 2024): an LLM rated 29148 characteristics with explanations. It was **stricter than humans**: humans marked 62 vs the LLM's 40 characteristics as fulfilled (Stopwatch) and 514 vs 225 (DigitalHome).
- **Industrial ambiguity detection** (Bashir, Ferrari et al., ICSME 2025 Industry, Westermo/Alstom): 10 in-context examples gave +20.2% ambiguity classification performance vs zero-shot. 8 experts rated the explanations 3.84/5.
- **Requirement smells → LLM task performance** (Vogelsang et al., ICSE-NIER 2025): a small but significant effect on trace-link prediction and none on line-level tracing, so the effects are task-dependent.
- **Frattini et al.** (REJ 2023, harmonized theory): requirements quality should be defined by its **impact on the activities that use the requirement** (activity-based), not by normative rules alone.
- **Requirement quality → test quality (direct evidence):**
  - RESTestBench (vague requirements −26 to −40 pp mutation score).
  - APITestGenie (documentation quality a critical success factor).
  - Thoughtworks experiment (Jul 2025, 9 stories): 87% correctness, 98.7% AC coverage, 27% of cases had ambiguity concerns, "heavy dependence on input quality".
- **LLMs improving stories:**
  - Austrian Post (2024): an LLM agent improved user story quality with 11 participants in 6 teams.
  - "Can LLMs generate user stories and assess their quality?" (2025, 10 LLMs): generated stories meet acceptance quality criteria less often than human ones, but LLMs reliably assess semantic quality given clear criteria.

### Bearing
- **Strongly supports T2** and the team's conclusion that requirement fidelity is the binding constraint. It also supports the GATE's existence.
- The GATE's 6 dimensions map onto 29148 as follows:

  | GATE dimension | 29148 characteristic |
  |---|---|
  | oracle | verifiable |
  | criteria clarity | unambiguous |
  | actor/preconditions | complete |
  | interface grounding | feasible / complete |
  | consistency | set-level consistent |
  | atomicity | singular |

  - **Not covered:** *correct* (does the AC reflect the real need?), *necessary*, *appropriate* (implementation-free) and *conforming*.
  - "Correct" cannot be checked by an LLM at all (T1), so it needs the human/PO loop.
- The LLM-stricter-than-human finding implies a **false-block risk** for GATE. Its precision and recall need measuring against humans, just like TRIAGE.

### Recommendations
1. Calibrate the GATE on a **human-labelled set** of requirements (testable / not, with reasons). Report block precision and recall plus kappa, and include few-shot examples drawn from your domain (+20% in the ICSME study).
2. Add a **"correctness / confirmed-by-owner"** status that only a human can set. Treat the GATE as necessary but not sufficient.
3. Close the loop **activity-based**, per Frattini: measure downstream test catch and FP per GATE score band. This shows which dimensions actually predict test quality, and turns T8 into data.
4. Use clarifying questions as a product. Track the time to answer and how often an answer changes the generated oracle.

---

## 8. Governance for AI in regulated testing

### Key findings
- **EU AI Act:**
  - Annex III high-risk areas: biometrics, critical infrastructure (safety components), education, employment, essential services, law enforcement, migration, justice/democracy. **Software testing / QA tooling is not listed**, so an internal test-generation tool is not high-risk per se.
  - It can, however, become part of the evidence chain for a high-risk system (e.g., a safety component of critical infrastructure). Use of AI to **evaluate worker performance** would fall under Annex III(4).
  - **Article 4 (AI literacy)** applies to all providers and deployers from **2 Feb 2025**.
  - **Article 14 (human oversight, for high-risk systems)** requires that overseers "remain aware of the possible tendency of automatically relying or over-relying" on output (automation bias), can correctly interpret outputs, and can override or disregard them.
- **ISO/IEC 42001:2023** (published 18 Dec 2023): the first AI management system standard (PDCA), for organizations of any size developing, providing or using AI.
- **NIST AI RMF 1.0** (26 Jan 2023): Govern / Map / Measure / Manage. **NIST AI 600-1 Generative AI Profile** (26 Jul 2024) adds GenAI-specific risks and actions.
- **Automation bias evidence:**
  - Romeo & Conti (AI & Society 2025, 35 studies, 2015–2025): expertise is the strongest protective factor. Cognitive load and verification complexity increase over-reliance, and moderate AI literacy can increase it. "User engagement" via **verification-demanding** interventions works better than passive explanations.
  - Perry et al. (CCS 2023): users with an AI assistant wrote **significantly less secure code yet were more confident**. Those who trusted the AI less did better.
  - Industrial LLM code review (Automated Code Review In Practice, 238 practitioners, 10 projects, 2024/25): 73.8% of automated comments were resolved, yet PR closure time **rose from ~5h52m to ~8h20m**, with complaints of faulty or irrelevant comments.

### Bearing
- **Supports T9**, and refines it: a human in the loop is only effective if the review is designed against rubber-stamping. Article 14 makes automation-bias awareness an explicit expectation for high-risk contexts.
- For a professional-services QE practice serving regulated clients, **42001 / AI RMF alignment** is the likely client ask, more than direct AI Act obligations on the test tool.

### Recommendations
1. Design the human review queue against automation bias:
   - show the **requirement clause and the assertion side by side**;
   - require reviewers to **actively confirm the expected value** (e.g., type or select it) rather than click "approve";
   - **seed known-bad tests** into the queue (canaries) to measure reviewer catch rate;
   - cap review batch size.
2. Log reviewer decisions with identity and timestamp (audit trail, T6). Measure the **override rate**: near 0% suggests rubber-stamping.
3. Map controls to **NIST AI RMF** (Govern / Map / Measure / Manage) and **ISO 42001** for client assurance. Document intended use, out-of-scope uses and model change control (ties to §6 migration).
4. Provide **AI-literacy training** for QE staff using the tool (EU Art. 4 applies regardless of risk class).

---

## 9. Economics

### Key findings
- **Atlassian (Dec 2025):** flaky tests behind about 15% of Jira backend failures cost **>150,000 developer hours/year**, and caused about 21% of Jira Frontend master failures.
- **Google (2016):** about 84% of pass→fail transitions involve flaky tests, so most red builds are noise.
- **Trust erosion as the main cost:** Parry et al. (2022) found habituation leads developers to ignore real failures. Gruber & Fraser (2023) found practitioners rank loss of trust above compute cost.
- **Maintenance:** in an industrial visual-GUI-testing study, 59.1% and 47.8% of test cases failed on the next version and needed rework.
- **Acceptance as an economic filter:** Meta's 73% acceptance (TestGen-LLM, ACH) came *after* filters discarded most generations (only 25% of TestGen-LLM candidates improved coverage). The review cost of the remaining 27% rejections is not reported.
- **LLM review overhead:** LLM-assisted code review raised PR closure time by about 42% in one industrial study.
- **Value-of-a-test models:** no 2023–26 primary quantitative model of per-test value was found and opened. The classic Google "Testing on the Toilet" and SWE-book material on brittle-test cost could not be opened. Google's 2018 CACM static-analysis paper, commonly cited for a "<10% effective false-positive" threshold, could not be opened. **[UNVERIFIED]**

### Bearing
- **Supports T3 and T4** quantitatively: run/maintain/triage cost dominates generation cost, and false positives cost trust, not just minutes.
- An **18% FP rate** on uncurated requirements would, by the Parry/Gruber mechanism, train reviewers to ignore failures. It is above any defensible tolerance for a CI-blocking suite.

### Recommendations
1. Define an explicit **cost model per test**: (review minutes + expected maintenance + flaky reruns × CI cost + FP triage minutes) vs (P(catch) × cost of an escaped defect for that requirement's risk class). Prune tests below break-even (T4).
2. Set **FP budgets** by lane. Blocking CI lane: FP well under 5% (internal target; no verified external threshold). Advisory lane: higher. Promote tests from advisory to blocking only after a clean history.
3. Report **developer-hours** (review, triage, quarantine fixing) alongside catch and FP rates, so the business case is in the currency stakeholders use.

---

## Mapping to first principles (summary)

| Principle | External evidence | Verdict |
|---|---|---|
| T1 oracle written not guessed | Konstantinou 2024; RESTestBench 2026; Molinelli 2025; arXiv 2405.12766 | **Strongly supported** |
| T2 output capped by input quality | RESTestBench (−26 to −40 pp vague); APITestGenie; Thoughtworks; Frattini | **Strongly supported** |
| T3 generation cheap, rest not | TestGen-LLM filters; Atlassian 150k h; LLM review +42% PR time | **Supported** |
| T4 test value economic | Parry, Gruber & Fraser (trust); Atlassian | Supported; no verified quantitative value model |
| T5 prompts ≠ enforcement | OWASP LLM01/LLM06; structured outputs docs | **Supported**; constrained decoding now available |
| T6 no memory; traceability in DB | OTel GenAI semconv; Art. 14 auditability | Supported; files → DB recommended |
| T7 ordinary software where it suffices | Anthropic workflows vs agents; CoverUp ("components not LLM") | **Supported** |
| T8 feedback loop needs measured outcomes | Anthropic evals (2026); Miller (2024) | Supported; **current n too small to close the loop** |
| T9 humans in loop for regulated work | EU AI Act Art. 14; automation-bias reviews | Supported, **with the caveat that HITL must be designed against rubber-stamping** |

Design choices most **challenged**:
- RUN3 as a flakiness *detector*;
- same-family TRIAGE judge;
- 12-defect catalog and its CIs;
- temperature-0 reproducibility via OpenRouter;
- the Sonnet 4.5 retirement date;
- GATE calibration (LLMs are stricter than humans).

---

## Sources

| Title | Publisher / venue | Year | URL |
|---|---|---|---|
| Automated Unit Test Improvement using Large Language Models at Meta (TestGen-LLM) | FSE 2024 Industry / arXiv | 2024 | https://arxiv.org/abs/2402.09171 |
| Mutation-Guided LLM-based Test Generation at Meta (ACH) | FSE 2025 Industry / arXiv | 2025 | https://arxiv.org/abs/2501.12862 |
| Revolutionizing software testing: Introducing LLM-powered bug catchers (ACH) | Meta Engineering blog | 2025 | https://engineering.fb.com/2025/02/05/security/revolutionizing-software-testing-llm-powered-bug-catchers-meta-ach/ |
| TestGenEval: A Real World Unit Test Generation and Test Completion Benchmark | ICLR 2025 / arXiv | 2024 | https://arxiv.org/abs/2410.00752 |
| SWT-Bench: Testing and Validating Real-World Bug-Fixes with Code Agents | NeurIPS 2024 / arXiv | 2024 | https://arxiv.org/abs/2406.12952 |
| CoverUp: Coverage-Guided LLM-Based Test Generation | arXiv (FSE 2025) | 2024 | https://arxiv.org/abs/2403.16218 |
| HITS: High-coverage LLM-based Unit Test Generation via Method Slicing | ASE 2024 / arXiv | 2024 | https://arxiv.org/abs/2408.11324 |
| RESTGPT: Leveraging LLMs to Enhance REST API Testing | ICSE-NIER 2024 / arXiv | 2023 | https://arxiv.org/abs/2312.00894 |
| A Multi-Agent Approach for REST API Testing with Semantic Graphs and LLM-Driven Inputs (AutoRestTest) | ICSE 2025 / arXiv | 2024 | https://arxiv.org/abs/2411.07098 |
| LlamaRestTest: Effective REST API Testing with Small Language Models | FSE 2025 / arXiv | 2025 | https://arxiv.org/abs/2501.08598 |
| APITestGenie: Automated API Test Generation through Generative AI | arXiv | 2024 | https://arxiv.org/abs/2409.03838 |
| APITestGenie – Automatic API Integration Test Generation from Business Requirements and OpenAPI Specifications | arXiv | 2026 | https://arxiv.org/abs/2604.02039 |
| RESTestBench: A Benchmark for Evaluating the Effectiveness of LLM-Generated REST API Test Cases from NL Requirements | EASE 2026 / arXiv | 2026 | https://arxiv.org/abs/2604.25862 (results: https://arxiv.org/html/2604.25862) |
| Acceptance Test Generation with Large Language Models: An Industrial Case Study | arXiv | 2025 | https://arxiv.org/abs/2504.07244 |
| Playwright v1.56.0 release notes (Playwright Agents) | Microsoft / GitHub | 2025 | https://github.com/microsoft/playwright/releases/tag/v1.56.0 |
| Do LLMs generate test oracles that capture the actual or the expected program behaviour? | arXiv | 2024 | https://arxiv.org/abs/2410.21136 |
| Do LLMs Generate Useful Test Oracles? An Empirical Study with an Unbiased Dataset | ASE 2025 | 2025 | https://homes.cs.washington.edu/~mernst/pubs/neurosymbolic-oracles-ase2025-abstract.html |
| Test Oracle Automation in the era of LLMs | arXiv (TOSEM) | 2024 | https://arxiv.org/abs/2405.12766 |
| AugmenTest: Enhancing Tests with LLM-Driven Oracles | arXiv (ICST 2025) | 2025 | https://arxiv.org/abs/2501.17461 |
| Understanding LLM-Driven Test Oracle Generation | arXiv | 2026 | https://arxiv.org/abs/2601.05542 |
| Can Large Language Models Write Good Property-Based Tests? | arXiv | 2023/24 | https://arxiv.org/abs/2307.04346 |
| Understanding the Characteristics of LLM-Generated Property-Based Tests in Exploring Edge Cases | arXiv | 2025 | https://arxiv.org/abs/2510.25297 |
| ARMeta: A Tool-Supported Approach for Metamorphic Testing of REST APIs | arXiv | 2026 | https://arxiv.org/abs/2605.28321 |
| Are mutants a valid substitute for real faults in software testing? (foundational) | FSE 2014 | 2014 | https://homes.cs.washington.edu/~mernst/pubs/mutation-effectiveness-fse2014-abstract.html |
| Are Mutation Scores Correlated with Real Fault Detection? (foundational) | ICSE 2018 | 2018 | https://conf.researchr.org/details/icse-2018/icse-2018-Technical-Papers/78/Are-Mutation-Scores-Correlated-with-Real-Fault-Detection-A-Large-Scale-Empirical-stu |
| Do Coverage and Mutation Scores of LLM-Generated Test Suites Correlate with Their Effectiveness? (Replicability Study) | arXiv | 2026 | https://arxiv.org/pdf/2607.22880 |
| Defects4J (v3.0.1) | GitHub (rjust) | 2024–25 | https://github.com/rjust/defects4j |
| LLM is Like a Box of Chocolates: the Non-determinism of ChatGPT in Code Generation | arXiv (TOSEM) | 2023 | https://arxiv.org/abs/2308.02828 |
| Non-Determinism of "Deterministic" LLM Settings | arXiv | 2024 | https://arxiv.org/abs/2408.04667 |
| Defeating Nondeterminism in LLM Inference | Thinking Machines Lab | 2025 | https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ |
| Adding Error Bars to Evals: A Statistical Approach to Language Model Evaluations | Anthropic / arXiv | 2024 | https://arxiv.org/html/2411.00640 |
| Evaluating Large Language Models Trained on Code (pass@k; foundational) | arXiv | 2021 | https://arxiv.org/abs/2107.03374 |
| Demystifying evals for AI agents | Anthropic Engineering | 2026 | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents |
| Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | NeurIPS 2023 D&B / arXiv | 2023 | https://arxiv.org/abs/2306.05685 |
| Large Language Models are not Fair Evaluators | ACL 2024 / arXiv | 2023 | https://arxiv.org/abs/2305.17926 |
| LLM Evaluators Recognize and Favor Their Own Generations | NeurIPS 2024 / arXiv | 2024 | https://arxiv.org/abs/2404.13076 |
| Replacing Judges with Juries: Evaluating LLM Generations with a Panel of Diverse Models | arXiv | 2024 | https://arxiv.org/abs/2404.18796 |
| Judging the Judges: Evaluating Alignment and Vulnerabilities in LLMs-as-Judges | arXiv | 2024 | https://arxiv.org/abs/2406.12624 |
| Understanding and Improving Flaky Test Classification (FlakyLens) | OOPSLA 2025 (SPLASH) | 2025 | https://2025.splashcon.org/details/OOPSLA/116/Understanding-and-Improving-Flaky-Test-Classification |
| "LLMs-as-Annotators" for Categorizing Root Causes of Flaky Tests in Industrial Database Systems | arXiv | 2026 | https://arxiv.org/abs/2602.03556 |
| Flaky Tests at Google and How We Mitigate Them (foundational) | Google Testing Blog | 2016 | https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html |
| An Empirical Study of Flaky Tests in Python | ICST 2021 / arXiv | 2021 | https://arxiv.org/abs/2101.09077 |
| Understanding Reproducibility and Characteristics of Flaky Tests Through Test Reruns in Java Projects | ISSRE 2020 | 2020 | https://experts.illinois.edu/en/publications/understanding-reproducibility-and-characteristics-of-flaky-tests-/ |
| FlakeFlagger: Predicting Flakiness Without Rerunning Tests | ICSE 2021 | 2021 | https://2021.icse-conferences.org/details/icse-2021-papers/115/FlakeFlagger-Predicting-Flakiness-Without-Rerunning-Tests |
| Test Flakiness' Causes, Detection, Impact and Responses: A Multivocal Review | arXiv / JSS | 2022/23 | https://arxiv.org/abs/2212.00908 |
| Taming test flakiness: how we built a scalable tool to detect and manage flaky tests | Atlassian Engineering | 2025 | https://www.atlassian.com/blog/atlassian-engineering/taming-test-flakiness-how-we-built-a-scalable-tool-to-detect-and-manage-flaky-tests |
| Surveying the Developer Experience of Flaky Tests | ICSE-SEIP 2022 | 2022 | https://conf.researchr.org/details/icse-2022/icse-2022-seip---software-engineering-in-practice/26/Surveying-the-Developer-Experience-of-Flaky-Tests |
| A Survey on How Test Flakiness Affects Developers and What Support They Need | ICST 2023 | 2023 | https://conf.researchr.org/details/icst-2023/icst-2023-previous-editions/17/A-Survey-on-How-Test-Flakiness-Affects-Developers-and-What-Support-They-Need-To-Addre |
| Building Effective AI Agents | Anthropic Engineering | 2024 | https://www.anthropic.com/engineering/building-effective-agents |
| Structured outputs | Claude Platform Docs (Anthropic) | 2025–26 | https://platform.claude.com/docs/en/build-with-claude/structured-outputs |
| Models overview | Claude Platform Docs (Anthropic) | 2026 | https://platform.claude.com/docs/en/models/overview |
| Model deprecations | Claude Platform Docs (Anthropic) | 2026 | https://platform.claude.com/docs/en/about-claude/model-deprecations |
| Provider Routing | OpenRouter Docs | 2025–26 | https://openrouter.ai/docs/features/provider-routing |
| GenAI semantic conventions (moved notice) | OpenTelemetry | 2025–26 | https://opentelemetry.io/docs/specs/semconv/gen-ai/ |
| semantic-conventions-genai repository | OpenTelemetry / GitHub | 2026 | https://github.com/open-telemetry/semantic-conventions-genai |
| Model Context Protocol specification repository | MCP / GitHub | 2026 | https://github.com/modelcontextprotocol/modelcontextprotocol |
| OWASP Top 10 for LLM Applications 2025 | OWASP GenAI Security Project | 2024/25 | https://genai.owasp.org/llm-top-10/ |
| LLM01:2025 Prompt Injection | OWASP GenAI Security Project | 2025 | https://genai.owasp.org/llmrisk/llm01-prompt-injection/ |
| LLM06:2025 Excessive Agency | OWASP GenAI Security Project | 2025 | https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ |
| Agentic AI – Threats and Mitigations | OWASP GenAI Security Project | 2025 | https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/ |
| OWASP Top 10 for Agentic Applications for 2026 | OWASP GenAI Security Project | 2025 | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ |
| ISO/IEC/IEEE 29148:2018 Requirements engineering | ISO | 2018 (under revision) | https://www.iso.org/standard/72089.html |
| Leveraging LLMs for the Quality Assurance of Software Requirements | RE 2024 (RE@Next!) / arXiv | 2024 | https://arxiv.org/abs/2408.10886 |
| Requirements Ambiguity Detection and Explanation with LLMs: An Industrial Study | ICSME 2025 Industry | 2025 | https://conf.researchr.org/details/icsme-2025/icsme-2025-industry-track/8/Requirements-Ambiguity-Detection-and-Explanation-with-LLMs-An-Industrial-Study |
| On the Impact of Requirements Smells in Prompts: The Case of Automated Traceability | ICSE-NIER 2025 | 2025 | https://conf.researchr.org/details/icse-2025/icse-2025-nier/6/On-the-Impact-of-Requirements-Smells-in-Prompts-The-Case-of-Automated-Traceability |
| Requirements Quality Research: a harmonized Theory, Evaluation, and Roadmap | Requirements Engineering Journal | 2023 | https://arxiv.org/abs/2309.10355 |
| AI-generated test cases from user stories: an experimental research study | Thoughtworks | 2025 | https://www.thoughtworks.com/insights/blog/generative-ai/AI-generated-test-cases-from-user-stories-an-experimental-research-study |
| LLM-based agents for automating the enhancement of user story quality: An early report | arXiv (XP 2024) | 2024 | https://arxiv.org/abs/2403.09442 |
| Can LLMs Generate User Stories and Assess Their Quality? | arXiv | 2025 | https://arxiv.org/abs/2507.15157 |
| EU AI Act – Annex III (High-risk AI systems) | artificialintelligenceact.eu (FLI) | 2024 | https://artificialintelligenceact.eu/annex/3/ |
| EU AI Act – Article 14 Human Oversight | artificialintelligenceact.eu (FLI) | 2024 | https://artificialintelligenceact.eu/article/14/ |
| EU AI Act – Article 4 AI Literacy | artificialintelligenceact.eu (FLI) | 2024 | https://artificialintelligenceact.eu/article/4/ |
| ISO/IEC 42001:2023 AI management systems | ISO | 2023 | https://www.iso.org/standard/42001 |
| AI Risk Management Framework (AI RMF 1.0; AI 600-1 GenAI Profile) | NIST | 2023 / 2024 | https://www.nist.gov/itl/ai-risk-management-framework |
| Exploring automation bias in human–AI collaboration: a review and implications for explainable AI | AI & Society (Springer) | 2025 | https://link.springer.com/article/10.1007/s00146-025-02422-7 |
| Do Users Write More Insecure Code with AI Assistants? | ACM CCS 2023 / arXiv | 2023 | https://arxiv.org/abs/2211.03622 |
| Automated Code Review In Practice | ICSE-SEIP 2025 / arXiv | 2024 | https://arxiv.org/abs/2412.18531 |
| Visual GUI testing in practice: An extended industrial case study | arXiv | 2020 | https://arxiv.org/abs/2005.09303 |

**Not opened / unverified:**
- ChatUniTest
- Just et al. full text ("73% coupled" figure)
- Memon et al. "Taming Google-scale continuous testing" full text
- Google SWE book testing chapters
- Google CACM 2018 static analysis FP threshold
- OpenAI "A practical guide to building agents"
- MCP spec security section
- OWASP Agentic Top 10 item list
- Playwright test-agents doc page (release notes used instead)
- OTel GenAI stability level
