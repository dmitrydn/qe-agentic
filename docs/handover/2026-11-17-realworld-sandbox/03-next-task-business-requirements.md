# 03 — Next task: business requirements for BA review

## 1. Goal

Produce the **initial set of business requirements for Conduit**, ready for a **human BA / Product Owner to review**. Do it by **refining the existing draft backlog**, not by starting from scratch.

The output becomes the BA-style requirement source for the demo story "agents start from user stories and acceptance criteria" (`01-app-selection.md` §4), and the input format `intent.md` §7 names: Markdown user stories with Given-When-Then acceptance criteria, plus Gherkin feature files.

**You prepare; a human decides.** You never answer open questions, approve stories or change their status beyond `Draft`. The reviewer is Conduit's BA: a QES tester from the bench assigned to that role (`DECISIONS.md` D-04), with a testing rather than BA background. `REVIEW-GUIDE.md` already exists (written 2026-11-17): it is the BA's method. You only fill its §6 and build the workbook it describes (step 8). The BA records answers in Excel, not Markdown.

**Executor:** GitHub Copilot in agent mode in VS Code on Dmitry's Mac, with the repository root open. `.github/copilot-instructions.md` repeats the hard rules below. Terminal auto-approve stays **off**: Dmitry approves each command (D-03).

## 2. Starting material

| Input | Path | Notes |
|---|---|---|
| Draft backlog | `sandboxes/realworld/requirements/source/Conduit-backlog.xlsx` | Tabs: README, Epics, Backlog, Acceptance Criteria, Business Rules, Open Questions, Traceability, Sources. 7 epics (EP-01..EP-07), 23 stories (US-01..US-23), 89 rules (BR-nn.m), 72 scenarios (AC-nn.m), 54 open questions (OQ-nn.m, all `Open`). Written by Claude 2026-10-30 at `SPEC_PIN`. Its README states that all 284 citations were checked automatically (0 failures) and that 73/73 baseline requirements are covered |
| Specification | `github.com/realworld-apps/realworld` at `ebbcdeb8d55b42a3a613c787560498b8ef10003f` | Only the requirement-source paths in `02-sandbox-architecture.md` §4 |
| Gap analyses | `research/realworld-spike/realworld-requirements-baseline.md` §4 (gaps G-01..G-11), `research/realworld-spike/requirements-recount.md` §I (gaps X-01..X-22) and its section "Which baseline gaps I think are wrong" (corrections to G-01, G-03, G-04, G-11) | Made on the **older pin `450bbc5`**. Use them as leads only; check every point at `ebbcdeb8` |
| Rules | `intent.md` §3 (P1–P8), §5 | Still valid |

Items in the backlog that are **BA judgement, not specification** (its README says so): "so that" value statements, personas (Visitor, Member, Author, API consumer), epic grouping, proposed priorities, example data ("jake", "anna"). Keep them, but label them in the output.

## 3. Hard rules

1. **Never read the held-out oracle:** `specs/api/hurl/`, `specs/api/bruno/`, `specs/e2e/`, the Postman collection, whether local (e.g. `~/realworld-sandbox/`) or on GitHub. Not even to "check" something. Get the specification with a sparse checkout that leaves them out (step 1). Keep a log of every file path and URL you read (D-03).
2. **Never read implementation code** (backend or frontend sources).
3. **Invent nothing.** Every business rule and acceptance criterion cites a specification file and line range at `ebbcdeb8`, or is tagged `BA-ASSUMPTION` with a reason. Where the specification is silent or contradicts itself, write an open question, not a rule.
4. **Keep IDs stable.** Existing US/BR/AC/OQ IDs keep their numbers. New items get the next free number. Removed items stay listed in the change log with the reason.
5. **Don't edit** `Conduit-backlog.xlsx`, anything under `research/`, or `intent.md`.
6. **Don't commit or push.** Dmitry reviews first.

## 4. Steps

Each step ends with a check. Don't continue until it passes.

**Two runs.** Run 1 is steps 1–3, then stop and write `HANDBACK.md` for run 1. Dmitry reviews the Markdown conversion and the citation report before run 2 (steps 4–8) starts. Start each run with a fresh chat, pointing it at this file and naming the run.

