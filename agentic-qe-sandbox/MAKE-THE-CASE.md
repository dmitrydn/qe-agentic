# Make the case: an agent that writes and runs its own tests

**Stage 7 deliverable.** This is the demo-and-evidence package the rest of the
build (Stages 1-6b) was constructed to support. It answers one question for a
reader who hasn't seen the rest of this repo: *can an AI agent be trusted to
generate, execute, and triage its own API tests against a real application —
and how do we know?*

Everything below was run live against a real, running application (the
Cypress Real World App — a full-stack banking demo with a real backend, real
database, real auth) and a real LLM (Claude Sonnet 4.5 via OpenRouter), not
mocked or scripted for effect.

## The one-paragraph pitch

Point the agent at a plain-English requirement (a user story plus
acceptance criteria, no test code). It writes an executable API test. We run
that test three times against the real app to rule out flukes. If it fails,
a second agent step looks at the failure evidence — never told whether
anything was deliberately broken — and decides: is this a real bug in the
app, a bad test, or an environment hiccup? Only "real bug" gets reported.
Everything is measured against a known-answer key (a catalog of deliberately
injected defects, including two the suite is *not* supposed to catch) so the
headline numbers are a measurement, not a marketing claim.

## Watch it work: one requirement, start to finish

This is the literal output of `demo/run-demo.js`, run against the live
container — every line below actually happened, in this order, in one run.

**1. The requirement** (`CYPRESS-RWA-TRANSACTIONS-007`, as authored, no AI
involved in writing it):
> As a user of cypress-rwa, I want "creates a new payment" so that the
> Transactions feature behaves as specified.
> - Given the requesting client is authenticated
> - When a POST /transactions request is made
> - Then the response status is 200, `transaction.id` is a string,
>   `transaction.status` is `"complete"`

**2. The agent writes the test.** From that prose alone, it produced a
4-step API test: fetch two real seeded users, fetch a real bank account,
submit a payment from one to the other, then re-fetch both balances and
assert the money actually moved by the right amount, in cents. Nobody told
it to check balances — it inferred that from the requirement's domain
context.

**3. Run it three times against the untouched app** — `pass, pass, pass`.

**4. We break the app on purpose.** One line, in the real backend source:
the payment amount stops being converted from dollars to cents.
```diff
- amount: transactionDetails.amount * 100,
+ amount: transactionDetails.amount,
```

**5. Same test, no changes, run again** — `fail, fail, fail`.

**6. The agent triages the failure**, seeing only the request/response
evidence (it is never told a defect was injected):
> "The application is not performing the documented dollar-to-cents
> conversion... a clear violation of the documented contract." —
> classified `real_defect`, confidence `high`, with a 5-step repro.

**7. We revert the one-line break. Same test, run again** — `pass, pass,
pass`. The app, not the test, was the variable the whole time.

That loop — generate once, run three times, triage on failure, revert and
confirm — is exactly what runs at scale below, just done one requirement at
a time so it can be watched rather than taken on faith.

## Does it scale? The numbers, with the caveats that bound them

Two different runs answer two different questions. Conflating them would
overstate the case, so they're kept separate everywhere in this repo
(`VERIFICATION.md` is the full, audited record this section summarizes).

### Run A — accuracy, on a curated slice (4 of 44 requirements)

These 4 requirements have hand-written, field-level hints about the app's
API shape (`CURATED_API_HINTS`) so the agent has enough grounding to not
invent fields. This is the "how good is the loop when it isn't guessing"
measurement.

| Metric | Result |
|---|---|
| False-positive rate (generated test fails against the clean, correct app) | **0%** |
| Defect catch rate (12-defect catalog, real defects only) | **90%** (9 of 10) |
| Negative controls correctly *not* caught | **2 of 2** |
| Triage accuracy (12-case labelled battery: real bug / bad test / environment) | **100%** (12 of 12) |
| Orphan tests (generated, untraceable to a requirement) | **0** |

The one missed defect is not swept under the rug: it's a deliberately subtle
off-by-one in pagination that the generated test's assertions structurally
can't see (full root-cause in `VERIFICATION.md`, Workstream B). Two negative
controls — defects the suite is *not* supposed to catch — were both
correctly missed, which is what makes the 90%/100% numbers a real
measurement rather than a catalog stacked in the suite's favor.

### Run B — breadth, uncurated, all 44 requirements

No curated hints — just the project's own auto-extracted requirements text,
across every domain in the app (transactions, bank accounts, users,
contacts, notifications, likes, comments). This is the "what happens when
you stop holding its hand" measurement.

| Metric | Result |
|---|---|
| Requirements with at least one passing test | **38 of 44** (86%) |
| Tests generated | **132** |
| ...passed | **70** |
| ...failed (false positive against the clean app) | **24** (18.2%) |
| ...flaky / inconclusive, excluded from scoring | **38** (28.8%) |
| Orphan tests | **0** |

The honest takeaway: **accuracy is high when the agent is given enough
context about the API, and drops off without it.** 18.2% false positives and
28.8% flaky-or-unresolved at full breadth, against 0% false positives on the
curated slice, is the clearest, most actionable finding in this whole
package — not a number to explain away. It points at a concrete next
investment (richer auto-extracted API hints, the same fix that took the
curated slice to 0%), not a fundamental flaw in the approach.

