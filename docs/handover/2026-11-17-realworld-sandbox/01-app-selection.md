# 01 — App selection: RealWorld (Conduit)

**Decision:** RealWorld "Conduit" is the TypeScript sandbox application for building and demoing the agentic QES SDLC (capabilities C1–C5 in `intent.md`).
**Decided:** confirmed by Dmitry (chat of 3 Nov 2026), based on the candidate analysis and the measurement spike of 23 Oct 2026.
**Scope of the decision:** the only Phase 1 demo app (`DECISIONS.md` D-01).

## 1. What the app is

- **Conduit** is a Medium-style blogging app from the RealWorld project: **one specification implemented 100+ times** in different stacks. Any conforming frontend works with any conforming backend.
- **Features:** sign-up and login, profiles, articles with Markdown and tags, comments, favourites, following authors, personal and global feeds, tag filtering, pagination.
- **What ships with the specification** (`github.com/realworld-apps/realworld`): prose specification pages, an OpenAPI 3.1 contract (`specs/api/openapi.yml`), an API test suite (Hurl), a UI test suite (Playwright) and a selector contract for UI tests (`specs/e2e/SELECTORS.md`).

## 2. Selection criteria and evidence

| Criterion (Dmitry's) | Evidence |
|---|---|
| Licence MIT or similar | MIT for the specification, backend and frontend repos, read from each `LICENSE` file |
| Requirements written **independently of the code** (`intent.md` P2): the entry point of the QES SDLC is requirements, not reverse-engineering | The specification is maintained separately from 100+ implementations, which must conform to it, never the reverse |
| TypeScript / Playwright | TypeScript backend and frontend; the shared UI suite is Playwright |
| It actually runs | Measured on Dmitry's Mac, 2026-10-23 (`research/realworld-spike/RESULTS.md`): backend 13/13 Hurl files, 154 requests, 692/692 assertions; Angular frontend 133/139 UI tests (95.7%), about 136/139 (97.8%) once the demo user `johndoe` is seeded |
| Enough requirements and real gaps for evals | 73 requirements (baseline v0.1) or 210 (independent recount), depending on the counting rule; 11–22 real specification gaps |

## 3. Candidates rejected

| Candidate | Reason |
|---|---|
| Cypress Real World App (RWA) | No written requirements. Its tests are characterization tests derived from the implementation, so using them as requirements is circular (breaks P2). The earlier sandbox's `unified-requirements.md` (191 items) was generated from those tests. **Declined** |
| iTrust2 (NCSU, Java) | Licence EPL-2.0 and Java stack; main branch had lost about half its use cases |
| Practice Software Testing ("Toolshop") | Licence "All rights reserved" |
| Restful Booker Platform | Licence GPL-3.0, Java, no independent requirements |
| OWASP Juice Shop | MIT, but its "challenges" are a security catalogue, not requirements. Possible later add-on for the security guild |
| TodoMVC | MIT with `app-spec.md`, but too small (122 lines, no API) |
| Spring PetClinic REST | Considered in the 23 Oct analysis and dropped in favour of candidates with written requirements |

## 4. What "selected" does NOT mean

1. **The specification is an API/UI interface contract, not business requirements.** It has no user stories, no business value statements and almost no business rules. The only business-level text is `features.md`: seven one-line bullets. Dmitry's team raised exactly this point.
   - Agents can convincingly show **contract → tests → traceability** and **requirements-quality assessment** (the gaps are real, not planted).
   - Agents **cannot** show **BA requirements → tests** on this app without an added BA layer. Dmitry wants all three demo stories, so a BA layer was drafted (`Conduit-backlog.xlsx`). It is **derived from the specification by Claude**, so it is not independent of the team. It must be labelled as derived and reviewed by a human BA/PO. That review is the next task (`03-next-task-business-requirements.md`).
2. **One app on one stack.** Nothing here shows the agents working on Java or on a messy client codebase.
3. **Few natural defects.** The spike found only three candidate defects in the Angular frontend (D-01..D-03 in `RESULTS.md`). Detection evals will need **planted defects** (as `intent.md` §8 already plans).
4. **Requirement counts are not stable.** Two Claude extractions of the same specification produced 73 vs 210 requirements and different gap lists. The count depends on the source scope and the splitting rule. Neither is ground truth until a human rules on the disputed items.

## 5. Decisions taken after the selection

Recorded in `DECISIONS.md` (repo root), the single source for decisions:

- **D-01** Phase 1 runs on Conduit only; no Java app until Phase 2.
- **D-02** `openapi.yml` keeps its examples; they are requirements, not leaked answers.
- **D-03** Four measures keep the held-out test suites away from agents; planted problems carry the eval scores.
- **D-04** A QES tester from the bench is assigned the BA role for Conduit and decides the open questions.
