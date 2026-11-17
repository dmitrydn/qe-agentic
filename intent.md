# QE checks for agent-built software — Intent

**Version:** 2.1 (2026-11-17) · replaces v2 (2026-10-21) and v1 (2026-10-20) · review of v1: `docs/intent/intent-review-2026-10-21.md`
**Changed in 2.1:** TypeScript demo app is now RealWorld (Conduit), replacing Cypress Real World App; Java demo app is open again (§7, §11, §12). Details: `docs/handover/2026-11-17-realworld-sandbox/`
**Owner:** Dmitry (QE Manager) · **Status:** intent agreed, not yet built
**Written for:** the BATC accelerator team, QE leadership, guild leads and QE technology architects. Terms are explained in the glossary at the end.

---

## 1. In one paragraph

When AI agents write software, writing code and tests becomes cheap, but checking that the result does what the business asked for does not. We will build **five QE capabilities** that check agent-built work against the requirement. Each one is derived from first principles and from what we found in the BATC accelerator and in our own experiments. Each capability works **on its own**, or as **one step in a build pipeline**. Each works on **any technology stack, any requirement source and any approved AI provider**, through replaceable connectors. They produce **evidence and advice; a person decides**. Phase 1 ends with an **internal demo on two open-source applications**, one Java and one TypeScript. Every capability is measured with **evals planned before the first run**. After the demo, Dmitry and the BATC team decide together whether to continue to Phase 2: connecting to BATC and piloting on a client project.

## 2. The problem in plain words

- **Producing got cheap; checking did not.** Agents can produce code and tests faster than people can review them. The bottleneck moves to checking and approving.
- **Agents grading their own work is not a check.** If the same agent reads the requirement, writes the code and writes the tests, the tests confirm the agent's reading of the requirement. They do not confirm the requirement.
- **"Tested" and "Done" are claims.** Without a record of which test ran, against which version of the requirement, with which result, a status is an opinion.
- **Requirements change.** Tests written for an earlier version quietly stop being right.

## 3. First principles

| # | Principle | In practice |
|---|---|---|
| P1 | A test needs an action, an observation and an **expected result stated in advance** | No expected result in the requirement → nothing to test against |
| P2 | The expected result must come from **outside the code** being checked: the requirement, a business rule, a contract | Reading "what it should do" from the code only proves the code does what it does |
| P3 | Whoever checks must be **independent** of whoever produced the work | Test design must not see the implementation |
| P4 | A status is worth **only the evidence behind it** | Every "Tested" must link to an executed result for each acceptance criterion |
| P5 | Requirements **change**; tests for older versions become wrong | Track which requirement version each test was written for |
| P6 | AI judgement **varies and can be confidently wrong** | Anything that can stop a pipeline must be repeatable, or a person decides |
| P7 | The checking system is software and **needs its own tests** | Each capability is proven with its own evals before anyone relies on it |
| P8 | **Checking is the bottleneck**, not producing | Value = less effort for a trustworthy check, not more tests |

## 4. From principles and evidence to capabilities

Each capability exists because a principle requires it and the evidence shows it is missing today.

| Capability | Question it answers | Principles | Evidence it is needed |
|---|---|---|---|
| **C1 Requirement check** | Can this requirement be tested, and is it true of the system? | P1, P2 | In our sandbox, most wrong test failures came from requirements that were untrue of the system: endpoints that don't exist, rules the system never enforces. More knowledge of the code did not help (Stage 8 experiment, stopped with evidence) |
| **C2 Independent test design** | Which tests prove each acceptance criterion, including the failure cases? | P1, P3 | BATC's test-plan skill is tied to BATC's own stack and stops on Java/Playwright projects. No existing step keeps test design independent of the code |
| **C3 Execution evidence and change tracking** | What actually ran, for which requirement version, with what result, and has anything changed since? | P4, P5, P6 | BATC's own June 2026 review found its traceability statuses did not match reality; no check compares a status with executed results. In our sandbox, a single run could not separate real passes from unstable tests |
| **C4 Claim check** | Does the claimed status match the evidence? What is missing? | P4, P3 | BATC's test-sync skill has no check for a "Tested" status without evidence, so a planted over-claim went undetected. BATC's claim-vs-evidence review is its most reusable idea, but it needs real execution evidence to work |
| **C5 Readiness report** | For this release, what is proven, what is not, and what are the risks? | P4, P6, P8 | The person who approves a release needs one view of the evidence. It must be repeatable, so it is a report, not an AI decision |

