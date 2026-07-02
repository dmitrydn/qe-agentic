import { test } from "node:test";
import assert from "node:assert/strict";
import { render } from "./render.js";

test("render substitutes simple and nested variables", () => {
  const out = render("Hello {{name}}, id={{requirement.id}}", { name: "world", requirement: { id: "R-1" } });
  assert.equal(out, "Hello world, id=R-1");
});

test("render expands #each over a list with {{this}}", () => {
  const out = render("{{#each items}}- {{this}}\n{{/each}}", { items: ["a", "b"] });
  assert.equal(out, "- a\n- b\n");
});

test("render expands #each with {{this.field}}", () => {
  const out = render("{{#each items}}{{this.method}} {{this.path}};{{/each}}", {
    items: [{ method: "GET", path: "/x" }, { method: "POST", path: "/y" }],
  });
  assert.equal(out, "GET /x;POST /y;");
});

test("render #if only emits its body when the value is truthy", () => {
  const tpl = "{{#if flag}}shown{{/if}}";
  assert.equal(render(tpl, { flag: true }), "shown");
  assert.equal(render(tpl, { flag: false }), "");
  assert.equal(render(tpl, {}), "");
});

test("render #if treats an empty array as falsy", () => {
  const tpl = "{{#if items}}shown{{/if}}";
  assert.equal(render(tpl, { items: [] }), "");
  assert.equal(render(tpl, { items: ["x"] }), "shown");
});

test("render supports #if nested inside #each, scoped to `this`", () => {
  const tpl = "{{#each items}}{{this.method}}{{#if this.notes}} ({{this.notes}}){{/if}};{{/each}}";
  const out = render(tpl, { items: [{ method: "GET", notes: "n1" }, { method: "POST" }] });
  assert.equal(out, "GET (n1);POST;");
});

test("render leaves undefined variables as empty string", () => {
  assert.equal(render("[{{missing}}]", {}), "[]");
});
