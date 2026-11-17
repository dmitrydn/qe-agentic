# 03 — Next task: business requirements for BA review

## 1. Goal

Produce the **initial set of business requirements for Conduit**, ready for a **human BA / Product Owner to review**. Do it by **refining the existing draft backlog**, not by starting from scratch.

The output becomes the BA-style requirement source for the demo story "agents start from user stories and acceptance criteria" (`01-app-selection.md` §4), and the input format `intent.md` §7 names: Markdown user stories with Given-When-Then acceptance criteria, plus Gherkin feature files.

**You prepare; a human decides.** You never answer open questions, approve stories or change their status beyond `Draft`. The reviewer is Conduit's BA: a QES tester from the bench assigned to that role (`DECISIONS.md` D-04), with a testing rather than BA background. Write `REVIEW-GUIDE.md` for someone new to the BA role: for each decision, say what to decide, the options, and what each choice means for the app.

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
Write a script (keep it under `sandboxes/realworld/requirements/tools/`) that reads the xlsx and writes the files in §5. Content must match the spreadsheet word for word at this stage.
Check: the script reports 7 epics, 23 stories, 89 rules, 72 scenarios, 54 open questions, 73 traceability rows.

**Step 3: re-verify every citation at `ebbcdeb8`**
For each cited file and line range, confirm the range exists and contains the cited wording (keyword match). Record failures; don't fix them yet.
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
Tag BA judgement (`BA-ASSUMPTION`), keep status `Draft`, and make each story readable on its own. Plain business language in the story and rules; technical detail (endpoints, status codes) only in API-level scenarios.

**Step 7: generate Gherkin feature files** from the same data (one `.feature` per epic), by script, never by hand.
Check: the scenario count in the feature files equals the AC count in the Markdown.

**Step 8: write the review guide and change log** (§5), then re-run steps 3 and 7 on the final files.

## 5. Output: `sandboxes/realworld/requirements/`

```
README.md              what this is, the pin, how it was derived, "derived, not stakeholder-authored" disclaimer
epics/EP-01-account-authentication.md ... EP-07-navigation-platform.md
open-questions.md      every OQ: question, why it matters, spec evidence, owner, answer (blank), status
traceability.md        spec statement → BR/AC; baseline R-IDs → stories; gap reconciliation table
features/EP-0n-*.feature
REVIEW-GUIDE.md        for the BA: what to check, the decisions needed (by priority), how to record answers
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
```

## 6. Done when

- [ ] All files in §5 exist; counts in `README.md` match the files
- [ ] Citation report: 100% of citations pass at `ebbcdeb8`, or each failure is fixed and logged in `CHANGELOG.md`
- [ ] Every rule and scenario has a citation or a `BA-ASSUMPTION` tag
- [ ] Every gap from the two analyses has a disposition in `traceability.md`
- [ ] No open question has an answer filled in; every story is `Draft`
- [ ] The oracle paths were never checked out or read (state this in the hand-back and show the sparse-checkout list)
- [ ] `REVIEW-GUIDE.md` lists the decisions the BA must make, with the most blocking first

## 7. Hand back to Dmitry

A short report (`sandboxes/realworld/requirements/HANDBACK.md`, one section per run): the **read log** (every file path and URL read, D-03), counts before/after, citation-check result, how many rules became open questions and why, new open questions, anything you could not verify, and deviations from this brief.

## 8. Stop and ask Dmitry if

- the specification at `ebbcdeb8` can't be reached;
- deciding something seems to require the oracle or the implementation code;
- more than about 10% of existing rules fail the citation check (that would suggest a pin or path problem, not content errors).
