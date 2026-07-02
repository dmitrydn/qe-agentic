/**
 * Mechanical (non-curated) field-level apiHints extractor for cypress-rwa.
 *
 * Reads the app's real backend contract — `backend/validators.ts` (the
 * express-validator field rules), every `backend/*-routes.ts` file (method +
 * path + per-route middleware chain), and `backend/app.ts` (the mount
 * table that turns each routes file into a top-level path prefix) — and
 * statically derives, per route: HTTP method, full path, whether
 * `ensureAuthenticated` gates it, and the request-body/query field names +
 * types pulled out of whichever `*Validator` middleware the route
 * registers. No hand-written per-requirement notes; if a route isn't found
 * by this static read, or a field's validator can't be resolved, it is
 * simply absent from the result — see `coverageReport()`.
 *
 * This is a line/regex scanner over real TypeScript source, not a TS
 * compiler — same tradeoff `extract-requirements.js` already makes for this
 * adapter, and good enough because express-validator's `body()`/`query()`/
 * `check()` calls are always simple, single-line-friendly call expressions
 * in this codebase.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const EXPORT_DECL_RE = /export const (\w+) =/g;
const FIELD_CALL_RE = /\b(body|query|check)\(\s*["'`]([^"'`]+)["'`]\s*\)((?:\s*\.[a-zA-Z]+\([^()]*\))*)/g;
const ROUTE_CALL_RE = /router\.(get|post|put|patch|delete)\(/g;
const VALIDATOR_IDENT_RE = /\b([a-zA-Z_]\w*Validator)\b/g;
const VALIDATE_MIDDLEWARE_CALL_RE = /\bvalidateMiddleware\(/g;
const IMPORT_RE = /import\s+(\w+)\s+from\s+["'`]\.\/([\w-]+)["'`]/g;
const MOUNT_RE = /app\.use\(\s*["'`](\/[\w]+)["'`]\s*,\s*(\w+)\s*\)/g;

// AQE_GROUNDING (Fix 2, enforcement-aware constraint extraction): a route may
// register a `*Validator` as bare middleware (its rules are declared but
// never enforced by validateMiddleware's checkResult()) alongside another
// `*Validator` actually wrapped in `validateMiddleware(...)`. Scanning the
// whole route block for VALIDATOR_IDENT_RE (the pre-fix behavior) credits
// both equally, so an unenforced validator's `.exists()` rules get reported
// as real constraints — the agent then writes a negative test that "fails"
// because the app never enforced the rule it never wrapped. Behind the flag,
// only identifiers inside a validateMiddleware(...) call's argument list
// count; default-off so baseline stays byte-identical. Read live (not cached
// at module load) so tests can toggle it per-case.
function groundingEnabled() {
  return Boolean(process.env.AQE_GROUNDING);
}

/** Text of every validateMiddleware(...) call's argument list in `block`, joined. */
function validateMiddlewareArgLists(block) {
  const argLists = [];
  VALIDATE_MIDDLEWARE_CALL_RE.lastIndex = 0;
  let m;
  while ((m = VALIDATE_MIDDLEWARE_CALL_RE.exec(block))) {
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    while (i < block.length && depth > 0) {
      if (block[i] === "(") depth++;
      else if (block[i] === ")") depth--;
      i++;
    }
    argLists.push(block.slice(start, i - 1));
  }
  return argLists.join(" ");
}

