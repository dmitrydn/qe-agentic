# Testability gate — design spec

_Implementation-ready. Build target: Claude Code. Moves slide 9's "not yet — by
design: testability input gate (T1·T2)" to built._

## 1. What and why (binding)

The Analyst–Designer's **first action**, per `Agentic_QE_Architecture_Proposal.docx`
(Layer 2): *score the input's testability and, below threshold, return questions
to the author instead of generating tests from inadequate input.* This makes
requirement quality a **gate, not a logged risk** (Principle 2) and enforces the
two load-bearing facts the rest of the system can't recover from:

- **T1** — intent must be written, not guessed. No expected result ⇒ no oracle ⇒ nothing worth generating.
- **T2** — output quality is capped by input quality (already shown empirically: 0% vs 18% false positives, curated vs uncurated hints).

**Guarantees-in-software split (Principle 1 / T5):** the LLM emits *per-dimension
judgement*; **deterministic code computes the score, the verdict, and the gating
decision.** Same hybrid contract as `generate`/`triage` today.

## 2. Where it lives (mirrors generate/triage exactly)

```
workflow/
  steps/
    assess.js              # NEW: LLM call -> dimension ratings (app-agnostic)
    testability.js         # NEW: PURE — pre-checks, score, verdict, decision
    testability.test.js    # NEW
    assess.test.js         # NEW (mocked llm)
  prompts/
    assess.system.md       # NEW
    assess.user.md         # NEW
  schemas/
    testability.schema.json# NEW (the LLM's output contract)
ops/
  assess-requirements.js   # NEW: Phase-A standalone scorer (names the adapter)
eval/
  testability-battery.js     # NEW: labelled good/poor cases
  run-testability-battery.js # NEW: confusion matrix + accuracy
```

Boundary rule holds: `workflow/**` stays adapter-free; `ops/` + `eval/` name the
concrete adapter (not scanned), exactly like `run-workflow.js` / `run-eval.js`.

## 3. The rubric (multi-dimensional)

The LLM rates each dimension `pass | partial | fail` with a one-line `finding`.
It does **not** output a number or a verdict — code derives those.

| # | Dimension | Checks | Maps to |
|---|---|---|---|
| D1 | Expected result / oracle | Each criterion states a checkable outcome (status, shape, value) | T1 — **blocking** |
| D2 | Criteria clarity | Criteria present, atomic, unambiguous (catches "24h from when?") | T1 |
| D3 | Actor & preconditions | Actor/auth context and setup state are specified | — |
| D4 | Interface grounding | A concrete endpoint/contract exists to act against (hint tier) | T2 — **blocking** |
| D5 | Internal consistency | No contradictions; no undefined entities/placeholders | — |
| D6 | Scope atomicity | One testable behaviour, not a vague epic | — |

"**Blocking**" dimensions (D1, D4): a `fail` forces `untestable` regardless of the
aggregate score — you cannot test without an oracle or an interface.

The LLM also returns:
- `clarifications: string[]` — specific questions to the author, one per gap (e.g. *"From which moment is the 24-hour expiry counted — email generation or delivery?"*).
- `assumptions: string[]` — explicit assumptions it would otherwise make (proposal appendix: "explicit assumptions log").

## 4. Output schema (`testability.schema.json`) — LLM fills these fields

```jsonc
{
  "requirementId": "CYPRESS-RWA-USERS-001",
  "dimensions": [
    { "id": "D1", "rating": "pass|partial|fail", "finding": "…" }
    // …D2–D6
  ],
  "clarifications": ["…"],
  "assumptions": ["…"]
}
```

Code then **adds** (never trusts the model for these):
```jsonc
{
  "score": 0.0-1.0,          // computed from ratings
  "verdict": "testable | needs_clarification | untestable",
  "blockedBy": ["D4"]        // blocking dims that failed, if any
}
```

## 5. Deterministic layer (`testability.js`, pure — T7)

```
preChecks(requirement) -> structural gaps with zero LLM cost:
  - acceptanceCriteria empty            -> hard gap (no input at all)
  - no "Then …" criterion               -> likely no oracle (flag D1)
  - apiHints absent                     -> low grounding (flag D4)
  If a HARD structural gap exists, short-circuit to `untestable`
  WITHOUT calling the LLM (saves spend, deterministic).

scoreOf(dimensions, weights) -> 0..1
  pass=1, partial=0.5, fail=0 ; weighted mean (weights configurable; default equal)

verdictOf(dimensions, score, threshold, blockingIds) ->
  if any blocking dim == fail            -> "untestable" (blockedBy = those)
  else if score < threshold              -> "needs_clarification"
  else                                   -> "testable"
```

