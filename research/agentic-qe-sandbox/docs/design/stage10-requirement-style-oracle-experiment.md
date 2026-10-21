# Stage 10 — Oracle Content-Richness → Test-Oracle Quality (Implementation Spec)

_Status: spec, not yet built. Written 2026-07-20. Supersedes the earlier
"requirement-style/format" framing — see §0._

## 0. What changed from the first draft, and why

The first draft tested "formal-contract notation (Hurl) vs tests-as-requirements."
That treatment **bundled two mechanisms** and could not attribute a result:

- **Notation / legibility** — an explicit `HTTP 200` + jsonpath block handed to
  the generator pre-digested vs intent it must infer from test code.
- **Oracle content richness** — the formal set also carried *more* explicit
  oracle (value assertions, dedicated negative/error cases).

A win under the bundled design would be uninterpretable, and the content half
is the one Stage 9 already has a prior on. So we **isolate a single mechanism:
oracle content richness, with notation held constant.** This is the lever
Stage 9 never tested and the one that is directly actionable for
requirement-authoring guidance.

## 1. Hypothesis (falsifiable)

**H1.** For the *same* endpoint expressed in the *same* notation, giving a
requirement a **richer oracle** (explicit expected status + jsonpath value/shape
assertions + explicit negative/error cases) vs a **sparse oracle** (bare
expected status only) produces higher-quality generated tests:

- **H1a.** lower false-positive rate (fewer spec-mismatch failures),
- **H1b.** equal-or-higher real-defect catch rate,
- **H1c.** lower grounding-gate rejection rate.

**Null (H0).** With oracle content depth as the only varied input, the composite
metric shows no difference beyond the run-to-run noise band.

A null is informative and will be reported as loudly as a positive: it would say
the oracle content a requirement carries does **not** causally move outcomes at
the scale we can detect — sharpening (or bounding) the Stage 9 "fidelity is the
lever" claim.

## 2. Design — one app, one notation, two oracle doses

Hold **everything except oracle content depth** constant:

| Held constant | How |
|---|---|
| App under test | Cypress RealWorld App (live) |
| Runtime / seed / reset / auth | Existing `adapters/cypress-rwa` live adapter |
| Requirement **notation** | Both doses authored in the **same** Hurl-block format |
| Generate → Run×N → Triage → Report | Unchanged app-agnostic `workflow/` core |
| Seeded-defect catalog | Existing 12-defect catalog (`fault-injector.js`) |
| Grounding gate | Unchanged |
| Field-level `apiHints` (curated **and** auto) | Stripped from both doses (see §5.2) |

Vary **only** the oracle dose:

- **RICH dose (treatment).** Authored from documented intent: explicit expected
  status **+** jsonpath value/shape assertions **+** explicit negative/error
  cases (missing auth, missing/invalid field, not-found, forbidden).
- **SPARSE dose (control).** **Mechanically derived** from the RICH set by
  deleting the value/shape assertions and the negative/error cases, leaving the
  same request + bare expected status. Deterministic strip → the request set is
  identical and the *only* difference is oracle content depth.

Because notation, app, runtime, loop, defect catalog, and hints are all held
constant, a difference is attributable to oracle content richness and nothing
else. There is no cross-app domain confound (both doses run the same banking
app), and no notation confound (both are Hurl).

## 3. Independent variable — pre-registered dose definition (frozen before any run)

**RICH requirement**, per endpoint case:
1. explicit expected **HTTP status**;
2. explicit **jsonpath** assertions on response shape and values;
3. explicit **negative/error cases** for that endpoint.

**SPARSE requirement** = RICH with (2) and (3) removed by the strip script;
retains request + (1) only.

**Authoring discipline (anti-bias — see also §7):**
- RICH oracles derived **from the Cypress RWA API's documented/intended
  behavior**, never from observed responses of the running app (Stage 9 rule:
  oracle = intent, never expected-from-code).
- RICH authored **blind to the metrics and to defect details** — see §5.3.
- SPARSE is not hand-authored at all; it is a deterministic projection of RICH,
  so it cannot be tuned. Parity of the request set is guaranteed by construction.
