# Stage 6 — Core Implementation Specification

Detailed enough to build the app-agnostic Core of the Agentic QE workflow. Pairs with
`stage6-agentic-qe-design.md` (what & why) and `stage6-build-prompt.md` (execution plan,
gate). This doc is the **how** for everything under `workflow/`.

---

## 0. Locked decisions (carry into implementation)
- **Language/runtime:** Node + JavaScript (match the stage-5 core; keeps `check-boundaries`
  consistent).
- **LLM runtime:** configurable **OpenRouter** call (OpenAI-compatible chat completions).
  Default model = a **Sonnet-class** slug; temperature 0; behind an `LlmClient` interface.
- **Generated tests are framework-neutral structured data** (a `TestCase` JSON), produced
  by Generate and executed by the adapter's `testRunner`. The Core never emits framework
  code and never names an app/framework.
- **Generate runs once against the clean app; the persisted suite is replayed** by the eval
  harness under each seeded defect. The agent never sees injected defects.
- **Prompts are versioned files** under `workflow/prompts/`, app-agnostic, with app context
  injected at runtime as data.

### Deferred to implementation (flagged here, decide while building)
- How the adapter's `testRunner` physically executes a `TestCase` — adapter-side, invisible
  to Core. **Default: plain `fetch`** (Node 22 built-in): loop the requests, evaluate the
  declarative status/JSON-path assertions with a small helper, no extra dependency. Switch
  to supertest/axios only if a concrete need arises; the Core is unaffected either way.
- Exact `check-boundaries` denylist contents.
- Numeric tuning: request timeout, regen retries (default 2), N (default 3).
- Report file format details (we fix JSON + Markdown below; field-level extras are open).
- Exact OpenRouter model slug (set `LLM_MODEL` to a current Sonnet-class slug).

---

## 1. Directory layout (under `agentic-qe-sandbox/`)
```
workflow/                     # APP-AGNOSTIC CORE (no app/framework names anywhere)
  config.js                   # reads env, exposes typed config object
  llm/llm-client.js           # OpenRouter client behind LlmClient interface
  llm/json.js                 # JSON extraction + ajv schema validation + repair loop
  prompts/
    generate.system.md
    generate.user.md          # {{handlebars-style}} placeholders
    triage.system.md
    triage.user.md
  schemas/                    # ajv JSON schemas (data contracts below)
    requirement.schema.json
    testcase.schema.json
    triage.schema.json
    scorecard.schema.json
  adapter/contract.js         # the adapter interface (JSDoc typedefs) + a validator
  steps/select.js             # deterministic
  steps/generate.js           # agent
  steps/run-harness.js        # deterministic (N runs, reset, decision rule)
  steps/triage.js             # agent
  steps/report.js             # deterministic
  orchestrator.js             # the loop; wires steps; app-agnostic
  index.js                    # CLI entry: `node workflow` (flags: --requirement, --all, --out)
adapters/cypress-rwa/         # app-specific (NOT core)
eval/                         # seeded-defect catalog + scoring harness
tools/check-boundaries.js     # import-boundary rule (scans workflow/ incl. prompts/)
generated-tests/              # persisted TestCase JSON (evidence + replayed by eval)
reports/                      # scorecard.json, report.md, defects/*.md
```

---

## 2. The adapter contract (what Core depends on)
Core talks ONLY to this interface; never to an app directly. Define as JSDoc typedefs in
`workflow/adapter/contract.js` plus a runtime `assertAdapter(obj)` validator.

