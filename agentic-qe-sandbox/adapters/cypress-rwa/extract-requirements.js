/**
 * Source B: "tests-as-requirements" — parses Cypress RWA's own
 * cypress/tests/api/*.spec.ts files into RawRequirementItem[].
 *
 * This is a lightweight line-scanner, not a full TS AST parser, but it reads
 * the real files on disk and reports real line numbers, so every emitted
 * traceability pointer is independently spot-checkable against the source.
 *
 * Pattern this relies on (true for every cypress/tests/api/*.spec.ts file in
 * this app as of inspection):
 *   describe("<Feature> API", ...) > context("<METHOD> <path>", ...) > it("<behavior>", ...)
 *   beforeEach() always does cy.task("db:seed") + cy.loginByApi(username)
 *   it() bodies call cy.request(METHOD, url) and assert expect(response.status).to.eq(N)
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DESCRIBE_RE = /^\s*describe\(\s*["'`]([^"'`]+)["'`]/;
const CONTEXT_RE = /^\s*context\(\s*["'`]([^"'`]+)["'`]/;
const IT_RE = /^\s*it\(\s*["'`]([^"'`]+)["'`]/;
const REQUEST_RE = /cy\.request\(\s*["'`]([A-Z]+)["'`]/;
const STATUS_RE = /expect\(response\.status\)\.to\.eq\((\d+)\)/;
const EXTRA_EXPECT_RE = /expect\([^)]*\)[.\w]*\([^;]*\);?/g;

const GIVEN_STEPS = [
  "the database has been seeded (cy.task(\"db:seed\"), backed by data/database-seed.json)",
  "the requesting client is authenticated as a seeded user via session-cookie login (cy.loginByApi)",
];

function blockBody(lines, startIdx, maxLookahead = 16) {
  const end = Math.min(lines.length, startIdx + maxLookahead);
  // Stop at the next it(/context(/describe( so a short test body never pulls
  // in assertions from the following sibling block (the fixed lookahead
  // alone over-reads past a one- or two-line it() body into whatever comes
  // next in the file).
  for (let i = startIdx + 1; i < end; i++) {
    if (IT_RE.test(lines[i]) || CONTEXT_RE.test(lines[i]) || DESCRIBE_RE.test(lines[i])) {
      return lines.slice(startIdx, i);
    }
  }
  return lines.slice(startIdx, end);
}

function extractFromFile(absPath, relPath, appName) {
  const content = readFileSync(absPath, "utf8");
  const lines = content.split("\n");

  const items = [];
  let currentFeature = null;
  let currentEndpoint = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const describeMatch = line.match(DESCRIBE_RE);
    if (describeMatch) {
      currentFeature = describeMatch[1].replace(/\s+API$/i, "");
      continue;
    }

    const contextMatch = line.match(CONTEXT_RE);
    if (contextMatch) {
      currentEndpoint = contextMatch[1];
      continue;
    }

    const itMatch = line.match(IT_RE);
    if (itMatch && currentFeature) {
      const title = itMatch[1];
      const lineNumber = i + 1;
      const body = blockBody(lines, i);
      const bodyText = body.join("\n");

      const requestMatch = bodyText.match(REQUEST_RE);
      const statusMatch = bodyText.match(STATUS_RE);
      // Every expect(...) assertion in the block, in source order, minus the
      // one already represented by statusMatch above — avoids emitting the
      // same status-code assertion twice and surfaces the *other* real
      // assertions (e.g. response-body shape) the previous single-match
      // version silently dropped whenever the status line matched first.
      const extraExpects = [...bodyText.matchAll(EXTRA_EXPECT_RE)]
        .map((m) => m[0].trim())
        .filter((text) => !STATUS_RE.test(text));

      const when = [];
      if (currentEndpoint) when.push(`a ${currentEndpoint} request is made`);
      when.push(title);

      const then = [];
      if (statusMatch) {
        then.push(`the response status is ${statusMatch[1]}`);
      } else {
        then.push("the request completes (see source for the exact assertion)");
      }
      for (const text of extraExpects) {
        then.push(`the response satisfies: \`${text}\``);
      }

      items.push({
        feature: currentFeature,
        title,
        given: [...GIVEN_STEPS],
        when,
        then,
        source: {
          app: appName,
          format: "ts-models+validators+cypress-specs",
          file: relPath,
          line: lineNumber,
          specId: currentEndpoint ?? (requestMatch ? requestMatch[1] : title),
        },
      });
    }
  }

  return items;
}

/**
 * @param {{ appRoot: string, appName: string }} opts
 * @returns {Promise<import('../../core/adapter/types.js').RawRequirementItem[]>}
 */
export async function extractCypressRwaRequirements({ appRoot, appName }) {
  const apiTestsDir = join(appRoot, "cypress/tests/api");
  const files = readdirSync(apiTestsDir).filter((f) => f.endsWith(".spec.ts"));

  const items = [];
  for (const file of files) {
    const absPath = join(apiTestsDir, file);
    const relPath = `cypress/tests/api/${file}`;
    items.push(...extractFromFile(absPath, relPath, appName));
  }
  return items;
}
