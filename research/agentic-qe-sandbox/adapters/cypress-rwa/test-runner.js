/**
 * Executes a framework-neutral TestCase against the live cypress-rwa
 * backend using plain `fetch` (Node 22+ built-in) plus a small declarative
 * assertion helper for status/JSON-path checks. No extra test dependency —
 * the framework choice for *how* a TestCase is executed lives here, never in
 * the app-agnostic workflow/ core.
 */

/**
 * Tokenize a JSONPath into key / index / filter segments. Supports:
 *   .field / [n] / [-n] (negative = from end) / ['key'] / [?(@.field OP value)]
 * enough of the grammar for the oracle assertions the generator emits.
 */
function tokenizeJsonPath(path) {
  const cleaned = path.replace(/^\$\.?/, "");
  const re = /\[\?\(([^)]*)\)\]|\[(-?\d+)\]|\['([^']*)'\]|\["([^"]*)"\]|([^.[\]]+)/g;
  const tokens = [];
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    if (m[1] !== undefined) tokens.push({ type: "filter", expr: m[1] });
    else if (m[2] !== undefined) tokens.push({ type: "index", value: Number(m[2]) });
    else tokens.push({ type: "key", value: m[3] ?? m[4] ?? m[5] });
  }
  return tokens;
}

function evalFilter(item, expr) {
  // expr like "@.requestStatus != 'pending'" or "@.amount == 1500"
  const m = expr.match(/^@\.([\w.[\]]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!m) return false;
  const [, field, op, rawVal] = m;
  const left = getByJsonPath(item, field);
  let right = rawVal.trim();
  if (/^'.*'$/.test(right) || /^".*"$/.test(right)) right = right.slice(1, -1);
  else if (/^-?\d+(\.\d+)?$/.test(right)) right = Number(right);
  switch (op) {
    case "==": return left == right; // eslint-disable-line eqeqeq -- cross-type by design
    case "!=": return left != right; // eslint-disable-line eqeqeq
    case ">=": return left >= right;
    case "<=": return left <= right;
    case ">": return left > right;
    case "<": return left < right;
    default: return false;
  }
}

export function getByJsonPath(root, path) {
  let cur = root;
  for (const tok of tokenizeJsonPath(path)) {
    if (cur == null) return undefined;
    if (tok.type === "key") cur = cur[tok.value];
    else if (tok.type === "index") cur = Array.isArray(cur) ? cur[tok.value < 0 ? cur.length + tok.value : tok.value] : undefined;
    else if (tok.type === "filter") cur = Array.isArray(cur) ? cur.filter((it) => evalFilter(it, tok.expr)) : undefined;
  }
  return cur;
}

function typeName(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

// JSON has no `undefined`, only `null` — so a TestCase asserting a field is
// absent (the JS/Chai idiom `expect(x).to.eq(undefined)`, which the real
// cypress-rwa spec for payment transactions actually uses for
// `transaction.requestStatus`) can only encode that as `value: null`. A
// missing key in the response body decodes to `actual === undefined` via
// getByJsonPath. Without this normalization, "eq(null)" against a
// genuinely-absent field would fail by strict `!==` even though the field
// being absent is exactly what was asserted — a false positive, not a real
// defect. Normalizing both sides treats "absent" and "explicitly null" as
// the same observable fact for eq/neq, while leaving every other value
// comparison exactly as strict as before.
function normalizeNullish(v) {
  return v === undefined ? null : v;
}

// Structural equality so an oracle asserting eq [] / eq {...} (e.g. a filter
// "no counter-example exists" check) compares by value, not reference. Reduces
// to strict === for primitives, so every existing comparison is unchanged.
function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]));
  }
  return false;
}

export function checkJsonPathAssertion(body, assertion, failures, captures) {
  const { path, op } = assertion;
  const value = typeof assertion.value === "string" ? resolveTemplate(assertion.value, captures) : assertion.value;
  const actual = getByJsonPath(body, path);
  switch (op) {
    case "exists":
      if (actual === undefined) failures.push(`jsonPath ${path}: expected to exist, was undefined`);
      break;
    case "eq":
      if (!deepEqual(normalizeNullish(actual), normalizeNullish(value)))
        failures.push(`jsonPath ${path}: expected === ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`);
      break;
    case "neq":
      if (deepEqual(normalizeNullish(actual), normalizeNullish(value)))
        failures.push(`jsonPath ${path}: expected !== ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`);
      break;
    case "gte":
      if (!(actual >= value)) failures.push(`jsonPath ${path}: expected >= ${value}, got ${JSON.stringify(actual)}`);
      break;
    case "lte":
      if (!(actual <= value)) failures.push(`jsonPath ${path}: expected <= ${value}, got ${JSON.stringify(actual)}`);
      break;
    case "isType": {
      // JSON has one numeric type; treat "integer" as number+Number.isInteger
      // so an oracle asserting an integer field isn't failed by JS calling
      // every number "number".
      const ok = value === "integer"
        ? typeof actual === "number" && Number.isInteger(actual)
        : typeName(actual) === value;
      if (!ok) failures.push(`jsonPath ${path}: expected type ${value}, got ${typeName(actual)}`);
      break;
    }
    default:
      failures.push(`jsonPath ${path}: unknown op "${op}"`);
  }
}