**Considered and not in Phase 1:**
- **Failure triage**: deciding whether a failed test is a real defect, a bad test or an environment problem. It is where most checking time goes (P8), and the strongest result in our sandbox. It comes later because C3 must first produce trustworthy evidence. It is the first candidate for Phase 2.
- **Plan coverage check at BATC's plan-approval step**: does the plan address every acceptance criterion? It is cheap and repeatable, but adds little until C1 to C4 exist.
- **Code review agents**: the AI tool vendors already offer these. They don't check against the requirement.

## 5. Rules every capability follows

1. **Independence:** C2 designs tests from the requirement and the system's public interface (its API contract, screens) only. It never reads the implementation code. Checks never grade the work of the same run that produced it.
2. **Evidence over opinion:** C3, C4 and C5 base every statement on recorded runs and requirement versions. Where AI judgement is used (C1 ratings, C2 drafting, parts of C4), the output is marked as AI judgement.
3. **People decide:** only repeatable rule-based checks may fail a pipeline, and only if the project switches that on. AI judgements never block. Release approval is always a person's.
4. **Each capability stands alone:** each has its own input and output format, its own command, and its own evals. They connect through pipeline templates, not through each other's internals.
5. **Works anywhere:** stack, requirement source and AI provider plug in through connectors. Adding a new stack or source must not require changing a capability's core.
6. **Proven before use:** no capability is shown as working without results from evals planned in advance (§8).

## 6. How this fits BATC (for the BATC team)

BATC sets the delivery flow and governs the AI. These capabilities plug in at the points where an independent check is needed. **Nothing in BATC's governance changes**: no edits to BATC's rules, protected files or existing skills.