```
Adapter = {
  name: string,                                  // opaque label, never branched on
  requirementsSource(): Promise<Requirement[]>   // already-normalized unified requirements
  run(): Promise<{ ready: () => Promise<boolean> }>   // boot/ensure app reachable
  seed(): Promise<void>                           // reset to known seeded state
  reset(): Promise<void>                          // alias/explicit clean state (used between runs)
  auth(actor: string): Promise<AuthContext>       // resolve abstract actor -> concrete auth
  testRunner(testCase: TestCase): Promise<RunResult>   // execute a structured test
  faultInjector(defectId: string): { apply(): Promise<void>, revert(): Promise<void> }
  teardown(): Promise<void>
}
AuthContext = { headers?: object, cookies?: object }   // opaque to Core; passed back as data
```
Notes: `actor` is an abstract identity string (e.g. `"anonymous"`, `"primaryUser"`,
`"secondaryUser"`). The Core passes actor names around as data; the adapter maps them to
real sessions/JWT/cookies. The Core never knows the auth mechanism.

---

## 3. Data contracts (ajv schemas in `workflow/schemas/`)

### 3.1 Requirement (input — from `requirementsSource()`)
```
Requirement = {
  id: string,                    // e.g. "CYPRESS-RWA-TX-001"
  title: string,
  userStory?: string,
  acceptanceCriteria: string[],  // natural-language or Gherkin lines
  source: { file: string, ref?: string },   // traceability pointer
  apiHints?: Array<{             // optional structured hints the normalizer extracted
    method: string, path: string, // e.g. "POST", "/transactions"
    auth?: string,                // abstract actor hint
    notes?: string
  }>
}
```

### 3.2 TestCase (Generate output / testRunner input) — framework-neutral
```
TestCase = {
  id: string,                    // stable, derived from requirementId + index
  requirementId: string,         // REQUIRED, must match a known Requirement.id
  title: string,
  kind: "positive" | "negative" | "auth",
  actor: string,                 // abstract identity, resolved by adapter.auth()
  requests: Array<{
    name: string,
    method: "GET"|"POST"|"PUT"|"PATCH"|"DELETE",
    pathTemplate: string,        // e.g. "/articles/{slug}/favorite"
    pathParams?: object,         // values, possibly captured from earlier steps
    query?: object,
    headers?: object,
    body?: object,
    capture?: object,            // { localName: "$.jsonPath" } -> reuse in later requests
    expect: {
      status?: number,           // or use statusIn
      statusIn?: number[],
      jsonPath?: Array<{ path: string, op: "eq"|"neq"|"exists"|"gte"|"lte"|"isType", value?: any }>
    }
  }>
}
```

### 3.3 RunResult (testRunner output)
```
RunResult = {
  pass: boolean,                 // all requests' assertions passed
  requests: Array<{ name: string, status: number, ok: boolean, failures: string[] }>,
  output: string                 // human-readable log for triage
}
```

### 3.4 TriageVerdict (Triage output)
```
TriageVerdict = {
  class: "real_defect" | "flaky_or_bad_test" | "environment",
  confidence: "low"|"medium"|"high",
  requirementId: string,
  rationale: string,
  repro?: string[]               // present when class == real_defect
}
```

### 3.5 Scorecard (Report output) — `reports/scorecard.json`
```
Scorecard = {
  generatedAt, model, n,
  requirements: { total, covered },
  tests: { generated, passed, failed, quarantinedFlaky },
  falsePositiveRate: number,     // clean-app failures (excl. quarantined) / generated
  traceability: { orphanTestIds: string[] },   // tests with no valid requirementId
  defects: Array<{ id: string, caught: boolean, byTestIds: string[] }>,  // filled by eval harness
  catchRate: number | null       // null on a pure clean run; set by eval harness
}
```

---

## 4. LlmClient (`workflow/llm/llm-client.js`)
Interface: `createLlmClient(config) -> { complete({system, user, schema, schemaName}): Promise<object> }`.

OpenRouter call:
- `POST https://openrouter.ai/api/v1/chat/completions`
- Headers: `Authorization: Bearer ${OPENROUTER_API_KEY}`, `Content-Type: application/json`,
  optional `HTTP-Referer` / `X-Title` (set to a generic project label, NOT an app name).
