# Decision Memo: Should a code knowledge graph (graphify) feed the agentic test-gen loop?

_Status: **A/B executed — graph-L1 NO-GO** (see §12). Phase 0 passed (§5), arm built (§5.1), differential A/B run on the 8 augmented requirements: no FP reduction, slight coverage loss. Layer 2 downgraded to low priority. One transferable win (balance-delta phrasing) kept. Author: exploration session, 2026-06-30. Target: Cypress RealWorld App._

---

## 1. Recommendation (read this first)

Run a **bounded A/B experiment** on the Cypress RWA target before committing to any build. The
hypothesis is sound but must be aimed correctly: a code knowledge graph helps **the precision of the
dependency knowledge that feeds test generation**, not the token count of the generation step itself.

Phase 0 (the graph-quality gate, §5) has now been run on the real backend, and it splits bet #1 into
**two layers** with very different cost and reliability — a distinction that did not exist before we
saw the actual graph:

- **Primary (#1), Layer 1 — deterministic, free, no API key.** Enrich the adapter's `apiHints` with
  **route→DB side-effect chains recovered by traversal** of the `EXTRACTED` graph (e.g. the payment
  route → `createTransaction` → `debit/creditPayAppBalance`). This is genuinely new signal the regex
  extractor cannot produce, with zero hallucination risk. **Run this arm first.**
- **Primary (#1), Layer 2 — LLM-inferred, amortized, needs audit.** Field-level **capture→consume**
  edges (`POST /transactions` → `transaction.id` → `GET /transactions/:id`). Phase 0 confirmed an LLM
  recovers these correctly — but they are *cached inference*, not a unique graph capability. They
  **reuse your existing OpenRouter setup** — preferably an inference pass on the sandbox's own working
  `LlmClient`, or graphify's own `--mode deep` pointed at OpenRouter (no new key). **Run as a second
  arm only if Layer 1 shows signal.** Layer 1 is now built; its measured reach is **narrow but
  precise** — see §5.1, which also sharpens what Layer 2 must add.
- **Secondary (#2):** give the Triage step a dependency subgraph for the failing test, to sharpen
  real-defect-vs-environmental classification.
- **Later (#3):** engine-side use of the graph for requirement clustering / orphan detection.

A naive integration — having the Generate agent query the graph live (**#4**) — is explicitly
**rejected** for the first experiment: it adds tokens to a step that is already lean and would be
measured against a baseline that does not read raw code, guaranteeing a weak or negative result.

**Go** if graph-enriched hints cut the uncurated false-positive rate from ~18% to **<10%**, or lift
coverage from 38/44 to **≥42/44**, at **≤ token parity** at generate-time. **No-go** if results sit
within run-to-run noise or only improve at materially higher token cost. Full criteria in §7.

The experiment is cheap because it reuses infrastructure you already trust: the same harness, the
same model/temperature, and the two baselines you already measured (curated 4-of-44 slice; uncurated
44). It is **falsifiable by construction** — that is the point.

---

## 2. The hypothesis, made precise

The Generate agent never reads raw source. It is handed a per-requirement context object —
`userStory`, `acceptanceCriteria`, `apiHints`, `actors`, and the `TestCase` schema
(`workflow/prompts/generate.user.md`). The `apiHints` are produced upstream, deterministically, by
`adapters/cypress-rwa/extract-api-hints.js`.

That extractor is a **regex/line scanner**. Per route it derives: HTTP method, full path, the
`ensureAuthenticated` gate, and body/query field names + types pulled from the express-validator
chains (`extract-api-hints.js:138-167`, `renderNotes` at `:175`). It is, by its own design comment,
**intra-route** — it sees one endpoint at a time. It structurally cannot produce:

- **Cross-route data dependencies** — the `POST` that creates the entity a later `GET` reads.
- **State / DB side effects** — the endpoint that mutates a balance, seed row, or foreign key.
- **Capture→consume chains across requests** — the exact thing the Generate prompt's `capture` /
  `{{localName}}` mechanism exists to express (`generate.system.md:9-22`). Today the model must
  *infer* those chains from acceptance-criteria prose, with no structural backing.
- **Custom validators** — it emits the literal string `custom-validated(see source)` and gives up
  (`extract-api-hints.js:48`).

A code knowledge graph — tree-sitter AST + call-graph pass + inferred edges, per graphify's
documented extraction — is exactly the artifact that supplies those missing edges. **The hypothesis
therefore lands on a specific, measurable gap, and your own uncurated numbers are that gap's
fingerprint:** FP 18.2%, 38/44 covered, 28.8% quarantined, attributed in `PROGRESS.md` to the
absence of "richer auto-extracted API hints."

---

## 3. The reframe that prevents a wasted experiment

graphify's headline number — **71.5× fewer tokens** — is measured against *an agent reading raw
files*. Your Generate step **already does not do that.** It reads lean, distilled hints. Point the
graph at generation expecting a token win and you are comparing against an already-thin baseline; the
result will look flat or negative, and you will wrongly conclude the graph has no value.

The graph's value in *this* architecture is **dependency precision**, which shows up as lower FP and
higher coverage — a *quality* axis — not as a smaller generate-time prompt. Token wins are real only
where the graph *replaces* whole-artifact reading (requirement clustering, coverage analysis — bet
#3), and are illusory where the step is already distilled (live generate-time querying — bet #4).
Keep the two axes separate when reporting, or the comparison misleads.

---

## 4. Where the graph plugs in — four points, one decision

The locked **app-agnostic boundary** is the deciding constraint. `workflow/` and `core/` may not
import an adapter or name an app/framework; `tools/check-boundaries.js` fails CI if they do
(`README.md` "Design principles"). Building a graph from a specific app's backend, and translating it
into hints, is inherently app-specific — so that work **must live in the adapter**, never in core.
That single fact orders the options:

| # | Insertion point | What the graph adds | Token effect at generate-time | Boundary-safe? | Verdict |
|---|---|---|---|---|---|
| 1a | Adapter extractor → `apiHints`, **deterministic traversal** (offline) | Route→DB side-effect chains (`EXTRACTED`); the regex scanner is blind to these | None (build-time, amortized) | Yes — stays in adapter | **Primary, run first** |
| 1b | Adapter extractor → `apiHints`, **LLM-inferred edges** (offline) | Field-level capture→consume chains | None at generate-time; one-time inference pass on your existing OpenRouter `LlmClient` | Yes — stays in adapter | **Primary, second arm** |
| 2 | Triage ← dependency subgraph for the failing test (live) | Structural basis for real-defect vs environmental | Small, on a judgment step where it's justified | Needs a *generic* graph-query interface in core; per-app graph injected via adapter | **Secondary** |
| 3 | Select / coverage (engine-side, deterministic) | Cluster related reqs; detect orphaned code paths | Negative (saves tokens) | Yes | **Later** |
| 4 | Generate agent queries graph live | Flexible context, but redundant with #1 | Adds tokens to an already-lean step | Same core-interface cost as #2, less payoff | **Rejected for v1** |

Bet #2's defect signature is a strong tell that this is the right shape of tool: the known Conduit
defects (missing `userId` FK migration; `sequelize.sync({alter:true})` restart fragility —
`sandbox-eval/COMPARISON.md` §2) are *literally* dependency/schema-graph-shaped. A triage step that
can see "this endpoint depends on a FK that the migrations never create" is reasoning with exactly the
edges a graph provides.

---

## 5. Phase 0 — the graph-quality gate (EXECUTED 2026-06-30)

**What was run.** Installed `graphifyy` 0.9.2 in the sandbox (Python 3.10; tree-sitter + networkx,
no native build, no API key). Ran the deterministic, no-LLM extractor
(`graphify update backend --no-cluster`) on the real `cypress-realworld-app/backend` (19 TS files).
Result: **171 nodes, 487 edges, every edge `EXTRACTED`.** Edge relations: `imports` 140,
`contains` 152, `imports_from` 103, `calls` 92. Probed the canonical payment/balance requirement by
hand against `graph.json`.

**Finding 1 — deterministic side-effect chains ARE present (the win).** The graph links each route
module to the specific DB functions it uses, and those functions' intra-file call closure exposes the
state mutation:

```
transaction_routes         --imports--> database_createtransaction        [EXTRACTED]
database_createtransaction --calls----> database_debitpayappbalance        [EXTRACTED]
database_createtransaction --calls----> database_creditpayappbalance       [EXTRACTED]
                           --calls----> savetransaction, updatetransactionbyid, createpaymentnotification
```

A 1–2 hop traversal (route → imported db-function → intra-file calls) recovers "the transaction route
debits the sender and credits the receiver" — exactly the balance coupling a correct multi-step test
needs, and exactly what `extract-api-hints.js` is blind to. This is `EXTRACTED`, free, reproducible.

**Finding 2 — limits the gate exposed (the honest scope).**

- **Endpoints are not nodes.** Each `-routes.ts` collapses to ~2 nodes (module + router);
  `POST /transactions` and `GET /transactions` are indistinguishable in the graph. Your *existing*
  regex extractor already resolves per-endpoint method+path — so the two are **complementary**: graph
  = dependencies, regex = endpoints. The translator must **join graph side-effects onto the regex
  extractor's per-endpoint rows**, ideally narrowed by which imported symbol each handler block
  references (the regex extractor already locates each route block).
- **Field-level capture→consume is absent from the deterministic graph.** It only appears under an
  LLM inference pass — graphify `--mode deep`, or an equivalent pass on the sandbox's own OpenRouter
  `LlmClient` — which is why the deterministic run here did not produce it. (graphify's `openai`
  backend honors `OPENAI_BASE_URL`, so `--mode deep` runs through OpenRouter directly; verified in
  `llm.py`. No new provider needed either way.)

**Finding 3 — deep-mode capability, probed by equivalent inference.** Because deep mode is just "an
LLM reads the source and emits inferred edges," that inference was run directly on the payment-flow
source (`validators.ts` + `transaction-routes.ts` + `database.ts createTransaction`). It cleanly and
correctly recovers the field-level edges: `transaction.id` (POST response) → `:transactionId` (GET/
PATCH param); request `amount` →`amount * 100` (the "×100 cents" assertion); `status: pending→complete`
on payment; `receiverId` as an FK to an existing user. **So Layer 2 is achievable — but it is cached
LLM inference, not a structural graph fact.** Its only advantages over the current baseline (where the
Generate model infers these inline from acceptance criteria) are amortization, auditability, and
keeping Generate's per-call context lean. The A/B must isolate whether *pre-computing* these beats
*the model inferring them itself* (§6, Layer-2 arm).

**Gate verdict: conditional PASS.** Proceed — but stage it (Layer 1 deterministic first; Layer 2
inferred only if Layer 1 shows signal). Trust policy unchanged: feed Generate only `EXTRACTED` +
high-confidence `INFERRED` edges; treat `AMBIGUOUS` as a separate arm; noisy edges can *hurt*
precision and the experiment must be able to detect that.

### 5.1 Build result — graph-L1 implemented and measured (2026-06-30)

Layer 1 is now built and verified: `adapters/cypress-rwa/graph-api-hints.js` (deterministic,
adapter-local), a default-off flag `AQE_API_HINTS_MODE=graph-l1` in `workflow-adapter.js`, 7 hermetic
tests, and the full suite (139) + `check:boundaries` staying green. Measured behaviour on the real
backend:

- **Precision over recall (deliberate).** A side-effect note is emitted *only* where the call-graph
  **proves** a persisted write — the handler's call-closure reaches a `save*` sink. It never asserts
  "read-only", because a single wrong "read-only" on a write endpoint would suppress a needed
  assertion and *raise* FP. Every emitted note is therefore trustworthy.
- **Reach is narrow but high-value: 5 endpoints / 8 requirements.** The covered set is the rich,
  named-function flows — including **both balance endpoints** (`POST` and `PATCH /transactions`),
  each carrying explicit "capture the balances before/after and assert the deltas" guidance, which is
  the hardest multi-step case in the suite to get right.
- **Documented blind spot.** The deterministic call-graph misses writes performed through inline
  lowdb chains (`db.get(...).assign(...).write()`) and lodash `flow(...)`. Confirmed:
  `updateUserById`'s closure in the graph is reads-only; `removeBankAccountById`'s is empty. So simple
  CRUD writes (update-user, delete-contact, delete-bank-account) get no note at Layer 1.
- **Implication for the A/B and for Layer 2.** graph-L1 will move the metrics **only if** the
  baseline's false positives concentrate on the rich write-flows it covers (especially the balance
  deltas). If the FPs are instead spread across simple CRUD, Layer 1 won't help — and that CRUD gap
  becomes the concrete, *measured* justification for Layer 2 (LLM-inferred edges, which read the
  handler body and would catch inline writes the call-graph can't). The A/B tells us which world we
  are in; either outcome is decisive.

---

## 6. Experiment design (the A/B)

**Independent variable (the only thing that changes):** the source of `apiHints`, run as **three
staged conditions**, each adding to the prior — everything downstream byte-identical:

- **`baseline`** — today's regex extractor.
- **`graph-L1`** — baseline + deterministic route→DB side-effect notes (traversal of the `EXTRACTED`
  graph, joined onto the regex extractor's per-endpoint rows). No API key, fully reproducible.
- **`graph-L1+L2`** — `graph-L1` + LLM-inferred field-level capture→consume notes, produced by an
  inference pass on your **existing OpenRouter `LlmClient`** (or graphify `--mode deep` pointed at
  OpenRouter). **Run only if `graph-L1` beats `baseline`.**

Staging this way means the cheap, reliable condition is tested first; Layer 2's inference cost and
key dependency are only incurred if Layer 1 proves the mechanism has signal at all.

**Held constant:** the requirement set, the model + temperature (Sonnet-class, temp 0 via
OpenRouter, per `PROGRESS.md`), the harness, the flake-guard N (default 3, seed/reset between runs),
the prompts other than the injected hint fields, and the scoring code.

**Arms (run each on both apiHints sources):**

1. **Curated 4-of-44 slice** — sanity arm. Baseline here is FP 0%, catch 9/10. Purpose: confirm the
   graph does no *harm* on the clean slice (regression guard), not to show improvement.
2. **Uncurated, all 44** — the real test. Baseline: 38/44 covered, FP 18.2%, 28.8% quarantined.
   This is where the hypothesis lives or dies.

**Metrics — emitted by your harness today (one caveat, noted inline):**

- Catch rate on the seeded-defect catalog (the 12-defect set, 2 negative controls).
- **False-positive rate** (primary outcome).
- **Coverage** = requirements with ≥1 valid test (primary outcome).
- % quarantined (flaky/unresolved).
- Orphan-test count (should stay 0; boundary/quality guard).
- **Generate-phase tokens per run** — already bucketed by phase in the scorecard
  (`llm-client.js:99` records by `phase`; `cost.js buildCostReport` writes the per-phase block).
  Report **mean per requirement = generate-phase run total ÷ requirement count**, across runs for
  spread. (Per-*requirement* attribution is **not** currently emitted; it is diagnostic-only and not
  needed for the §7 decision. If wanted, snapshot `llm.getUsage()` before/after each requirement's
  generate call in the orchestrator and diff — no change to the `complete()` contract.)
- **One-time graph-build token cost**, reported *separately* (see §8 honesty note).

**Determinism control.** OpenRouter is not bit-deterministic at temp 0 (`PROGRESS.md` open risk).
Run each arm **≥3 times** and report distributions, not single numbers. An "improvement" smaller than
the baseline's own run-to-run spread is **not** a result. The curated slice's known stability across
gate runs is the reference for what "within noise" means here.

**Bet #2 (Triage) instrumentation, run only if #1 passes its gate:** for each failing test in the
uncurated run, additionally pass Triage the dependency subgraph around the failing endpoint. Measure
triage accuracy against your existing 12/12 labelled battery — does it hold or improve, and at what
added token cost per triage call? Bet #2 is a *secondary* readout; it does not gate the #1 decision.

**What "graph-enriched apiHints" concretely means.** Same `{method, path, auth, notes}` shape the
Generate prompt already consumes (`generate.user.md:10-13`) — so *zero* prompt-schema change — with
the `notes` field extended. The **translator is a graph-walk, not an edge-copy**: for each endpoint
(from the regex extractor), find the handler's imported DB symbols, take their intra-file call
closure, and summarize the side-effects. Example by layer:

- **L1 (deterministic):** _"Writes `transactions`; debits sender + credits receiver pay-app balance
  via `debit/creditPayAppBalance`. To assert the balance delta, read `balance` from `GET /users/:id`
  before and after."_
- **L2 (inferred):** adds _"`POST` returns `transaction.id`; capture it to drive
  `GET /transactions/{{id}}`. Request `amount` is stored ×100 (cents). `status` is `pending` until a
  payment completes."_

The existing `capture`/`{{localName}}` machinery expresses all of it; only the `notes` content changes.

---

## 7. Go / No-Go criteria

**Go (build the implementation spec)** if, on the uncurated 44, the `graph` arm achieves *either*:

- FP rate **<10%** (from ~18%), **or**
- Coverage **≥42/44** (from 38/44),

…*and* generate-time tokens per requirement are **≤ baseline + 5%**, *and* orphan count stays 0,
*and* the curated slice shows **no regression** (FP stays 0%, catch ≥9/10), *and* the improvement
exceeds the measured run-to-run spread.

**No-go** if improvement is within noise, or requires `AMBIGUOUS` edges that also raise FP, or only
materializes at a token cost that erases the quality gain.

**Null result is still informative:** if Phase 0 passes (edges exist) but the A/B is flat, the
finding is "the Generate model already infers these dependencies from acceptance-criteria prose well
enough" — which itself redirects effort toward bet #2/#3 rather than #1.

---

## 8. Threats to validity (and how each is handled)

- **Token-accounting boundary.** Building the graph consumes LLM tokens. For a stable app under test
  the graph is built **once** and reused across all 44 requirements and every rerun, so the honest
  per-requirement figure is amortized — but it must be reported *alongside* the one-time build cost,
  never folded into it silently. State the amortization window explicitly or the comparison is
  gameable.
- **Noisy edges can hurt.** `INFERRED`/`AMBIGUOUS` edges may inject wrong dependencies and *raise*
  FP. Mitigation: tag-filtered arms (§5); the experiment is designed to detect harm, not just benefit.
- **OpenRouter non-determinism.** Handled by ≥3 runs/arm and distribution reporting (§6).
- **Boundary violation risk.** All graph-building and graph→hints code stays in the adapter;
  `npm run check:boundaries` must stay green. Any forced change to `core/`/`workflow/` is a
  design-failure signal, per the standing guardrail.
- **Graph staleness.** The app under test is fixed during the experiment, so staleness is moot here;
  for production use, graphify's `--watch` (instant AST rebuild on code save) and post-commit hook
  keep it current — but that's an adoption concern, not an experiment concern.
- **Single-target generalization.** A positive Cypress result does not prove Conduit will benefit;
  it de-risks the investigation (§10), nothing more.

---

## 9. Feasibility & cost

**Confirmed in Phase 0:** the graphify **CLI is standalone** (no Claude Code needed), installs from
PyPI in seconds with no native build, and the Layer-1 code graph is built with **no API key**
(`graphify update --no-cluster`). Layer 2 (the inferred edges) **reuses your existing, working OpenRouter integration — no new provider
or key.** Two ways: (i, preferred) implement the inference pass on the sandbox's own `LlmClient`,
feeding it only the source slice the Layer-1 graph points to — one provider, one cost ledger, stays
inside the adapter; or (ii) run graphify's own `--mode deep` through its OpenAI-compatible backend by
setting `OPENAI_BASE_URL=https://openrouter.ai/api/v1` with your OpenRouter key and an OpenRouter
model id (verified against graphify's `llm.py` backend table: the `openai` backend honors
`OPENAI_BASE_URL` and builds a standard OpenAI client). Build-once-amortize plus `--watch`/git-hook
rebuilds keep ongoing cost negligible. The experiment reuses your run harness; the marginal
engineering is adapter-local: (a) a graph-build step, (b) the traversal translator (graph side-effects
→ per-endpoint `apiHints.notes`, §6), (c) a config flag to switch the three conditions, (d) for L2,
the inference pass on your existing `LlmClient`.

---

## 10. Conduit applicability (why this generalizes if it works)

Conduit's inputs are richer and *multimodal*: OpenAPI 3.1, Hurl API assertions, a Playwright E2E
suite, and a `SELECTORS.md` contract (`COMPARISON.md` §1). A knowledge graph is most valuable exactly
when it can connect edges *across artifacts of different kinds* — spec ↔ code ↔ selector ↔ test — which
is graphify's stated multimodal strength and precisely the case the regex extractor handles worst.
So the theoretical upside is *larger* on Conduit than on Cypress RWA. But Conduit has no clean
baseline yet and two known defects in the reference impl, so it is the wrong place to *first*
falsify the hypothesis. Sequence: prove (or kill) the mechanism cheaply on Cypress RWA where you have
trusted baselines; **only if** it pays off, port the adapter-local graph step to Conduit, where the
payoff should be bigger.

---

## 11. Next step

Phase 0 is done and passed conditionally (§5). The decision in front of you is whether to build the
**`graph-L1` arm** — the cheapest possible test: the deterministic traversal translator + the config
flag, run through your existing harness against the `baseline` and the uncurated 44. That is a small,
adapter-local, key-free build, and it either shows signal (then we add the `graph-L1+L2` arm and, on
a §7 pass, I write the full Claude Code implementation spec) or it doesn't (then we stop, having spent
very little — exactly the point of staging). The honest open question Layer 1 answers: does
*externalizing dependency knowledge into hints* beat *the Generate model inferring it inline* — and
nothing smaller than that build will tell us.

---

## 12. Results & decision — A/B executed (2026-06-30)

The `graph-L1` arm was run. Because graph-L1 augments only **8 of 44** requirements (§5.1), the A/B
was run as a **differential** on exactly those 8 (3 reps per arm; baseline extracted from the three
full uncurated sweeps, graph-L1 run focused on the 8). All against the live app, Sonnet-class, temp 0.
"False positive" = a test triaged as a `defect` against the known-clean app (FP rate = defects ÷
generated). The curated 4-requirement regression slice was also run under the flag.

**Aggregate on the 8 augmented requirements (3 runs each):**

| arm | generated | FP rate | coverage |
|---|---|---|---|
| baseline | 108 | **0.315** | 8/8 every run |
| graph-L1 | 116 | **0.328** | **7/8** every run |

graph-L1 **did not reduce false positives** (0.315 → 0.328 — within noise, marginally worse) and
**lost one requirement's coverage** (8 → 7). Against §7's bar (FP **<10%** *or* coverage up, at
≤ token parity), this is a **NO-GO for graph-L1 as built.**

**Per-requirement (pass / defect / quarantine, summed over 3 runs):**

| requirement | baseline | graph-L1 | read |
|---|---|---|---|
| TRANSACTIONS-008 — POST, balance | 12 / 0 / 5 | 16 / 0 / **0** | **helped** — eliminated all flakiness |
| TRANSACTIONS-010 — PATCH, balance | 3 / 3 / 3 | **0** / 0 / 6 | **hurt** — lost coverage, all flaky |
| USERS-009 — POST | 6 / 10 / 0 | 4 / **17** / 0 | **hurt** — more FPs |
| USERS-008 — POST | 7 / 18 / 0 | 6 / 18 / 0 | unchanged — the FP hotspot |
| 009 / COMMENTS-002 / LIKES-002 | — | — | ~neutral |

**What actually happened.** The balance-delta guidance *solidified the clean single-step write*
(TRANSACTIONS-008: 5 quarantines → 0, more solid passes). But on the multi-step **PATCH** variant it
pushed Generate toward more ambitious before/after assertions that came out **flaky** (quarantined)
rather than correct — converting a covered requirement into all-quarantine (TRANSACTIONS-010, the lost
coverage). And the dominant FP source — `USERS-008`, 18 defects in *both* arms — is **not** a
side-effect problem, so the note cannot touch it.

**Decision.**

1. **graph-L1 (deterministic side-effects): NO-GO as built.** It does not move the metric that
   matters (FP), and slightly lowers coverage, on the very requirements it targets. The curated slice
   showed no regression (4/4 covered, FP 0), so the mechanism is safe — just not beneficial.
2. **Layer 2 (LLM-inferred capture→consume): downgrade from "secondary bet" to "low priority."**
   The A/B's clearest evidence is that the FP hotspot (`USERS`) is about wrong assertions on fields
   the model already sees, not missing dependency knowledge — so more/better dependency edges are
   unlikely to be the lever. Spending the inference cost is hard to justify on this evidence.
3. **The one transferable win:** "capture balances before/after and assert the deltas" guidance
   genuinely de-flaked the clean single-step balance write. That is a *prompt/acceptance-criteria*
   improvement, reproducible **without** a graph — worth lifting into the requirement notes directly.
4. **Where to look instead.** The real defect driver is bad assertions on simple writes (esp. user
   creation). That points back to bet #2 (graph-assisted **triage** — could it down-classify these
   FPs?) and to plain prompt/validator-grounding work, not to richer generate-time dependency hints.

**Honest limits of this result.** Small sample: 8 requirements; graph-L1 runs 1 and 2 were identical
(temp-0 determinism), so it is effectively ~2 distinct graph-L1 samples vs 3 genuinely-varying
baseline samples, and the per-requirement swings are on small counts. Treat this as a **strong
directional signal, not a significance test.** It is enough to stop investing in graph-L1/L2 for test
*generation*, while keeping the balance-delta phrasing and the triage idea (#2) open.
