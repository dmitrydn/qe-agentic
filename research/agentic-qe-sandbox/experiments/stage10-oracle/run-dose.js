#!/usr/bin/env node
/**
 * Stage 10 — run one oracle dose through the live cypress-rwa loop.
 * Mirrors ../../run-workflow.js but swaps in the dose adapter.
 *
 *   node experiments/stage10-oracle/run-dose.js --dose rich  --all --out reports/s10-rich
 *   node experiments/stage10-oracle/run-dose.js --dose sparse --all --out reports/s10-sparse
 *
 * The experiment is defined apiHints-free, so AQE_STRIP_APIHINTS defaults to 1
 * here (set AQE_STRIP_APIHINTS=0 to override). The full N-run, both-dose,
 * metrics + adjudication harness is a separate unit; this entry runs a single
 * dose once. Boots Docker (cypress-rwa runtime) and calls the LLM.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../../workflow/config.js";
import { createLlmClient } from "../../workflow/llm/llm-client.js";
import { runCli } from "../../workflow/index.js";
import { makeDoseAdapter } from "./dose-adapter.js";
import { DOSES } from "./dose-requirements.js";

const SANDBOX_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

if (process.env.AQE_STRIP_APIHINTS === undefined) process.env.AQE_STRIP_APIHINTS = "1";

function parseDose(argv) {
  const i = argv.indexOf("--dose");
  const dose = i !== -1 ? argv[i + 1] : "rich";
  if (!DOSES.includes(dose)) {
    throw new Error(`--dose must be one of ${DOSES.join(" | ")} (got "${dose}")`);
  }
  const passthrough = argv.filter((_, idx) => idx !== i && idx !== i + 1);
  return { dose, passthrough };
}

async function main() {
  const { dose, passthrough } = parseDose(process.argv.slice(2));
  const config = loadConfig(process.env);
  const llm = createLlmClient(config);
  const adapter = makeDoseAdapter(dose);

  console.error(`[stage10] dose=${dose} · apiHints stripped=${process.env.AQE_STRIP_APIHINTS}`);
  await runCli({ adapter, llm, config, argv: passthrough, sandboxRoot: SANDBOX_ROOT });
  await adapter.teardown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