- Body: `{ model: config.model, temperature: 0, messages: [{role:"system",content:system},
  {role:"user",content:user}], response_format: { type: "json_object" } }`.
- **Structured-output discipline** (`workflow/llm/json.js`): extract JSON from the response,
  validate against the provided ajv `schema`; on invalid, re-ask once or twice with the
  validation errors appended ("your JSON failed these checks: …; return corrected JSON").
  Bounded by `LLM_JSON_REPAIR_RETRIES` (default 2). Throw a typed error if still invalid.
- **Determinism:** temperature 0 always; do not stream; log model + token usage.
- **Resilience:** retry transient HTTP (429/5xx) with backoff, bounded.
- The client is generic — it knows nothing about QE, apps, or frameworks.

---

## 5. Prompts (`workflow/prompts/`) — app-agnostic
Templates use `{{placeholders}}` filled at runtime. **Hard rule:** prompt text contains no
app or framework names; everything specific arrives via injected data. `check-boundaries`
scans these files too.

### 5.1 generate.system.md (role + rules)
- Role: "You convert a software requirement and its acceptance criteria into structured,
  executable API test cases."
- Rules: output ONLY JSON matching the TestCase array schema; one or more cases per
  requirement; include negative and auth cases when the acceptance criteria imply them
  (e.g. an unauthenticated request expecting 401); use only endpoints/fields present in the
  provided `apiHints`/criteria — do not invent paths; reference abstract `actor` names only;
  chain requests with `capture` when an assertion needs a value from a prior call; every
  case must carry the given `requirementId`.

### 5.2 generate.user.md (data)
Injected: `{{requirement.id}}`, `{{requirement.title}}`, `{{requirement.userStory}}`,
`{{#each acceptanceCriteria}}`, `{{#each apiHints}}`, available actors list, and the
TestCase JSON schema. Ends: "Return a JSON array of TestCase objects."

### 5.3 triage.system.md
- Role: "Given a failing API test and its run output, classify the cause."
- Rules: choose exactly one `class` (`real_defect` | `flaky_or_bad_test` | `environment`);
  base the verdict only on the provided assertions/output; if `real_defect`, give concise
  repro steps; output ONLY JSON matching the TriageVerdict schema. The prompt must NOT be
  told whether a fault was injected.

### 5.4 triage.user.md
Injected: the `TestCase`, the failing `RunResult`(s) across the N runs, the requirement text.

---

## 6. Steps

### 6.1 select.js (deterministic)
`select({adapter, filter}) -> Requirement[]`. Calls `adapter.requirementsSource()`,
validates each against `requirement.schema.json`, applies optional filter (id / app / all),
returns the list. No app logic.

### 6.2 generate.js (agent)
`generate({requirement, llm}) -> TestCase[]`. Render generate prompts with the requirement
data; call `llm.complete({system,user,schema:testcaseArray})`; validate; enforce
`requirementId` matches; assign stable `id`s; return. Persist nothing here (orchestrator
persists).

### 6.3 run-harness.js (deterministic) — the flake guard
`runHarness({testCase, adapter, n}) -> { decision, runs }` where `decision ∈
{PASS, FAIL, FLAKY}`:
```
runs = []
for i in 1..n:
    await adapter.reset()            // clean, seeded state BEFORE each run (mandatory)
    runs.push(await adapter.testRunner(testCase))
passes = runs.filter(r => r.pass).length
if passes === n      -> PASS
else if passes === 0 -> FAIL
else                 -> FLAKY        // mixed => quarantine, never scored
```
`n` from config (default 3). Reset-between-runs is required or the check is meaningless.

### 6.4 triage.js (agent)
`triage({testCase, runs, requirement, llm}) -> TriageVerdict`. Only called on `FAIL`.
Render triage prompts; call llm; validate.

