#!/usr/bin/env node
/**
 * Stage 10 — experiment orchestrator (LIVE: boots Docker + calls the LLM).
 *
 * For each dose (sparse first, so its run-to-run spread defines the noise band),
 * runs the full generate→run→triage→score loop N times with a fresh generate
 * each time, then the seeded-defect eval, into isolated per-run report dirs.
 * Aggregates every run's scorecard via the (unit-tested) pure analysis core and
 * emits: runs.json, analysis.json, decision-memo.md, and the arm-BLINDED
 * adjudication worksheet + sealed key.
 *
 *   set -a; source .env; set +a
 *   node experiments/stage10-oracle/run-experiment.js --runs 5 --out reports/s10 [--grounding]
 *
 * Cost/time: 2 doses × N × (generate+run+triage + eval). ~1M tokens/pass; needs
 * the cypress-rwa container up. The analysis/worksheet steps are pure and can be
 * re-run over an existing --out tree without re-spending (see --analyze-only).
 */
import { dirname, join, resolve, isAbsolute, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { loadConfig } from "../../workflow/config.js";
import { createLlmClient } from "../../workflow/llm/llm-client.js";
import { runCli } from "../../workflow/index.js";
import { runEval } from "../../eval/run-eval.js";
import { makeDoseAdapter } from "./dose-adapter.js";
import { loadDoseRequirements } from "./dose-requirements.js";
import { analyzeExperiment } from "./analyze.js";
import { collectRun, buildBlindWorksheet, requirementIdOf, renderMemo } from "./analyze-io.js";

const SANDBOX_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const DOSE_ORDER = ["sparse", "rich"]; // control first

function parseArgs(argv) {
  const a = { runs: 5, out: "reports/s10", grounding: false, analyzeOnly: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--runs") a.runs = Number(argv[++i]);
    else if (argv[i] === "--out") a.out = argv[++i];
    else if (argv[i] === "--grounding") a.grounding = true;
    else if (argv[i] === "--analyze-only") a.analyzeOnly = true;
    else if (argv[i] === "--force") a.force = true; // re-run even cached (completed) runs
  }
  return a;
}

const listMd = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")) : []);

/** Best-effort: candidate-FP failures + detail from a run's reports/defects dir. */
function readFailures(reportsDir) {
  const dir = join(reportsDir, "defects");
  return listMd(dir).map((f) => {
    const testId = f.replace(/\.md$/, "");
    let detail = "";
    try {
      detail = readFileSync(join(dir, f), "utf8").split("\n").slice(0, 8).join(" ");
    } catch {}
    return { testId, detail };
  });
}

function readRun(dose, i, reportsDir) {
  const scorecard = JSON.parse(readFileSync(join(reportsDir, "scorecard.json"), "utf8"));
  const groundingRejections = listMd(join(reportsDir, "clarifications")).length;
  const failures = readFailures(reportsDir);
  const run = collectRun(dose, scorecard, { groundingRejections, failingTestIds: failures.map((f) => f.testId) });
  const wsEntries = failures.map((f) => ({ dose, runIndex: i, testId: f.testId, detail: f.detail }));
  return { run, wsEntries };
}

async function runOneDoseRun(dose, i, { llm, config, outRoot, grounding, force }) {
  // runCli resolves --out/--tests-dir RELATIVE to sandboxRoot (reportsDir:
  // join(sandboxRoot, args.out)); pass relative paths to it, keep absolute
  // paths for our own fs ops and for runEval (which uses them directly).
  const relReports = join(outRoot, dose, `run-${i}`);
  const relTests = join(relReports, "tests");
  const reportsDir = join(SANDBOX_ROOT, relReports);
  const testsDir = join(SANDBOX_ROOT, relTests);

  // Resume: a completed run has a scorecard.json with catchRate (eval done).
  // Skip its (expensive) execution so a crash/re-run costs only unfinished work.
  const scPath = join(reportsDir, "scorecard.json");
  if (!force && existsSync(scPath) && JSON.parse(readFileSync(scPath, "utf8")).catchRate !== undefined) {
    console.error(`[s10] ${dose} run ${i}: cached — skipping (use --force to re-run)`);
    return readRun(dose, i, reportsDir);
  }

  mkdirSync(testsDir, { recursive: true });
  process.env.AQE_STRIP_APIHINTS = "1";
  if (grounding) process.env.AQE_GROUNDING = "1";

  const adapter = makeDoseAdapter(dose);
  console.error(`[s10] ${dose} run ${i}: generate+run+triage`);
  await runCli({ adapter, llm, config, argv: ["--all", "--out", relReports, "--tests-dir", relTests], sandboxRoot: SANDBOX_ROOT });
  console.error(`[s10] ${dose} run ${i}: seeded-defect eval`);
  await runEval({ adapter, config, generatedTestsDir: testsDir, reportsDir });
  await adapter.teardown();

  return readRun(dose, i, reportsDir);
}

function collectFromDisk(outRoot) {
  const runs = [];
  const wsEntries = [];
  for (const dose of DOSE_ORDER) {
    const base = join(SANDBOX_ROOT, outRoot, dose);
    if (!existsSync(base)) continue;
    for (const d of readdirSync(base).filter((x) => x.startsWith("run-")).sort()) {
      const reportsDir = join(base, d);
      const scPath = join(reportsDir, "scorecard.json");
      if (!existsSync(scPath)) continue;
      const i = Number(d.replace("run-", ""));
      const scorecard = JSON.parse(readFileSync(scPath, "utf8"));
      const failures = readFailures(reportsDir);
      runs.push(collectRun(dose, scorecard, {
        groundingRejections: listMd(join(reportsDir, "clarifications")).length,
        failingTestIds: failures.map((f) => f.testId),
      }));
      failures.forEach((f) => wsEntries.push({ dose, runIndex: i, testId: f.testId, detail: f.detail }));
    }
  }
  return { runs, wsEntries };
}

function writeOutputs(outRoot, runs, wsEntries, sliceIds, n) {
  const dir = join(SANDBOX_ROOT, outRoot);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "runs.json"), JSON.stringify(runs, null, 2));

  const analysis = analyzeExperiment(runs, sliceIds);
  writeFileSync(join(dir, "analysis.json"), JSON.stringify(analysis, null, 2));
  writeFileSync(join(dir, "decision-memo.md"), renderMemo(analysis, { n, slice: sliceIds.length }));

  const { worksheetMd, key } = buildBlindWorksheet(wsEntries);
  writeFileSync(join(dir, "worksheet.md"), worksheetMd);
  writeFileSync(join(dir, "worksheet-key.json"), JSON.stringify(key, null, 2));
  console.error(`[s10] verdict: ${analysis.overall} · outputs in ${outRoot}/`);
  return analysis;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  process.env.AQE_STRIP_APIHINTS = "1";
  // Keep --out relative to sandboxRoot (runCli joins it under sandboxRoot).
  const outRoot = isAbsolute(args.out) ? relative(SANDBOX_ROOT, args.out) : args.out;
  const sliceIds = (await loadDoseRequirements("sparse")).map((r) => r.id);

  if (args.analyzeOnly) {
    const { runs, wsEntries } = collectFromDisk(outRoot);
    writeOutputs(outRoot, runs, wsEntries, sliceIds, Math.round(runs.length / 2));
    return;
  }

  const config = loadConfig(process.env);
  const llm = createLlmClient(config);
  const runs = [];
  const wsEntries = [];
  for (const dose of DOSE_ORDER) {
    for (let i = 1; i <= args.runs; i++) {
      const { run, wsEntries: e } = await runOneDoseRun(dose, i, { llm, config, outRoot, grounding: args.grounding, force: args.force });
      runs.push(run);
      wsEntries.push(...e);
    }
  }
  writeOutputs(outRoot, runs, wsEntries, sliceIds, args.runs);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
