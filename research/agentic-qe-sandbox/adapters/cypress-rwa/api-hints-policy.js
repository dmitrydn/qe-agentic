/**
 * Pure policy for choosing a requirement's apiHints. Extracted from
 * workflow-adapter.js so it is testable without triggering that module's
 * heavy app-tree extraction at import.
 *
 * Precedence (unchanged from the original apiHintsFor):
 *   stripAll  -> none (Stage 10 experiment control; see below)
 *   curated   -> hand-written business-semantic notes, when present
 *   auto      -> mechanically extracted method/path/fields/auth
 *   (+graph)  -> auto augmented with call-graph side-effects, when enabled
 *   else      -> undefined (core's generic inference takes over)
 *
 * Stage 10 (AQE_STRIP_APIHINTS): the oracle-content-richness experiment must
 * measure the requirement's OWN oracle, not hand-curated or auto-extracted
 * field hints layered on top. `stripAll` returns undefined for BOTH curated
 * and auto hints so each dose stands on its own oracle only. Stripping just
 * the curated map would leak the auto hints as a third oracle source.
 */

/**
 * @param {{ id: string, source?: { specId?: string } }} record
 * @param {{ curatedMap: Record<string, any>, autoMap: Map<string, any>,
 *           graphSideEffects?: Map<string, string>|null, stripAll?: boolean }} opts
 * @returns {any[]|undefined}
 */
export function resolveApiHints(record, { curatedMap, autoMap, graphSideEffects, stripAll }) {
  if (stripAll) return undefined;

  const curated = curatedMap[record.id];
  if (curated) return curated;

  const auto = record.source?.specId ? autoMap.get(record.source.specId) : undefined;
  if (!auto) return undefined;

  if (graphSideEffects) {
    const fx = graphSideEffects.get(`${auto.method} ${auto.path}`);
    if (fx) return [{ ...auto, notes: auto.notes ? `${auto.notes} ${fx}` : fx }];
  }
  return [auto];
}

/** Whether the Stage 10 apiHints-strip experiment flag is set. */
export function stripAllFromEnv(env = process.env) {
  return !!env.AQE_STRIP_APIHINTS;
}