- RICH is **committed/frozen before** the runner's first execution. No edits
  after any result exists.
- **Frozen at commit `db961fd` on `main`** (parent `2fe15d9`), authored by a
  clean-room subagent before any runner, strip script, or defect-linked code
  existed. This is the auditable proof the oracles were not tuned to results.

## 4. The slice — LOCKED at 24 requirements

Slice size fixed at **24** (moderate-effect detection, d≈0.57; §6.1). Selection
criteria: (a) authorable in both doses on the live Cypress RWA API;
(b) weighted to cases where oracle content bites — input-validation, error
responses, auth gates, exact-count/array-shape assertions (the Stage 9 FP
drivers); (c) collectively cover **all 12** seeded defects so H1b is measurable;
(d) include a **negative control** whose oracle is unambiguous at either dose.

Every id below is a real entry in `requirements/unified-requirements.md`;
defect ids are real entries in `adapters/cypress-rwa/fault-injector.js`.

| # | Requirement id | Behavior | Defect(s) exercised |
|---|---|---|---|
| 1 | `CYPRESS-RWA-TRANSACTIONS-001` | GET transactions list (default) | `auth-gate-get-transactions` |
| 2 | `CYPRESS-RWA-TRANSACTIONS-002` | GET pending request transactions | — (array-shape) |
| 3 | `CYPRESS-RWA-TRANSACTIONS-003` | GET pending, time-range | — (query oracle) |
| 4 | `CYPRESS-RWA-TRANSACTIONS-004` | GET contacts transactions, page 1 | `transactions-pagination-off-by-one` |
| 5 | `CYPRESS-RWA-TRANSACTIONS-005` | GET contacts transactions, page 2 | `transactions-pagination-off-by-one` (exact-count) |
| 6 | `CYPRESS-RWA-TRANSACTIONS-006` | GET public transactions | — (array-shape) |
| 7 | `CYPRESS-RWA-TRANSACTIONS-007` | POST create payment | `payment-amount-cents`, `payment-amount-rounding-shaved-cent`, `receiver-balance-not-credited`, `auth-gate-post-transactions` |
| 8 | `CYPRESS-RWA-TRANSACTIONS-008` | POST create request | — (side-effect) |
| 9 | `CYPRESS-RWA-TRANSACTIONS-010` | errors on invalid field | — (validation negative) |
| 10 | `CYPRESS-RWA-BANK-ACCOUNTS-001` | GET bank-accounts list | `auth-gate-get-bankaccounts`, `bankaccounts-missing-userid-field`, `bankaccounts-routingnumber-hardcoded` |
| 11 | `CYPRESS-RWA-BANK-ACCOUNTS-002` | GET a bank account | — (field/shape) |
| 12 | `CYPRESS-RWA-BANK-ACCOUNTS-003` | POST create bank account | — (validation + side-effect) |
| 13 | `CYPRESS-RWA-BANK-ACCOUNTS-004` | DELETE a bank account | — (side-effect) |
| 14 | `CYPRESS-RWA-USERS-001` | GET users list | `auth-gate-get-users`, `users-results-not-array`, `users-self-not-excluded` |
| 15 | `CYPRESS-RWA-USERS-002` | GET a user | — (shape) |
| 16 | `CYPRESS-RWA-USERS-003` | errors on invalid userId | — (negative) |
| 17 | `CYPRESS-RWA-USERS-005` | GET users by email | — (query filter) |
| 18 | `CYPRESS-RWA-USERS-010` | errors on invalid field | — (validation negative) |
| 19 | `CYPRESS-RWA-USERS-011` | PUT update a user | — (side-effect) |
| 20 | `CYPRESS-RWA-CONTACTS-003` | errors on invalid contactUserId | — (negative) |
| 21 | `CYPRESS-RWA-NOTIFICATIONS-004` | errors on invalid field | — (negative) |
| 22 | `CYPRESS-RWA-COMMENTS-002` | POST create comment | — (side-effect) |
| 23 | `CYPRESS-RWA-LIKES-002` | POST create like | — (side-effect) |
| 24 | `CYPRESS-RWA-TEST-DATA-001` | GET remote mock data | — (**negative control**) |

