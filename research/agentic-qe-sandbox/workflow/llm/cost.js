/**
 * Pure cost math for a run's token usage. No app/framework/provider
 * knowledge — just (tokens, per-million prices) -> dollars. Kept separate
 * from the LLM client so it's trivially unit-testable and reusable by the
 * report step and any entry point that wants a cost summary.
 */

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}

/**
 * @param {{ promptTokens: number, completionTokens: number }} tokens
 * @param {{ inputUsdPerMTok: number, outputUsdPerMTok: number }} pricing
 * @returns {{ inputUsd: number, outputUsd: number, totalUsd: number }}
 */
export function costFor(tokens, pricing) {
  const promptTokens = Number(tokens?.promptTokens) || 0;
  const completionTokens = Number(tokens?.completionTokens) || 0;
  const inputRate = Number(pricing?.inputUsdPerMTok) || 0;
  const outputRate = Number(pricing?.outputUsdPerMTok) || 0;

  const inputUsd = round6((promptTokens / 1e6) * inputRate);
  const outputUsd = round6((completionTokens / 1e6) * outputRate);
  return { inputUsd, outputUsd, totalUsd: round6(inputUsd + outputUsd) };
}

/**
 * Builds the full cost block written into the scorecard from an accumulated
 * usage object (see createLlmClient's getUsage()) and the configured pricing.
 * Includes a per-phase breakdown so the disproportionately call-heavy phase
 * (e.g. triage fan-out on an uncurated sweep) is visible, not just the total.
 *
 * @param {{ calls: number, promptTokens: number, completionTokens: number,
 *           byPhase?: Record<string, { calls: number, promptTokens: number, completionTokens: number }> }} usage
 * @param {{ inputUsdPerMTok: number, outputUsdPerMTok: number }} pricing
 * @returns {object}
 */
export function buildCostReport(usage, pricing) {
  const safeUsage = usage ?? { calls: 0, promptTokens: 0, completionTokens: 0, byPhase: {} };
  const total = costFor(safeUsage, pricing);

  const byPhase = {};
  for (const [phase, u] of Object.entries(safeUsage.byPhase ?? {})) {
    byPhase[phase] = {
      calls: u.calls ?? 0,
      promptTokens: u.promptTokens ?? 0,
      completionTokens: u.completionTokens ?? 0,
      ...costFor(u, pricing),
    };
  }

  return {
    calls: safeUsage.calls ?? 0,
    promptTokens: safeUsage.promptTokens ?? 0,
    completionTokens: safeUsage.completionTokens ?? 0,
    pricing: {
      inputUsdPerMTok: Number(pricing?.inputUsdPerMTok) || 0,
      outputUsdPerMTok: Number(pricing?.outputUsdPerMTok) || 0,
    },
    inputUsd: total.inputUsd,
    outputUsd: total.outputUsd,
    totalUsd: total.totalUsd,
    byPhase,
  };
}