> **Update (2026-06-30): this "18.2%" reading was tested and substantially
> revised.** We built the "richer hints" fix as a code knowledge graph and it
> did **not** reduce false positives — and investigating why revealed that most
> of the "false positives" were *real bugs the system found*. The true
> false-positive rate is ≈ 2–3%. See the new chapter "After Stage 7" below.

### Where the gate currently stands

Run end-to-end, the project's own acceptance gate (`./verify.sh`) is
currently **red** — it fails at the defect-catch step on the same
structurally-unfixable pagination miss called out above. This was found
while preparing this package, run twice for confirmation (identical result
both times — not a flaky LLM call). It is reported here rather than hidden:
fixing it for real means either earning a genuine catch (better hints for
that one requirement) or deliberately reclassifying that defect as an
accepted gap — both real follow-up work, not a checkbox to tick. See
`VERIFICATION.md`, "Gate status," for the full account.

## What this proves, and what it doesn't

**Proven, live, against a real app:**
- An agent can turn plain-English acceptance criteria into a runnable,
  meaningful API test without being shown test code.
- The loop correctly tells real application bugs apart from bad tests and
  environment noise (100% on a 12-case labelled battery; one real mistake
  found and fixed during that battery's own construction, documented rather
  than discarded).
- The flake-guard (run 3x, reset between runs) and the negative controls
  are not theoretical — both were exercised live, not just unit-tested.
- It generalizes beyond the 4 hand-curated requirements, just with lower
  accuracy — measured at 18.2%/28.8%, not assumed.

**Not yet proven / explicitly out of scope:**
- UI/E2E test generation — this is API-level only, by design (see
  `VERIFICATION.md` §8).
- A second, structurally different app — the core/adapter split is designed
  for this, but only one live app has been wired up.
- A fully green standing gate at the expanded, 12-defect catalog — see
  "Where the gate currently stands" above.
- Rare, intermittent flakiness — the 3-run flake guard catches frequent
  flakiness; rare flakiness would need many more runs than were attempted.

## After Stage 7: we chased the 18.2%, and the case got stronger

Stage 7 named one honest weakness — 18.2% false positives at full breadth — and
one hypothesis for fixing it: give the agent *richer knowledge of the code*. We
spent the next chapter testing that hypothesis properly. It failed, and failing
it is what produced the strongest evidence in this whole package.

**1. We built the "richer knowledge" fix — a code knowledge graph — and it did
not work.** The idea: build a dependency/side-effect graph of the backend and
feed the agent what each endpoint actually touches (e.g. "this payment mutates
sender and receiver balance"). We built it, verified it, and ran a controlled
A/B. The false-positive rate did not move; coverage slipped by one. Measured,
not assumed — and killed cheaply rather than shipped on faith.

**2. Why it couldn't work — a first-principles reason.** A test checks observed
behaviour against an *expected* behaviour — the oracle. The oracle is a
statement of **intent**, and intent is not present in the implementation.
Deriving "what it should do" from the code under test is circular — it just
asserts the code does what the code does, which catches nothing. So no amount of
code knowledge can supply a missing oracle. The lever was never code knowledge;
it is the **fidelity of the requirement itself.**

**3. What the false positives actually were.** We read every failure. The
dominant cause was requirements that assert things *untrue of the running app* —
endpoints that don't exist at the stated path, and input constraints the app
never actually enforces. A small, deterministic **grounding gate** (an endpoint
must exist in the app's real route table; only enforced validators count as
constraints) cut the rate from 15.4% to 12.2%.

**4. The reframe — most "false positives" were real bugs.** Adjudicating the 15
remaining failures one by one: **about 11 were genuine defects the system
correctly caught** — the API 500-crashes when a password is omitted, it runs a
GraphQL *createBankAccount* mutation with **no authentication**, it accepts empty
account numbers and invalid emails without validation, it crashes on a contacts
lookup. Only ~3 were true false positives (over-strict "exactly one error"
assertions), and ~1 a data-setup gap. **The true false-positive rate is ≈ 2–3%,
not 12%.** The headline "accuracy problem" was, in large part, the agentic QE
system *doing exactly its job* against a demo backend with weak validation.

**What this changes about the case:**
- The loop is **more capable** than the raw metric implied — it surfaces real
  crashes, auth gaps, and validation holes without being told they exist.
- The binding constraint is **requirement/oracle fidelity** — a solvable,
  now-understood specification problem — not a limit of the agent or the model.
- "Give it more code knowledge" is **disproven** as the lever, saving that
  investment. The next real lever is *oracle authority*: when the app and the
  spec disagree, deciding which is the source of truth.

Full technical record: `../docs/design/graphify-decision-memo.md` (the graph
experiment) and `../docs/design/requirements-first-principles.md` (the
first-principles analysis, the grounding result, and the residual adjudication).

## Where to look for more

- `VERIFICATION.md` — the complete, line-by-line audited record (Stage 6,
  Stage 6b workstreams A-D, the gate-status finding above).
- `demo/run-demo.js` — re-run the live walkthrough above yourself:
  `node demo/run-demo.js [requirementId] [defectId]`.
- `reports-all/scorecard.json` + `reports-all/report.md` — the full
  44-requirement breadth run's raw output.
- `eval/run-eval.js`, `eval/run-triage-battery.js` — the seeded-defect and
  triage evaluation harnesses, runnable on demand.