**All 12 seeded defects covered** by requirements 1, 4/5, 7, 10, 14. Explicit
validation/error negatives: #9, 16, 18, 20, 21 (native "errors when…" behaviors)
plus the unauthenticated→401 negative cases the RICH dose adds to the four
auth-gated requirements (#1, #7, #10, #14).

**Honesty note on auth-gate catches (report transparently, do not let them
inflate the headline):** the four `auth-gate-*` defects are caught by the RICH
dose largely *because* RICH includes an unauthenticated→401 negative case that
SPARSE (positive-case + bare status) lacks by construction. That is the
hypothesis in action — richer oracle catches more — but it is a near-structural
win for 4 of 12 defects. Catch rate is therefore **decomposed by defect type**
(auth-gate vs value/shape vs validation) in the memo, so the value-oracle catches
(the harder, more interesting ones: rounding, balance-not-credited, results-not-
array, self-not-excluded, pagination) are visible separately from the auth-gate
freebies.

## 5. Code seams (additive; no `core/`/`workflow/` change expected)

### 5.1 Both doses as requirement sources
- RICH set authored (blind) at
  `experiments/stage10-oracle/rich/*.hurl` — tracked, not under gitignored
  `sandbox-eval/`. 24 files, parsed by the existing generic Hurl extractor.
- A deterministic `strip-oracle.js` derives
  `experiments/stage10-oracle/sparse/*.hurl` from RICH (drop `[Asserts]` jsonpath lines and the
  `errors_*` blocks; keep request + `HTTP <status>`). Unit-tested: sparse ⊆ rich
  on requests, sparse has zero jsonpath asserts and zero negative cases.
- **BUILT.** The generic Hurl extractor gained an optional `hurlDir` param
  (backward-compatible; original `{specRoot}` path still returns its 147 items).
  `dose-requirements.js` points it at each dose dir and **aggregates all blocks
  of a file into ONE core Requirement** — a RICH file's negative/value blocks
  become extra acceptance criteria, SPARSE carries only the headline. Measured
  contrast: rich 363 acceptance criteria total vs sparse 109 (e.g. TRANSACTIONS-007
  22 vs 6). 24 schema-valid requirements per dose, identical id sets, apiHints
  stripped. Loader unit-tested (`dose-requirements.test.js`).
- **BUILT.** `dose-adapter.js` (`makeDoseAdapter("rich"|"sparse")`) spreads the
  live `cypress-rwa` adapter (run/seed/reset/auth/testRunner/faultInjector/
  teardown unchanged) and swaps in only `requirementsSource` — the one seam the
  experiment varies. `run-dose.js` is a thin single-dose entry (defaults
  `AQE_STRIP_APIHINTS=1`). Full suite 285/285, boundary green.

### 5.2 Strip all apiHints (both doses) — BUILT
Flag `AQE_STRIP_APIHINTS=1`. Turned out to need **two** parts, not one (an
end-to-end check caught the second):

1. **Policy:** hint selection was factored into a pure module
   `adapters/cypress-rwa/api-hints-policy.js` (`resolveApiHints`, `stripAllFromEnv`);
   `apiHintsFor` now delegates to it. Under the flag it returns `undefined` for
   **both curated and auto** hints. Stripping only the curated map would leak
   auto hints as a third oracle source.
2. **Core-backfill drop:** when `apiHintsFor` returns nothing, core's
   `toRequirement` backfills a bare method+path hint via `inferApiHints`. So
   `loadRequirements` additionally drops the whole `apiHints` field under the
   flag (adapter-local, **no core change** — boundary check stays green),
   covering both the normal and `AQE_GROUNDING` return paths.

Verified end-to-end against the real adapter: flag OFF → 41/44 requirements
carry hints (baseline unchanged); flag ON → 0/44, field absent entirely. Pure
policy unit-tested in `api-hints-policy.test.js` (8 cases: curated+auto+graph
zeroed under the flag, hints preserved without it, env mapping). Full suite
279/279.

### 5.3 Blind-authoring boundary (enforces §3)
The RICH-authoring pass may read: the endpoint inventory, the RealWorld/Cypress
RWA API's *intended* behavior, and which endpoints are in-slice (needed so the
slice covers defect targets). It may **not** read `fault-injector.js`'s defect
*details* (the specific mutation each defect injects) — otherwise an oracle could
be aimed at exactly the seeded bug, inflating catch. Enforced procedurally: RICH
is authored and committed before the runner (which imports the catalog) is wired
up, and never edited afterward. The commit hash of RICH is recorded in the memo.

