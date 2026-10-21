/**
 * Source A: the formal realworld-spec requirements format — OpenAPI 3.1
 * contract + Hurl API assertions + Playwright E2E + SELECTORS.md.
 *
 * This extractor parses specs/api/hurl/*.hurl (the most literal,
 * machine-checkable acceptance-criteria source in that repo: each block is
 * already request -> expected status -> jsonpath assertions, which maps
 * almost directly onto Given/When/Then). It is a line-scanner against the
 * real files, not a hand-authored list, so every traceability pointer here
 * is independently spot-checkable.
 *
 * Conceptually this lives under adapters/conduit/ rather than its own
 * top-level adapter because realworld-spec *is* the Conduit app's
 * requirements format — even though Phase 2 only reads its artifacts and
 * does not run the live Conduit app (that's deferred; see DEFERRAL.md).
 *
 * Hurl block grammar this relies on (true for every specs/api/hurl/*.hurl
 * file in this repo as of inspection):
 *   # <comment title>
 *   <METHOD> {{host}}<path>
 *   [headers/body lines...]
 *   HTTP <status>
 *   [Asserts]
 *   jsonpath "..." ...
 *   jsonpath "..." ...
 *   [Captures]
 *   ...
 *   <blank line before next block>
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const TITLE_RE = /^#\s*(.+)$/;
const REQUEST_RE = /^(GET|POST|PUT|PATCH|DELETE)\s+\{\{host\}\}(\S*)/;
const STATUS_RE = /^HTTP\s+(\d+)/;
const ASSERT_RE = /^jsonpath\s+"([^"]+)"\s+(.+)$/;
const AUTH_HEADER_RE = /^Authorization:\s*Token/;

function featureFromFilename(filename) {
  const base = filename.replace(/\.hurl$/, "");
  const isError = base.startsWith("errors_");
  const name = isError ? base.replace(/^errors_/, "") : base;
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  return isError ? `${title} (errors)` : title;
}

function extractFromFile(absPath, relPath, appName) {
  const lines = readFileSync(absPath, "utf8").split("\n");
  const items = [];
  const feature = featureFromFilename(relPath.split("/").pop());

  let i = 0;
  while (i < lines.length) {
    const titleMatch = lines[i].match(TITLE_RE);
    if (!titleMatch) {
      i++;
      continue;
    }
    const title = titleMatch[1].trim();
    const titleLine = i + 1;

    // Find the request line (skip nothing in practice; it's the very next line).
    let j = i + 1;
    while (j < lines.length && !REQUEST_RE.test(lines[j]) && lines[j].trim() !== "") j++;
    const requestMatch = lines[j]?.match(REQUEST_RE);
    if (!requestMatch) {
      i++;
      continue;
    }
    const [, method, path] = requestMatch;

    let requiresAuth = false;
    let k = j + 1;
    while (k < lines.length && !STATUS_RE.test(lines[k])) {
      if (AUTH_HEADER_RE.test(lines[k])) requiresAuth = true;
      k++;
    }
    const statusMatch = lines[k]?.match(STATUS_RE);
    const status = statusMatch ? statusMatch[1] : null;

    const asserts = [];
    let m = k + 1;
    while (m < lines.length && lines[m].trim() !== "" && !TITLE_RE.test(lines[m])) {
      const assertMatch = lines[m].match(ASSERT_RE);
      if (assertMatch) asserts.push(`${assertMatch[1]} ${assertMatch[2]}`);
      m++;
    }

    const given = ["the Conduit/RealWorld API contract is reachable at {{host}}"];
    if (requiresAuth) given.push("the client holds a valid Token captured from a prior register/login call");

    const when = [`${method} ${path}`];

    const then = [];
    if (status) then.push(`the response status is ${status}`);
    asserts.slice(0, 2).forEach((a) => then.push(`jsonpath ${a}`));
    if (then.length === 0) then.push("the request completes (see source for the exact assertion)");

    items.push({
      feature,
      title,
      given,
      when,
      then,
      source: {
        app: appName,
        format: "openapi+hurl+playwright+selectors",
        file: relPath,
        line: titleLine,
        specId: `${method} ${path}`,
      },
    });

    i = m;
  }

  return items;
}

/**
 * @param {{ specRoot: string, appName: string }} opts
 * @returns {Promise<import('../../core/adapter/types.js').RawRequirementItem[]>}
 */
export async function extractConduitSpecRequirements({ specRoot, appName }) {
  const hurlDir = join(specRoot, "specs/api/hurl");
  const files = readdirSync(hurlDir).filter((f) => f.endsWith(".hurl"));

  const items = [];
  for (const file of files) {
    const absPath = join(hurlDir, file);
    const relPath = `specs/api/hurl/${file}`;
    items.push(...extractFromFile(absPath, relPath, appName));
  }
  return items;
}
