/**
 * graph-L1 apiHints augmenter for cypress-rwa — DETERMINISTIC, no LLM.
 *
 * The mechanical extractor (`extract-api-hints.js`) is intra-route: per
 * endpoint it knows method/path/auth and the express-validator field shapes,
 * but nothing about what the handler *does* to state. This module closes that
 * specific gap using the code knowledge graph that `graphify` builds from the
 * same backend source (AST + call-graph, all edges `EXTRACTED` — no inference,
 * no API key).
 *
 * Per endpoint it computes a side-effect summary by:
 *   1. slicing the handler's source block (reusing the route list that
 *      extract-api-hints.js already derives — method/path/file/line);
 *   2. finding which database.ts functions that block references (the graph's
 *      function nodes carry their real identifier in `label`, e.g.
 *      "createTransaction()");
 *   3. taking each referenced function's intra-file `calls` closure from the
 *      graph (so `createTransaction` -> debit/creditPayAppBalance, savePayApp-
 *      Balance, saveTransaction, ...);
 *   4. classifying the reachable functions into state mutations vs reads, with
 *      a special flag for pay-app balance mutations.
 *
 * The result is a Map<specId, string> of one extra sentence to append to that
 * endpoint's `apiHints.notes`. It is intentionally per-ENDPOINT, not per-file:
 * `POST /transactions` reaches balance debits/credits; `GET /transactions`
 * reaches only reads — so a GET is never mislabelled as mutating (which would
 * push the model toward wrong assertions and *raise* false positives).
 *
 * App-specific by design; lives in the adapter, never in core. Reads only the
 * deterministic graph — `confidence: "EXTRACTED"` edges — so there is no
 * hallucination surface here.
 *
 * PRECISION OVER RECALL (deliberate). A note is emitted ONLY when the handler's
 * call-graph closure positively reaches a persistence sink (`save*`) — i.e. the
 * graph *proves* a durable write. Endpoints where it does not are omitted
 * entirely; we never assert "read-only", because the deterministic call-graph
 * does NOT capture writes performed through inline lowdb chains
 * (`db.get(...).assign(...).write()`) or lodash `flow(...)` composition. Several
 * CRUD handlers (e.g. updateUserById, removeContactById) therefore have a
 * read-only closure in the graph even though they persist — so a "read-only"
 * claim would be wrong for them. The result: every emitted note is trustworthy
 * (high precision), at the cost of breadth (the rich, named-function flows like
 * the payment/balance path are covered; simple inline-write CRUD is not — that
 * gap is the argument for the LLM-inferred Layer 2).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { extractApiRoutes } from "./extract-api-hints.js";

const DB_FILE = "database.ts";

// We claim "mutates PERSISTED state" only when the handler's call-closure
// reaches a persistence sink. In this codebase every durable write goes through
// a `save*` function (saveUser, saveTransaction, savePayAppBalance, ...), so a
// reachable `save*` is the ground-truth signal. This deliberately excludes
// in-memory transforms whose name merely *looks* write-ish (e.g.
// `removeUserFromResults`, which filters a search result list and never
// persists) — flagging those would push the model toward wrong assertions and
// raise false positives, the exact thing per-endpoint precision is meant to
// avoid. Under-claiming (a real write missed because it bypasses `save*`) is
// the safer error here than over-claiming.
const WRITE_SINK_RE = /^save/i;
// Functions worth naming in the note once a real write is confirmed.
const MUTATION_PREFIX_RE = /^(save|create|update|delete|insert|debit|credit|reset|increment|decrement)/i;
const BALANCE_RE = /balance/i;

/** @returns {{ idToIdent: Map<string,string>, callsAdj: Map<string,string[]>, dbIdentToId: Map<string,string> }} */
function indexGraph(graph) {
  const idToIdent = new Map();
  const dbIdentToId = new Map();
  for (const node of graph.nodes ?? []) {
    // Function nodes label themselves like "createTransaction()"; file nodes
    // like "database.ts". Only the former carry a "(" — use that to pick out
    // callable symbols and recover their exact identifier.
    const label = typeof node.label === "string" ? node.label : "";
    const m = label.match(/^([A-Za-z_$][\w$]*)\s*\(/);
    if (!m) continue;
    const ident = m[1];
    idToIdent.set(node.id, ident);
    if (node.source_file === DB_FILE) dbIdentToId.set(ident, node.id);
  }
  const callsAdj = new Map();
  for (const edge of graph.links ?? []) {
    if (edge.relation !== "calls") continue;
    if (!callsAdj.has(edge.source)) callsAdj.set(edge.source, []);
    callsAdj.get(edge.source).push(edge.target);
  }
  return { idToIdent, callsAdj, dbIdentToId };
}

/** Breadth-first closure over `calls` edges, returning reachable node ids (excl. start). */
function callClosure(callsAdj, startId) {
  const seen = new Set();
  const stack = [...(callsAdj.get(startId) ?? [])];
  while (stack.length) {
    const id = stack.pop();
    if (seen.has(id)) continue;
    seen.add(id);
    for (const next of callsAdj.get(id) ?? []) if (!seen.has(next)) stack.push(next);
  }
  return seen;
}

/** Reads a route file and returns the source text of each route, keyed by `line`. */
function blocksByLine(appRoot, routes) {
  const byFile = new Map();
  for (const r of routes) {
    if (!byFile.has(r.file)) byFile.set(r.file, []);
    byFile.get(r.file).push(r);
  }
  const blockByKey = new Map(); // `${file}:${line}` -> source text
  for (const [file, rs] of byFile) {
    const lines = readFileSync(join(appRoot, file), "utf8").split("\n");
    const sorted = [...rs].sort((a, b) => a.line - b.line);
    for (let i = 0; i < sorted.length; i++) {
      const start = sorted[i].line - 1; // route.line is 1-based
      const end = i + 1 < sorted.length ? sorted[i + 1].line - 1 : lines.length;
      blockByKey.set(`${file}:${sorted[i].line}`, lines.slice(start, end).join("\n"));
    }
  }
  return blockByKey;
}

/**
 * Returns the side-effect sentence for a confirmed persisted write, or `null`
 * when the graph does not positively prove one (see "precision over recall" in
 * the module header — we stay silent rather than assert read-only).
 * @param {Set<string>} mutationIdents @param {boolean} touchesBalance @param {boolean} hasWriteSink
 */
function renderSideEffectNote(mutationIdents, touchesBalance, hasWriteSink) {
  if (!hasWriteSink || mutationIdents.size === 0) return null;
  const list = [...mutationIdents].sort().join(", ");
  let note = `Side-effects (call-graph): this handler mutates persisted state via ${list}.`;
  if (touchesBalance) {
    note +=
      " It changes user pay-app balance (debit/credit) — capture the relevant balances before and after and assert the deltas, not just the response body.";
  }
  return note;
}

/**
 * Build a Map of `specId` ("METHOD /path") -> one side-effect sentence to be
 * appended to that endpoint's apiHints.notes. Endpoints whose handler reaches
 * no database function are omitted (nothing useful to add).
 *
 * @param {{ appRoot: string, graphPath?: string }} opts
 *   appRoot   — the app root that extract-api-hints.js reads (contains backend/).
 *   graphPath — graph.json built by `graphify update <appRoot>/backend --no-cluster`
 *               (default: <appRoot>/backend/graphify-out/graph.json).
 * @returns {Map<string,string>}
 */
export function buildGraphSideEffectsBySpecId({ appRoot, graphPath }) {
  const resolvedGraphPath = graphPath ?? join(appRoot, "backend", "graphify-out", "graph.json");
  let graph;
  try {
    graph = JSON.parse(readFileSync(resolvedGraphPath, "utf8"));
  } catch (err) {
    throw new Error(
      `graph-L1 apiHints: could not read graph at ${resolvedGraphPath}. ` +
        `Build it first with: graphify update ${join(appRoot, "backend")} --no-cluster. ` +
        `(${err.message})`
    );
  }

  const { idToIdent, callsAdj, dbIdentToId } = indexGraph(graph);
  const routes = extractApiRoutes({ appRoot });
  const blocks = blocksByLine(appRoot, routes);

  // Pre-compile a matcher for each db identifier so we can detect references
  // inside a handler block by whole-word match (exact case, as written).
  const dbIdents = [...dbIdentToId.keys()];

  const out = new Map();
  for (const route of routes) {
    const block = blocks.get(`${route.file}:${route.line}`) ?? "";
    const referenced = dbIdents.filter((id) => new RegExp(`\\b${id}\\b`).test(block));

    const reachedMutations = new Set();
    let touchesBalance = false;
    let hasWriteSink = false;
    let anyDbReached = false;
    for (const ident of referenced) {
      anyDbReached = true;
      const startId = dbIdentToId.get(ident);
      const reachable = new Set([startId, ...callClosure(callsAdj, startId)]);
      for (const nodeId of reachable) {
        const fnIdent = idToIdent.get(nodeId);
        if (!fnIdent) continue;
        if (WRITE_SINK_RE.test(fnIdent)) hasWriteSink = true;
        if (MUTATION_PREFIX_RE.test(fnIdent)) {
          reachedMutations.add(fnIdent);
          if (BALANCE_RE.test(fnIdent)) touchesBalance = true;
        }
      }
    }

    if (!anyDbReached) continue;
    const note = renderSideEffectNote(reachedMutations, touchesBalance, hasWriteSink);
    if (note === null) continue; // emit only graph-proven writes
    out.set(`${route.method} ${route.path}`, note);
  }
  return out;
}