**Step 1: get the specification without the oracle**
```bash
git clone --filter=blob:none --no-checkout https://github.com/realworld-apps/realworld.git /tmp/rw-spec
cd /tmp/rw-spec && git sparse-checkout set --no-cone \
  'docs/src/content/docs/specifications/' 'docs/src/content/docs/implementation-creation/features.md' 'specs/api/openapi.yml'
git checkout --detach ebbcdeb8d55b42a3a613c787560498b8ef10003f
```
Check: `git rev-parse HEAD` prints `ebbcdeb8…`, and `ls specs/api` shows only `openapi.yml`.

**Step 2: convert the backlog to Markdown, unchanged**
Write a script (keep it under `sandboxes/realworld/requirements/tools/`) that reads the xlsx and writes **only** `README.md`, `epics/EP-0n-*.md`, `open-questions.md` and `traceability.md` (at this stage only the baseline R-ID → story mapping from the Traceability sheet). Content must match the spreadsheet word for word at this stage. Feature files (step 7), `review/`, the `REVIEW-GUIDE.md` §6 list and `CHANGELOG.md` (step 8) are **not** written in run 1.
Check: the script reports 7 epics, 23 stories, 89 rules, 72 scenarios, 54 open questions, 73 traceability rows.

**Step 3: re-verify every citation at `ebbcdeb8`**
For each of the 284 citations on the Business Rules, Acceptance Criteria and Open Questions sheets, confirm the cited file and line range exist and contain the cited wording (keyword match). The Backlog sheet's *Spec traces (rules)* column is a roll-up: only confirm each entry appears among that story's business-rule citations. Record failures; don't fix them yet. Write the report to `sandboxes/realworld/requirements/citation-report.md`.
Open-question citations point to where the specification is **silent**, so they are checked for range existence only, not for keywords.
Keyword failures that a person has reviewed and found correct (paraphrase) go in `tools/citation-exceptions.md` (ID, citation, reason, reviewer, date); the checker treats them as passed and reports them separately.
Check: a citation report with the number checked, passed and failed.

**Step 4: reconcile with the gap analyses**
For each recount gap (X-01..X-22), each baseline gap (G-01..G-11) and the four corrections, check it at `ebbcdeb8`. Then:
- **already an open question** → link it;
- **real and missing** → add an open question;
- **resolved by the specification at this pin** → note it, no question;
- **a backlog rule that the specification doesn't support** → turn the rule into an open question and log it.
Known result to reproduce: BR-08.6 (distinct slugs for duplicate titles) **is supported** at `endpoints.md` L185 at `ebbcdeb8`. Don't remove it.
Check: a reconciliation table with one row per gap and a disposition for each.

**Step 5: fill coverage gaps**
Map the requirement statements of the specification to rules or scenarios. Use the 210-item recount as a checklist, re-located at the current pin. Add rules and scenarios only where the specification states the behaviour.
Check: a coverage list where every item is covered by a BR/AC ID, or marked out of scope with a reason (for example "implementation detail", "styling").

**Step 6: label and tidy for a human reader**
First, split business rules from interface contract (`DECISIONS.md` D-06). Classify every rule with this test:
- **IC (interface contract)** if it *only* lists declared status codes, schema fields or types, request/response shapes, markup or CSS classes, or fixed static text (headings, banner, footer).
- **BR (business rule)** if it states a condition and an outcome a user or the business cares about, even if it names a status code or message (e.g. "a taken username is rejected with 409 *has already been taken*"). If in doubt, keep it BR.
Move IC items into a per-story section `### Interface contract (not for BA review)` with IDs `IC-nn.m` (nn = story number), keeping text and citations unchanged. Retire the old BR IDs and log each move in `CHANGELOG.md`. Update every reference (traceability, coverage list, scenarios, open questions). The BA review workbook lists BR only.
Check: a classification table in `traceability.md` (old ID, new ID, class, one-line reason); counts of BR and IC in `README.md`; the citation check still passes.
In the hand-back, list separately as **borderline** every rule moved to IC that mentions an actor, a permission, a limit or a condition, with the reason it is not a business rule. Dmitry reviews only that list.
Tag BA judgement (`BA-ASSUMPTION`), keep status `Draft`, and make each story readable on its own. Plain business language in the story and rules; technical detail (endpoints, status codes) only in API-level scenarios.

**Step 7: generate Gherkin feature files** from the same data (one `.feature` per epic), by script, never by hand.
Check: the scenario count in the feature files equals the AC count in the Markdown.

