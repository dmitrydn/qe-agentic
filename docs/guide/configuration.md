# Configuration reference

Every environment variable and CLI flag the framework reads, with its default,
type, effect, and which flows use it. Defaults are the shipped values; you only
set a variable to change behaviour.

## How configuration is loaded

- All knobs are environment variables, read once per process by `workflow/config.js` (`loadConfig`).
- `./verify.sh` automatically sources `.env`. **The other entry points do not** — run them with the key in your environment:
  ```bash
  set -a; source .env; set +a        # then run any node entry point
  ```
- `.env` holds at minimum `OPENROUTER_API_KEY`; it is git-ignored and never committed.

---

## LLM & cost

| Variable | Default | Type | Effect | Used by |
|---|---|---|---|---|
| `OPENROUTER_API_KEY` | — (required) | string | OpenRouter credential. Any flow that calls the model fails without it. | generate · triage · assess (and their batteries) |
| `LLM_MODEL` | `anthropic/claude-sonnet-4.5` | string | OpenRouter model id for every agent call. | all LLM flows |
| `LLM_TEMPERATURE` | `0` | float | Sampling temperature. Kept at 0 for determinism (note: OpenRouter is not bit‑deterministic even at 0). | all LLM flows |
| `LLM_MAX_TOKENS` | `4096` | int | Hard cap on completion size. **Not a quality knob** — without it OpenRouter reserves credit against the model's full max output before every call, draining balance. Generous over real usage (~150–1200 tok). | all LLM flows |
| `LLM_JSON_REPAIR_RETRIES` | `2` | int | How many times to re‑ask the model for valid JSON if its output fails schema validation. Each retry is a billed call. | all LLM flows |
| `LLM_INPUT_USD_PER_MTOK` | `3` | float | Price per 1M input tokens, **display only** — used to compute the cost figures in reports. Wrong values mis‑state cost, never affect a run. | cost reporting |
| `LLM_OUTPUT_USD_PER_MTOK` | `15` | float | Price per 1M output tokens, display only. | cost reporting |
| `REQUEST_TIMEOUT_MS` | `30000` | int | Per‑request timeout for an LLM call before it aborts/retries. | all LLM flows |

---

## Generate / run / report (the Stage‑6 loop)

| Variable | Default | Type | Effect | Used by |
|---|---|---|---|---|
| `RUN_N` | `3` | int | Flake guard: each generated test is executed N times with a reset between every run. Decision rule: all‑pass → PASS, all‑fail → FAIL (→ triage), mixed → quarantined (excluded from scoring). Raise for flakier UI/E2E later. | run‑workflow · eval · validate‑release |
| `MAX_REGEN_RETRIES` | `2` | int | On a flaky/bad‑test verdict, how many times to regenerate a test before quarantining it. | run‑workflow |
| `MAX_FALSE_POSITIVE_RATE` | `0` | float | Gate threshold: `verify.sh` fails if the clean‑run false‑positive rate exceeds this. | verify.sh |
| `GENERATED_TESTS_DIR` | `generated-tests` | string (dir) | Where the persisted test suite lives. Relative to the sandbox root unless absolute. **This is how the gate stays isolated** — `verify.sh` sets it to `generated-tests-gate` so it never clobbers your durable suite. Also settable per‑run via `--tests-dir`. | run‑workflow · eval · triage‑battery · ops |

---

## Gate thresholds (`verify.sh` only)

| Variable | Default | Type | Effect |
|---|---|---|---|
| `MIN_CATCH_RATE` | `0.8` | float | Gate fails if seeded‑defect catch rate drops below this. |
| `MIN_TRIAGE_ACCURACY` | `0.8` | float | Gate fails if the triage battery's accuracy drops below this. |
| `GENERATED_TESTS_DIR` | `generated-tests-gate` | string | Scratch suite dir for the gate (overrides the framework default so the gate's `rm -rf` never touches `generated-tests/`). |

---

## Testability gate

The LLM rates six dimensions (D1 oracle · D2 clarity · D3 actor · D4 interface ·
D5 consistency · D6 scope); **deterministic code computes the verdict**:
blocking fail (D1/D4) → `untestable`; a `fail` on a clarify dimension → `needs_clarification`;
`score < threshold` → `needs_clarification`; else `testable`.

| Variable | Default | Type | Effect | Used by |
|---|---|---|---|---|
| `TESTABILITY_GATE` | `off` | `on`/`off` | The master switch. `off`: assessment never affects generation (run‑workflow behaves as before). `on`: run‑workflow assesses each requirement first and **skips generation** for any non‑`testable` one, writing a clarification file instead. | run‑workflow (Phase B) |
| `TESTABILITY_THRESHOLD` | `0.7` | float | Score below which a requirement (with no clarify‑fail) is `needs_clarification`. Calibrated against the real set; with the dimension‑aware rules below the threshold is a secondary lever. | assess |
| `TESTABILITY_CLARIFY_ON_FAIL` | `D2,D3,D5` | csv of dim ids | A `fail` on any listed dimension forces `needs_clarification` (D2 ambiguous criteria, D3 missing actor, D5 contradiction). Narrow to `D2` if D3/D5 prove too strict; widen at your own risk. | assess |
| `TESTABILITY_STRICT_FAIL` | `off` | `on`/`off` | `on` restores the blunt rule: ANY dimension `fail` caps the verdict at `needs_clarification`. Kept for A/B; off by default because it makes borderline verdicts unstable run‑to‑run. | assess |
| `TESTABILITY_RUNS` | `1` | int | Assess each requirement N times and take the majority verdict / median score, to damp temp‑0 noise on borderline cases. N×LLM cost. | assess |
| `TESTABILITY_WEIGHTS` | equal | JSON string | Per‑dimension weights for the score, e.g. `{"D1":2}`. Affects only the numeric score, not the blocking/clarify rules. | assess |

> **Blocking vs clarify vs score** — D1 and D4 are *blocking* (a fail → `untestable`,
> always). D2/D3/D5 are *clarify‑on‑fail* (a fail → `needs_clarification`). D6 and
> everything else only move the score. This split is why the gate is stable on the
> parts that must be reliable (untestable) and tunable on the soft boundary.

---

## CLI flags

| Entry point | Flags | Meaning |
|---|---|---|
| `run-workflow.js` | `--all` · `--requirement <id>` (repeatable) · `--out <dir>` (default `reports`) · `--tests-dir <dir>` | Select all vs specific requirements; where reports go; which suite dir to write. |
| `ops/sync-requirements.js` | `--dry-run` (default) · `--init-manifest` · `--apply` | Preview the delta (free); snapshot a baseline (free); regenerate the delta + prune (spends). |
| `ops/assess-requirements.js` | `--all` · `--requirement <id>` | Testability Phase A over all vs one requirement (measure only). |
| `ops/validate-release.js` | — | Replays the persisted suite against the current build. |
| `eval/run-eval.js` · `run-triage-battery.js` · `run-testability-battery.js` | — | Run their fixed batteries. |

---

## Quick "what costs money / needs Docker"

| | Spends LLM | Needs Docker |
|---|---|---|
| `npm test`, `check:boundaries` | no | no |
| `sync --dry-run` / `--init-manifest` | no | no |
| `assess-requirements`, `run-testability-battery` | yes | no |
| `sync --apply`, `run-workflow` (generate) | yes | yes |
| `eval/run-eval` (replay) | no | yes |
| `validate-release`, `run-triage-battery` | yes (triage only) | yes |

See the [Operations guide](operations-guide.md) for the full per‑flow detail.
