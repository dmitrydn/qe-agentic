# Conduit requirements — unchanged workbook conversion

Derived, not stakeholder-authored. Run 1 preserves source wording; no BA decisions have been made.

Specification pin: ebbcdeb8d55b42a3a613c787560498b8ef10003f

## Counts

- epics: 7
- stories: 23
- rules: 89
- scenarios: 72
- open questions: 54
- traceability rows: 73

## Workbook README (verbatim cell text)

Conduit product backlog

What this is

User stories, business rules and acceptance criteria for the Conduit (RealWorld) application, written in the form a Business Analyst would hand to a delivery team.

Derived from

The RealWorld specification, github.com/realworld-apps/realworld, pinned at commit ebbcdeb8d55b42a3a613c787560498b8ef10003f (2026-08-26). Sources used: the prose specification pages and the OpenAPI contract (see Sources tab).

Not used

The official test suites (specs/api/hurl, specs/api/bruno, specs/e2e) were deliberately NOT read while writing this backlog. They remain an independent check of the application. Do not use them to edit this backlog.

Method

1. Every business rule and acceptance criterion cites the specification file and line it comes from (Spec traces).
2. Where the specification is silent or contradicts itself, nothing was invented: the gap is logged on the Open Questions tab for the Product Owner.
3. Business rules state what the system must do; Gherkin scenarios illustrate them with concrete examples.
4. Coverage: every one of the 73 requirements in the earlier requirements baseline maps to at least one story (Traceability tab).

Verification done

All 284 citations were checked automatically against the pinned specification (the cited line range contains the cited wording): 0 failures. Coverage check: 73 of 73 baseline requirements covered.

Authored, not specified

These parts are BA judgement and are NOT in the specification: the "so that" value statements, the personas, the epic grouping, the proposed priorities (Must for features in the spec's feature list), and the example data in scenarios (e.g. user "jake", "anna").

Personas

Visitor = not signed in · Member = signed in · Author = a member acting on their own article or comment · API consumer = a developer or client application using the API.

Tabs

Epics (summary with counts) · Backlog (one row per story) · Acceptance Criteria (one row per scenario, with full Gherkin) · Business Rules · Open Questions · Traceability · Sources.

IDs

US-nn story · BR-nn.m business rule · AC-nn.m acceptance criterion · OQ-nn.m open question (nn = story number).

Levels

UI = checked through the web app · API = checked against the REST API directly.

Cells to edit

Pale yellow cells are for the reader: Priority and Status on Backlog; Answer / decision and Status on Open Questions. Example answer: "422, message 'email or password is invalid' (decided by PO, 2026-11-05)". Counts on Backlog and Epics update automatically.

Known limitation

This layer is derived from the specification, not independently authored by a business stakeholder. Treat open questions as unresolved until a Product Owner answers them.

## Workbook epic summary (verbatim cell text)

**Epic ID:**

EP-01

**Epic:**

Account & authentication

**Goal:**

Let people create an account, sign in, stay signed in and sign out.

**# Stories:**

4

**# Acceptance criteria:**

12

**# Open questions (open):**

11

**Epic ID:**

EP-02

**Epic:**

Profiles & settings

**Goal:**

Let members manage their own details and see other members' public profiles.

**# Stories:**

3

**# Acceptance criteria:**

10

**# Open questions (open):**

9

**Epic ID:**

EP-03

**Epic:**

Articles

**Goal:**

Let members publish, edit and delete articles, and let anyone read them.

**# Stories:**

4

**# Acceptance criteria:**

15

**# Open questions (open):**

12

**Epic ID:**

EP-04

**Epic:**

Discovery & feeds

**Goal:**

Help readers find articles: global feed, personal feed, tags and paging.

**# Stories:**

4

**# Acceptance criteria:**

12

**# Open questions (open):**

8

**Epic ID:**

EP-05

**Epic:**

Comments

**Goal:**

Let members discuss articles.

**# Stories:**

3

**# Acceptance criteria:**

9

**# Open questions (open):**

5

**Epic ID:**

EP-06

**Epic:**

Social

**Goal:**

Let members follow authors and favourite articles.

**# Stories:**

2

**# Acceptance criteria:**

8

**# Open questions (open):**

5

**Epic ID:**

EP-07

**Epic:**

Navigation & platform

**Goal:**

Cross-cutting behaviour: navigation, API error contract, cross-origin access.

**# Stories:**

3

**# Acceptance criteria:**

6

**# Open questions (open):**

4

**Epic ID:**

Total

**Epic:**



**Goal:**



**# Stories:**

23

**# Acceptance criteria:**

72

**# Open questions (open):**

54

## Workbook sources and personas (verbatim cell text)

Key

Source

Path in spec repository

Link (pinned commit)

EP

Backend endpoints

docs/src/content/docs/specifications/backend/endpoints.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md

ER

Error handling

docs/src/content/docs/specifications/backend/error-handling.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md

RF

API response format

docs/src/content/docs/specifications/backend/api-response-format.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md

CO

CORS

docs/src/content/docs/specifications/backend/cors.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md

RT

Frontend routing

docs/src/content/docs/specifications/frontend/routing.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md

TP

Frontend page templates

docs/src/content/docs/specifications/frontend/templates.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md

FE

Feature list

docs/src/content/docs/implementation-creation/features.md

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md

OA

OpenAPI contract

specs/api/openapi.yml

https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml

Personas

Visitor

Anyone using Conduit without being signed in. Can read and browse.



Member

A signed-in user. Can publish, comment, follow and favourite.



Author

A Member acting on content they created themselves (their article or comment).



API consumer

A developer or client application integrating with the Conduit REST API.



Workbook verification statements above are historical claims, not the current check result. See citation-report.md for Run 1 results. BA-ASSUMPTION: personas, value statements, epic grouping, proposed priorities and example data are authored judgement as described above; per-item tidy-up is deferred to step 6.
