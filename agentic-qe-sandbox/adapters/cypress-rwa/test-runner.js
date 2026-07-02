/**
 * Executes a framework-neutral TestCase against the live cypress-rwa
 * backend using plain `fetch` (Node 22+ built-in) plus a small declarative
 * assertion helper for status/JSON-path checks. No extra test dependency —
 * the framework choice for *how* a TestCase is executed lives here, never in
 * the app-agnostic workflow/ core.
 */

export function getByJsonPath(root, path) {
  const cleaned = path.replace(/^\$\.?/, "");
  if (cleaned === "") return root;
  const tokens = cleaned.match(/[^.[\]]+/g) ?? [];
  let cur = root;
  for (const token of tokens) {
    if (cur == null) return undefined;
    cur = cur[/^\d+$/.test(token) ? Number(token) : token];
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

function checkJsonPathAssertion(body, assertion, failures, captures) {
  const { path, op } = assertion;
  const value = typeof assertion.value === "string" ? resolveTemplate(assertion.value, captures) : assertion.value;
  const actual = getByJsonPath(body, path);
  switch (op) {
    case "exists":
      if (actual === undefined) failures.push(`jsonPath ${path}: expected to exist, was undefined`);
      break;
    case "eq":
      if (normalizeNullish(actual) !== normalizeNullish(value))
        failures.push(`jsonPath ${path}: expected === ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`);
      break;
    case "neq":
      if (normalizeNullish(actual) === normalizeNullish(value))
        failures.push(`jsonPath ${path}: expected !== ${JSON.stringify(value)}, got ${JSON.stringify(actual)}`);
      break;
    case "gte":
      if (!(actual >= value)) failures.push(`jsonPath ${path}: expected >= ${value}, got ${JSON.stringify(actual)}`);
      break;
    case "lte":
      if (!(actual <= value)) failures.push(`jsonPath ${path}: expected <= ${value}, got ${JSON.stringify(actual)}`);
      break;
    case "isType":
      if (typeName(actual) !== value) failures.push(`jsonPath ${path}: expected type ${value}, got ${typeName(actual)}`);
      break;
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
  const resolvedParams = resolveTemplate(pathParams ?? {}, captures);
  return pathTemplate.replace(/\{(\w+)\}/g, (_, name) => {
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
export async function executeTestCase(testCase, { baseUrl, authContext }) {
  const captures = {};
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
