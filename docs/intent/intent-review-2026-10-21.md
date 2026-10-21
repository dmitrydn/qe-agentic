# Review of intent.md v1 — first-principles check

**Date:** 2026-10-21 · **Reviewed:** `intent.md` v1 (2026-10-20) · **Result:** v1 replaced by v2

**Method:** start from what must be true for any check of software to be worth trusting. Derive which checks agentic delivery needs from those truths and from the evidence we hold, which is the BATC accelerator analysis and our own experiments. Then compare that derived list with what v1 proposed. v1 was not allowed to justify itself by pointing to a slide or a plan.

---

## 1. First principles used

| # | Principle | Why it holds |
|---|---|---|
| P1 | A test needs three things: an action, an observation, and an **expected result** stated in advance | Without the expected result there is nothing to compare against. A test that "passes" then proves nothing |
| P2 | The expected result must come from **outside the code being checked**: the requirement, a business rule, a contract | Reading the expected result from the code only confirms the code does what the code does. Our code-knowledge experiment (graph-based hints) failed for exactly this reason |
| P3 | If the same agent writes both the code and the tests from the same reading of the requirement, the tests check that reading, not the requirement | Two outputs that agree with each other are not proof that either is right |
| P4 | A claim such as "Tested" or "Done" is only worth the evidence behind it: which requirement version, which test, which run, which result | BATC's own June 2026 review found its traceability statuses did not match reality, in both directions; none of its checks compares a status with executed results |
| P5 | Requirements change. Tests written for an older version quietly become wrong | Nothing in BATC or in our experiments tracks this today |
| P6 | AI judgement varies between runs and can be confidently wrong. A check that **stops** work must be repeatable, or a person must make the call | The same BATC skill gave different behaviour depending on the model and the run |
| P7 | The checking system is itself software and needs its own tests | BATC tested its code well and its AI behaviour not at all, and shipped a release where 15 of 24 skills depend on a missing file |
| P8 | Writing code and tests became cheap; checking and approving did not. The bottleneck is checking | Value lies in reducing the cost of trustworthy checking, not in producing more tests |

## 2. What the evidence shows is missing

| Evidence | Source | Principle |
|---|---|---|
| Requirement statements that were untrue of the system (endpoints that don't exist, rules the system never enforces) caused most of our wrong test failures | Sandbox Stages 8–9 | P1, P2 |
| Giving the AI more knowledge of the code did not reduce wrong failures | Sandbox Stage 8 | P2 |
| BATC's traceability statuses drifted from reality (its own June 2026 review); its test-sync skill has no check comparing a "Tested" status with executed results, so a planted over-claim went undetected in our test | BATC documentation (implemented-vs-planned, 2026-06-12); BATC portability test | P4 |
| BATC's QA skills stop at step 1 on Java and Playwright projects; they are tied to BATC's own folder layout and TypeScript stack | BATC analysis (F1, F4) | Must work on any stack |
| BATC's gates check that files exist and look right, not that the skills work | BATC analysis (F2, F3), Bug 2347 | P7 |
| Our own headline accuracy numbers were small samples, labelled by the builder and partly adjusted after seeing results; the one pre-planned experiment was negative | Sandbox adversarial review A–E, Stage 10 | P7 |
| Wrong failures were caused by unstable tests as well as by bad requirements; repeating each test 3 times and treating mixed results as "unstable" made this visible | Sandbox Stage 6 | P4, P6 |

## 3. Findings on v1

| # | Finding | Severity | Resolution in v2 |
|---|---|---|---|
| R1 | **Scope came from a slide, not from analysis.** v1 §3 and §4 define scope as "the 5 agents on slide A4". That makes the intent circular: the plan justifies itself | High | v2 derives each capability from a principle and the evidence above (v2 §4). Slides are not cited |
| R2 | **Independence of test design is missing.** P3 is the core reason an independent QE check has value, yet v1 lets the test-design agent read anything | High | v2 rule: the test-design capability reads the requirement and the system's public interface only, never the implementation code (v2 §5, rule 1) |
| R3 | **"Release readiness" is not an agent.** It adds no judgement beyond collecting results from the other checks; making it an AI step adds variability (P6) where none is needed | Medium | v2 makes it a repeatable report built from evidence, no AI decision (C5) |
| R4 | **Unstable tests are not handled**, yet v1 counts "covered and passing". A single run cannot separate a real pass from luck (P4, P6) | Medium | v2 puts the rerun rule (3 runs, reset between runs, mixed = unstable) inside the evidence capability (C3) |
| R5 | **No baseline to beat.** v1's pass marks (e.g. "detection ≥ 80%") don't show the agent adds anything beyond asking the same AI model a plain question. The BATC portability test showed a plain prompt beat the BATC skills | High | v2 requires each AI capability to beat a plain-prompt baseline on the same eval set (v2 §8) |
| R6 | **Sample sizes not stated.** With 40 items, an 80% result has a 95% interval of roughly ±12 points. Pass marks without n can't be judged | Medium | v2 states minimum n and what the interval width allows us to conclude |
| R7 | **Second-model labelling overstated as independent.** Two AI models can share blind spots (P3, P6) | Medium | v2 sets an order: seeded defects first; second-model labels only where seeding is impossible; a person spot-checks |
| R8 | **Language excludes part of the audience.** Terms such as "oracle", "Wilson interval", "pre-registered", "import-boundary rule", "Layer-4", "WS2", "Lever-4b" are unexplained | Medium | v2 uses plain terms and adds a glossary |
| R9 | **No build order.** Five capabilities, two demo apps and evals in 6–8 weeks, with one builder. Doing the riskiest-to-value items last risks a demo with nothing proven | Medium | v2 orders the build by certainty and dependency: evidence (repeatable, no AI) → requirement check → claim check → test design → readiness report |
| R10 | **What BATC gets is unclear.** v1 says "thin adapter" but not which BATC steps, what BATC must supply, or what BATC receives | Medium | v2 §6 is written for the BATC team: plug-in points, inputs, outputs, and what stays untouched in BATC |
| R11 | **Failure triage left out without saying why.** Deciding whether a failure is a real defect, a bad test or an environment problem is where checking time goes (P8). It was the strongest mechanism in our sandbox | Low (for Phase 1) | v2 records it as the first candidate for Phase 2, with the reason it is deferred |

## 4. What stays from v1

The 20 Oct decisions stand: standalone core with a BATC adapter later, pipeline first, provider-neutral AI access, native test code on request, files as the first requirement source, advice not blocking, Node/TypeScript, pre-planned evals, internal demo only, Cypress RWA plus a Java app, a solo build of 6–8 weeks, and a joint go/no-go with the BATC team.

## 5. Capability set: v1 vs v2

| v1 agent | v2 capability | Change |
|---|---|---|
| A1 Requirement quality check | **C1 Requirement check** | Same purpose; now explicitly two questions: *is it checkable?* and *is it true of the system?* |
| A2 Test plan from the ACs | **C2 Independent test design** | Adds the independence rule (no implementation code) |
| A4 Execution evidence + drift | **C3 Execution evidence and change tracking** | Adds the rerun rule for unstable tests; built first |
| A3 Claim-vs-reality review | **C4 Claim check** | Same; ordered after C3 because it consumes C3's records |
| A5 Release readiness | **C5 Readiness report** | No longer an AI agent; a repeatable report |
| — | Failure triage | Considered; deferred to Phase 2 with reason |