### 5.4 Experiment runner + report — BUILT
- `analyze.js` (pure, unit-tested incl. a known-answer Wilcoxon): per-dose
  aggregation, control-derived noise band, paired per-requirement Wilcoxon
  signed-rank, catch decomposition (auth-gate vs value/shape), and the
  pre-registered GO/NULL/NEGATIVE decision vs band.
- `analyze-io.js` (unit-tested against the real `scorecard.json`): normalize a
  finished run, render the memo, and build the **arm-blinded** adjudication
  worksheet + sealed key.
- `run-experiment.js` (LIVE — boots Docker + LLM): for each dose (sparse first,
  so its run-to-run spread defines the band) runs generate→run→triage→score
  **N=5** times into isolated per-run report dirs, then `eval/run-eval.js` for
  catch. Emits `runs.json`, `analysis.json`, `decision-memo.md`, `worksheet.md`,
  `worksheet-key.json`. `--analyze-only` re-runs the pure analysis over an
  existing tree without re-spending.
- **Adjudication is deferred by design** (chosen): the paid run stays
  deterministic and emits the blind worksheet; true-FP is adjudicated afterward
  (you or a blind subagent), re-checkably — the Stage 9 method. FP/grounding in
  the memo are therefore PRE-adjudication until the worksheet is filled.
- **Live-validation pending:** the loop and the `reports/defects/` failure-detail
  parsing (`readFailures`) are only exercised by a real run; the first live run
  may need a small tweak to that parser once the on-disk format is seen.

## 6. Metrics, power, and the noise band

Composite, reported **per dose** as **mean over N runs ± noise band**, analysed
**paired per requirement** (each requirement contributes a sparse↔rich pair):

1. **False-positive rate** (H1a) — adjudicated spec-mismatch ÷ total tests. Primary.
2. **Grounding-gate rejection rate** (H1c) — deterministic; least noisy, best-powered.
3. **Seeded-defect catch rate** (H1b) — over the 12 catalog defects (near-census; report exactly).
4. Guardrails: orphan count (must be 0), quarantine rate, coverage.

**Noise band:** measured, not assumed. Run the **control (sparse) dose** its N
times; the band = observed run-to-run spread per metric (OpenRouter is not
bit-deterministic at temp 0). Any sparse↔rich delta **inside** the band = null
for that metric.

### 6.1 Power (why 15, why N is not the lever)
Independent unit = a requirement (paired). N runs shrink the *within-requirement*
LLM-variance (band ∝ 1/√N) but add **no** independent units. So slice size drives
detectable effect size; N drives band width. Paired design, power 0.8, α 0.05,
n ≈ 7.84/d²:

| Slice (pairs) | Smallest detectable effect |
|---|---|
| 12 | d ≈ 0.81 — large only |
| 15 | d ≈ 0.72 — large |
| 20 | d ≈ 0.63 |
| **24 (LOCKED)** | **d ≈ 0.57 — moderate-to-large** |
| 32 | d ≈ 0.50 — moderate |

**Pre-registered:** at the locked slice=24 we are powered for **moderate-to-large
effects** (d≈0.57); a null is interpreted as "no effect of at least that size,"
never "no effect at all." N=5 (→7 conditionally); past ~7, between-requirement
variance dominates and extra runs waste budget. Cost of a full pass ≈ ~1M tokens
(low tens of dollars); the binding constraint is statistical, not monetary, so
marginal budget goes to slice size, not run count.

