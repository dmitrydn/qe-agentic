/**
 * JSON extraction + ajv schema validation, generic — knows nothing about
 * QE/apps/frameworks. Used by llm-client.js to enforce structured-output
 * discipline on whatever the model returns.
 */
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true, strict: false });
const compiledCache = new Map();

function getValidator(schema) {
  const key = schema.$id ?? schema;
  let validate = compiledCache.get(key);
  if (!validate) {
    validate = (typeof key === "string" ? ajv.getSchema(key) : undefined) ?? ajv.compile(schema);
    compiledCache.set(key, validate);
  }
  return validate;
}

export class InvalidLlmJsonError extends Error {
  constructor(message, errors, raw) {
    super(message);
    this.name = "InvalidLlmJsonError";
    this.errors = errors;
    this.raw = raw;
  }
}

/** Extract the first JSON value (object or array) from a text blob. */
export function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through to brace/bracket scanning below
  }
  const firstObj = trimmed.indexOf("{");
  const firstArr = trimmed.indexOf("[");
  const candidates = [firstObj, firstArr].filter((i) => i >= 0);
  if (candidates.length === 0) {
    throw new InvalidLlmJsonError("No JSON object/array found in LLM response", [], text);
  }
  const start = Math.min(...candidates);
  const openChar = trimmed[start];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  // A brace/bracket that's *inside* a JSON string value (e.g. a finding that
  // quotes a code snippet like ".to.contain({") must not affect depth — only
  // structural braces outside of strings do. Track string state (and escaped
  // characters, so a literal `\"` doesn't end the string early) while scanning.
  for (let i = start; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (inString) {
      if (ch === "\\") i++; // skip the escaped character entirely (e.g. \", \\)
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
    } else if (ch === openChar) {
      depth++;
    } else if (ch === closeChar) {
      depth--;
      if (depth === 0) {
        const slice = trimmed.slice(start, i + 1);
        try {
          return JSON.parse(slice);
        } catch (e) {
          throw new InvalidLlmJsonError(`Found JSON-like span but it failed to parse: ${e.message}`, [], text);
        }
      }
    }
  }
  throw new InvalidLlmJsonError("Unterminated JSON object/array in LLM response", [], text);
}

/** @returns {{ valid: boolean, errors: object[] }} */
export function validateAgainstSchema(data, schema) {
  const validate = getValidator(schema);
  const valid = validate(data);
  return { valid, errors: valid ? [] : validate.errors };
}

export function formatAjvErrors(errors) {
  return errors.map((e) => `${e.instancePath || "<root>"} ${e.message}`).join("; ");
}
