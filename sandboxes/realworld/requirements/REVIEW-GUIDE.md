# Conduit requirements: review guide for the BA

**For:** the BA of the Conduit app (`DECISIONS.md` D-04). No prior BA experience is assumed.
**Time:** about half a day to a day. Work one epic per sitting.
**You need:** `review/BA-review.xlsx` (your working file), `epics/*.md` (the stories), and for step 4 only, a running local Conduit sandbox (`../install/INSTALL.md` §7).

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
- Is anything obviously missing that a user would expect? (Note it; don't invent the rule. It becomes a new open question.)

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

With the local sandbox running (`INSTALL.md` §7: start the backend, seed, start the web app, open `http://localhost:4200`; sign in as `johndoe` / `password123`), try your rule by hand, in the browser or with simple API calls. Record what you saw in *Observed in app*.

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

*To be generated in run 2 by the agent: one line per open question with its ID, story, kind proposed by the agent, and why it is ranked where it is. Everything above this section is fixed; the agent must not change it.*
