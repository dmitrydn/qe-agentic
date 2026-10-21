/**
 * The one place app identity is allowed to exist: this script names the two
 * concrete adapters and wires them into the app-agnostic core workflow to
 * produce requirements/unified-requirements.md.
 *
 * Run: node agentic-qe-sandbox/requirements/build.js
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildUnifiedRequirements } from "../core/workflow.js";
import { conduitAdapter } from "../adapters/conduit/adapter.js";
import { cypressRwaAdapter } from "../adapters/cypress-rwa/adapter.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { unified, markdown } = await buildUnifiedRequirements([conduitAdapter, cypressRwaAdapter]);

const outPath = join(__dirname, "unified-requirements.md");
writeFileSync(outPath, markdown);

const byApp = unified.reduce((acc, r) => {
  acc[r.source.app] = (acc[r.source.app] ?? 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${unified.length} unified requirements to ${outPath}`);
console.log("Per app:", byApp);