### 6.5 report.js (deterministic)
`report({records, config}) -> Scorecard` + writes `reports/scorecard.json`,
`reports/report.md`, and `reports/defects/<id>.md` for each `real_defect`. Computes
coverage, false-positive rate, traceability orphans. Leaves `defects`/`catchRate` to the
eval harness on a clean run (set to `null`).

---

## 7. Orchestrator (`workflow/orchestrator.js`) — the loop
```
async function run({ adapter, llm, config }) {
  assertAdapter(adapter)
  await (await adapter.run()).ready()
  const requirements = await select({ adapter, filter: config.filter })
  const records = []
  for (const req of requirements) {
    let testCases = await generate({ requirement: req, llm })
    for (const tc of testCases) {
      let attempt = 0, outcome
      while (true) {
        const { decision, runs } = await runHarness({ testCase: tc, adapter, n: config.n })
        if (decision === 'PASS') { outcome = { tc, status: 'pass' }; break }
        if (decision === 'FAIL') {
          const verdict = await triage({ testCase: tc, runs, requirement: req, llm })
          if (verdict.class === 'real_defect') { outcome = { tc, status: 'defect', verdict }; break }
          // flaky_or_bad_test / environment -> try regenerating a better test
        }
        // FLAKY or non-defect failure -> bounded regeneration
        if (attempt++ >= config.maxRegenRetries) { outcome = { tc, status: 'quarantined' }; break }
        tc = (await generate({ requirement: req, llm }))[0] ?? tc   // regenerate this case
      }
      records.push(outcome)
      persistTestCase(tc)            // -> generated-tests/<tc.id>.json
    }
  }
  return report({ records, config })
}
```
Bounded everywhere: `maxRegenRetries` (default 2). The orchestrator names no app and no
framework — it only moves typed data between steps and the adapter.

---

## 8. Clean-run vs eval (keep the metric honest)
- **Clean run** (this Core): generate → run (N+reset) → triage → report against the
  unmodified app. Produces the persisted suite + baseline; false-positive rate must be
  ≤ `MAX_FALSE_POSITIVE_RATE` (default 0).
- **Eval** (`eval/`, separate harness, replays the persisted suite): for each seeded defect
  `faultInjector(id).apply()` → re-run each persisted `TestCase` via run-harness (NO
  regeneration, NO new generation) → a defect is "caught" if a test that was PASS on the
  clean app becomes FAIL → `revert()`. Fills `defects[]` and `catchRate` in the scorecard.
  Generation never sees defects, so the metric measures the tests' fault-detection power.

---

## 9. Config & env (`workflow/config.js`)
```
OPENROUTER_API_KEY   (required)
LLM_MODEL            default: a Sonnet-class OpenRouter slug (set explicitly)
LLM_TEMPERATURE      default: 0
LLM_JSON_REPAIR_RETRIES  default: 2
RUN_N                default: 3
MAX_REGEN_RETRIES    default: 2
MAX_FALSE_POSITIVE_RATE  default: 0
REQUEST_TIMEOUT_MS   default: 30000
```

## 10. App-agnostic guarantee
`tools/check-boundaries.js` scans `workflow/**` (code AND `prompts/**`) and fails if it
finds an `adapters/` import or any denylisted app/framework identifier. The TestCase data,
generated tests, and adapter are allowed to contain app specifics — the *Core code and
prompts* must not. This is the same standing guardrail from `stage6-build-prompt.md`.

## 11. Definition of done for the Core
The Core is built when, wired to the Cypress RWA adapter and a valid `OPENROUTER_API_KEY`:
- `node workflow --all` runs the full loop and writes a `scorecard.json` + `report.md`;
- `check-boundaries` passes including `prompts/`;
- a clean run yields false-positive rate ≤ threshold;
- every generated test carries a valid `requirementId` (no orphans);
- the eval harness can replay the persisted suite under a seeded defect and flip a test.
These roll up into the `./verify.sh` gate defined in `stage6-build-prompt.md`.
