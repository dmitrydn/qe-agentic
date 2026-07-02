# First-Principles Analysis: the Requirements / Oracle Problem in Agentic QE

_Companion to `graphify-decision-memo.md`. Written 2026-06-30, after the graph-L1 A/B returned a
no-go and pointed the whole investigation back at requirements quality. The point of this document is
to stop optimizing the wrong layer and rebuild the approach from undeniable truths._

---

## 1. The core problem, the outcome, and why it matters

**Core problem.** The agentic QE loop generates tests whose quality is capped **not** by the agent's
ability to find endpoints or understand code, but by whether each requirement carries a precise,
independent, *testable statement of expected behaviour* — an **oracle**. When that is missing, the
agent invents one, and an invented oracle is a false positive waiting to happen.

**Desired outcome.** A repeatable path from raw requirements to **oracle-bearing, testable
requirements**, such that generated tests are correct (low false-positive rate), meaningful (catch
real defects), and stable (low flakiness) — at scale, without hand-curating every requirement.

**Why it matters.** This is the binding constraint of the entire value proposition. Our own data says
so plainly:

- Curated requirements (oracle written in: "amount stored ×100 in cents; sender balance decreases,
  receiver increases by that amount") → **FP 0%**, perfect coverage, triage 100%.
- The same system on uncurated, boilerplate requirements ("As a user, I want *Setup: Register* so that
  the feature behaves as specified") → **FP 18.2%**, 38/44 covered, 28.8% quarantined.
- Adding code-structure knowledge (graph-L1) on top of the weak requirements **did not move FP** —
  and the FP hotspot (`USERS-008`, 18 false defects in *both* arms) was wrong assertions on fields the
  model already saw, not missing dependency knowledge.

Every sophistication we add downstream (graphs, multi-agent, more context) polishes a surface that is
not the constraint. The constraint is the specification.

---

## 2. Undeniable truths (reasoned from the ground up)

- **T1.** A test is four things: a stimulus, an observed behaviour, an **expected** behaviour, and a
  comparison. Remove "expected" and you no longer have a test — only an observation.
- **T2.** The expected behaviour (the oracle) is a statement of **intent**. Intent is not contained in
  the implementation. Deriving "expected" from the code under test is **circular** — it asserts the
  code does what the code does, which catches nothing.
- **T3.** Therefore the oracle must come from a source **independent of the implementation**: a human
  requirement, a formal contract/spec, a prior version, or an explicit business rule.
- **T4.** An agent asked to generate a test must get the oracle from the requirement. If it is absent
  the agent either (a) **fabricates** an expected value → false positive, or (b) asserts something
  trivial → catches nothing. We observed both.
- **T5. The structural flaw in the current design:** Generate both *decides* the expected value and
  *writes the assertion against it*. That is the agent **grading its own homework** — there is no
  independent oracle, so disagreement between the test and reality is as likely to be the test's fault
  as the app's. This is the mechanical root of the false-positive rate.
- **T6.** "Requirement quality," for testing, is a **measurable** property: does each acceptance
  criterion bind a concrete stimulus to a concrete, observable, falsifiable expected outcome (a real
  Given/When/Then with real values)?
- **T7.** Oracles split by source: some are **contract-derivable** cheaply and deterministically
  (HTTP status, response schema, required fields, Hurl assertions — Conduit ships these); others
  encode **business intent** (the ×100 cents rule, balance settlement) that no contract states and
  only a human can supply.
- **T8.** The cheapest place to fix the oracle is **once, upstream** (author/enrich the requirement),
  not **per test, per run** downstream. Downstream the agent has no new source of truth, so it guesses.

The graph-L1 result is fully explained by T2 + T5: a code-derived artifact can never supply an oracle,
because the oracle is intent, not structure — and Layer 2 (also code-derived inference) would fail for
the same reason.

---

## 3. Assumptions, challenged and rewritten

| # | Assumption (as commonly held) | Verdict | Rewritten as a verifiable truth / testable question |
|---|---|---|---|
| A1 | Better tests need the agent to understand the code better | **False** (graph-L1 disproved) | Test quality is bounded by **oracle** quality in the requirement, not code knowledge. |
| A2 | The requirements we have are usable as-is | **Partly** | *Testable:* what % of the 44 (and Conduit's 191) contain a concrete, falsifiable expected outcome? |
| A3 | A requirement = a user story + an endpoint | **Incomplete** | A *testable* requirement = preconditions + actor + stimulus + **concrete expected outcome**. |
| A4 | Curation is manual and doesn't scale | **Unproven** | The curation that mattered was *adding the oracle*. *Testable:* what fraction of oracles are contract-derivable vs need a human? |
| A5 | The agent can author the oracle and test against it | **False** (T5) | The oracle must be **fixed independently before** generation, or the test grades its own homework. |
| A6 | More requirements = more coverage = better | **False** | 191 boilerplate items dilute signal. **Oracle-bearing quality > quantity.** |
| A7 | Flakiness is a runner problem — raise N | **Partly** | Flakiness rose in our data when assertions got *ambitious without a precise oracle* (the PATCH-balance case). Often flakiness = **under-specified oracle**, not a runner issue. |
| A8 | The constraint is generation | **False** | Generation is already adequate where the oracle exists. The constraint is **specification**. |

---

## 4. The redesigned approach (reconstructed from truths)

Stop building a code-knowledge back-end. Build the missing **oracle front-end**: a step that sits
*before* Generate and guarantees that every requirement entering generation carries an independent,
concrete oracle — or doesn't get generated against at all.

Three moves, in order of leverage:

1. **Make the oracle a first-class, independent input.** Separate "what is the expected behaviour"
   (sourced from contract or human, fixed) from "write a test that checks it" (the agent's job). The
   agent may never invent the expected value it then asserts. This directly removes the T5 flaw.
2. **Auto-derive oracles from formal contracts where they exist.** Status codes, response schema,
   required fields, enum domains, and Hurl/OpenAPI assertions are deterministic oracles — extract them
   into structured acceptance criteria. This is exactly where Conduit (OpenAPI 3.1 + Hurl) is *richer*
   than cypress-rwa, which reframes Conduit as the **better**, not harder, next target.
3. **Gate the rest.** A requirement with no derivable and no authored oracle must **fail a testability
   gate** and route to a clarification/authoring queue — not silently flow into Generate and become a
   false positive. (The machinery already exists: `workflow/steps/testability.js`, the assess gate's
   D4 "interface grounding", and the `clarifications/` output. We repoint it from "is there an endpoint
   to call" to "is there a concrete falsifiable expected outcome.")

The human stays in the loop only for **business-intent oracles** (the ×100 rule, settlement
semantics) — a small, bounded, write-once set, *if* assumption A4 holds. Step 1 below measures whether
it does.

---

## 5. Step-by-step solution path (with the reasoning for each)

**Step 1 — Diagnose oracle-presence and prove it predicts FP (1–2 days).**
Classify every requirement into: (a) has a concrete oracle already, (b) oracle is contract-derivable,
(c) needs a human business-rule oracle, (d) no possible oracle (delete it). Then **correlate the class
with the per-requirement false-positive data we already have** from the A/B. *Reasoning:* this is the
cheapest possible falsification — if oracleless requirements (like `USERS-008`) don't dominate FP, the
whole thesis is wrong and we stop. We can run most of this against existing run outputs today.

**Step 2 — Contract-oracle extractor (3–5 days).**
Extend the adapter to emit *expected outcomes* (status, schema, required fields, enum domains, Hurl
assertions) as structured acceptance criteria, not freeform notes. *Reasoning:* attacks the largest,
cheapest slice of missing oracles deterministically; no LLM, no hallucination; directly testable by
re-running the harness.

**Step 3 — Harden the testability gate into an oracle gate (2–3 days).**
Change the gate so a requirement with no concrete falsifiable expected outcome **fails** and is routed
to `clarifications/` instead of generated against. *Reasoning:* removes the input that manufactures
false positives; converts a silent quality leak into an explicit, trackable backlog.

**Step 4 — Author business-rule oracles once (bounded by Step 1's count).**
For the (c) set, write oracles in the structured format, by hand, once. *Reasoning:* intent cannot be
derived (T2); but it is a one-time, finite cost — and Step 1 tells us how finite before we commit.

**Step 5 — Enforce oracle/author separation in the pipeline.**
Generate consumes the fixed oracle as input and is forbidden from inventing expected values not traceable
to it. *Reasoning:* closes the T5 "grading own homework" loophole structurally, not by prompting.

**Step 6 — Re-run the A/B on oracle-enriched vs baseline requirements (1 day + run time).**
Same harness, same metrics. *Reasoning:* this is the real experiment the graph one was a proxy for; it
isolates the effect of the actual constraint.

**Step 7 — Generalize to Conduit (adapter-only).**
The contract-rich app should benefit most. *Reasoning:* validates that the leverage is the spec layer,
and that the core stays app-agnostic (only the adapter's oracle-extraction changes).

---

## 6. Key risks and trade-offs

- **Honest coverage drops.** Gating oracleless requirements means testing *fewer* things, on purpose.
  Trade vanity coverage (a test that asserts nothing real) for precision. Mitigation: the clarification
  queue turns each gap into a visible authoring task, so "coverage" becomes a deliberate decision, not
  an accident.
- **Contract oracles are shallow.** Status/schema catch format, not business correctness (a 200 with a
  wrong balance still passes). So Steps 2 and 4 are complementary, not substitutes.
- **The human set might be large.** If most high-value oracles need intent, A4 is false and the
  "scales without curation" dream is limited. That is precisely why Step 1 measures it *first*, cheaply,
  before any build.
- **LLM oracle-authoring can re-introduce fabrication.** If you use a model to *draft* business-rule
  oracles, it must be grounded in a real source (the running app's observed behaviour on a known-good
  seed, the contract, a human sign-off) — never free generation, or T5 returns by the back door.
- **Flakiness vs ambition.** Precise oracles let tests be assertive *and* stable; vague oracles plus
  ambition produced the quarantine spike we saw. Precise oracles should reduce flakiness, but verify it
  in Step 6 rather than assume it.

---

## 7. Execution plan

| Priority | Action | Owner | Timeline | Success metric | Next action |
|---|---|---|---|---|---|
| **P0** | Step 1 — oracle-class each requirement; correlate with existing per-req FP | Claude Code (analysis) + Dmitry (review) | 1–2 days | A clear correlation: oracleless reqs account for the majority of FP. Go/stop on the whole thesis. | Run the classifier over the 44 + the A/B per-req data we already have |
| **P0** | Decide go/stop based on Step 1 | Dmitry | same | Documented decision | If correlation holds → proceed; if not → thesis falsified, stop |
| **P1** | Step 2 — contract-oracle extractor (deterministic) | Claude Code | 3–5 days | New structured oracles emitted for ≥X% of the 44; unit-tested | Build in the cypress-rwa adapter; add Conduit's OpenAPI/Hurl path next |
| **P1** | Step 3 — testability → oracle gate + clarification routing | Claude Code | 2–3 days | Oracleless reqs no longer reach Generate; appear in `clarifications/` | Extend `workflow/steps/testability.js` + assess D4 |
| **P2** | Step 4 — author business-rule oracles for the (c) set | Dmitry | bounded by Step 1 count | The (c) set has oracles; size is small as predicted | Write in the structured format used by curated hints |
| **P1** | Step 5 — oracle/author separation in pipeline | Claude Code | within Step 3 | Generate cannot assert values not traceable to the oracle | Add a generation-time guard + prompt contract |
| **P0** | Step 6 — re-run A/B: oracle-enriched vs baseline | Claude Code (run) + Dmitry (key/Docker) | 1 day + runs | Uncurated FP falls from 18% toward the curated 0% (target **<8%**); quarantine down; coverage = *deliberate* | Reuse the differential harness we just built |
| **P2** | Step 7 — generalize to Conduit | Claude Code | after Step 6 | Same gate works via adapter only; Conduit FP comparable or better | Add Conduit adapter oracle-extraction |

**Headline success metrics.**
1. **Oracle coverage** — % of requirements with a concrete falsifiable expected outcome (before → after).
2. **False-positive rate** on the uncurated set — 18% → **<8%** target, achieved by oracles not by per-req curation.
3. **Quarantine/flakiness rate** — 28.8% → meaningfully lower.
4. **Human cost** — number of requirements needing hand-authored oracles (should be small; measured in Step 1).
5. **Generalization** — Conduit benefits with adapter-only change, core untouched (`check:boundaries` green).

---

## 8. Step 1 executed (2026-06-30) — thesis confirmed and **refined**

Ran the diagnostic against the per-requirement false-positive data from the three baseline sweeps,
joined to each requirement's actual acceptance criteria. Result:

**FP concentrates by specification completeness, not by oracle presence alone.** By method: POST 0.34,
GET 0.12, PATCH 0.07, DELETE 0.00. The worst requirements fail for one of three reasons — none of them
code-knowledge problems:

- **Unsatisfied state precondition.** `BANK-TRANSFER-001` (FP 1.0): asserts `transfers[0].userId`
  but the seeded actor may have **zero** transfers → `transfers[0]` undefined → false "defect."
  `CONTACTS-001` (FP 1.0): same with `contacts[0]`.
- **Unbound reference / incomplete input.** `USERS-008` (FP 0.72): oracle references `firstName`
  (never bound) and POST /users needs seven "must exist" fields — any omission yields 4xx vs the
  expected 201. `CONTACTS-001` also leaves `:username` unbound.
- **Elided oracle.** `NOTIFICATIONS-002` (FP 1.0): the criterion is literally *"the request completes
  (see source for the exact assertion)"* — nothing falsifiable.

Contrast the robust ones: `USERS-001` asserts `results.length > 1` (state-robust, FP 0). `TRANSACTIONS-002`
uses `results[0]` and passes — but **only because the seed happens to contain data for that actor**;
it is green by luck, not by specification.

**Why:** these requirements were extracted from cypress tests that built state **imperatively**
(`cy.task` seeds, prior creates, faker-bound inputs). The extraction kept the **final assertion** and
dropped the **setup and the bound values that made it true.** Each requirement is therefore an
assertion divorced from the state and inputs that make it pass — and that divorce is the
false-positive generator.

**Refinement to the truths above (T1–T8):** the unit that must be made whole is not "the oracle" in
isolation but the **self-contained testable scenario = established preconditions (state) + concrete
bound inputs (stimulus) + falsifiable expected outcome (oracle).** All three of T2's "independent of the
implementation" sources apply, and all three failure modes are specification-completeness defects that
no code graph can repair — which re-confirms the graph no-go from an independent direction.

**Consequence for the plan (§7):** Step 2 broadens from "extract oracles" to "extract/repair the whole
scenario" — concretely: (a) make list-endpoint oracles state-robust (assert schema-if-present or
guarantee the precondition by setup), (b) bind every referenced variable to a concrete value, (c) fail
the gate on elided oracles. The biggest, cheapest win is the **write endpoints** (POST FP 0.34): give
them complete, valid input bindings and a reachable expected status.

### 8.1 Defect-report evidence — the diagnosis sharpens to *fidelity*, not just completeness

Reading the AC text suggested "incomplete scenarios." Reading the actual **defect reports** (the
runtime failure reasons) revises it to something stronger: the dominant failure is **requirement-to-
application fidelity** — the requirement asserts things that are *not true of the running app*. Two
deterministic, code-knowledge-proof classes:

- **Phantom endpoints (404).** `BANK-TRANSFER-001` requests `GET /bankTransfer`; the app mounts
  `/bankTransfers` (plural) → 404. `NOTIFICATIONS-002` requests `POST /notifications`; that prefix
  serves only GET/PATCH (notifications are created as *side-effects*) → 404. The requirement names an
  endpoint the app does not have. **Detectable:** the endpoint is absent from the app's real route
  table, which `extractApiRoutes` already builds — indeed these requirements' hints already lack the
  "Mechanically extracted from…" line for exactly this reason.
- **Unenforced constraints.** `USERS-008` (FP 0.72): the agent's negative test omits `firstName` and
  expects a 4xx; the app returns **201**. Cause: `POST /users` applies `userFieldsValidator` as *raw
  middleware, unwrapped by `validateMiddleware`* — its rules are declared but never enforced — yet the
  extractor harvests field rules from every `*Validator` in the route indiscriminately and reports
  `firstName (must exist)`. So the requirement over-claims a constraint the app does not enforce. This
  is a **bad requirement, not an app bug. Detectable:** only attribute a field rule to a route if its
  declaring validator is actually enforced.

**Honesty note — some "false positives" are real findings.** Blindly suppressing this bucket would be
wrong. A 404 on a phantom endpoint is a *spec* error; but the class of "app accepts what the contract
forbids" can, in a different app, be a *genuine* defect. The fix is not to silence disagreements but to
**ground the requirement in the app's actually-enforced contract**, so that a remaining disagreement is
trustworthy signal rather than extraction noise.

**Revised Step 2, concretely (both deterministic, adapter-local, no LLM, no graph):**
1. **Endpoint grounding gate** — fail/flag any requirement whose `method /path` is not in the real
   route table; route to `clarifications/` with the nearest real route. Kills the phantom-endpoint FPs
   (`BANK-TRANSFER-001`, `NOTIFICATIONS-002`, …).
2. **Enforcement-aware constraint extraction** — in `extract-api-hints.js`, attribute a field rule to a
   route only when its validator is actually enforced (wrapped in `validateMiddleware`). Kills the
   over-claimed-required-field FPs (`USERS-008/009`).
Then re-run the differential harness and measure FP before/after.

### 8.2 Step 2 executed (2026-06-30) — grounding is a real but *modest* win

Both fixes were built behind `AQE_GROUNDING=1` (default off), unit-tested, `npm test` (148) and
`check:boundaries` green. One grounded `--all` run vs the baseline:

| metric | baseline run1 | grounded run1 |
|---|---|---|
| requirements covered / total | 37/44 (84%) | 36/41 (**88%**) |
| tests generated | 136 | 123 |
| defects (FP) | 21 | 15 |
| **FP rate** | **15.4%** | **12.2%** |
| generate-phase tokens | 359,597 | 342,629 |

**Signal, not noise.** The baseline FP band across three runs was 15.4 / 19.0 / 19.1% (min 15.4%).
Grounded run1 at **12.2% is below the entire baseline band**, so even a single run beats the best
baseline run. Coverage-*rate* rose (84% → 88%), tokens fell slightly, gate stayed green.

**But decompose the 3.2-point drop honestly:**
- Gating the 3 phantom requirements removed ~5 FP over ~13 tests (all 404 noise): ~15.4% → ~13.0%.
  That is **~2.4 points of "stop testing endpoints that don't exist"** — a legitimate *fidelity*
  cleanup, but mechanical (set-reduction), not better generation.
- Fix 2 removed **1** additional live FP (`USERS-008` `defaultPrivacyLevel`, a field declared only in
  the unenforced `userFieldsValidator`): ~13.0% → 12.2%. Real, but small — smaller than the raw
  "must-exist" over-claim count suggested.

**Verdict: GO on grounding** — cheap, deterministic, safe, correct-by-construction (never test a
phantom endpoint), and it moved FP below the baseline band. But it is a **~3-point fidelity cleanup,
not the road to single-digit FP by itself.** The residual **12.2% lives in the state/precondition
class** (e.g. `CONTACTS-001`: asserts `contacts[0]` on a possibly-empty collection, unbound
`:username`) — real endpoints grounding correctly leaves in but cannot repair. **That is the next and
larger lever:** establish the state a list-oracle needs, or make the oracle state-robust
(schema-if-present / array-is-array instead of `[0]`).

**Matcher fix to carry forward (b).** Grounding currently compares `"METHOD /path"` by exact string.
`BANK-ACCOUNTS-004` was gated on a param-*name* technicality — its path was `DELETE /contacts/:bankAccountId`
while the real route is `DELETE /contacts/:contactId` (same shape, different param name). It was a
garbled requirement so no real coverage was lost, but the exact-match rule will **false-gate real
endpoints whose path params are merely named differently.** Before relying on grounding on a cleaner
corpus (notably **Conduit**), normalize path params to wildcards (`/contacts/:x` → `/contacts/{}`)
in the matcher so grounding keys on path *shape*, not param spelling.

_Caveat: single grounded run. It is below the baseline band, so directionally solid; two more grounded
runs would convert "below-band at n=1" into a confirmed distribution if that certainty is worth ~€7._

### 8.3 Step 3.0 — residual adjudication (2026-06-30): the "FP rate" was mostly *real defects*

Read all 15 residual "defects" from the grounded run. The premise inverts:

| bucket | count | what it actually is |
|---|---|---|
| **Real app defects** the system correctly caught | ~11 | 500-crashes and missing validation/auth in the demo backend |
| **Brittle oracles** (genuine FP) | ~3 | over-precise extracted assertions (`errors.length === 1`, "reject unknown field") |
| **State / empty-collection** (the predicted class) | ~1 | `TRANSACTIONS-003` empty results |

Concrete real defects (unambiguous — a 500 or missing auth is never acceptable): `CONTACTS-001`
500-crashes (`getUserId` on undefined, authed *and* unauthed); `USERS-009` 500-crashes on missing
password (bcrypt on undefined); `BANK-ACCOUNTS-006` executes an unauthenticated GraphQL `createBankAccount`
instead of returning 401; `TRANSACTIONS-010` 500s on create. Plus missing-validation gaps:
`BANK-ACCOUNTS-002` (non-existent id → 200 not 404), `BANK-ACCOUNTS-003` (empty accountNumber → 200),
`USERS-004` (non-existent profile → 200), `USERS-010-TC2` (invalid email → 201), `CONTACTS-003`
(invalid contact FK → 200).

**Consequence — the metric was conflating three things.** The **true false-positive rate is ~3/123 ≈
2–3%**, not 12.2%. The rest is the agentic QE system *working*: cypress-realworld-app has weak
server-side validation and several crash bugs, and the system found them. This is the strongest
possible confirmation of the first-principles thesis: **without an independent oracle of what the app
*should* do, the "FP" number cannot separate "bad test" from "real bug."** The cypress tests encoded
"invalid input → 422"; the app doesn't honor it; mostly the app is wrong.

**Step 3 pivots** (it is *not* precondition-binding — that's ~1 case):
- **3a — Reclassify (done).** True FP ≈ 2–3%. Headline: the system is far more capable than the raw
  metric implied; a large share of "FPs" are findings.
- **3b — Relax the ~3 brittle exact-count oracles** (`errors.length === 1` → `>= 1` / subset). Cheap,
  deterministic; takes true FP toward ~1%. Verify with one differential run (~€0.7).
- **3c — Surface the ~11 real defects as the system's value**, not noise. Do not suppress.
- **The real remaining lever is oracle *authority*** — when app and spec disagree, which is truth? A
  triage/adjudication problem (the memo's bet #2), not a generation-completeness one.

_Caveat: adjudication is based on the triage agent's defect rationales; the 500-crash and missing-auth
findings are unambiguous, the missing-validation ones warrant a quick human confirm against the app._

---

## 9. The one-sentence reframe

We spent the journey trying to make the agent **understand the system better**; the data says the win
is to make each requirement a **self-contained, reachable scenario** — established preconditions,
concrete bound inputs, and a falsifiable expected outcome — because a test is only as good as the
scenario it encodes, and that scenario is intent + setup, which no amount of code knowledge can supply.

**Step 1 is done and the thesis holds** (§8): false positives concentrate in requirements with
incomplete scenarios (unsatisfied state, unbound inputs, elided oracles), led by write endpoints.
**Immediate next action:** Step 2 — build the scenario-completeness extractor/gate, starting with the
POST endpoints, and re-run the differential harness to measure FP before/after.
