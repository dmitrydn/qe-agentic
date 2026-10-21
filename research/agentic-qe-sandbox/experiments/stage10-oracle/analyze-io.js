/**
 * Stage 10 — I/O helpers around the pure analysis core: turn a finished run's
 * scorecard into a normalized record, build the arm-BLINDED adjudication
 * worksheet (+ its sealed key), and render the decision memo. Kept separate
 * from analyze.js (pure math) and run-experiment.js (imperative, live-only) so
 * these mappings are unit-testable against real fixtures.
 */

const REQ_ID_RE = /^(CYPRESS-RWA-[A-Z-]+-\d+)/;

/** Map a failing test id back to its requirement id (best-effort by prefix). */
export function requirementIdOf(testId) {
  const m = String(testId).match(REQ_ID_RE);
  return m ? m[1] : null;
}

/**
 * Normalize a finished run's scorecard.json into the record analyze.js expects.
 * `failingTestIds` (candidate FPs — tests that failed on the CLEAN app) and
 * `groundingRejections` come from the run's reports dir; the orchestrator
 * supplies them since scorecard.json alone doesn't enumerate clean-run failures.
 */
export function collectRun(dose, scorecard, { groundingRejections = 0, failingTestIds = [] } = {}) {
  const perRequirementFp = {};
  for (const tid of failingTestIds) {
    const rid = requirementIdOf(tid);
    if (rid) perRequirementFp[rid] = 1;
  }
  return {
    dose,
    fpRateRaw: Number(scorecard.falsePositiveRate ?? 0),
    groundingRejections,
    requirementsTotal: Number(scorecard.requirements?.total ?? 0),
    catchRate: Number(scorecard.catchRate ?? 0),
    defects: (scorecard.defects ?? []).map((d) => ({
      id: d.id,
      caught: !!d.caught,
      expectCaught: d.expectCaught,
    })),
    perRequirementFp,
    tests: scorecard.tests ?? null,
  };
}

/**
 * Build the blind adjudication worksheet. Each failure is labelled only by an
 * arm CODE (not "rich"/"sparse"); the code→dose mapping is returned separately
 * as the sealed key, so an adjudicator can classify real-bug vs spec-mismatch
 * without knowing which oracle dose produced the failure.
 *
 * @param {Array<{dose:string, runIndex:number, testId:string, detail?:string}>} entries
 * @param {{ armAssignment?: Record<string,string> }} [opts]
 */
export function buildBlindWorksheet(entries, { armAssignment } = {}) {
  const doses = [...new Set(entries.map((e) => e.dose))].sort();
  // default: randomize which dose is A vs B so order can't leak the mapping
  const assign = armAssignment ?? randomArmAssignment(doses);

  const rows = entries
    .map((e) => ({
      arm: assign[e.dose],
      requirement: requirementIdOf(e.testId) ?? "(unknown)",
      testId: e.testId,
      run: e.runIndex,
      detail: (e.detail ?? "").replace(/\s+/g, " ").trim(),
    }))
    .sort((a, b) =>
      a.requirement.localeCompare(b.requirement) || a.arm.localeCompare(b.arm) || a.run - b.run
    );

  const lines = [
    "# Stage 10 — blind FP adjudication worksheet",
    "",
    "Classify each failure as **real-bug** (the oracle correctly caught a genuine",
    "app defect), **spec-mismatch** (the oracle asserted something the app never",
    "promised — a true false positive), or **brittle** (over-specified/exact-match",
    "oracle). The arm column is a code; you do NOT know which oracle dose it is.",
    "Fill the `verdict` column, then hand back with the sealed key unopened.",
    "",
    "| arm | requirement | run | test id | failure detail | verdict |",
    "|-----|-------------|-----|---------|----------------|---------|",
    ...rows.map(
      (r) => `| ${r.arm} | ${r.requirement} | ${r.run} | ${r.testId} | ${r.detail || "(see run report)"} |  |`
    ),
    "",
    `_${rows.length} failures across ${doses.length} arms. Sealed key in worksheet-key.json._`,
  ];

  return { worksheetMd: lines.join("\n"), key: assign, rowCount: rows.length };
}

function randomArmAssignment(doses) {
  const codes = ["A", "B", "C", "D"];
  const shuffled = [...doses].sort(() => Math.random() - 0.5);
  const out = {};
  shuffled.forEach((d, i) => (out[d] = codes[i]));
  return out;
}

const pct = (x) => `${(x * 100).toFixed(1)}%`;
const call = (d) => `${d.call} (Δ=${(d.delta * 100).toFixed(1)}pt, band=±${(d.band * 100).toFixed(1)}pt)`;

/** Render the decision memo from analyzeExperiment() output. */
export function renderMemo(a, { n, slice } = {}) {
  const L = [];
  L.push("# Stage 10 — Oracle Content-Richness: decision memo");
  L.push("");
  L.push(`Paired dose experiment on Cypress RWA. N=${n ?? a.aggRich.n} runs/dose · slice=${slice ?? "—"} requirements.`);
  L.push(`FP and grounding-rejection reported PRE-adjudication; true-FP awaits the blind worksheet.`);
  L.push("");
  L.push(`## Verdict: **${a.overall}**`);
  L.push("");
  L.push("| metric | sparse (control) | rich (treatment) | call |");
  L.push("|--------|------------------|------------------|------|");
  L.push(`| FP rate (raw) | ${pct(a.aggSparse.fpRateRaw.mean)} | ${pct(a.aggRich.fpRateRaw.mean)} | ${call(a.decisions.fpRateRaw)} |`);
  L.push(`| grounding-rejection | ${pct(a.aggSparse.groundingRejectionRate.mean)} | ${pct(a.aggRich.groundingRejectionRate.mean)} | ${call(a.decisions.groundingRejectionRate)} |`);
  L.push(`| catch rate | ${pct(a.aggSparse.catchRate.mean)} | ${pct(a.aggRich.catchRate.mean)} | ${call(a.decisions.catchRate)} |`);
  L.push("");
  L.push("### Catch decomposition (auth-gate freebies vs value/shape)");
  L.push("| defect type | sparse | rich |");
  L.push("|-------------|--------|------|");
  L.push(`| auth-gate (structural) | ${pct(a.catch.sparse.authGate.mean)} | ${pct(a.catch.rich.authGate.mean)} |`);
  L.push(`| value/shape (the interesting ones) | ${pct(a.catch.sparse.valueShape.mean)} | ${pct(a.catch.rich.valueShape.mean)} |`);
  L.push("");
  L.push("### Paired per-requirement FP (Wilcoxon signed-rank)");
  L.push(`W=${a.wilcoxonFp.W}, z=${a.wilcoxonFp.z.toFixed(2)}, p=${a.wilcoxonFp.p.toFixed(3)}, non-zero pairs=${a.wilcoxonFp.n}`);
  L.push("");
  L.push("_Noise band = control (sparse) run-to-run range; deltas inside the band are null. Powered for moderate-to-large effects only (slice=24) — a null means no effect of at least that size._");
  return L.join("\n");
}
