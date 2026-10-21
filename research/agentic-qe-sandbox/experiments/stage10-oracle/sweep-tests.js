#!/usr/bin/env node
/**
 * Stage 10 — execution-health sweep (LIVE: needs Docker; NO LLM cost).
 *
 * Replays every persisted test from a prior run N times (reset before each rep,
 * like the flake guard) and categorizes each: PASS (all reps pass), FAIL (all
 * fail deterministically — a real assertion/behavior diff), FLAKY (mixed), or
 * THROW (broken wiring — e.g. an unresolved {{var}}). Then it groups failures
 * by their offending step+reason so systemic issues (one app behavior breaking
 * many tests) are visible at a glance. Use this to size what's actually
 * executable BEFORE spending on a full run.
 *
 *   node experiments/stage10-oracle/sweep-tests.js --from reports/s10 --run 1 --n 3
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { cypressRwaWorkflowAdapter as adapter } from "../../adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function parseArgs(argv) {
  const a = { from: "reports/s10", run: 1, n: 3, doses: ["sparse", "rich"] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--from") a.from = argv[++i];
    else if (argv[i] === "--run") a.run = Number(argv[++i]);
    else if (argv[i] === "--n") a.n = Number(argv[++i]);
    else if (argv[i] === "--doses") a.doses = argv[++i].split(",");
  }
  return a;
}

function loadTests(from, dose, run) {
  const dir = join(SANDBOX_ROOT, from, dose, `run-${run}`, "tests");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")));
}

async function repeat(testCase, n) {
  const reps = [];
  for (let i = 0; i < n; i++) {
    await adapter.reset();
    try {
      reps.push(await adapter.testRunner(testCase));
    } catch (err) {
      reps.push({ pass: false, requests: [], output: `testRunner threw: ${err.message}` });
    }
  }
  return reps;
}

function firstFailReason(reps) {
  const f = reps.find((r) => !r.pass);
  if (!f) return "";
  const thrown = /testRunner threw: (.+)/.exec(f.output || "");
  if (thrown) return `THREW: ${thrown[1].slice(0, 80)}`;
  const q = (f.requests || []).find((x) => !x.ok);
  return q ? `${q.name}: ${(q.failures || [])[0] || "?"}`.slice(0, 100) : "(failed, no detail)";
}

function categorize(reps) {
  const threw = reps.filter((r) => /testRunner threw/.test(r.output || "")).length;
  if (threw > 0) return "THROW";
  const passes = reps.filter((r) => r.pass).length;
  if (passes === reps.length) return "PASS";
  if (passes === 0) return "FAIL";
  return "FLAKY";
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await (await adapter.run()).ready();
  const grouped = {};
  try {
    for (const dose of args.doses) {
      const tests = loadTests(args.from, dose, args.run);
      const rows = [];
      for (const tc of tests) {
        const reps = await repeat(tc, args.n);
        rows.push({ id: tc.id, cat: categorize(reps), reason: firstFailReason(reps) });
        process.stderr.write(".");
      }
      grouped[dose] = rows;
      process.stderr.write("\n");
    }
  } finally {
    await adapter.teardown();
  }

  for (const dose of args.doses) {
    const rows = grouped[dose] || [];
    const by = (c) => rows.filter((r) => r.cat === c).length;
    console.log(`\n================ ${dose} (${rows.length} tests, n=${args.n}) ================`);
    console.log(`PASS ${by("PASS")}   FAIL ${by("FAIL")}   FLAKY ${by("FLAKY")}   THROW ${by("THROW")}`);
    for (const cat of ["THROW", "FLAKY", "FAIL"]) {
      const items = rows.filter((r) => r.cat === cat);
      if (!items.length) continue;
      console.log(`\n  ${cat}:`);
      for (const r of items) console.log(`    ${r.id.padEnd(48)} ${r.reason}`);
    }
  }

  // Cross-dose pattern: most common failure reasons (systemic issues).
  const reasons = {};
  for (const dose of args.doses) for (const r of grouped[dose] || []) {
    if (r.cat === "FAIL" || r.cat === "THROW") {
      const key = r.reason.replace(/\d{3,}|[0-9a-f-]{8,}/g, "#"); // normalize ids/status noise
      reasons[key] = (reasons[key] || 0) + 1;
    }
  }
  const top = Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (top.length) {
    console.log("\n================ most common failure/throw patterns (systemic) ================");
    for (const [reason, count] of top) console.log(`  ${String(count).padStart(3)}×  ${reason}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
