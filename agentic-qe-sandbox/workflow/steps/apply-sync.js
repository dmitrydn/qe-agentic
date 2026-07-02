/**
 * APPLY a requirement sync (orchestration; app-agnostic). Effects are injected
 * (generate / persist / remove / assess) so this is unit-testable with no LLM
 * and no filesystem. Order matters: prune stale files first, then regenerate
 * the added+changed requirements, then drop removed ones from the manifest.
 *
 * `effects.assess` is optional (testability-gate.md §7-8): when supplied
 * (the gate is on), every added/changed/missing requirement is assessed
 * before generation. A non-testable verdict is recorded under
 * `manifest.gated` instead of being generated — never silently retried next
 * sync while its hash is unchanged. Omitting `effects.assess` preserves the
 * exact pre-gate behavior (every caller before this gate existed).
 */

/**
 * @param {{ added: string[], changed: string[], missing?: string[], removed: string[],
 *           pruneSet: Array<{ file: string }>, hashes: Record<string,string>,
 *           requirementsById: Map<string, object>,
 *           prevManifest: { model?: string, requirements?: Record<string, object>, gated?: Record<string, object> },
 *           effects: { generate: (req:object)=>Promise<object[]>,
 *                      persist: (tc:object)=>void|Promise<void>,
 *                      remove: (file:string)=>void|Promise<void>,
 *                      assess?: (req:object)=>Promise<{ verdict: string }> } }} opts
 * @returns {Promise<{ manifest: object, summary: { regenerated: number, generatedTests: number, pruned: number, gated: number } }>}
 */
export async function applySync({ added, changed, missing = [], removed, pruneSet, hashes, requirementsById, prevManifest, effects }) {
  const manifest = {
    version: 1,
    model: prevManifest?.model,
    requirements: { ...(prevManifest?.requirements ?? {}) },
    gated: { ...(prevManifest?.gated ?? {}) },
  };

  // 1) prune stale files first (changed -> replaced below; removed/orphan -> gone)
  for (const p of pruneSet) await effects.remove(p.file);

  // 2) regenerate added + changed + missing; record the exact test ids
  const regenerate = [...added, ...changed, ...missing];
  let generatedTests = 0;
  let gatedCount = 0;
  for (const id of regenerate) {
    const requirement = requirementsById.get(id);
    // This id is being (re-)processed fresh — any prior gated verdict for it
    // (e.g. the author has since revised a previously-gated requirement) is
    // stale the moment we re-assess/regenerate, regardless of the outcome.
    delete manifest.gated[id];

    if (effects.assess) {
      const assessment = await effects.assess(requirement);
      if (assessment.verdict !== "testable") {
        manifest.gated[id] = { hash: hashes[id], verdict: assessment.verdict };
        gatedCount++;
        continue; // do NOT generate — input-quality gate (testability-gate.md)
      }
    }

    const testCases = await effects.generate(requirement);
    for (const tc of testCases) {
      await effects.persist(tc);
      generatedTests++;
    }
    manifest.requirements[id] = { hash: hashes[id], testIds: testCases.map((t) => t.id) };
  }

  // 3) removed requirements leave the manifest entirely
  for (const id of removed) {
    delete manifest.requirements[id];
    delete manifest.gated[id];
  }

  return {
    manifest,
    summary: { regenerated: regenerate.length - gatedCount, generatedTests, pruned: pruneSet.length, gated: gatedCount },
  };
}
