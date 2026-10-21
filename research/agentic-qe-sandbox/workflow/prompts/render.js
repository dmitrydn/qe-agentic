/**
 * Minimal {{handlebars-style}} renderer for the app-agnostic prompt
 * templates in workflow/prompts/. Supports {{var}}, {{a.b.c}}, {{#each
 * list}}...{{/each}} (with {{this}}/{{this.field}} inside), and
 * {{#if cond}}...{{/if}}. Deliberately tiny — no app/framework knowledge,
 * just string substitution.
 */
const TAG_RE = /\{\{(#each|#if|\/each|\/if)?\s*([^}]*?)\s*\}\}/g;

function tokenize(template) {
  const tokens = [];
  let lastIndex = 0;
  let match;
  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(template))) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: template.slice(lastIndex, match.index) });
    }
    const [, kind, expr] = match;
    if (kind === "#each") tokens.push({ type: "each-open", path: expr.trim() });
    else if (kind === "#if") tokens.push({ type: "if-open", path: expr.trim() });
    else if (kind === "/each") tokens.push({ type: "each-close" });
    else if (kind === "/if") tokens.push({ type: "if-close" });
    else tokens.push({ type: "var", path: expr.trim() });
    lastIndex = TAG_RE.lastIndex;
  }
  if (lastIndex < template.length) {
    tokens.push({ type: "text", value: template.slice(lastIndex) });
  }
  return tokens;
}

function parseBlocks(tokens, start = 0) {
  const nodes = [];
  let i = start;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t.type === "each-close" || t.type === "if-close") {
      return { nodes, next: i + 1 };
    }
    if (t.type === "each-open") {
      const inner = parseBlocks(tokens, i + 1);
      nodes.push({ type: "each", path: t.path, body: inner.nodes });
      i = inner.next;
      continue;
    }
    if (t.type === "if-open") {
      const inner = parseBlocks(tokens, i + 1);
      nodes.push({ type: "if", path: t.path, body: inner.nodes });
      i = inner.next;
      continue;
    }
    nodes.push(t);
    i++;
  }
  return { nodes, next: i };
}

function get(context, path) {
  if (path === "this") return context.this;
  const parts = path.split(".");
  let cur = parts[0] === "this" ? context.this : context;
  const rest = parts[0] === "this" ? parts.slice(1) : parts;
  for (const part of rest) {
    if (cur == null) return undefined;
    cur = cur[part];
  }
  return cur;
}

function isTruthy(value) {
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
}

function renderNodes(nodes, context) {
  let out = "";
  for (const node of nodes) {
    if (node.type === "text") {
      out += node.value;
    } else if (node.type === "var") {
      const value = get(context, node.path);
      out += value === undefined || value === null ? "" : String(value);
    } else if (node.type === "each") {
      const list = get(context, node.path) ?? [];
      for (const item of list) {
        out += renderNodes(node.body, { ...context, this: item });
      }
    } else if (node.type === "if") {
      const value = get(context, node.path);
      if (isTruthy(value)) out += renderNodes(node.body, context);
    }
  }
  return out;
}

export function render(template, data) {
  const tokens = tokenize(template);
  const { nodes } = parseBlocks(tokens, 0);
  return renderNodes(nodes, { ...data, this: undefined });
}
