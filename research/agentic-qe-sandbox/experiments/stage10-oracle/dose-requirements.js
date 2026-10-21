/**
 * Stage 10 — dose requirement source.
 *
 * Loads one oracle dose ("rich" | "sparse") from
 * experiments/stage10-oracle/<dose>/*.hurl and turns each file into ONE core
 * Requirement (workflow/schemas/requirement.schema.json). Uses the full-fidelity
 * `parseHurl` (shared with the stripper) rather than the Conduit extractor,
 * because that extractor caps assertions at two per block and titles from the
 * first block — both of which would gut the RICH dose's oracle. Here EVERY
 * assertion of EVERY block becomes an acceptance-criterion, so the dose contrast
 * is faithful: a RICH file contributes its value assertions + negative cases,
 * the derived SPARSE file only its headline request + bare status.
 *
 * Runtime is unchanged and comes from the live cypress-rwa adapter (dose-adapter.js).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";
import { parseHurl, isSetup } from "./strip-oracle.js";
import { stripAllFromEnv } from "../../adapters/cypress-rwa/api-hints-policy.js";

const HERE = dirname(fileURLToPath(import.meta.url));
export const DOSES = ["rich", "sparse"];

const stripHash = (s) => (s || "").replace(/^#\s?/, "").trim();
const statusCodeOf = (unit) => (unit.status && unit.status.match(/\d+/)) ? unit.status.match(/\d+/)[0] : null;
const isAuthed = (unit) => unit.preStatus.some((l) => /^Authorization:/i.test(l));
const bodyOf = (unit) =>
  unit.preStatus.filter((l) => l.trim() !== "" && !/^[\w-]+:\s/.test(l)).join(" ").replace(/\s+/g, " ").trim();
const assertsOf = (unit) => unit.postStatus.map((l) => l.trim()).filter((l) => /^jsonpath\s/.test(l));

function fileToRequirement(id, text, { stripApiHints }) {
  const units = parseHurl(text);
  const headline = units.find((u) => !isSetup(u)) ?? units[0];

  const acceptanceCriteria = [
    "Given the cypress-rwa API under test, with an authenticated client unless a step says otherwise",
    // Ambient identity fixtures the harness injects (see ambient-fixtures.js).
    // Declared identically for BOTH doses (context, not oracle) so the generator
    // references them directly instead of fabricating extra requests to obtain
    // them — which is what broke the payment test.
    "Given these values are already provided and MUST be referenced directly (never fetched via an extra request): " +
      "{{user_id}} (the authenticated user's id), {{other_user_id}} (a different user's id), " +
      "{{other_user_email}} (that other user's email), {{unknown_id}} (a well-formed but non-existent id), " +
      "{{other_user_bank_account_id}} (a bank account owned by another user), {{token}} (auth)",
  ];
  for (const u of units) {
    const auth = isAuthed(u) ? "" : " (unauthenticated)";
    const body = bodyOf(u);
    acceptanceCriteria.push(`When ${u.method} ${u.path}${auth}${body ? ` with body ${body}` : ""}`);
    const sc = statusCodeOf(u);
    if (sc) acceptanceCriteria.push(`Then the response status is ${sc}`);
    for (const a of assertsOf(u)) acceptanceCriteria.push(`Then ${a}`);
  }

  const req = {
    id,
    title: stripHash(headline.title[0]) || id,
    acceptanceCriteria,
    source: { file: `${id}.hurl` },
  };
  if (!stripApiHints) req.apiHints = [{ method: headline.method, path: headline.path }];
  return req;
}

/**
 * @param {"rich"|"sparse"} dose
 * @param {{ stripApiHints?: boolean }} [opts] - defaults to the AQE_STRIP_APIHINTS env flag
 * @returns {Promise<object[]>} core Requirement objects (one per .hurl file)
 */
export async function loadDoseRequirements(dose, { stripApiHints = stripAllFromEnv() } = {}) {
  if (!DOSES.includes(dose)) {
    throw new Error(`unknown dose "${dose}" (expected one of ${DOSES.join(", ")})`);
  }
  const dir = join(HERE, dose);
  const files = readdirSync(dir).filter((f) => f.endsWith(".hurl")).sort();

  const requirements = files.map((f) => {
    const id = f.replace(/\.hurl$/, "");
    return fileToRequirement(id, readFileSync(join(dir, f), "utf8"), { stripApiHints });
  });
  return requirements;
}
