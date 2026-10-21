/**
 * Stage 10 — SPARSE-dose derivation.
 *
 * Deterministically derives the SPARSE oracle dose from the frozen RICH set.
 * The experiment's independent variable is oracle *content richness*; SPARSE
 * must differ from RICH ONLY by carrying less oracle. So this transform is
 * purely SUBTRACTIVE and uniform:
 *
 *   - KEEP any leading setup/capture blocks (titled "Setup: ...") that precede
 *     the headline request. These are test *fixtures* (they capture ids/values
 *     the headline request needs to be executable), not oracle content — their
 *     [Captures] are kept, their [Asserts] are stripped.
 *   - KEEP the headline request (the first non-setup request block) reduced to
 *     request + bare `HTTP <status>` line. Its [Asserts] are stripped.
 *   - DROP everything else: every jsonpath assertion (value/shape oracle), every
 *     negative/error variant (401/403/404/422 blocks), and every side-effect
 *     verification block.
 *
 * Because the transform only ever *removes*, and removes the same categories
 * from every file, no knowledge of the seeded defects can leak into SPARSE
 * through it (see the Stage 10 spec, §5.1 and §7). This file may be authored by
 * a defect-aware party without compromising the experiment.
 *
 * Pure, dependency-free ESM. `node strip-oracle.js` regenerates ./sparse/*.hurl
 * from ./rich/*.hurl; the exports are unit-tested in strip-oracle.test.js.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const METHOD_RE = /^(GET|POST|PUT|PATCH|DELETE)\s+\{\{host\}\}(\S*)/;
const STATUS_RE = /^HTTP\s+(\d+)\b/;
const TITLE_RE = /^#\s?(.*)$/;

/**
 * Parse a .hurl document into request units delimited by METHOD lines.
 * Leading `#` comment lines attach as the title of the request that follows.
 * Everything between the METHOD line and the `HTTP` line is preStatus
 * (headers + body); everything after the `HTTP` line is postStatus
 * (`[Asserts]` / `[Captures]` / inline `#` assertion-group comments).
 *
 * @param {string} text
 * @returns {Array<{title:string[], request:string, method:string, path:string,
 *                   preStatus:string[], status:string|null, postStatus:string[]}>}
 */
export function parseHurl(text) {
  const lines = text.split("\n");
  const units = [];
  let cur = null;
  let phase = "preStatus"; // preStatus -> postStatus once HTTP seen
  let commentBuf = []; // `#` lines whose ownership isn't decided yet

  const flush = () => {
    if (cur) units.push(cur);
    cur = null;
  };
  const drainCommentsToCurrent = () => {
    if (cur && commentBuf.length) {
      (phase === "preStatus" ? cur.preStatus : cur.postStatus).push(...commentBuf);
    }
    commentBuf = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const method = line.match(METHOD_RE);
    if (method) {
      // Buffered comments immediately preceding a request are ITS title.
      flush();
      cur = {
        title: commentBuf,
        request: line,
        method: method[1],
        path: method[2],
        preStatus: [],
        status: null,
        postStatus: [],
      };
      commentBuf = [];
      phase = "preStatus";
      continue;
    }

    if (TITLE_RE.test(line)) {
      // Undecided: could be the next unit's title or an inline assert note.
      commentBuf.push(line);
      continue;
    }

    if (line.trim() === "") {
      // Blank ends any inline-note run; such comments belong to the current unit.
      drainCommentsToCurrent();
      continue;
    }

    // Substantive line: any pending comments were inline notes for this unit.
    if (!cur) {
      commentBuf = [];
      continue;
    }
    drainCommentsToCurrent();

    const status = line.match(STATUS_RE);
    if (status && cur.status === null) {
      cur.status = line;
      phase = "postStatus";
      continue;
    }
    (phase === "preStatus" ? cur.preStatus : cur.postStatus).push(line);
  }
  drainCommentsToCurrent();
  flush();
  return units;
}

/** A unit is a fixture/setup block iff its title begins with "Setup". */
export function isSetup(unit) {
  const first = (unit.title[0] || "").replace(/^#\s?/, "").trim();
  return /^setup\b/i.test(first);
}

/** Extract only the `[Captures]` section from a unit's postStatus lines. */
function capturesOnly(postStatus) {
  const out = [];
  let capturing = false;
  for (const line of postStatus) {
    if (/^\[Captures\]/.test(line)) {
      capturing = true;
      out.push(line);
      continue;
    }
    if (/^\[Asserts\]/.test(line)) {
      capturing = false;
      continue;
    }
    if (capturing && line.trim() !== "") out.push(line);
  }
  return out;
}

function serializeUnit(unit, { keepCaptures }) {
  const parts = [...unit.title, unit.request, ...unit.preStatus];
  if (unit.status) parts.push(unit.status);
  if (keepCaptures) parts.push(...capturesOnly(unit.postStatus));
  return parts.join("\n");
}

/**
 * Derive the SPARSE document from a RICH document.
 * @param {string} richText
 * @returns {{ text:string, headline:{method:string,path:string,status:string|null},
 *             keptRequests:string[], assertCount:number }}
 */
export function stripToSparse(richText) {
  const units = parseHurl(richText);
  const headlineIdx = units.findIndex((u) => !isSetup(u));
  if (headlineIdx === -1) {
    throw new Error("no non-setup (headline) request found");
  }

  const kept = [];
  for (let i = 0; i <= headlineIdx; i++) {
    const u = units[i];
    kept.push(serializeUnit(u, { keepCaptures: i < headlineIdx })); // setups keep captures
  }
  const text = kept.join("\n\n") + "\n";

  const headline = units[headlineIdx];
  const keptRequests = units.slice(0, headlineIdx + 1).map((u) => u.request);
  const assertCount = (text.match(/^\s*jsonpath\s/gm) || []).length;

  return {
    text,
    headline: { method: headline.method, path: headline.path, status: headline.status },
    keptRequests,
    assertCount,
  };
}

// ---- CLI: regenerate ./sparse from ./rich -------------------------------
function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const richDir = join(here, "rich");
  const sparseDir = join(here, "sparse");
  mkdirSync(sparseDir, { recursive: true });

  const files = readdirSync(richDir).filter((f) => f.endsWith(".hurl")).sort();
  let totalAsserts = 0;
  for (const f of files) {
    const rich = readFileSync(join(richDir, f), "utf8");
    const { text, assertCount, headline } = stripToSparse(rich);
    writeFileSync(join(sparseDir, f), text);
    totalAsserts += assertCount;
    console.log(`  ${f}: headline ${headline.method} ${headline.path} ${headline.status} · asserts=${assertCount}`);
  }
  console.log(`\nWrote ${files.length} SPARSE files. Total jsonpath asserts across SPARSE: ${totalAsserts} (must be 0).`);
  if (totalAsserts !== 0) {
    console.error("FAIL: SPARSE dose still carries value assertions.");
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
