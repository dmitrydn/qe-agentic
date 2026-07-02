#!/usr/bin/env node
/**
 * Import-boundary rule: keeps core/ and workflow/ app-agnostic on a standing
 * basis (replaces the stage-5 manual checksum check). Run via
 * `npm run check:boundaries`; wired into the default test/CI command.
 *
 * Fails (non-zero exit, prints offending file:line) if any scanned file:
 *   1. imports/requires from adapters/ or any app-specific module — the
 *      dependency direction must be one-way: adapters import from core,
 *      never the reverse.
 *   2. contains an app/framework identifier from the denylist below
 *      (case-insensitive).
 *
 * Scans: core/** and workflow/** (including workflow/prompts/**), since both
 * directories together make up "the core" referenced in docs/build-prompts/stage6-build-prompt.md.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname_ = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname_, "..");

// Single, obvious place to extend the denylist as new apps/frameworks are added.
export const DENYLIST = [
  "cypress",
  "conduit",
  "realworld",
  "openapi",
  "hurl",
  "playwright",
  "vite",
  "sequelize",
  "lowdb",
  "jwt",
  "supertest",
];

const SCAN_DIRS = ["core", "workflow"];
const SCAN_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".json", ".md"]);
const IMPORT_FROM_ADAPTERS_RE = /(?:from\s+["'][^"']*\/adapters\/|require\(\s*["'][^"']*\/adapters\/)/;

function listFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const abs = join(dir, entry);
    const st = statSync(abs);
    if (st.isDirectory()) {
      out.push(...listFiles(abs));
    } else if (SCAN_EXTENSIONS.has(extname(entry))) {
      out.push(abs);
    }
  }
  return out;
}

function denylistPattern() {
  const escaped = DENYLIST.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
}

/**
 * @returns {{ ok: boolean, violations: Array<{ file: string, line: number, rule: string, detail: string }> }}
 */
export function checkBoundaries({ root = ROOT, scanDirs = SCAN_DIRS } = {}) {
  const violations = [];
  const denyRe = denylistPattern();

  for (const dir of scanDirs) {
    const absDir = join(root, dir);
    for (const file of listFiles(absDir)) {
      const relFile = relative(root, file);
      const content = readFileSync(file, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, idx) => {
        if (IMPORT_FROM_ADAPTERS_RE.test(line)) {
          violations.push({
            file: relFile,
            line: idx + 1,
            rule: "no-adapter-import",
            detail: line.trim(),
          });
        }
        const denyMatch = line.match(denyRe);
        if (denyMatch) {
          violations.push({
            file: relFile,
            line: idx + 1,
            rule: "no-app-identifier",
            detail: `found denylisted term "${denyMatch[1]}" in: ${line.trim()}`,
          });
        }
      });
    }
  }

  return { ok: violations.length === 0, violations };
}

function main() {
  const { ok, violations } = checkBoundaries({});
  if (ok) {
    console.log("check-boundaries: OK — core/ and workflow/ are free of adapter imports and denylisted identifiers.");
    process.exit(0);
  }
  console.error(`check-boundaries: FAILED — ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.detail}`);
  }
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