/**
 * Deep-substitutes "{{name}}" tokens (whole-string match preserves type;
 * partial match stringifies). Also supports a simple arithmetic form,
 * "{{name +/- number}}", so an assertion can check a captured numeric value
 * shifted by a known delta (e.g. a balance after debit/credit) without a
 * full expression language.
 */
export function resolveTemplate(value, captures) {
  if (typeof value === "string") {
    const arithMatch = value.match(/^\{\{(\w+)\s*([+-])\s*(\d+(?:\.\d+)?)\}\}$/);
    if (arithMatch) {
      const [, name, op, amount] = arithMatch;
      const base = Number(captures[name]);
      const delta = Number(amount) * (op === "-" ? -1 : 1);
      return base + delta;
    }
    const wholeMatch = value.match(/^\{\{(\w+)\}\}$/);
    if (wholeMatch) return captures[wholeMatch[1]];
    return value.replace(/\{\{(\w+)\}\}/g, (_, name) => String(captures[name] ?? ""));
  }
  if (Array.isArray(value)) return value.map((v) => resolveTemplate(v, captures));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveTemplate(v, captures)]));
  }
  return value;
}

export function buildPath(pathTemplate, pathParams, captures) {
  // First resolve any {{capture}} references embedded in the path itself
  // (the generator sometimes emits the requirement's Hurl-style {{var}} straight
  // into the pathTemplate). resolveTemplate handles {{name}} and {{name +/- n}}
  // from captures — the same map used for bodies/queries/headers — so an
  // authenticated-identity fixture like {{user_id}} resolves here too.
  const resolvedTemplate = resolveTemplate(pathTemplate, captures);
  const resolvedParams = resolveTemplate(pathParams ?? {}, captures);
  return resolvedTemplate.replace(/\{(\w+)\}/g, (_, name) => {
    if (!(name in resolvedParams)) throw new Error(`Missing pathParam "${name}" for template "${pathTemplate}"`);
    return encodeURIComponent(resolvedParams[name]);
  });
}

export function buildQueryString(query, captures) {
  if (!query) return "";
  const resolved = resolveTemplate(query, captures);
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(resolved)) params.append(k, v);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * @param {object} testCase
 * @param {{ baseUrl: string, authContext: { headers?: object } }} ctx
 * @returns {Promise<import('../../workflow/adapter/contract.js').RunResult>}
 */
export async function executeTestCase(testCase, { baseUrl, authContext, initialCaptures }) {
  // Ambient fixtures (authenticated user id, a second user, a non-existent id,
  // etc.) are seeded here so tests that reference them via {{var}} resolve —
  // the same role auth headers play, but for identity/context values. Empty by
  // default, so nothing changes for callers that don't pass them.
  const captures = { ...(initialCaptures ?? {}) };
  const requestResults = [];
  const logLines = [];
  let overallPass = true;

  for (const reqSpec of testCase.requests) {
    const failures = [];
    const path = buildPath(reqSpec.pathTemplate, reqSpec.pathParams, captures);
    const qs = buildQueryString(reqSpec.query, captures);
    const url = `${baseUrl}${path}${qs}`;
    const headers = {
      "Content-Type": "application/json",
      ...(authContext.headers ?? {}),
      ...resolveTemplate(reqSpec.headers ?? {}, captures),
    };
    const body = reqSpec.body !== undefined ? resolveTemplate(reqSpec.body, captures) : undefined;

    let res;
    let json;
    let text;
    try {
      res = await fetch(url, {
        method: reqSpec.method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
      text = await res.text();
      try {
        json = text ? JSON.parse(text) : undefined;
      } catch {
        json = undefined;
      }
    } catch (err) {
      failures.push(`request error: ${err.message}`);
      requestResults.push({ name: reqSpec.name, status: 0, ok: false, failures });
      logLines.push(`${reqSpec.method} ${url} -> ERROR ${err.message}`);
      overallPass = false;
      break;
    }

    const expect = reqSpec.expect ?? {};
    if (typeof expect.status === "number" && res.status !== expect.status) {
      failures.push(`status: expected ${expect.status}, got ${res.status}`);
    }
    if (Array.isArray(expect.statusIn) && !expect.statusIn.includes(res.status)) {
      failures.push(`status: expected one of [${expect.statusIn.join(", ")}], got ${res.status}`);
    }
    for (const assertion of expect.jsonPath ?? []) {
      checkJsonPathAssertion(json, assertion, failures, captures);
    }

    if (reqSpec.capture) {
      for (const [localName, jsonPath] of Object.entries(reqSpec.capture)) {
        captures[localName] = getByJsonPath(json, jsonPath);
      }
    }

    const ok = failures.length === 0;
    if (!ok) overallPass = false;
    requestResults.push({ name: reqSpec.name, status: res.status, ok, failures });
    logLines.push(
      `${reqSpec.method} ${url} -> ${res.status}${ok ? " OK" : ` FAILURES: ${failures.join("; ")}`}\nbody: ${text?.slice(0, 2000)}`
    );

    if (!ok) break; // later requests likely depend on this one's captures
  }

  return { pass: overallPass, requests: requestResults, output: logLines.join("\n") };
}
