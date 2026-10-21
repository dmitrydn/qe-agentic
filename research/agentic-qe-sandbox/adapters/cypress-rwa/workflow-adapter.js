/**
 * The Stage-6 Adapter (workflow/adapter/contract.js) for cypress-rwa. Reuses
 * the existing stage-5 AppAdapter's run/seed/auth/teardown (see adapter.js)
 * and adds the two Stage-6-specific members: testRunner() and
 * faultInjector(). Also implements requirementsSource() per the Stage-6
 * Requirement shape (workflow/schemas/requirement.schema.json), parsed from
 * requirements/unified-requirements.md — the one other place (besides
 * requirements/build.js) where this app's identity is allowed to exist.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cypressRwaAdapter } from "./adapter.js";
import { executeTestCase } from "./test-runner.js";
import { createFaultInjector } from "./fault-injector.js";
import { buildAutoApiHintsBySpecId } from "./extract-api-hints.js";
import { buildGraphSideEffectsBySpecId } from "./graph-api-hints.js";
import { partitionByGrounding } from "./grounding.js";
import { resolveApiHints, stripAllFromEnv } from "./api-hints-policy.js";
import { buildAmbientFixtures } from "./ambient-fixtures.js";
import { parseUnifiedRequirementsMarkdown, toRequirement } from "../../workflow/requirements-md.js";

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname_, "../..");
const REPO_ROOT = join(SANDBOX_ROOT, "..");
const config = JSON.parse(readFileSync(join(__dirname_, "config.json"), "utf8"));
const UNIFIED_REQUIREMENTS_PATH = join(SANDBOX_ROOT, "requirements/unified-requirements.md");

/**
 * Mechanically extracted (see extract-api-hints.js), keyed by the same
 * "METHOD /path" specId the requirements markdown already records — this is
 * the default source of field-level apiHints for every requirement below
 * (Stage 6b, workstream A). It reads the app's real validators.ts + route
 * files + app.ts mount table; nothing here is hand-typed per requirement.
 */
const AUTO_API_HINTS = buildAutoApiHintsBySpecId({ appRoot: join(REPO_ROOT, config.appRoot) });

/**
 * Experiment arm `graph-L1` (default OFF). When `AQE_API_HINTS_MODE` ===
 * "graph-l1", each mechanically-extracted hint is augmented with a
 * deterministic, call-graph-derived side-effect note (see graph-api-hints.js),
 * keyed by "METHOD /path". Requires graph.json built once via
 * `graphify update <appRoot>/backend --no-cluster`. With the flag unset the
 * map is null and every hint below is byte-identical to the baseline, so the
 * acceptance gate is unaffected. This is the only knob the A/B toggles.
 */
const GRAPH_SIDE_EFFECTS =
  process.env.AQE_API_HINTS_MODE === "graph-l1"
    ? buildGraphSideEffectsBySpecId({ appRoot: join(REPO_ROOT, config.appRoot) })
    : null;

/**
 * Curated, app-specific notes that go BEYOND what AUTO_API_HINTS can derive
 * mechanically — business semantics not expressed in validators.ts's input
 * shape (e.g. the dollars-to-cents storage conversion, balance-crediting on
 * a completed payment). This map used to also carry plain method+path+auth
 * for three other requirements (USERS-001, TRANSACTIONS-001,
 * BANK-ACCOUNTS-001); those are now served entirely by AUTO_API_HINTS (see
 * VERIFICATION.md Stage 6b, workstream A) and were removed here on purpose —
 * do not re-add them; that would defeat the point of auto-extraction.
 * Curated by hand from the real backend source (database.ts) — describes
 * the documented, correct contract, never the seeded defects, which
 * Generate must never be told about.
 */
const CURATED_API_HINTS = {
  "CYPRESS-RWA-TRANSACTIONS-007": [
    {
      method: "GET",
      path: "/testData/users",
      notes:
        'Unauthenticated test-data endpoint. Returns { results: User[] } where each User has "id" (string) and "balance" (integer, in cents). Use two distinct entries from results as the sender and receiver.',
    },
    {
      method: "GET",
      path: "/bankAccounts",
      auth: "primaryUser",
      notes:
        'Authenticated as the sender. Returns { results: BankAccount[] }; use results[0].id as the payment\'s "source" bank account id.',
    },
    {
      method: "POST",
      path: "/transactions",
      auth: "primaryUser",
      notes:
        'Body: { "transactionType": "payment", "source": <bankAccountId>, "receiverId": <a different seeded user\'s id>, "description": <string>, "amount": <integer, dollars>, "privacyLevel": "public" }. ' +
        'On success: status 200, body.transaction.id is a string, body.transaction.status === "complete". ' +
        "Documented contract: the persisted/returned transaction.amount equals the submitted dollar amount multiplied by 100 (stored in cents) — assert this exactly. " +
        "Documented contract: on a completed payment, the sender's balance (via GET /testData/users) decreases and the receiver's balance increases, each by the payment amount in cents — capture both balances before and after and assert both deltas.",
    },
    {
      method: "POST",
      path: "/transactions",
      auth: "anonymous",
      notes:
        'Same body shape as above, sent with no authentication. Documented contract: unauthenticated requests to this endpoint must receive status 401.',
    },
  ],
};