All three are pure, unit-tested, boundary-clean. The **decision lives here**, not
in the prompt.

## 6. The `assess` step (`assess.js`) — mirrors `generate.js`

```
assess({ requirement, llm, config }):
  pre = preChecks(requirement)
  if pre.hardGap: return deterministic untestable assessment (no LLM call)
  raw = await llm.complete({ system, user, schema: testabilitySchema,
                             schemaName: "Testability", phase: "assess" })
  score   = scoreOf(raw.dimensions, config.testabilityWeights)
  verdict = verdictOf(raw.dimensions, score, config.testabilityThreshold, BLOCKING)
  return { requirementId, ...raw, score, verdict, blockedBy }
```

Prompt (`assess.system.md` / `assess.user.md`): app-agnostic; given the
requirement (title, user story, acceptance criteria, apiHints, available actors)
and the rubric, return only the schema JSON. Explicitly instruct: rate each
dimension, write findings, and for every `partial`/`fail` produce a concrete
clarifying question — never invent missing intent. (Same render/repair machinery
as generate/triage, so reuse `prompts/render.js` and the `llm-client` JSON repair.)

## 7. Phased integration

**Phase A — standalone scorer (measure only, no gating).** `node
ops/assess-requirements.js [--all | --requirement <id>]`. Scores the selected
requirements, writes:
- `reports/testability-report.md` — table of id · verdict · score · blockedBy · top gap, and a summary (`N testable / M needs-clarification / K untestable`).
- `reports/clarifications/<id>.md` — for every non-`testable` requirement, its questions + assumptions.
- prints the cost (reuses `buildCostReport`).

No generation, no enforcement. This is the calibration tool — run it on the real
44 to **set `TESTABILITY_THRESHOLD`** before turning the gate on. Mirrors the
`sync --dry-run` pattern.

**Phase B — hard gate in `orchestrator.js`.** Per requirement, before `generate`:
```
a = await assess({ requirement, llm, config })
if a.verdict !== "testable":
    write reports/clarifications/<id>.md
    records.push({ status: "needs_clarification", requirementId, assessment: a })
    continue                      # DO NOT generate
# else proceed to generate as today
```
`report.js` gains a `testability` block in the scorecard (counts per verdict) and
a "Requirements returned for clarification" section. A gated requirement is **not**
counted as a generated test, an orphan, or a coverage hit.

Config (in `config.js`, env-overridable, same style as `MAX_FALSE_POSITIVE_RATE`):
- `TESTABILITY_THRESHOLD` (default e.g. `0.7`, set after Phase-A calibration)
- `TESTABILITY_GATE` (`off` in Phase A, `on` in Phase B; default `off` so the gate is opt-in until calibrated)
- optional `TESTABILITY_WEIGHTS` per dimension (default equal)

## 8. Interaction with the sync flow (must agree)

A requirement gated as `needs_clarification`/`untestable` has **no tests by
design** — it must not be seen as `missing` and auto-regenerated by
`ops/sync-requirements.js`. Spec:
- Record gated requirement ids + their requirement-hash in the manifest under a `gated` map (`{ hash, verdict }`).
- `diff-requirements.js`: a requirement whose hash matches a `gated` entry is bucketed **`gated`**, not `missing`/`unchanged`. It only leaves the gated bucket when its **hash changes** (i.e., the author actually revised it) — then it's re-assessed.
- `prune.js`: gated requirements have no files, so they never appear in the prune set.

This keeps "in sync" meaning *has tests, or is intentionally gated pending author input* — never a silent retry of a known-bad requirement.

## 9. Validation — labelled battery (`eval/testability-battery.js`)

A small labelled set, ground-truth `expectedVerdict`, mixing real and synthesized:

| Kind | Example | Expected |
|---|---|---|
| good | a real curated-4 requirement (clear criteria + oracle + endpoint) | `testable` |
| ambiguous | "link expires after 24 hours" (from when?) | `needs_clarification` |
| no-oracle | criteria describe an action but no expected outcome | `untestable` (D1 blocking) |
| no-interface | a behaviour with no endpoint/contract/hint | `untestable` (D4 blocking) |
| epic | "the payments module works correctly" | `needs_clarification` |

