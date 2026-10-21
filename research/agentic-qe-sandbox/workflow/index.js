/**
 * Adapter-agnostic CLI runner. Deliberately takes the adapter and llm client
 * as parameters rather than importing a concrete adapter module — importing
 * `adapters/*` from anywhere under workflow/ would violate the standing
 * import-boundary rule (tools/check-boundaries.js). The one place a concrete
 * adapter is named for Stage 6 is `run-workflow.js` at the sandbox root
 * (sibling to workflow/, exactly like requirements/build.js sits outside
 * core/ for Stage 5) — that's what actually wires this up and is invoked
 * from the command line.
 */
import { join } from "node:path";
import { run } from "./orchestrator.js";
import { resolveTestsDir } from "./tests-dir.js";

export function parseArgs(argv) {
  const args = { ids: [], all: false, out: "reports", testsDir: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--all") args.all = true;
    else if (arg === "--requirement") args.ids.push(argv[++i]);
    else if (arg === "--out") args.out = argv[++i];
    else if (arg === "--tests-dir") args.testsDir = argv[++i];
  }
  return args;
}

/**
 * @param {{ adapter: object, llm: { complete: Function }, config: object,
 *           argv: string[], sandboxRoot: string }} opts
 */
export async function runCli({ adapter, llm, config, argv, sandboxRoot }) {
  const args = parseArgs(argv);

  const scorecard = await run({
    adapter,
    llm,
    config,
    filter: { all: args.all, ids: args.ids },
    generatedTestsDir: resolveTestsDir(sandboxRoot, args.testsDir),
    reportsDir: join(sandboxRoot, args.out),
  });

  console.log(JSON.stringify(scorecard, null, 2));
  return scorecard;
}