function describeChain(chain) {
  const optional = /\.optional\(/.test(chain);
  const arrLiteral = chain.match(/\.isIn\(\[([^\]]*)\]\)/);
  if (arrLiteral) {
    const values = arrLiteral[1]
      .split(",")
      .map((s) => s.replace(/["'`]/g, "").trim())
      .filter(Boolean);
    return { type: `enum(${values.join("|")})`, optional };
  }
  const genericIn = chain.match(/\.isIn\(([^)]*)\)/);
  if (genericIn) return { type: `enum(see ${genericIn[1].trim()})`, optional };
  if (/\.isNumeric\(/.test(chain)) return { type: "numeric", optional };
  if (/\.isBoolean\(/.test(chain)) return { type: "boolean", optional };
  if (/\.isURL\(/.test(chain)) return { type: "url(string)", optional };
  if (/\.isString\(/.test(chain)) return { type: "string", optional };
  if (/\.exists\(/.test(chain)) return { type: "any(must exist)", optional: false };
  if (/\.custom\(/.test(chain)) return { type: "custom-validated(see source)", optional };
  return { type: "unknown", optional };
}

/** @returns {Record<string, Array<{kind:string,name:string,type:string,optional:boolean}>>} */
function parseValidators(content) {
  const starts = [];
  let m;
  EXPORT_DECL_RE.lastIndex = 0;
  while ((m = EXPORT_DECL_RE.exec(content))) starts.push({ name: m[1], index: m.index });

  const map = {};
  for (let i = 0; i < starts.length; i++) {
    const begin = starts[i].index;
    const end = i + 1 < starts.length ? starts[i + 1].index : content.length;
    const block = content.slice(begin, end);
    const fields = [];
    FIELD_CALL_RE.lastIndex = 0;
    let fm;
    while ((fm = FIELD_CALL_RE.exec(block))) {
      const [, fn, name, chain] = fm;
      const kind = fn === "body" ? "body" : fn === "query" ? "query" : "field";
      fields.push({ kind, name, ...describeChain(chain) });
    }
    map[starts[i].name] = fields;
  }
  return map;
}

function parseRouteFile(content, relPath) {
  const matches = [];
  let m;
  ROUTE_CALL_RE.lastIndex = 0;
  while ((m = ROUTE_CALL_RE.exec(content))) matches.push({ method: m[1].toUpperCase(), index: m.index });

  const routes = [];
  for (let i = 0; i < matches.length; i++) {
    const begin = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    const block = content.slice(begin, end);
    const pathMatch = block.match(/router\.\w+\(\s*["'`]([^"'`]*)["'`]/);
    if (!pathMatch) continue;
    const lineNumber = content.slice(0, begin).split("\n").length;
    const authRequired = /\bensureAuthenticated\b/.test(block);
    const validatorScanText = groundingEnabled() ? validateMiddlewareArgLists(block) : block;
    const validatorRefs = [...new Set([...validatorScanText.matchAll(VALIDATOR_IDENT_RE)].map((mm) => mm[1]))];
    routes.push({
      method: matches[i].method,
      subpath: pathMatch[1],
      authRequired,
      validatorRefs,
      file: relPath,
      line: lineNumber,
    });
  }
  return routes;
}

const ROOT_MOUNT_RE = /app\.use\(\s*(\w+)\s*\)/g;

function parseAppMounts(content) {
  const fileByVar = {};
  for (const m of content.matchAll(IMPORT_RE)) fileByVar[m[1]] = m[2];
  const mountByFile = {};
  for (const m of content.matchAll(MOUNT_RE)) {
    const [, prefix, varName] = m;
    const file = fileByVar[varName];
    if (file) mountByFile[file] = prefix;
  }
  // app.use(someRouter) with no path prefix mounts at the root (e.g. `auth`,
  // which defines POST /login, POST /logout, GET /checkAuth) — only counts
  // when the bare identifier resolves to a file we actually imported as a
  // router; this naturally skips non-router single-arg calls like
  // app.use(passport.initialize()) since those aren't bare identifiers.
  for (const m of content.matchAll(ROOT_MOUNT_RE)) {
    const varName = m[1];
    const file = fileByVar[varName];
    if (file && !(file in mountByFile)) mountByFile[file] = "";
  }
  return mountByFile;
}

function joinPath(prefix, subpath) {
  const full = subpath === "/" ? prefix : `${prefix}${subpath}`;
  return full.replace(/\/{2,}/g, "/");
}

/**
 * @param {{ appRoot: string }} opts
 * @returns {Array<{method:string,path:string,authRequired:boolean,fields:Array,file:string,line:number}>}
 */
export function extractApiRoutes({ appRoot }) {
  const backendDir = join(appRoot, "backend");
  const validators = parseValidators(readFileSync(join(backendDir, "validators.ts"), "utf8"));
  const mountByFile = parseAppMounts(readFileSync(join(backendDir, "app.ts"), "utf8"));
  const filesOnDisk = new Set(readdirSync(backendDir));

  const routes = [];
  // Driven by app.ts's own mount table (router var -> file, file -> prefix),
  // not a filename convention — so a root-mounted file like auth.ts (no
  // "-routes" suffix) is included on the same footing as user-routes.ts.
  for (const [fileBase, mountPrefix] of Object.entries(mountByFile)) {
    const f = `${fileBase}.ts`;
    if (!filesOnDisk.has(f)) continue;
    const content = readFileSync(join(backendDir, f), "utf8");
    for (const r of parseRouteFile(content, `backend/${f}`)) {
      const fields = r.validatorRefs.flatMap((name) =>
        (validators[name] ?? []).map((field) => ({ ...field, validator: name }))
      );
      routes.push({
        method: r.method,
        path: joinPath(mountPrefix, r.subpath),
        authRequired: r.authRequired,
        fields,
        file: r.file,
        line: r.line,
      });
    }
  }
  return routes;
}

function renderFieldList(fields, kind) {
  const subset = fields.filter((f) => f.kind === kind);
  if (subset.length === 0) return null;
  return subset.map((f) => `${f.name} (${f.type}${f.optional ? ", optional" : ""})`).join(", ");
}

function renderNotes(route) {
  const parts = [`Auth: ${route.authRequired ? "required (ensureAuthenticated)" : "none"}.`];
  const bodyFields = renderFieldList(route.fields, "body");
  const queryFields = renderFieldList(route.fields, "query");
  const otherFields = renderFieldList(route.fields, "field");
  if (bodyFields) parts.push(`Request body fields: ${bodyFields}.`);
  if (queryFields) parts.push(`Query fields: ${queryFields}.`);
  if (otherFields) parts.push(`Other validated fields: ${otherFields}.`);
  parts.push(`Mechanically extracted from ${route.file}:${route.line} + backend/validators.ts.`);
  return parts.join(" ");
}

/**
 * Builds a `specId -> apiHint` map ("GET /users" -> {method,path,auth,notes})
 * for direct lookup against the same specId the cypress-rwa requirements
 * extractor already records (the `context("METHOD /path", ...)` title).
 * @param {{ appRoot: string }} opts
 * @returns {Map<string, {method:string, path:string, auth?:string, notes:string}>}
 */
export function buildAutoApiHintsBySpecId({ appRoot }) {
  const routes = extractApiRoutes({ appRoot });
  const map = new Map();
  for (const route of routes) {
    const specId = `${route.method} ${route.path}`;
    map.set(specId, {
      method: route.method,
      path: route.path,
      auth: route.authRequired ? "primaryUser" : "anonymous",
      notes: renderNotes(route),
    });
  }
  return map;
}

/**
 * Diagnostic helper (not used by the workflow at runtime): for a given list
 * of requirement specIds, reports which ones matched a mechanically
 * extracted route and which didn't (e.g. a spec's context() title disagrees
 * with the real route path — see VERIFICATION.md Stage 6b for examples).
 * @param {{ appRoot: string, specIds: string[] }} opts
 */
export function coverageReport({ appRoot, specIds }) {
  const hints = buildAutoApiHintsBySpecId({ appRoot });
  const matched = [];
  const unmatched = [];
  for (const specId of specIds) {
    if (hints.has(specId)) matched.push(specId);
    else unmatched.push(specId);
  }
  return { matched, unmatched, totalRoutesExtracted: hints.size };
}
