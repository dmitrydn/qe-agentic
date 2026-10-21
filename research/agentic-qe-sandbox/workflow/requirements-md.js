/**
 * Generic parser for the unified-requirements.md document format produced by
 * core/normalizer/render-markdown.js. Knows the *document structure* (##
 * Source / ### Feature / #### `id` — title / blockquote userStory / gherkin
 * fence / traceability line) but nothing about any particular app or
 * framework — that structure is the same regardless of which app the
 * requirements came from.
 */

const SOURCE_RE = /^## Source: (.+)$/;
const REQ_HEADER_RE = /^#### `([^`]+)` — (.+)$/;
const USER_STORY_RE = /^> (.+)$/;
const TRACEABILITY_RE = /^_Source: (.+?) \/ (.+?) — `([^`]+)`(?: \(`([^`]+)`\))?_$/;
const GHERKIN_LINE_RE = /^\s*(Given|When|Then|And)\s+(.+)$/;

/**
 * @param {string} markdown
 * @returns {Array<{ app: string, id: string, title: string, userStory: string,
 *   given: string[], when: string[], then: string[],
 *   source: { file: string, line?: number, specId?: string } }>}
 */
export function parseUnifiedRequirementsMarkdown(markdown) {
  const lines = markdown.split("\n");
  const records = [];
  let currentApp = null;
  let current = null;
  let section = null; // "given" | "when" | "then" while inside a gherkin fence
  let inFence = false;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "");

    const sourceMatch = line.match(SOURCE_RE);
    if (sourceMatch) {
      currentApp = sourceMatch[1].trim();
      continue;
    }

    const headerMatch = line.match(REQ_HEADER_RE);
    if (headerMatch) {
      if (current) records.push(current);
      current = {
        app: currentApp,
        id: headerMatch[1],
        title: headerMatch[2],
        userStory: "",
        given: [],
        when: [],
        then: [],
        source: { file: "" },
      };
      section = null;
      inFence = false;
      continue;
    }

    if (!current) continue;

    if (line === "```gherkin") {
      inFence = true;
      continue;
    }
    if (line === "```" && inFence) {
      inFence = false;
      continue;
    }
    if (inFence) {
      const gherkin = line.match(GHERKIN_LINE_RE);
      if (gherkin) {
        const [, keyword, text] = gherkin;
        if (keyword === "Given") section = "given";
        else if (keyword === "When") section = "when";
        else if (keyword === "Then") section = "then";
        // "And" keeps the current section
        if (section) current[section].push(text.trim());
      }
      continue;
    }

    const storyMatch = line.match(USER_STORY_RE);
    if (storyMatch && !current.userStory) {
      current.userStory = storyMatch[1].trim();
      continue;
    }

    const traceMatch = line.match(TRACEABILITY_RE);
    if (traceMatch) {
      const [, , , fileWithLine, specId] = traceMatch;
      const [file, lineNo] = splitFileLine(fileWithLine);
      current.source = { file, line: lineNo, specId };
    }
  }
  if (current) records.push(current);

  return records;
}

function splitFileLine(fileWithLine) {
  const idx = fileWithLine.lastIndexOf(":");
  if (idx === -1) return [fileWithLine, undefined];
  const maybeLine = fileWithLine.slice(idx + 1);
  if (!/^\d+$/.test(maybeLine)) return [fileWithLine, undefined];
  return [fileWithLine.slice(0, idx), Number(maybeLine)];
}

const METHOD_PATH_RE = /^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)$/;

/**
 * Best-effort apiHints extraction from a parsed record's specId (when it
 * follows the conventional "METHOD /path" form). Returns [] when it doesn't.
 */
function inferApiHints(record) {
  const match = record.source.specId?.match(METHOD_PATH_RE);
  if (!match) return [];
  return [{ method: match[1], path: match[2] }];
}

/**
 * Converts a parsed record into the Requirement shape
 * (workflow/schemas/requirement.schema.json). `extraApiHints`, when given,
 * are merged in (and take precedence) — this is where an adapter may supply
 * curated, app-specific field-level documentation beyond what the generic
 * markdown structure captures.
 * @param {ReturnType<typeof parseUnifiedRequirementsMarkdown>[number]} record
 * @param {Array<object>} [extraApiHints]
 */
export function toRequirement(record, extraApiHints) {
  const acceptanceCriteria = [
    ...record.given.map((g) => `Given ${g}`),
    ...record.when.map((w) => `When ${w}`),
    ...record.then.map((t) => `Then ${t}`),
  ];

  const apiHints = extraApiHints?.length ? extraApiHints : inferApiHints(record);

  return {
    id: record.id,
    title: record.title,
    userStory: record.userStory,
    acceptanceCriteria,
    source: {
      file: record.source.file,
      ...(record.source.line ? { ref: String(record.source.line) } : {}),
    },
    ...(apiHints.length ? { apiHints } : {}),
  };
}
