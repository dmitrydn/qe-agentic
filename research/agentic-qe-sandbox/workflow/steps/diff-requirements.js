/**
 * Requirement-change detection (deterministic, app-agnostic). Compares the
 * current requirement set against a stored manifest of per-requirement content
 * hashes and reports what is new / changed / removed — so a sync can regenerate
 * only the delta instead of the whole suite. Names no app and no framework;
 * lives under workflow/ on purpose so the import-boundary rule covers it.
 */
import { createHash } from "node:crypto";

// Stable, order-independent serialization so the hash depends on *content*,
// not on key ordering or incidental whitespace.
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, k) => {
        acc[k] = canonical(value[k]);
        return acc;
      }, {});
  }
  return value;
}

/**
 * Content hash of the parts of a requirement that, if changed, should force its
 * tests to be regenerated. Deliberately excludes `id` (the manifest key) and
 * `source` (provenance metadata) — only the testable substance counts.
 * @param {{ title?: string, userStory?: string, acceptanceCriteria?: string[], apiHints?: object[] }} req
 * @returns {string} hex sha256
 */
export function hashRequirement(req) {
  const subject = {
    title: req.title ?? "",
    userStory: req.userStory ?? "",
    acceptanceCriteria: req.acceptanceCriteria ?? [],
    apiHints: req.apiHints ?? [],
  };
  return createHash("sha256").update(JSON.stringify(canonical(subject))).digest("hex");
}

/**
 * Diff the current requirements against a manifest.
 *
 * Buckets: `added` (not in manifest), `changed` (hash differs), `removed` (in
 * manifest but gone), `gated` (testability-gate.md §8: the manifest's
 * separate `gated` map has a hash-matching entry — has no tests *by design*,
 * pending author clarification, so it must NOT read as `missing`/`added` and
 * get silently regenerated), and — for hash-matching, non-gated requirements
 * — either `missing` (no test currently exists on disk) or `unchanged`.
 * `missing` only appears when `coveredReqIds` is supplied: it closes the
 * blind spot where a matching hash but an empty/absent suite would otherwise
 * read as "in sync."
 *
 * A previously-gated requirement whose hash has since changed (the author
 * revised it) falls through to the normal added/changed logic below instead
 * of `gated` — that's "leaving the gated bucket" per the spec, and it gets
 * the full normal treatment (re-assessed if the gate is on) as if new.
 *
 * @param {{ requirements?: Record<string, { hash: string, testIds?: string[] }>,
 *           gated?: Record<string, { hash: string, verdict: string }> }} manifest
 * @param {Array<{ id: string }>} requirements
 * @param {Iterable<string>|null} [coveredReqIds] requirement ids that have >=1 persisted test
 * @returns {{ added: string[], changed: string[], missing: string[], removed: string[], unchanged: string[], gated: string[], hashes: Record<string,string> }}
 */
export function diffRequirements(manifest, requirements, coveredReqIds = null) {
  const prev = (manifest && manifest.requirements) || {};
  const prevGated = (manifest && manifest.gated) || {};
  const covered = coveredReqIds == null ? null : new Set(coveredReqIds);
  const hashes = {};
  const added = [];
  const changed = [];
  const missing = [];
  const unchanged = [];
  const gated = [];
  const currentIds = new Set();

  for (const req of requirements) {
    currentIds.add(req.id);
    const h = hashRequirement(req);
    hashes[req.id] = h;

    if (req.id in prevGated && prevGated[req.id].hash === h) {
      gated.push(req.id);
      continue;
    }

    if (!(req.id in prev)) {
      added.push(req.id);
    } else if (prev[req.id].hash !== h) {
      changed.push(req.id);
    } else if (covered && !covered.has(req.id)) {
      // hash matches, but the suite has no test for it -> backfill
      missing.push(req.id);
    } else {
      unchanged.push(req.id);
    }
  }

  // Union of both manifest maps: a gated requirement that disappears from
  // the source entirely must also be cleaned up (manifest.gated), not just
  // a requirement that had tests (manifest.requirements).
  const prevIds = new Set([...Object.keys(prev), ...Object.keys(prevGated)]);
  const removed = [...prevIds].filter((id) => !currentIds.has(id));
  return { added, changed, missing, removed, unchanged, gated, hashes };
}