Analysis test: Wilcoxon signed-rank on the paired per-requirement FP and
grounding-rejection deltas (proportions per requirement are lumpy; no
normality/p-value theater beyond this non-parametric paired test), plus the
descriptive band.

## 7. Threats to validity → mitigations

| Threat | Mitigation |
|---|---|
| **Authoring bias** — RICH authored to flatter H1 | Derive from intent not observed behavior; author **blind to metrics + defect details** (§5.3); freeze/commit RICH before first run; record commit hash |
| **Dose asymmetry** — doses secretly test different requests | SPARSE is a deterministic strip of RICH → identical request set by construction; unit-tested |
| **apiHints leakage** — real oracle is the hints, not the dose | Strip curated **and** auto hints, both doses (§5.2) + unit test |
| **Catch inflation** — oracle aimed at the seeded bug | Blind-authoring boundary excludes `fault-injector.js` details (§5.3) |
| **Over-specification backfire** — RICH becomes brittle exact-match asserts (a Stage 9 failure mode) | Adjudication separates brittle-oracle from real FP; a NEGATIVE result triggers this diagnosis (§8) |
| **Floor effect** — slice too easy | Slice weighted to validation/error/exact-count cases (§4) |
| **LLM variance as signal** | N paired runs + empirical band from the control dose |
| **Under-powered false null** | Pre-registered: powered for large effects only; state effect size we could miss |
| **Adjudicator bias** | Frozen Stage 9 rubric; raw responses logged for re-audit |
| **Domain / notation confound** | Eliminated by construction — one app, one notation |

## 8. Decision criteria (pre-registered)

- **GO / H1 supported:** RICH's FP **and** grounding-rejection rates are below
  SPARSE by more than the band, with catch **≥** SPARSE. → Richer oracle content
  causally improves outcomes; fold "invest in explicit status + value assertions
  + negative cases" into requirement-authoring guidance, with the measured ROI.
- **NULL / H0:** all composite deltas inside the band. → Oracle content depth is
  not a *large* lever at this scale; bounds the Stage 9 claim. Report like the
  Graphify kill.
- **NEGATIVE:** RICH worse (higher FP or lower catch beyond the band). →
  Diagnose over-specification: explicit value assertions likely became brittle
  exact-match oracles. Report as a caution against naive oracle enrichment — a
  genuinely useful finding.

## 9. Deliverables

1. `sandbox-eval/cypress-rwa-oracle/specs/api/hurl/rich/*.hurl` — frozen RICH set (commit hash recorded).
2. `strip-oracle.js` + derived `sparse/*.hurl` + its unit test.
3. Dose requirement-source wiring; `AQE_STRIP_APIHINTS` flag + unit test.
4. Experiment runner + adjudication pass (raw responses logged).
5. `stage10-oracle-content-richness-decision-memo.md` — paired metrics per dose,
   bands, Wilcoxon result, GO/NULL/NEGATIVE call, threats ledger with evidence.
6. `PROGRESS.md` Stage 10 row.

## 10. Verification of the experiment (trustworthiness checks)

- **Boundary + orphan guards** green across both doses.
- **Strip unit test** proves SPARSE ⊆ RICH on requests and carries zero
  asserts/negatives (dose is the only difference).
- **apiHints-stripped unit test** proves dose is the only oracle source.
- **Control-dose band measured**, not assumed; if it swamps a plausible effect,
  declare under-powered and raise N/slice **before** looking at sparse↔rich —
  decided by the band, not the wanted result.
- **Negative control** shows no dose difference (rig isn't manufacturing signal).
- **Blind commit hash** of RICH recorded before the runner exists (authoring
  couldn't have chased results).
- **Re-checkability**: every adjudication logs its raw response.

## 11. Non-goals

- No Conduit live runtime (deferred; would only add a domain confound).
- No notation/legibility test (deliberately held constant; that is a *separate*
  future experiment, not this one).
- No UI/E2E (stays API-level, matching the current oracle).
- No `core/`/`workflow/` change expected; any forced change is a reportable
  design-failure signal.
