# Conduit requirements: review guide for the BA

**For:** the BA of the Conduit app (`DECISIONS.md` D-04). No prior BA experience is assumed.
**Read first:** `PRODUCT-INTRO.md`: what Conduit is, who uses it, similar products, and what is out of scope.
**Time:** about half a day to a day. Work one epic per sitting.
**You need:** `review/BA-review.xlsx` (your working file), `epics/*.md` (the stories), and for step 4 only, the team's Conduit instance in a browser (no installation needed; see step 4).

## 1. What you are doing and why

The Conduit specification describes *how* the app behaves (endpoints, screens, error codes) but almost never *what the business wants*. An AI agent turned it into user stories, business rules and acceptance criteria, and listed every place where the specification is silent or contradicts itself as an **open question**.

You are now the person who decides. Your answers become the requirements that the QE agents design tests from and check the app against. So two things matter more than anything else:

1. **Decide as the business would, not as the app happens to work.** The app already exists and won't change. Where your rule differs from the app, that difference is a valuable finding, not a mistake.
2. **Every decision must be testable.** Someone who never met you must be able to write a test from your sentence and know whether it passed.

## 2. Rules you must follow

| Rule | Why |
|---|---|
| **Decide first, look at the app afterwards** (step 4). Never change a decision because the app does something else | Requirements copied from the app prove nothing: the app would always pass (`intent.md` P2) |
| **Never open the official test suites**: `specs/api/hurl/`, `specs/api/bruno/`, `specs/e2e/`, the Postman collection, in the sandbox or on GitHub | They are the hidden answer key used to score the agents (`DECISIONS.md` D-03) |
| **Never read the app's source code** (`backend/`, `frontend/` in the sandbox) | Same reason as the first rule |
| **Never use the public demo** (`api.realworld.show` and its web app) | It behaves differently from the local app on purpose |
| **Don't edit the Markdown files** (`epics/`, `open-questions.md`) | Your answers are transferred into them by script, so there is one source of truth: your workbook |

## 3. Part A: review the stories

Sheet **Stories** in `review/BA-review.xlsx`, one row per user story. For each story, read it in `epics/EP-0n-….md` and ask:

