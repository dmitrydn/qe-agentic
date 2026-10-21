/**
 * Reads env into a typed config object. No app/framework knowledge here —
 * just numeric/string knobs the orchestrator and LLM client use.
 */
function int(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function float(value, fallback) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

// TESTABILITY_WEIGHTS is an optional JSON object string, e.g. '{"D1":2}', to
// weight specific dimensions above the default of 1 each (see testability.js
// scoreOf). Malformed/absent input falls back to equal weighting rather than
// throwing — a config typo here should degrade gracefully, not crash the run.
function weights(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadConfig(env = process.env) {
  return {
    openRouterApiKey: env.OPENROUTER_API_KEY ?? "",
    llmModel: env.LLM_MODEL ?? "anthropic/claude-sonnet-4.5",
    llmTemperature: float(env.LLM_TEMPERATURE, 0),
    llmJsonRepairRetries: int(env.LLM_JSON_REPAIR_RETRIES, 2),
    // Explicit cap, NOT a quality knob: without this, OpenRouter reserves
    // credit against the model's full max output (64000 for Sonnet-class
    // models) before every single call, even though actual completions here
    // are ~150-1200 tokens (TestCase[]/TriageVerdict JSON is small) — that
    // mismatch is what exhausts account balance long before real usage
    // would justify it. Generous headroom over observed usage, not a tight
    // limit that risks truncating a legitimate response.
    llmMaxTokens: int(env.LLM_MAX_TOKENS, 4096),
    // Per-million-token prices used only to turn observed token usage into a
    // dollar figure in the report — they do NOT affect any API call. Defaults
    // are the published Sonnet-class rates ($3 in / $15 out per 1M tok);
    // override per model/provider via env. Wrong/absent prices only mis-state
    // the cost line, never the run itself.
    llmInputUsdPerMTok: float(env.LLM_INPUT_USD_PER_MTOK, 3),
    llmOutputUsdPerMTok: float(env.LLM_OUTPUT_USD_PER_MTOK, 15),
    runN: int(env.RUN_N, 3),
    maxRegenRetries: int(env.MAX_REGEN_RETRIES, 2),
    maxFalsePositiveRate: float(env.MAX_FALSE_POSITIVE_RATE, 0),
    requestTimeoutMs: int(env.REQUEST_TIMEOUT_MS, 30_000),
    // Default unset on purpose — Phase A (ops/assess-requirements.js) exists
    // to calibrate this against the real 44 before the hard gate (Phase B)
    // ever reads it. 0.7 is a placeholder until that calibration happens.
    testabilityThreshold: float(env.TESTABILITY_THRESHOLD, 0.7),
    // "off" until Phase A calibration is done; Phase B (orchestrator gate)
    // only enforces when this is "on".
    testabilityGate: env.TESTABILITY_GATE ?? "off",
    testabilityWeights: weights(env.TESTABILITY_WEIGHTS),
    // Assess each requirement N times and take the majority verdict / median
    // score, to damp temp-0 non-determinism on borderline cases (1 = single shot).
    testabilityRuns: int(env.TESTABILITY_RUNS, 1),
    // When "on", ANY dimension rated `fail` (even non-blocking) caps the verdict
    // at needs_clarification. Off (default) lets non-blocking fails only lower
    // the score — removing the binary cliff that made borderline verdicts flip
    // run-to-run. D1/D4 remain the hard gate regardless of this knob.
    testabilityStrictFail: (env.TESTABILITY_STRICT_FAIL ?? "off") === "on",
    // Dimension-aware middle ground between strict (any fail caps) and soft
    // (no fail caps): a `fail` on these dimensions forces needs_clarification,
    // because each is a genuine "ask the author" signal — D2 ambiguous criteria,
    // D3 missing actor/preconditions, D5 internal contradiction. Other
    // non-blocking fails only lower the score. Narrow to "D2" via env if D3/D5
    // gating proves too strict for terse but grounded requirements.
    testabilityClarifyOnFail: (env.TESTABILITY_CLARIFY_ON_FAIL ?? "D2,D3,D5").split(",").map((s) => s.trim()).filter(Boolean),
  };
}
