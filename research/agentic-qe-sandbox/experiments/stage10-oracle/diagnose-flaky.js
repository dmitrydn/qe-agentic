#!/usr/bin/env node
/**
 * Stage 10 — flaky-test diagnostic (LIVE: needs Docker up; NO LLM cost).
 *
 * Replays an already-generated test case N times, resetting before each rep
 * (exactly like the flake guard), and prints the per-repetition outcome so a
 * "FLAKY/quarantined" verdict becomes "rep 2 got status=500 / balance=Y". Pulls
 * the persisted test from a prior run's tests dir — no regeneration, no spend.
 *
 *   colima start   # if not already up
 *   node experiments/stage10-oracle/diagnose-flaky.js \
 *     --requirement CYPRESS-RWA-TRANSACTIONS-007 --dose rich --from reports/s10 --n 5
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { cypressRwaWorkflowAdapter as adapter } from "../../adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function parseArgs(argv) {
  const a = { requirement: "CYPRESS-RWA-TRANSACTIONS-007", dose: "rich", from: "reports/s10", run: 1, n: 5 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--requirement") a.requirement = argv[++i];
    else if (argv[i] === "--dose") a.dose = argv[++i];
    else if (argv[i] === "--from") a.from = argv[++i];
    else if (argv[i] === "--run") a.run = Number(argv[++i]);
    else if (argv[i] === "--n") a.n = Number(argv[++i]);
  }
  return a;
}

function loadTestCases({ from, dose, run, requirement }) {
  const dir = join(SANDBOX_ROOT, from, dose, `run-${run}`, "tests");
  if (!existsSync(dir)) throw new Error(`no tests dir at ${dir} — run the experiment first`);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && f.startsWith(requirement))
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
}

async function repeat(testCase, n) {
  const reps = [];
  for (let i = 0; i < n; i++) {
    await adapter.reset();
    let r;
    try {
      r = await adapter.testRunner(testCase);
    } catch (err) {
      r = { pass: false, requests: [], output: `testRunner threw: ${err.message}` };
    }
    reps.push(r);
  }
  return reps;
}

function reportTestCase(testCase, reps) {
  console.log(`\n================ ${testCase.id} (${reps.length} reps) ================`);
  const decisions = reps.map((r) => (r.pass ? "PASS" : "FAIL"));
  console.log("per-rep decision:", decisions.join("  "));
  const mixed = new Set(decisions).size > 1;
  console.log(mixed ? ">>> FLAKY (mixed) — the flake guard quarantines this" : `>>> stable ${decisions[0]}`);

  // Per named request: show the set of (status, ok) outcomes across reps.
  const names = [...new Set(reps.flatMap((r) => (r.requests || []).map((q) => q.name)))];
  console.log("\nper-request outcomes across reps (status·ok):");
  for (const name of names) {
    const cells = reps.map((r) => {
      const q = (r.requests || []).find((x) => x.name === name);
      return q ? `${q.status}${q.ok ? "✓" : "✗"}` : "—";
    });
    const varies = new Set(cells).size > 1;
    console.log(`  ${varies ? "⚑" : " "} ${name.padEnd(46)} ${cells.join("  ")}${varies ? "   <-- DIFFERS" : ""}`);
  }

  // Dump the first failing rep's failure lines (the concrete differing field).
  const firstFail = reps.find((r) => !r.pass);
  if (firstFail) {
    console.log("\nfirst failing rep — failure detail:");
    for (const q of firstFail.requests || []) {
      if (q.failures?.length) console.log(`  ${q.name}: ${q.failures.join(" | ")}`);
    }
    if (!(firstFail.requests || []).some((q) => q.failures?.length)) {
      console.log("  (no per-request failures recorded — likely a throw or empty test)");
    }
    // Always surface the raw output/throw — this is where a broken {{capture}}
    // or the concrete status/body/assertion mismatch actually shows up.
    console.log("\nfirst failing rep — raw output:");
    console.log((firstFail.output || "(empty output)").split("\n").map((l) => "  " + l).join("\n").slice(0, 2000));
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const testCases = loadTestCases(args);
  if (!testCases.length) throw new Error(`no persisted tests for ${args.requirement} under ${args.from}/${args.dose}/run-${args.run}`);
  console.log(`[diagnose] ${testCases.length} test(s) for ${args.requirement} · dose=${args.dose} · n=${args.n} reps each`);

  await (await adapter.run()).ready();
  try {
    for (const tc of testCases) {
      const reps = await repeat(tc, args.n);
      reportTestCase(tc, reps);
    }
  } finally {
    await adapter.teardown();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
