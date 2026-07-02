/**
 * Generic OpenRouter chat-completions client behind the LlmClient interface.
 * Knows nothing about QE, apps, or frameworks — just sends/validates JSON.
 */
import { extractJson, validateAgainstSchema, formatAjvErrors, InvalidLlmJsonError } from "./json.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postChatCompletion({ apiKey, model, temperature, maxTokens, system, user, timeoutMs, maxHttpRetries = 3 }) {
  const body = JSON.stringify({
    model,
    temperature,
    // Without an explicit cap, OpenRouter reserves credit against the
    // model's full max output (e.g. 64000 for Sonnet-class models) before
    // every call, regardless of actual usage — see config.js's
    // llmMaxTokens comment. Always pass one.
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  let lastError;
  for (let attempt = 0; attempt <= maxHttpRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/agentic-qe-sandbox",
          "X-Title": "agentic-qe-sandbox",
        },
        body,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text();
        if (RETRYABLE_STATUS.has(res.status) && attempt < maxHttpRetries) {
          await sleep(2 ** attempt * 500);
          continue;
        }
        throw new Error(`OpenRouter request failed: HTTP ${res.status} — ${text}`);
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (typeof content !== "string") {
        throw new Error(`OpenRouter response missing choices[0].message.content: ${JSON.stringify(json)}`);
      }
      const usage = json.usage ?? {};
      const promptTokens = Number(usage.prompt_tokens) || 0;
      const completionTokens = Number(usage.completion_tokens) || 0;
      console.log(
        `[llm] model=${model} prompt_tokens=${usage.prompt_tokens ?? "?"} completion_tokens=${usage.completion_tokens ?? "?"}`
      );
      return { content, promptTokens, completionTokens };
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (err.name === "AbortError") {
        throw new Error(`OpenRouter request timed out after ${timeoutMs}ms`);
      }
      if (attempt < maxHttpRetries) {
        await sleep(2 ** attempt * 500);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

/**
 * @param {{ openRouterApiKey: string, llmModel: string, llmTemperature: number, llmJsonRepairRetries: number, requestTimeoutMs: number }} config
 */
export function createLlmClient(config) {
  if (!config.openRouterApiKey) {
    throw new Error("createLlmClient requires a non-empty OPENROUTER_API_KEY");
  }

  // Per-run token accumulator. Every postChatCompletion (including JSON- and
  // schema-repair retries — those are real, billed calls) is added here, and
  // bucketed by the caller-supplied `phase` ("generate"/"triage"/...) so the
  // report can show which phase dominates spend. getUsage() returns a copy.
  const usage = { calls: 0, promptTokens: 0, completionTokens: 0, byPhase: {} };

  function record(phase, promptTokens, completionTokens) {
    usage.calls += 1;
    usage.promptTokens += promptTokens;
    usage.completionTokens += completionTokens;
    const key = phase || "unlabelled";
    const bucket = usage.byPhase[key] ?? { calls: 0, promptTokens: 0, completionTokens: 0 };
    bucket.calls += 1;
    bucket.promptTokens += promptTokens;
    bucket.completionTokens += completionTokens;
    usage.byPhase[key] = bucket;
  }

  return {
    /**
     * Snapshot of token usage accumulated so far this run (deep copy).
     * @returns {{ calls: number, promptTokens: number, completionTokens: number, byPhase: Record<string, object> }}
     */
    getUsage() {
      return {
        calls: usage.calls,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        byPhase: Object.fromEntries(Object.entries(usage.byPhase).map(([k, v]) => [k, { ...v }])),
      };
    },

    /**
     * @param {{ system: string, user: string, schema: object, schemaName: string, phase?: string }} opts
     * @returns {Promise<object>}
     */
    async complete({ system, user, schema, schemaName, phase }) {
      let lastInvalid;
      let userMessage = user;

      for (let attempt = 0; attempt <= config.llmJsonRepairRetries; attempt++) {
        const { content, promptTokens, completionTokens } = await postChatCompletion({
          apiKey: config.openRouterApiKey,
          model: config.llmModel,
          temperature: config.llmTemperature,
          maxTokens: config.llmMaxTokens,
          system,
          user: userMessage,
          timeoutMs: config.requestTimeoutMs,
        });
        record(phase, promptTokens, completionTokens);

        let parsed;
        try {
          parsed = extractJson(content);
        } catch (err) {
          lastInvalid = err;
          userMessage = `${user}\n\nYour previous response could not be parsed as JSON (${err.message}). Return corrected JSON only, matching the ${schemaName} schema.`;
          continue;
        }

        const { valid, errors } = validateAgainstSchema(parsed, schema);
        if (valid) return parsed;

        lastInvalid = new InvalidLlmJsonError(
          `LLM JSON failed ${schemaName} schema validation`,
          errors,
          content
        );
        userMessage = `${user}\n\nYour previous JSON failed these schema checks: ${formatAjvErrors(
          errors
        )}. Return corrected JSON only, matching the ${schemaName} schema exactly.`;
      }

      throw lastInvalid ?? new Error(`LLM did not return valid ${schemaName} JSON`);
    },
  };
}