**Step 8: build the BA review pack and the change log** (§5), then re-run steps 3 and 7 on the final files.
- `REVIEW-GUIDE.md`: replace only the placeholder in §6 with the decision list, most blocking first. Rank spec conflicts and security questions first, then questions that affect the most acceptance criteria. For each, give ID, story, proposed kind (Conflict / Missing rule / Not needed / Can't decide yet) and a one-line reason for its rank. **Don't change §1–§5.**
- `review/BA-review.xlsx`, generated by script from the Markdown, with three sheets:
  - **Stories:** Story ID, Epic, Title, File (path to the epic file), Review result (dropdown: Accepted / Change requested / Rejected), Comment, Priority (pre-filled with the proposed priority; dropdown Must / Should / Could)
  - **Decisions:** one row per open question in the §6 order. Rank, OQ ID, Story ID, Question, Why it matters, Spec evidence (each citation a hyperlink to the line range on GitHub at `ebbcdeb8`, `…/blob/<pin>/<path>#Lx-Ly`), Kind (pre-filled with your proposal; dropdown), Decision, Rationale, Owner, Due date, Observed in app, App matches? (dropdown Yes / No / Not checkable), Status (dropdown Open / Decided / Not needed / Deferred; pre-filled Open)
  - **Sign-off:** Reviewer name, Date, Comment
  - Editable cells pale yellow, everything else locked against accidental edits (no password), header row frozen.
- Check: row counts equal the story and open-question counts in `README.md`; 10 random hyperlinks open the right lines.

## 5. Output: `sandboxes/realworld/requirements/`

```
README.md              what this is, the pin, how it was derived, "derived, not stakeholder-authored" disclaimer
epics/EP-01-account-authentication.md ... EP-07-navigation-platform.md
open-questions.md      every OQ: question, why it matters, spec evidence, owner, answer (blank), status
traceability.md        spec statement → BR/AC; baseline R-IDs → stories; gap reconciliation table
features/EP-0n-*.feature
REVIEW-GUIDE.md        exists: the BA's method (§1–§5, don't change); you fill §6, the decision list
review/BA-review.xlsx  the BA's working file (step 8)
CHANGELOG.md           every change vs Conduit-backlog.xlsx: ID, change, reason, citation
tools/                 the conversion and citation-check scripts
source/                Conduit-backlog.xlsx (unchanged)
```

Story format in `epics/*.md`:
```markdown
## US-01 Sign up
**Persona:** Visitor (BA-ASSUMPTION) · **Priority (proposed):** Must · **Status:** Draft

As a visitor, I want to …, so that … (so-that: BA-ASSUMPTION)

### Business rules
- **BR-01.1** Registration requires username, email and password. — `endpoints.md` L48

### Acceptance criteria
- **AC-01.1** Visitor signs up successfully (UI) — `routing.md` L9-10; `templates.md` L262-281
  ```gherkin
  Scenario: …
  ```

### Open questions
- **OQ-01.1** What are the password rules? → `open-questions.md`

### Interface contract (not for BA review)
- **IC-01.1** <contract detail> — `openapi.yml` L…
```

## 6. Done when

- [ ] All files in §5 exist; counts in `README.md` match the files
- [ ] Citation report: every citation passes at `ebbcdeb8`, is a reviewed exception in `tools/citation-exceptions.md`, or was fixed and logged in `CHANGELOG.md`
- [ ] Every rule and scenario has a citation or a `BA-ASSUMPTION` tag
- [ ] Every gap from the two analyses has a disposition in `traceability.md`
- [ ] No open question has an answer filled in; every story is `Draft`
- [ ] The oracle paths were never checked out or read (state this in the hand-back and show the sparse-checkout list)
- [ ] `REVIEW-GUIDE.md` §6 lists every open question, most blocking first; §1–§5 unchanged (`git diff` shows changes only below the §6 heading)
- [ ] `review/BA-review.xlsx` exists with the three sheets and matching row counts

## 7. Hand back to Dmitry

A short report (`sandboxes/realworld/requirements/HANDBACK.md`, one section per run): the **read log** (every file path and URL read, D-03), counts before/after, citation-check result, how many rules became open questions and why, new open questions, anything you could not verify, and deviations from this brief.

## 8. Stop and ask Dmitry if

- the specification at `ebbcdeb8` can't be reached;
- deciding something seems to require the oracle or the implementation code;
- more than about 10% of existing rules fail the citation check (that would suggest a pin or path problem, not content errors).