async function waitForApiReady(apiBaseUrl, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${apiBaseUrl}/testData/users`);
      if (res.ok) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`cypress-rwa API did not become ready within ${timeoutMs}ms`);
}

/**
 * Precedence for a requirement's apiHints: curated (deep business-semantic
 * notes, hand-written, rare) > mechanically auto-extracted (method/path/
 * fields/auth, derived from real source, the default) > core's generic
 * method+path-only inference from the specId (toRequirement's fallback,
 * used only when neither of the above has anything — see VERIFICATION.md
 * Stage 6b for the list of requirements that land here).
 */
function apiHintsFor(record) {
  return resolveApiHints(record, {
    curatedMap: CURATED_API_HINTS,
    autoMap: AUTO_API_HINTS,
    graphSideEffects: GRAPH_SIDE_EFFECTS,
    stripAll: stripAllFromEnv(),
  });
}

/** Mirrors workflow/index.js's own `--out <dir>` parsing (default "reports") — duplicated here, adapter-local, because requirementsSource() takes no arguments and so has no other way to learn where this run writes its reports. */
function reportsDir() {
  const args = process.argv.slice(2);
  const i = args.indexOf("--out");
  const out = i !== -1 ? args[i + 1] : "reports";
  return join(SANDBOX_ROOT, out);
}

/**
 * Fix 1 (endpoint grounding gate, AQE_GROUNDING=1): writes one
 * clarifications/<id>.md per ungrounded requirement, same convention as the
 * testability gate's reports/clarifications/<id>.md (workflow/steps/report.js).
 */
function writeGroundingClarifications(ungrounded) {
  if (ungrounded.length === 0) return;
  const dir = join(reportsDir(), "clarifications");
  mkdirSync(dir, { recursive: true });
  for (const requirement of ungrounded) {
    const lines = [
      `# Clarification needed: ${requirement.id}`,
      "",
      `endpoint ${requirement.groundingEndpoint} not found in application route table; ` +
        `nearest real route: ${requirement.nearestRoute ?? "(none found)"}.`,
      "",
    ];
    writeFileSync(join(dir, `${requirement.id}.md`), lines.join("\n"));
  }
}

async function loadRequirements() {
  const markdown = readFileSync(UNIFIED_REQUIREMENTS_PATH, "utf8");
  const records = parseUnifiedRequirementsMarkdown(markdown);
  const built = records
    .filter((r) => r.app === config.id)
    .map((r) => toRequirement(r, apiHintsFor(r)));

  // Stage 10 (AQE_STRIP_APIHINTS): apiHintsFor already returns none, but core's
  // toRequirement backfills a bare method+path hint via inferApiHints. Drop the
  // whole apiHints field here (adapter-local, no core change) so each dose's
  // oracle is ONLY what its requirement carries. Applies to both return paths.
  const requirements = stripAllFromEnv()
    ? built.map(({ apiHints, ...rest }) => rest)
    : built;

  if (!process.env.AQE_GROUNDING) return requirements;

  const appRoot = join(REPO_ROOT, config.appRoot);
  const { grounded, ungrounded } = partitionByGrounding(requirements, { appRoot });
  rmSync(join(reportsDir(), "clarifications"), { recursive: true, force: true });
  writeGroundingClarifications(ungrounded);
  return grounded;
}

/** Maps an abstract actor name to concrete login credentials for this app. */
async function resolveActorCredentials(actor) {
  if (actor === "anonymous") return null;
  const usersRes = await fetch(`${config.baseUrls.api}/testData/users`);
  if (!usersRes.ok) throw new Error(`auth(): could not look up seeded users: HTTP ${usersRes.status}`);
  const { results } = await usersRes.json();
  if (actor === "primaryUser") return { username: results[0].username };
  if (actor === "secondaryUser") return { username: results[1].username };
  throw new Error(`Unknown actor "${actor}" — expected "anonymous" | "primaryUser" | "secondaryUser"`);
}

/**
 * Resolve ambient identity fixtures (user_id, other_user_id, unknown_id, …)
 * from seeded data so requirements referencing them via {{var}} execute.
 * Best-effort: any lookup that fails yields a partial set rather than throwing.
 */
async function resolveAmbientFixtures(actor) {
  let users = [];
  let bankAccounts = [];
  try {
    const usersRes = await fetch(`${config.baseUrls.api}/testData/users`);
    if (usersRes.ok) users = (await usersRes.json()).results ?? [];
    const baRes = await fetch(`${config.baseUrls.api}/testData/bankaccounts`);
    if (baRes.ok) bankAccounts = (await baRes.json()).results ?? [];
  } catch {
    /* partial fixtures are fine */
  }
  return buildAmbientFixtures({ actor, users, bankAccounts });
}

export const cypressRwaWorkflowAdapter = {
  name: config.id,

  requirementsSource: loadRequirements,

  // Stage 6 is API-level only (see docs/build-prompts/stage6-build-prompt.md scope), so
  // readiness only waits on the API port. The container's frontend (Vite,
  // port 3000) binds to loopback *inside* the container and is reachable
  // from Cypress running in-container, but not via Docker's host port
  // mapping — irrelevant here since nothing in this workflow talks to it.
  async run() {
    await cypressRwaAdapter.run();
    return { ready: () => waitForApiReady(config.baseUrls.api) };
  },
  seed: () => cypressRwaAdapter.seed(),
  reset: () => cypressRwaAdapter.reset(),

  async auth(actor) {
    const credentials = await resolveActorCredentials(actor);
    if (credentials === null) return {}; // anonymous: no auth headers
    const session = await cypressRwaAdapter.auth(credentials);
    return { headers: session.headers };
  },

  async testRunner(testCase) {
    const authContext = await this.auth(testCase.actor);
    const initialCaptures = await resolveAmbientFixtures(testCase.actor);
    return executeTestCase(testCase, { baseUrl: config.baseUrls.api, authContext, initialCaptures });
  },

  faultInjector(defectId) {
    return createFaultInjector(
      { containerName: config.containerName, apiBaseUrl: config.baseUrls.api },
      defectId
    );
  },

  teardown: () => cypressRwaAdapter.teardown(),
};