- Does the "As a … I want … so that …" make sense for a blogging site? (The "so that" part and the personas were written by the agent; they are tagged `BA-ASSUMPTION`.)
- Do the business rules say what a user of this site should be able to do, in plain language?
- Skip the section **Interface contract (not for BA review)** under each story. It lists technical detail (status codes, data fields, page markup) taken from the specification for the test agents; it needs no business decision (`DECISIONS.md` D-06).
- Is anything missing that one of Conduit's core capabilities can't work without? (Note it; don't invent the rule. It becomes a new open question.) Features that similar products have but Conduit lacks on purpose (search, notifications, paid plans and so on) are out of scope: see the product introduction, section 6.

Record in the sheet:

| Column | What to enter |
|---|---|
| Review result | `Accepted` · `Change requested` · `Rejected` |
| Comment | Required unless Accepted: what to change and why |
| Priority | `Must` · `Should` · `Could` (the agent's proposal is pre-filled; change it if you disagree) |

## 4. Part B: answer the open questions

Sheet **Decisions**, one row per open question, most blocking first. For each row, do steps 1 to 5 in order.

### Step 1: understand the question
Read the question, *Why it matters*, and the cited specification lines (*Spec evidence*; the links open the exact lines on GitHub).

### Step 2: decide which kind of question it is

| Kind | Looks like | Your job | Example (question IDs from the draft backlog) |
|---|---|---|---|
| **Conflict** | Two sources say different things | Pick one, or write a third rule that settles it | OQ-02.1: wrong password, 401 or 422? · OQ-22.1: "can't be empty" or "can't be blank"? |
| **Missing rule** | The specification says nothing | Write the rule | OQ-01.1: password rules · OQ-08.3: length limits |
| **Not needed** | A feature that may not belong in this product | Decide explicitly that there is no rule, and say so | OQ-02.2: lockout after failed sign-ins |
| **Can't decide yet** | Needs someone else or more information | Defer it, with an owner and a date | Use sparingly |

Enter the kind in column *Kind*.

### Step 3: write the decision

Write it in column *Decision* as one or more rules in this shape: **when [condition], the system [observable result]**. Then check it against this list:

- [ ] **Specific.** Numbers, exact messages and exact pages, not "reasonable", "appropriate" or "user-friendly".
- [ ] **Observable.** Someone can see the result on screen or in the API response.
- [ ] **One rule per line.** "Must be 8–64 characters" and "must contain a digit" are two rules.
- [ ] **Covers the failure case.** What happens when the rule is broken (which message, which status)?

| Weak (not testable) | Strong (testable) |
|---|---|
| "Passwords should be secure." | "When a password shorter than 8 characters is submitted at sign-up, registration is refused with status 422 and the message *password is too short*." |
| "Handle duplicate emails properly." | "When the email is already registered, sign-up is refused with status 409 and the message *email has already been taken*." |
| "No lockout needed for now." | "Not needed: repeated failed sign-ins do not lock the account in this product." |

*The strong examples show the form only. They are not recommended values; decide your own.*

Fill in *Rationale*: one sentence on the business reason ("matches common practice for consumer sites", "keeps the demo simple"). For **Deferred**, fill *Owner* and *Due date* instead.

### Step 4: only now, check the app

Use the team's Conduit instance: **https://web-vs-pro-batc-qe-realworld-sandbox-f4crcjf2bcg9c5b6.swedencentral-01.azurewebsites.net/** (its API is the same address followed by `/api`).

- **Sign up two test accounts of your own**, for example `ba-member-1` and `ba-member-2`. Use made-up emails ending in `@example.invalid` and a password you use nowhere else. Many questions are about "another member", so you need two.
- **The data is shared and temporary.** Anyone on the project sees what you create, and everything is lost when the app is redeployed. Never rely on data from an earlier session; recreate what you need. Ignore other test accounts you may see (for example `claude-check-a`).

Try your rule by hand in the browser. Record what you saw in *Observed in app*.

| What you see | *App matches?* | What to do |
|---|---|---|
| The app does what your rule says | `Yes` | Nothing |
| The app does something else | `No` | **Keep your decision.** Describe the difference precisely in *Observed in app*. It becomes a known requirement-vs-system gap for the QE agents to find |
| You can't check it (e.g. a server-side rule with no visible effect) | `Not checkable` | Say why |

If seeing the app makes you think your decision was wrong *for a business reason*, you may change it, but write that reason in *Rationale*. "The app does it differently" is never a reason.

### Step 5: set the status
`Decided` · `Not needed` · `Deferred`. Leave nothing as `Open`.

## 5. When you are done

- [ ] Every story on **Stories** has a review result, and a comment where needed
- [ ] Every row on **Decisions** has a status other than `Open`
- [ ] Every `Decided` row passes the step 3 checklist and has a rationale
- [ ] Every `Deferred` row has an owner and a due date
- [ ] *App matches?* is filled for every `Decided` row
- [ ] You did not open the official test suites, the source code or the public demo

Save the workbook, tell Dmitry, and add your name and the date on the **Sign-off** sheet. An agent then transfers your answers into the Markdown requirements and updates the stories. Nothing you decided is changed without asking you.

**One more rule for later:** you should not also be the person who later judges the tests designed from these requirements. Checks need someone independent of whoever produced the work (`intent.md` P3).

## 6. Decision list (most blocking first)

Agent-proposed kinds and ranking only; no decisions or approvals. Spec conflicts and security first, then descending estimated number of affected current ACs, with response-field meaning questions last. Ties use stable numeric OQ ID. Impact sets are conservative design estimates, not executed coverage; a missing rule may require new ACs.

| Rank | OQ ID | Story | Proposed kind | Rank reason |
| --- | --- | --- | --- | --- |
| 1 | OQ-09.4 | US-09 | Missing rule | Spec conflict/security first; 2 potentially affected current AC (AC-09.2, AC-09.3). |
| 2 | OQ-10.4 | US-10 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-10.2, AC-10.3, AC-10.4). |
| 3 | OQ-18.2 | US-18 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-18.1, AC-18.2, AC-18.3). |
| 4 | OQ-02.1 | US-02 | Conflict | Spec conflict/security first; 2 potentially affected current AC (AC-02.3, AC-22.1). |
| 5 | OQ-11.2 | US-11 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-08.1, AC-09.1, AC-11.1). |
| 6 | OQ-01.1 | US-01 | Missing rule | Spec conflict/security first; 4 potentially affected current AC (AC-01.1, AC-01.2, AC-02.1, AC-02.2). |
| 7 | OQ-01.5 | US-01 | Missing rule | Spec conflict/security first; 5 potentially affected current AC (AC-01.1, AC-01.2, AC-02.1, AC-02.2, AC-05.2). |
| 8 | OQ-22.1 | US-22 | Conflict | Spec conflict/security first; 5 potentially affected current AC (AC-01.4, AC-02.4, AC-08.4, AC-16.3, AC-22.2). |
| 9 | OQ-01.2 | US-01 | Missing rule | Spec conflict/security first; 4 potentially affected current AC (AC-01.1, AC-01.2, AC-01.3, AC-05.2). |
| 10 | OQ-01.3 | US-01 | Missing rule | Spec conflict/security first; 4 potentially affected current AC (AC-01.1, AC-01.2, AC-06.1, AC-06.2). |
| 11 | OQ-02.2 | US-02 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-02.1, AC-02.2, AC-02.3). |
| 12 | OQ-02.3 | US-02 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-03.1, AC-03.2, AC-03.3). |
| 13 | OQ-03.1 | US-03 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-03.1, AC-03.2, AC-21.2). |
| 14 | OQ-03.2 | US-03 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-03.2, AC-03.3, AC-22.1). |
| 15 | OQ-03.4 | US-03 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-06.2, AC-12.2, AC-17.2). |
| 16 | OQ-05.6 | US-05 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-05.2, AC-03.1, AC-03.2). |
| 17 | OQ-09.1 | US-09 | Conflict | Spec conflict/security first; 3 potentially affected current AC (AC-08.1, AC-09.1, AC-09.2). |
| 18 | OQ-18.1 | US-18 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-18.1, AC-18.2, AC-18.3). |
| 19 | OQ-21.1 | US-21 | Missing rule | Spec conflict/security first; 3 potentially affected current AC (AC-08.1, AC-09.1, AC-05.1). |
| 20 | OQ-04.2 | US-04 | Missing rule | Spec conflict/security first; 2 potentially affected current AC (AC-04.1, AC-03.2). |
| 21 | OQ-05.3 | US-05 | Conflict | Spec conflict/security first; 2 potentially affected current AC (AC-05.2, AC-06.1). |
| 22 | OQ-08.1 | US-08 | Conflict | Spec conflict/security first; 2 potentially affected current AC (AC-08.2, AC-08.3). |
| 23 | OQ-09.2 | US-09 | Missing rule | Spec conflict/security first; 2 potentially affected current AC (AC-09.1, AC-09.3). |
| 24 | OQ-03.3 | US-03 | Missing rule | Spec conflict/security first; 1 potentially affected current AC (AC-03.1). |
| 25 | OQ-05.2 | US-05 | Missing rule | Spec conflict/security first; 1 potentially affected current AC (AC-05.2). |
| 26 | OQ-19.1 | US-19 | Conflict | Spec conflict/security first; 1 potentially affected current AC (AC-19.1). |
| 27 | OQ-23.1 | US-23 | Missing rule | Spec conflict/security first; 1 potentially affected current AC (AC-23.1). |
| 28 | OQ-22.2 | US-22 | Missing rule | Other missing behaviour; 8 potentially affected current AC (AC-01.2, AC-05.2, AC-08.2, AC-09.2, AC-11.2, AC-12.2, AC-16.2, AC-17.2). |
| 29 | OQ-21.3 | US-21 | Missing rule | Other missing behaviour; 5 potentially affected current AC (AC-02.1, AC-03.1, AC-12.1, AC-13.1, AC-17.1). |
| 30 | OQ-08.2 | US-08 | Missing rule | Other missing behaviour; 4 potentially affected current AC (AC-08.1, AC-08.2, AC-14.1, AC-14.3). |
| 31 | OQ-07.2 | US-07 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-07.3, AC-07.4, AC-14.3). |
| 32 | OQ-07.4 | US-07 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-07.3, AC-07.4, AC-14.3). |
| 33 | OQ-08.3 | US-08 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-08.1, AC-08.2, AC-09.2). |
| 34 | OQ-09.3 | US-09 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-09.1, AC-09.2, AC-11.2). |
| 35 | OQ-10.2 | US-10 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-10.4, AC-17.2, AC-07.4). |
| 36 | OQ-15.4 | US-15 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-12.2, AC-13.3, AC-15.3). |
| 37 | OQ-16.2 | US-16 | Missing rule | Other missing behaviour; 3 potentially affected current AC (AC-16.1, AC-16.2, AC-16.3). |
| 38 | OQ-05.1 | US-05 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-05.1, AC-05.2). |
| 39 | OQ-05.4 | US-05 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-05.1, AC-05.2). |
| 40 | OQ-06.1 | US-06 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-06.1, AC-19.1). |
| 41 | OQ-07.1 | US-07 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-07.1, AC-07.2). |
| 42 | OQ-07.3 | US-07 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-07.3, AC-07.4). |
| 43 | OQ-12.1 | US-12 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-12.1, AC-12.2). |
| 44 | OQ-13.1 | US-13 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-12.1, AC-13.1). |
| 45 | OQ-13.2 | US-13 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-13.1, AC-13.3). |
| 46 | OQ-14.1 | US-14 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-14.1, AC-14.2). |
| 47 | OQ-14.2 | US-14 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-14.1, AC-14.3). |
| 48 | OQ-15.2 | US-15 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-15.2, AC-15.3). |
| 49 | OQ-16.1 | US-16 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-16.1, AC-16.4). |
| 50 | OQ-17.1 | US-17 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-17.1, AC-17.2). |
| 51 | OQ-17.2 | US-17 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-17.1, AC-17.2). |
| 52 | OQ-19.2 | US-19 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-19.1, AC-19.2). |
| 53 | OQ-19.3 | US-19 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-19.1, AC-19.4). |
| 54 | OQ-20.1 | US-20 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-20.1, AC-20.2). |
| 55 | OQ-20.2 | US-20 | Missing rule | Other missing behaviour; 2 potentially affected current AC (AC-20.1, AC-20.4). |
| 56 | OQ-01.4 | US-01 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-01.1). |
| 57 | OQ-04.1 | US-04 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-04.1). |
| 58 | OQ-05.5 | US-05 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-05.2). |
| 59 | OQ-08.4 | US-08 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-08.1). |
| 60 | OQ-10.1 | US-10 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-10.1). |
| 61 | OQ-10.3 | US-10 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-10.1). |
| 62 | OQ-13.3 | US-13 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-13.3). |
| 63 | OQ-15.1 | US-15 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-15.1). |
| 64 | OQ-19.5 | US-19 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-19.3). |
| 65 | OQ-20.4 | US-20 | Missing rule | Other missing behaviour; 1 potentially affected current AC (AC-20.3). |
| 66 | OQ-21.2 | US-21 | Missing rule | Other missing behaviour; 0 potentially affected current AC; new acceptance coverage needed. |
| 67 | OQ-20.3 | US-20 | Missing rule | Field-meaning question last; 3 potentially affected current AC (AC-20.1, AC-20.2, AC-20.3). |
| 68 | OQ-19.4 | US-19 | Missing rule | Field-meaning question last; 2 potentially affected current AC (AC-19.2, AC-19.3). |
| 69 | OQ-11.1 | US-11 | Missing rule | Field-meaning question last; 1 potentially affected current AC (AC-11.2). |
| 70 | OQ-15.3 | US-15 | Missing rule | Field-meaning question last; 1 potentially affected current AC (AC-15.2). |
