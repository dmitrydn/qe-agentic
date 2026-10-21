import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkBoundaries } from "./check-boundaries.js";

function withTempRoot(fn) {
  const root = mkdtempSync(join(tmpdir(), "check-boundaries-test-"));
  try {
    return fn(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("checkBoundaries passes on a clean workflow/ tree", () => {
  withTempRoot((root) => {
    mkdirSync(join(root, "workflow"), { recursive: true });
    writeFileSync(join(root, "workflow", "ok.js"), "export const x = 1;\n");
    const { ok, violations } = checkBoundaries({ root, scanDirs: ["workflow"] });
    assert.equal(ok, true);
    assert.deepEqual(violations, []);
  });
});

test("checkBoundaries fails on an adapters/ import with file:line", () => {
  withTempRoot((root) => {
    mkdirSync(join(root, "workflow"), { recursive: true });
    writeFileSync(
      join(root, "workflow", "bad.js"),
      'import { x } from "../adapters/foo/bar.js";\n'
    );
    const { ok, violations } = checkBoundaries({ root, scanDirs: ["workflow"] });
    assert.equal(ok, false);
    assert.equal(violations.length, 1);
    assert.equal(violations[0].file, "workflow/bad.js");
    assert.equal(violations[0].line, 1);
    assert.equal(violations[0].rule, "no-adapter-import");
  });
});

test("checkBoundaries fails on a denylisted app/framework identifier", () => {
  withTempRoot((root) => {
    mkdirSync(join(root, "workflow"), { recursive: true });
    writeFileSync(join(root, "workflow", "leak.js"), "// uses cypress under the hood\nexport const x = 1;\n");
    const { ok, violations } = checkBoundaries({ root, scanDirs: ["workflow"] });
    assert.equal(ok, false);
    assert.equal(violations[0].line, 1);
    assert.equal(violations[0].rule, "no-app-identifier");
  });
});

test("checkBoundaries does not flag unrelated substrings (word boundary)", () => {
  withTempRoot((root) => {
    mkdirSync(join(root, "workflow"), { recursive: true });
    // "invite" contains "vite" as a substring but is not the framework.
    writeFileSync(join(root, "workflow", "fine.js"), "export const sendInvite = () => {};\n");
    const { ok } = checkBoundaries({ root, scanDirs: ["workflow"] });
    assert.equal(ok, true);
  });
});
