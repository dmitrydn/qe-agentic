/**
 * Resolve where the persisted test suite lives. One knob, honored everywhere
 * (workflow run, eval, triage battery, ops) so the acceptance gate can be
 * isolated to a throwaway directory and never clobber the durable regression
 * suite. App-agnostic — just path resolution.
 *
 * Precedence: explicit override (e.g. a --tests-dir flag) > GENERATED_TESTS_DIR
 * env var > the default "generated-tests". Relative values resolve against the
 * sandbox root; an absolute value is used as-is.
 */
import { join, isAbsolute } from "node:path";

export const DEFAULT_TESTS_DIR = "generated-tests";

/**
 * @param {string} sandboxRoot
 * @param {string} [override] e.g. a CLI --tests-dir value
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string} absolute path to the tests directory
 */
export function resolveTestsDir(sandboxRoot, override, env = process.env) {
  const dir = override ?? env.GENERATED_TESTS_DIR ?? DEFAULT_TESTS_DIR;
  return isAbsolute(dir) ? dir : join(sandboxRoot, dir);
}
