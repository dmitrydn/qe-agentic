import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { resolveTestsDir, DEFAULT_TESTS_DIR } from "./tests-dir.js";

const ROOT = "/sandbox";

test("defaults to generated-tests under the sandbox root", () => {
  assert.equal(resolveTestsDir(ROOT, undefined, {}), join(ROOT, DEFAULT_TESTS_DIR));
});

test("env var overrides the default", () => {
  assert.equal(resolveTestsDir(ROOT, undefined, { GENERATED_TESTS_DIR: "generated-tests-gate" }), join(ROOT, "generated-tests-gate"));
});

test("explicit override beats env and default", () => {
  assert.equal(resolveTestsDir(ROOT, "custom-dir", { GENERATED_TESTS_DIR: "from-env" }), join(ROOT, "custom-dir"));
});

test("absolute paths are used as-is", () => {
  assert.equal(resolveTestsDir(ROOT, "/tmp/suite", {}), "/tmp/suite");
});
