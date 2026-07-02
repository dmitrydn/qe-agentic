/**
 * Prune-set computation (pure, app-agnostic). Given the persisted suite and a
 * requirement diff, decide which test files are now stale and should be removed:
 *   - tests for a REMOVED requirement      -> delete
 *   - tests for a CHANGED requirement      -> delete (they get regenerated fresh,
 *                                             which also clears any now-extra files)
 *   - tests whose requirement no longer exists at all (ORPHAN) -> delete
 * Everything else is kept. Returns data only; the caller does the deleting.
 */

/**
 * @param {{ persisted: Array<{ file: string, requirementId: string }>,
 *           changedIds: Iterable<string>, removedIds: Iterable<string>,
 *           currentReqIds: Iterable<string> }} opts
 * @returns {Array<{ file: string, requirementId: string, reason: string }>}
 */
export function computePruneSet({ persisted, changedIds, removedIds, currentReqIds }) {
  const changed = new Set(changedIds);
  const removed = new Set(removedIds);
  const current = new Set(currentReqIds);

  const out = [];
  for (const p of persisted) {
    const rid = p.requirementId;
    let reason = null;
    if (removed.has(rid)) reason = "removed requirement";
    else if (changed.has(rid)) reason = "changed requirement (replace)";
    else if (!current.has(rid)) reason = "orphan (no matching requirement)";
    if (reason) out.push({ file: p.file, requirementId: rid, reason });
  }
  return out;
}
