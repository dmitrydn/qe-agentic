#!/usr/bin/env node
/**
 * The one place app identity is allowed to exist for the Stage-6 workflow —
 * mirrors requirements/build.js's role for Stage 5. Wires the concrete
 * cypress-rwa adapter + OpenRouter LLM client into the app-agnostic
 * workflow/ CLI runner. Lives outside workflow/ on purpose: workflow/ itself
 * must never import an adapter (see tools/check-boundaries.js).
 *
 * Usage: node run-workflow.js [--requirement <id> ...] [--all] [--out <dir>]
 */
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "./workflow/config.js";
import { createLlmClient } from "./workflow/llm/llm-client.js";
import { runCli } from "./workflow/index.js";
import { cypressRwaWorkflowAdapter } from "./adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = dirname(fileURLToPath(import.meta.url));

async function main() {
  const config = loadConfig(process.env);
  const llm = createLlmClient(config);

  await runCli({
    adapter: cypressRwaWorkflowAdapter,
    llm,
    config,
    argv: process.argv.slice(2),
    sandboxRoot: SANDBOX_ROOT,
  });

  await cypressRwaWorkflowAdapter.teardown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
