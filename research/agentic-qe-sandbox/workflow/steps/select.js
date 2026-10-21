/**
 * SELECT (deterministic). Calls adapter.requirementsSource(), validates each
 * Requirement against the schema, applies the optional filter, and returns
 * the list. No app logic lives here — requirementsSource() is the adapter's
 * job; this step only validates and filters the shape it hands back.
 */
import { validateAgainstSchema, formatAjvErrors } from "../llm/json.js";
import requirementSchema from "../schemas/requirement.schema.json" with { type: "json" };

/**
 * @param {{ adapter: import('../adapter/contract.js').Adapter, filter?: { all?: boolean, ids?: string[] } }} opts
 * @returns {Promise<object[]>}
 */
export async function select({ adapter, filter }) {
  const requirements = await adapter.requirementsSource();

  requirements.forEach((req, idx) => {
    const { valid, errors } = validateAgainstSchema(req, requirementSchema);
    if (!valid) {
      throw new Error(
        `select(): requirement at index ${idx} (id=${req?.id ?? "?"}) failed schema validation: ${formatAjvErrors(errors)}`
      );
    }
  });

  if (!filter || filter.all || !filter.ids?.length) {
    return requirements;
  }

  const idSet = new Set(filter.ids);
  return requirements.filter((req) => idSet.has(req.id));
}