`run-testability-battery.js` runs each through the real `assess` step + a real
LLM call, builds a **confusion matrix** (predicted verdict × expected) and an
accuracy, and writes `reports/testability-battery.{json,md}` — exactly like
`run-triage-battery.js`. Gate the feature on, say, **≥ 80% verdict accuracy**.

## 10. Verification plan (how to prove the build)

- **Unit tests (free, in `node --test` / the gate):** `preChecks`, `scoreOf`, `verdictOf` (incl. blocking-dimension override and threshold edges); `assess` with a mocked `llm` (asserts the deterministic fields are code-derived, and that a hard structural gap short-circuits with no LLM call); schema validation. All app-agnostic ⇒ boundary check stays green.
- **Battery accuracy (small live spend):** run the labelled battery; require the accuracy threshold; inspect the confusion matrix.
- **Phase-A calibration (cheap live):** run `assess-requirements.js --all` on the real 44; eyeball the verdict distribution; pick `TESTABILITY_THRESHOLD`.
- **Cost:** every path reports cost via the existing accumulator; pre-check short-circuits keep cost ≈ proportional to genuinely-ambiguous requirements.

## 11. Build order

1. `testability.schema.json` + `testability.js` (pure: preChecks, scoreOf, verdictOf) + `testability.test.js`.
2. `assess.system.md` / `assess.user.md` + `assess.js` + `assess.test.js` (mocked).
3. `ops/assess-requirements.js` (Phase A) + report/clarification writers.
4. `eval/testability-battery.js` + `run-testability-battery.js`; calibrate threshold.
5. Phase-B gate in `orchestrator.js` + scorecard `testability` block (behind `TESTABILITY_GATE`).
6. Sync interaction: `gated` bucket in `diff-requirements.js` + manifest.

## 12. Risks / open items

- **Threshold is empirical** — Phase A exists precisely to set it; don't ship the hard gate before calibration.
- **Over-gating frustrates authors** (proposal risk) — every rejection must ship with concrete `clarifications`, so the gate *teaches* rather than merely blocks.
- **Non-determinism** — leave headroom on the threshold (same reasoning as `MIN_CATCH_RATE`); the battery measures lenient/strict drift.
- **No real author in the sandbox** — "returns questions" = a clarification artifact; wiring those back to Jira/Confluence is a separate roadmap item (the proposal's adapters).
- **Calibration data** — the 44 are mostly decent; the synthesized weak cases in the battery are how we exercise the failure paths until real weak requirements arrive.

## 13. Calibration results (June 2026 — built & calibrated)

**Final defaults:** `TESTABILITY_THRESHOLD=0.7` · `TESTABILITY_CLARIFY_ON_FAIL=D2,D3,D5` · `TESTABILITY_STRICT_FAIL=off` · `TESTABILITY_RUNS=1` · `TESTABILITY_GATE=off` (opt-in per run).

- **Battery: 100% (16/16)** verdict accuracy over 16 labelled cases (5 testable / 3 needs-clarification / 8 untestable), ~$0.18/run.
- **Live Phase-A over the 44 Cypress RWA requirements: 20 testable / 17 needs-clarification / 7 untestable**, ~$0.51/run.

**What the verdict logic actually became (it evolved during calibration):**
- The verdict is **not** a pure score-vs-threshold. `verdictOf` = blocking fail (D1/D4) → `untestable`; else a `fail` on a **clarify-on-fail** dimension (`D2,D3,D5`) → `needs_clarification`; else `score < threshold` → `needs_clarification`; else `testable`. A non-blocking, non-clarify fail only lowers the score (no cliff).
- Earlier a blanket "any fail caps" rule (`strictFail`) made borderline verdicts flip run-to-run on temp-0 noise; it's now opt-in only.
- **D2 over-gated terse auto-extracted criteria** (it failed "redundant with the title"). Fixed by sharpening `assess.system.md` to judge D2 across the **whole** requirement (title + all criteria + apiHints) — terse/redundant is not a gap; fail only on genuine undeterminability ("24h from when?"). This moved Phase-A from 7 → 20 testable and dropped pure-D2 false-rejects from 17 → ~0.

**Operational aids added during calibration:** per-dimension `D1–D6` column in the report; timestamped run files + `reports/testability/history.md` (one diffable row per run, recording the settings); `assessStable` / `TESTABILITY_RUNS` for N-run majority on borderline cases.

**Finding worth carrying forward:** the remaining needs-clarification cluster on **negative/error-case specification** ("you described an error case but didn't say what makes it an error") and **contradictions** — a concrete requirement-quality backlog, and a live demonstration of T2.