| BATC step | Capability | BATC provides | BATC receives |
|---|---|---|---|
| 1 Requirement / 2 Acceptance criteria | C1 Requirement check | Requirement text with acceptance criteria (today: BATC's requirement files) | Testable / needs clarification / not testable, with the questions to ask the author |
| 2 Acceptance criteria | C2 Independent test design | Approved requirement; target stack | Test cases per criterion; test code on request; links back to the requirement |
| 6 PR gate | C3 Execution evidence and change tracking | Test result files from the pipeline; requirement versions | Evidence record per criterion; list of tests made stale by requirement changes |
| 5 Gap review | C4 Claim check | Claimed status per requirement | Gap list: covered and passing / covered, not run / partly checked / not covered |
| 7 Release | C5 Readiness report | Release scope | One report for the person who signs off |

**Timing:** Phase 1 designs this connection (formats and plug-in points) but does not build it. Building starts in Phase 2, through BATC's planned plug-in mechanism or an equivalent, after BATC Bug 2347 (skills that reference a missing file) is fixed.

## 7. Phase 1 — scope and build order

**Goal:** an internal demo proving each capability on two open-source applications.

| Item | Phase 1 |
|---|---|
| Demo applications | **RealWorld (Conduit)** (TypeScript: Nitro API, Angular UI; tests in Playwright; sandbox in `sandboxes/realworld/`) and a Java web app with a REST API (**not yet selected**; tests in JUnit with RestAssured and Selenium) |
| Requirement source | Files: user stories with Given-When-Then acceptance criteria (Markdown), and Gherkin feature files |
| AI provider | One connector for development use in the sandbox; the design must allow other providers without core changes |
| Pipelines | Azure DevOps templates first |
| Builder / time | Dmitry with Claude Code, about 6–8 weeks |
| Audience | QE leadership and unit leads, guild leads and engineers, the BATC team |

**Build order** (most certain first; each step feeds the next):

1. **C3 Execution evidence and change tracking.** Rule-based, no AI, so the most certain to work, and everything else depends on its records.
2. **C1 Requirement check.** Partly designed and tested in the sandbox already.
3. **C4 Claim check.** Needs C3's records.
4. **C2 Independent test design**, including Java test code: the highest-risk item, so start a Java spike in week 1.
5. **C5 Readiness report.** Aggregates C1 to C4.

## 8. How we prove each capability works

**Method, in plain words:**
- **Plan the measurement before running it.** For each capability, write down the test set, the expected answers and the pass mark, and freeze them before the first measured run. No adjusting the test set after seeing results.
- **Expected answers come first from planted problems.** We deliberately insert known defects into requirements, test results or the application, so the right answer is known for certain. Where planting is impossible, a second AI model labels the cases, and a person checks at least 20% of those labels.
- **Beat a simple baseline.** Every AI-based capability must do better than asking the same AI model a plain question on the same test set. Otherwise the capability adds nothing beyond the model.
- **Show the uncertainty.** Every result is reported with its sample size and a 95% range. With 40 cases, an 80% score means "somewhere between about 65% and 90%". Pass marks are judged on that range.

**Proposed pass marks**, to be frozen per capability in `evals/<capability>/plan.md`:

| Capability | Test set (minimum) | Proposed pass mark |
|---|---|---|
| C1 | 40 requirements per app: sound ones plus planted problems (no expected result, ambiguous criterion, endpoint that doesn't exist, rule the system doesn't enforce, too big to test) | Finds ≥ 80% of planted problems; wrongly flags ≤ 15% of sound requirements; beats the plain-prompt baseline |
| C2 | Same requirements after C1; both apps; known planted application defects including cases that should *not* be caught | Every criterion has ≥ 1 test (rule check, 100%); generated tests run green on the unbroken app ≥ 85%; planted-defect catch rate reported with range and better than baseline; does not read implementation code (verified by access log) |
| C3 | Result files and requirement-change scenarios with known answers | 100% correct (rule-based) |
| C4 | Scenarios with planted over-claims: "Tested" without a run, criterion without a test, criterion only partly checked | Finds ≥ 90%; false alarms ≤ 10%; beats baseline |
| C5 | End-to-end release scenarios with known answers | Same inputs → same report, every time; matches the known answer ≥ 90% |
| All | Both apps | Works on both apps with connector and configuration changes only; AI provider switchable by configuration |

## 9. Not in Phase 1

- Client projects, client data and client AI environments
- Building the BATC connection (design only)
- Azure DevOps, Jira or Confluence as requirement sources (files only)
- IDE front end (Copilot / Claude Code skills)
- Failure triage, regression maintenance, testing of AI systems, commercial assets
- Performance, mobile, codeless and security testing capabilities
- Any measure based on usage, perceived speed or volume of output

## 10. Decisions (agreed 2026-10-20, re-confirmed in v2)

| Topic | Decision |
|---|---|
| Relation to BATC | Standalone core; connection to BATC's flow in Phase 2 |
| Where it runs | Pipeline first; IDE front end later |
| Shape | Independent capabilities, usable alone or in a pipeline |
| AI access | Provider-neutral, one connector per approved provider |
| Test output | Native test code for the project's stack, on request |
| Requirement sources | Through connectors; files only in Phase 1 |
| Authority | Advice; only repeatable rule checks may block; people sign |
| Language | Node.js / TypeScript, reusing proven parts of the sandbox |
| Proof | Pre-planned evals, planted-problem ground truth, baseline comparison, 95% ranges |
| Phase 1 done | Internal demo on two open-source apps |
| Go/no-go | Dmitry and the BATC team, jointly |

## 11. Assumptions, open questions and risks

**Assumptions (correct me if wrong):**
1. TypeScript demo app: RealWorld (Conduit), MIT. Its specification is written independently of the 100+ implementations, so it meets P2. Cypress Real World App is declined: its only "requirements" are its own tests. Conduit's specification is an API/UI contract, not business requirements; the BA layer (user stories, acceptance criteria) is derived from it and must be reviewed by a person before use.
2. A development AI connector is acceptable inside the sandbox only. Client providers come in Phase 2.
3. Proven sandbox parts are copied into the new code and tested again; the research copy stays untouched.
4. The BATC source in `reference/batc-accelerator-development/` is refreshed from Azure DevOps before the BATC connection is designed. The current copy is the 7 October release (3.2.5).

**Open questions:**
- Which AI providers can client projects approve? This decides whether Phase 2 can run at all.
- Who in the BATC team owns the plug-in point design on their side?
- Which Java demo app? It needs an MIT-like licence and requirements written independently of the code. The candidates checked so far failed (iTrust2: EPL-2.0; Restful Booker Platform: GPL-3.0; Spring PetClinic: no written requirements). If none is found, Phase 1 runs on Conduit only.
- Who acts as Product Owner / BA reviewer for Conduit's derived backlog and its open questions?

**Risks:**

| Risk | Effect | Mitigation |
|---|---|---|
| Java test generation is new; the sandbox was API-only, Node.js, one app | Largest build risk | Java spike in week 1 |
| One builder, 6–8 weeks | Delay; no independent review | Guild leads review formats and the demo; evals use planted ground truth |
| Second AI model shares the first model's blind spots | Overstated results | Planted problems first; a person checks ≥ 20% of AI labels |
| BATC Bug 2347 unresolved | Phase 2 connection blocked | Raised 2026-10-20; check before Phase 2 |
| Agents can read Conduit's held-out test suites (they ship inside the specification repository) | C1/C2 eval scores contaminated | Agents get the specification without the test folders; isolation decided before the first measured run |
| No Java app with independent requirements | Demo covers one stack only | Keep searching; decide before C2's Java spike |

## 12. Folder structure

```
qe-agentic/
├── intent.md                    ← this file
├── README.md                    ← map of the folders
├── packages/
│   ├── core/                    ← shared formats, evidence records, AI-provider interface
│   ├── connectors/
│   │   ├── ai-providers/        ← one per AI provider
│   │   ├── requirement-sources/ ← files (Markdown, Gherkin); later Azure DevOps, Jira, BATC
│   │   ├── stacks/              ← Java (JUnit/RestAssured/Selenium), TypeScript (Playwright)
│   │   └── test-results/        ← JUnit XML, Playwright JSON
│   ├── capabilities/
│   │   ├── c1-requirement-check/
│   │   ├── c2-independent-test-design/
│   │   ├── c3-execution-evidence/
│   │   ├── c4-claim-check/
│   │   └── c5-readiness-report/
│   └── cli/                     ← one command per capability
├── pipelines/                   ← Azure DevOps templates
├── evals/                       ← per capability: plan, test sets, planted problems, results
├── sandboxes/                   ← demo applications (realworld = Conduit; Java app to be selected)
├── docs/
│   ├── intent/                  ← intent reviews and history
│   ├── architecture/            ← design, formats, decisions
│   └── batc-integration/        ← plug-in design for BATC (Phase 1 design, Phase 2 build)
├── reference/
│   └── batc-accelerator-development/  ← BATC source (separate git repo, read-only reference)
├── research/                    ← earlier experiments and evidence, kept as they were
└── linkedin-campaign/           ← communication material (not part of the product)
```

## 13. Glossary

| Term | Meaning here |
|---|---|
| **Acceptance criterion** | A condition the requirement must meet, ideally written as Given-When-Then with an expected result |
| **Expected result** | What the system should do, stated before testing. Testers sometimes call it the "oracle" |
| **Capability** | One of the five checks (C1 to C5): a program with its own inputs, outputs, command and evals |
| **Connector** | A replaceable piece that links a capability to one specific thing: an AI provider, a requirement source, a technology stack or a test-result format |
| **Planted problem** | A defect inserted on purpose so the correct answer is known for certain |
| **Baseline** | The result of asking the same AI model a plain question with no capability around it |
| **Evals** | Tests of the AI-based checks themselves: a fixed set of cases with known answers |
| **95% range** | The span the true score most likely lies in, given the sample size (statistically, a confidence interval) |
| **Unstable test** | A test that gives different results on identical runs ("flaky"). Treated as unproven, not as pass or fail |
| **Rule-based** | Same input always gives the same output; no AI involved |
| **BATC** | The unit's agentic SDLC accelerator: governance, skills and delivery flow for AI-assisted development |
| **QES** | Quality Engineering Services |
