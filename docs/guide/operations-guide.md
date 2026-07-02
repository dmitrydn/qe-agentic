# Operations guide

Running, maintaining, and reasoning about the framework in practice — what each
flow requires, what it costs, and how the pieces fit. For commands see the
[User guide](user-guide.md); for every variable see the
[Configuration reference](configuration.md).

## Mental model

Three responsibilities, kept separate:

- **`workflow/` — make the suite.** App‑agnostic core (select → generate → run → triage → report). The import‑boundary rule (`npm run check:boundaries`) fails CI if anything here imports an adapter or names an app/framework.
- **`eval/` — grade the suite.** Seeded‑defect catch rate, triage battery, testability battery.
- **`ops/` — operate the suite in an SDLC.** Requirement sync (delta + prune), release gate, testability Phase A.

Within the loop: the **agent** (LLM) does judgement — generate, triage, assess —
and the **engine** (deterministic code) does everything that must be reliable:
select, run, score, report, and every gating *decision*. Guarantees live in
software, not in prompts.

## What each flow requires

| Flow | Command | Docker | LLM cost | Writes |
|---|---|---|---|---|
| Unit + boundary | `npm test` | no | none | — |
| Generate suite | `run-workflow.js` | yes | ~$1–3 (`--all`) | `generated-tests/`, `reports/` |
| Requirement sync — plan | `sync-requirements.js --dry-run` / `--init-manifest` | no | none | `state/suite-manifest.json` (init only) |
| Requirement sync — apply | `sync-requirements.js --apply` | no | ∝ delta | `generated-tests/`, manifest |
| Testability assess (Phase A) | `assess-requirements.js --all` | no | ~$0.5 / 44 | `reports/testability/`, `clarifications/` |
| Release gate | `validate-release.js` | yes | ~$0 (triage on fail only) | `reports/release-report.md` |
| Seeded‑defect eval | `eval/run-eval.js` | yes | none (replay) | `reports/eval-report.md` |
| Triage battery | `eval/run-triage-battery.js` | yes | ~$0.1 | `reports/triage-battery.*` |
| Testability battery | `eval/run-testability-battery.js` | no | ~$0.16 | `reports/testability-battery.*` |
| Acceptance gate | `./verify.sh` | yes | ~$0.15 | `reports/` (in scratch dir) |

**Docker** is needed only to boot the app under test (generate, run, eval,
release, gate). **LLM credit** is needed only for generate/triage/assess.
Replay and unit tests are free.

## Cost control

- Only **generate, triage, and assess** spend; **replay is free** (validation reruns the persisted suite with no new LLM calls).
- Every LLM run prints `[cost] $… over N call(s)` and writes the figure into its report (scorecard `cost` block, testability `history.md`).
- Levers that reduce spend: the testability gate (skips generation for weak requirements), `sync --apply` (regenerates only the delta), `LLM_MAX_TOKENS` (keeps OpenRouter from over‑reserving credit), and replaying instead of regenerating.
- Pricing is via OpenRouter (a proxy that bills its own credit at roughly provider list price + a fee). The `LLM_*_USD_PER_MTOK` knobs are display‑only.

## The durable suite vs the gate's scratch

`generated-tests/` is your **durable regression suite**. The acceptance gate
(`verify.sh`) must not clobber it, so the gate runs in its own directory:

- The tests dir is configurable via `GENERATED_TESTS_DIR` (or `--tests-dir`), default `generated-tests`.
- `verify.sh` exports `GENERATED_TESTS_DIR=generated-tests-gate` and only ever `rm -rf`s that scratch dir.
- So you can build a full suite (`run-workflow --all` or `sync --apply`), run the gate as often as you like, and replay against new builds — the three no longer collide. `generated-tests-gate/` is git‑ignored.

## Requirement lifecycle (sync)

`state/suite-manifest.json` records a content hash and the test ids per
requirement. `sync-requirements` three‑way diffs the current requirements against
it:

- **added / changed** → regenerate · **missing** (hash matches but no tests on disk) → backfill · **removed / orphan** → prune · **gated** (returned for clarification, see below) → left alone, never silently regenerated · **unchanged** → skipped (free).
- `--dry-run` prints the plan and spends nothing; `--apply` executes it. The manifest is **committed alongside `generated-tests/`** so delta detection works across machines and in CI (a fresh checkout sees the real baseline, not "everything is new").

## Testability gate operations

- **Phase A (measure):** `assess-requirements.js` scores every requirement and writes a clarification file (findings + author questions) per non‑testable one. It does **not** block anything. The clarifications folder is rebuilt each run, so it reflects only the latest run.
- **Phase B (enforce):** with `TESTABILITY_GATE=on`, `run-workflow` assesses each requirement first and skips generation for non‑`testable` ones. A gated requirement is recorded in the scorecard and excluded from the sync `missing` backfill (so it isn't silently retried).
- **Calibration:** the verdict logic, the dimension roles (D1/D4 blocking, D2/D3/D5 clarify‑on‑fail), and the journey to the current defaults are documented in [Testability gate design](../design/testability-gate.md). Re‑run `assess --all` after changing any `TESTABILITY_*` knob; `history.md` records the setting per run so you can diff outcomes.

## Reports & artifacts

| Path | Produced by | Contents |
|---|---|---|
| `reports/scorecard.json` · `report.md` | run‑workflow | coverage, false‑positive rate, per‑test outcomes, `cost` block |
| `reports/defects/<id>.md` | run‑workflow | a real‑defect finding with repro steps |
| `reports/eval-report.md` | run‑eval | seeded‑defect catch rate |
| `reports/release-report.md` | validate‑release | regressions vs the current build |
| `reports/testability-report.md` + `testability/run-*.md` + `history.md` | assess | per‑requirement verdicts (D1–D6), one diffable row per run |
| `reports/clarifications/<id>.md` | assess / gate | dimension findings + questions for the author |
| `reports/testability-battery.*` · `triage-battery.*` | batteries | confusion matrix + accuracy |
| `reports-all/` | manual `--all` snapshot | committed breadth measurement |

## CI usage

- `./verify.sh` is the standing gate: import‑boundary check, unit tests, container smoke, curated clean run (false‑positive threshold), seeded‑defect eval (catch‑rate threshold), triage battery (accuracy threshold), and a read of the committed `reports-all/` snapshot. Exits non‑zero on the first failure.
- It runs in the scratch suite dir, so it's safe to run in CI without affecting a committed suite.
- `validate-release.js` is the release‑stage gate: exits non‑zero if any regression is found against a new build.

## Troubleshooting

- **`createLlmClient requires a non-empty OPENROUTER_API_KEY`** — you ran an entry point without loading `.env`. Run `set -a; source .env; set +a` first (only `verify.sh` sources it automatically).
- **`getaddrinfo … openrouter.ai` / fetch failed** — no network route to OpenRouter from this environment.
- **`no persisted suite in generated-tests/`** (validate‑release) — generate or `sync --apply` a suite first.
- **Everything reads as "new" in sync** — no manifest yet; run `--init-manifest` once.
- **The gate wiped my suite** — it shouldn't anymore; confirm `verify.sh` is exporting `GENERATED_TESTS_DIR=generated-tests-gate` (it is, by default).
- **Container won't boot / slow first build** — the Cypress RWA image is Electron‑heavy; the first `docker build` is several minutes, then cached.
