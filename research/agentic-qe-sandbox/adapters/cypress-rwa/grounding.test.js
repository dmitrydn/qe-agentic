/**
 * Hermetic test for the endpoint grounding gate (Fix 1, AQE_GROUNDING=1).
 * Builds the same Requirement records loadRequirements() would (minus the
 * curated/graph-L1 apiHints layering, irrelevant here), then checks
 * partitionByGrounding() against the real backend route table — no running
 * app, no LLM required.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseUnifiedRequirementsMarkdown, toRequirement } from "../../workflow/requirements-md.js";
import { partitionByGrounding } from "./grounding.js";

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname_, "../..");
const REPO_ROOT = join(SANDBOX_ROOT, "..");
const config = JSON.parse(readFileSync(join(__dirname_, "config.json"), "utf8"));
const appRoot = join(REPO_ROOT, config.appRoot);

const markdown = readFileSync(join(SANDBOX_ROOT, "requirements/unified-requirements.md"), "utf8");
const requirements = parseUnifiedRequirementsMarkdown(markdown)
  .filter((r) => r.app === config.id)
  .map((r) => toRequirement(r));

const { grounded, ungrounded } = partitionByGrounding(requirements, { appRoot });
const groundedIds = new Set(grounded.map((r) => r.id));
const ungroundedIds = new Set(ungrounded.map((r) => r.id));

console.log(
  `[grounding] ${ungrounded.length} ungrounded requirement(s): ` +
    ungrounded.map((r) => `${r.id} (${r.groundingEndpoint} -> nearest: ${r.nearestRoute})`).join("; ")
);

test("GET /bankTransfer (real route is /bankTransfers) is ungrounded", () => {
  assert.ok(ungroundedIds.has("CYPRESS-RWA-BANK-TRANSFER-001"));
});

test("POST /notifications (that prefix only serves GET/PATCH) is ungrounded", () => {
  assert.ok(ungroundedIds.has("CYPRESS-RWA-NOTIFICATIONS-002"));
});

test("a requirement backed by a real route stays grounded", () => {
  assert.ok(groundedIds.has("CYPRESS-RWA-BANK-ACCOUNTS-001"));
  assert.ok(!ungroundedIds.has("CYPRESS-RWA-BANK-ACCOUNTS-001"));
});

test("every ungrounded requirement carries a nearest-route suggestion", () => {
  for (const r of ungrounded) {
    assert.ok(r.groundingEndpoint, `${r.id} should record which endpoint it asserted`);
    assert.ok(r.nearestRoute, `${r.id} should carry a nearest real route`);
  }
});

test("grounded + ungrounded partition every requirement exactly once", () => {
  assert.equal(grounded.length + ungrounded.length, requirements.length);
  const seen = new Set([...groundedIds, ...ungroundedIds]);
  assert.equal(seen.size, requirements.length);
});
