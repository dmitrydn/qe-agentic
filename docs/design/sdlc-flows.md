# SDLC flows — requirement sync (delta + prune) & release gate

_Design sketch. Not yet built. Forward-looking companion to the Stage‑6 loop._

## 1. Where this lives (folder decision)

The sandbox already separates concerns by folder, and the import‑boundary rule
(`tools/check-boundaries.js`, scans **only** `core/**` and `workflow/**`) decides
what is allowed where:

| Folder | Responsibility | Names the adapter? | Boundary‑scanned? |
|---|---|---|---|
| `workflow/` | **Make** the suite (generate → run → triage → report) | no | yes |
| `eval/` | **Grade** the suite (seeded‑defect catch‑rate, triage battery) | yes (in `main()`) | no |
| `run-workflow.js` (root) | wire the concrete adapter into `workflow/` | yes | no |

The two new flows are a third category — **operate** the suite in an SDLC — so
they get a sibling folder to `eval/`:

```
agentic-qe-sandbox/
├── workflow/      ← make the suite        (app-agnostic logic; gate-tested)
├── eval/          ← grade the suite
└── ops/           ← NEW: operate the suite in the SDLC
    ├── sync-requirements.js     ← requirement-change → regenerate delta + prune
    └── validate-release.js      ← release gate → replay suite vs a new build
```

Rule of thumb that keeps the boundary green:

- **Reusable, app‑agnostic logic** (diffing, prune set, replay‑and‑classify)
  goes under `workflow/` so it is unit‑tested by the gate and can never import an
  adapter. New modules: `workflow/steps/diff-requirements.js`,
  `workflow/steps/prune.js`.
- **The thin entry point** that boots a concrete app/adapter goes in `ops/`
  (exactly like `eval/run-eval.js` and `run-workflow.js` do today).

Mental model: **workflow = make · eval = grade · ops = operate.**

> Alternative name if you prefer it more descriptive: `lifecycle/`. `ops/` is
> shorter and conventional; pick one and stay consistent.

---

## 2. Flow A — requirement change → regenerate only the delta + prune

### The gap it closes
Today generation is per‑requirement and id‑traceable, but there is **no change
detection, no pruning, and no history**: you decide which ids to regenerate, and
removed/changed requirements leave stale test files behind (orphans are *flagged*
in the report, never deleted). This flow makes requirement churn a one‑command,
cost‑proportional operation.

### The missing piece: a suite manifest
A small state file records, per requirement, a content hash and the test ids that
were generated from it. That is all delta detection and precise pruning need.

```jsonc
// state/suite-manifest.json
{
  "version": 1,
  "model": "anthropic/claude-sonnet-4.5",
  "requirements": {
    "CYPRESS-RWA-USERS-001": {
      "hash": "9f2c…",                       // sha256 of normalized req
      "testIds": ["…-TC-001", "…-TC-002"]   // exactly what to prune on change
    }
  }
}
```

> **Gotcha (real, from the code):** the manifest must **not** live in
> `generated-tests/` as a `*.json` file. `eval/run-eval.js` and the orchestrator
> load that directory with `readdirSync(...).filter(f => f.endsWith('.json'))`
> and `JSON.parse` each as a `TestCase`. A manifest there would be parsed as a
> (broken) test. Keep it in a separate `state/` dir.

### Algorithm (`ops/sync-requirements.js`)
```
load manifest (empty if first run)
reqs        = select({ adapter })                  // current requirements
for each req: hash = sha256(normalize(req))        // title + AC + apiHints

added    = ids in reqs but not in manifest
changed  = ids in both where hash differs
removed  = ids in manifest but not in reqs
unchanged= the rest                                // skipped → ZERO LLM cost

planPrune = files for (changed ∪ removed).testIds  // precise, from manifest
                + any generated-tests/*.json whose requirementId ∉ reqs (safety sweep)

if --dry-run: print {added, changed, removed, planPrune} and STOP   // free, no LLM, no deletes

delete planPrune
for id in (added ∪ changed):
    testCases = generate({ requirement, llm })     // reuse workflow/steps/generate.js
    persist testCases → generated-tests/
    manifest[id] = { hash, testIds: testCases.map(t => t.id) }
for id in removed: delete manifest[id]
save manifest
```

### What it reuses vs. what is new
- **Reuses unchanged:** `workflow/steps/select.js`, `workflow/steps/generate.js`,
  the persistence in `orchestrator.js`, `workflow/llm/*`, and the cost accumulator
  (so the run reports exactly what the delta cost).
- **New, app‑agnostic, in `workflow/`:** `diff-requirements.js` (hash + 3‑way
  diff) and `prune.js` (compute + apply the delete set).
- **New entry point, in `ops/`:** `sync-requirements.js` (wires the cypress‑rwa
  adapter, parses `--dry-run`/`--all`, calls the above).

### How to verify it (before trusting it)
- **Unit tests (run free in the gate, `node --test`):** `diff-requirements` is a
  pure function — given an old manifest + new reqs, assert the added/changed/
  removed sets. `prune` is pure — given manifest + file list, assert the delete
  set (including the orphan safety sweep). Both stay boundary‑clean.
- **`--dry-run`:** change one line in `requirements/unified-requirements.md`, run
  `node ops/sync-requirements.js --dry-run`; confirm only that id appears under
  `changed`, only its `testIds` under `planPrune`, and **no** LLM call or delete
  happened.
- **Cost proof:** after a real run, the scorecard `cost` block should show calls
  ≈ number of added+changed requirements — proportional to the delta, not the
  whole set.

---

## 3. Flow B — release gate (shares `ops/`)

Sketched earlier; lives beside Flow A because it is the other "operate" verb and
reuses the same harness.

### Algorithm (`ops/validate-release.js`)
```
adapter.run().ready()                       // boot the NEW build
suite = load generated-tests/*.json         // the existing, persisted suite
for tc in suite:
    { decision, runs } = runHarness({ tc, adapter, n })   // ×N + reset each
    if decision == FAIL:
        verdict = triage({ tc, runs, requirement, llm })  // real / flaky / env
        if verdict.class == real_defect: record REGRESSION
write release report (reuse report.js renderer or a thin release renderer)
```

- **No generation.** Cost is near‑zero: deterministic replay, with a triage call
  only on a failing test. The cost accumulator confirms it.
- **Reuses:** `run-harness.js`, `triage.js`, `report.js`, `workflow/llm/*`.
- **New, app‑agnostic in `workflow/`:** a small `release.js` orchestration (replay
  + classify), so `ops/validate-release.js` stays a thin adapter‑wiring shim.
- **Verify:** point it at the clean build → expect **0** regressions; apply one
  `eval/defects.js` defect to stand in for "a bad release" → expect exactly that
  regression reported. (This reuses the seeded‑defect machinery as a test of the
  gate itself.)

---

## 4. How the two fit together (the SDLC picture)

```
requirement changes ─► ops/sync-requirements.js ─► suite updated (delta only, pruned)
                                                         │
new app build ─────────► ops/validate-release.js ◄───────┘  replays the up-to-date
                                                            suite → regression report
```

`sync-requirements` keeps the suite faithful to the requirements (pay only for
what changed); `validate-release` keeps each build faithful to the suite (pay
almost nothing). Both are thin shims over logic that already exists in
`workflow/` — no redesign, just the two entry points and two small pure modules.
