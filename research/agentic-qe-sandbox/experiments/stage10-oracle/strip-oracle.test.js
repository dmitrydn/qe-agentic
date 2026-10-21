/**
 * Stage 10 — invariants that guarantee SPARSE is a clean, purely-subtractive
 * dose of RICH. If any of these fail, the dose contrast is compromised.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseHurl, isSetup, stripToSparse } from "./strip-oracle.js";

const here = dirname(fileURLToPath(import.meta.url));
const richDir = join(here, "rich");
const richFiles = readdirSync(richDir).filter((f) => f.endsWith(".hurl")).sort();

const ERROR_PRIMARY = new Set([
  "CYPRESS-RWA-CONTACTS-003.hurl",
  "CYPRESS-RWA-USERS-003.hurl",
  "CYPRESS-RWA-USERS-010.hurl",
  "CYPRESS-RWA-NOTIFICATIONS-004.hurl",
  "CYPRESS-RWA-TRANSACTIONS-010.hurl",
]);

test("all 24 RICH files are present", () => {
  assert.equal(richFiles.length, 24);
});

for (const f of richFiles) {
  const rich = readFileSync(join(richDir, f), "utf8");
  const richUnits = parseHurl(rich);
  const richHeadline = richUnits.find((u) => !isSetup(u));
  const { text, headline, keptRequests, assertCount } = stripToSparse(rich);
  const sparseUnits = parseHurl(text);

  test(`${f}: SPARSE carries zero value assertions`, () => {
    assert.equal(assertCount, 0, "SPARSE must have no jsonpath asserts");
    assert.ok(!/\[Asserts\]/.test(text), "SPARSE must have no [Asserts] section");
  });

  test(`${f}: SPARSE has exactly one headline (non-setup) request`, () => {
    const nonSetup = sparseUnits.filter((u) => !isSetup(u));
    assert.equal(nonSetup.length, 1, "exactly one headline request");
  });

  test(`${f}: SPARSE headline matches RICH headline (parity)`, () => {
    assert.equal(headline.method, richHeadline.method);
    assert.equal(headline.path, richHeadline.path);
    assert.equal(headline.status, richHeadline.status);
  });

  test(`${f}: every SPARSE request also appears in RICH (subset)`, () => {
    const richRequests = new Set(richUnits.map((u) => u.request));
    for (const r of keptRequests) assert.ok(richRequests.has(r), `orphan request: ${r}`);
  });

  test(`${f}: SPARSE drops all negative/error variants beyond the headline`, () => {
    const statuses = sparseUnits
      .map((u) => (u.status ? Number(u.status.match(/\d+/)[0]) : 0))
      .filter((s) => s >= 400);
    if (ERROR_PRIMARY.has(f)) {
      assert.equal(statuses.length, 1, "error-primary keeps exactly its one 4xx headline");
    } else {
      assert.equal(statuses.length, 0, "positive-primary keeps no 4xx blocks");
    }
  });
}

test("USERS-001 SPARSE keeps the 200 list but not the 401 auth case (by construction)", () => {
  const rich = readFileSync(join(richDir, "CYPRESS-RWA-USERS-001.hurl"), "utf8");
  const { text } = stripToSparse(rich);
  assert.ok(/GET \{\{host\}\}\/users\nHTTP 200/.test(text) || /GET \{\{host\}\}\/users\b/.test(text));
  assert.ok(!/HTTP 401/.test(text), "auth-gate negative must be absent from SPARSE");
});

test("CONTACTS-003 (error-primary) SPARSE keeps its 422 headline, still zero asserts", () => {
  const rich = readFileSync(join(richDir, "CYPRESS-RWA-CONTACTS-003.hurl"), "utf8");
  const { text, headline, assertCount } = stripToSparse(rich);
  assert.equal(headline.status, "HTTP 422");
  assert.equal(assertCount, 0);
});
