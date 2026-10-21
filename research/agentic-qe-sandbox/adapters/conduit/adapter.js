/**
 * Conduit adapter — STUB. Phase 3 of the sandbox plan defers standing up a
 * second live runtime; see DEFERRAL.md for why and what to do when it's
 * actually needed.
 *
 * requirementsSource() is real and working today: realworld-spec's artifacts
 * (the formal requirements format, Source A) are read from disk regardless
 * of whether the Conduit app itself is running, which is exactly the
 * decoupling this sandbox is built to prove. run()/seed()/auth()/teardown()
 * are NotImplementedError stubs — present so this object satisfies the
 * AppAdapter shape, deliberately not working so nobody calls them by accident
 * and gets a silent no-op.
 */
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";
import { NotImplementedError } from "../../core/adapter/types.js";
import { extractConduitSpecRequirements } from "./extract-requirements.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname, "../../..");
const config = JSON.parse(readFileSync(join(__dirname, "config.json"), "utf8"));

export const conduitAdapter = {
  id: config.id,

  async run() {
    throw new NotImplementedError(
      this.id,
      "run",
      "Conduit runtime is deferred — see adapters/conduit/DEFERRAL.md."
    );
  },

  async seed() {
    throw new NotImplementedError(this.id, "seed", "Conduit runtime is deferred.");
  },

  async reset() {
    throw new NotImplementedError(this.id, "reset", "Conduit runtime is deferred.");
  },

  async auth() {
    throw new NotImplementedError(
      this.id,
      "auth",
      "Conduit uses JWT auth once live — see DEFERRAL.md. Not implemented yet."
    );
  },

  requirementsSource() {
    return {
      format: config.requirements.format,
      rootDir: join(SANDBOX_ROOT, config.specRoot),
      extract: () =>
        extractConduitSpecRequirements({
          specRoot: join(SANDBOX_ROOT, config.specRoot),
          appName: config.id,
        }),
    };
  },

  async teardown() {
    throw new NotImplementedError(this.id, "teardown", "Conduit runtime is deferred.");
  },
};
