/**
 * The requirements normalizer. Deliberately the most boring file in core/:
 * it has zero knowledge of any specific requirements-source format or tooling.
 * It only knows the generic RawRequirementItem shape (see ../adapter/types.js)
 * and turns a list of those into a UnifiedRequirement[] — assigning stable
 * IDs, guaranteeing every item has a user story and Gherkin acceptance
 * criteria, and preserving the traceability pointer untouched.
 *
 * Each new requirements format plugs in by having its adapter's
 * requirementsSource().extract() return RawRequirementItem[] — this file
 * never changes when that happens.
 */

function slug(text) {
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function synthesizeUserStory(item) {
  return `As a user of ${item.source.app}, I want "${item.title}" so that the ${item.feature} feature behaves as specified.`;
}

/**
 * @param {import('../adapter/types.js').RawRequirementItem[]} rawItems
 * @returns {Array<import('../adapter/types.js').RawRequirementItem & { id: string, userStory: string }>}
 */
export function normalize(rawItems) {
  const counters = new Map();

  return rawItems.map((item) => {
    if (!item.feature || !item.title || !item.source?.app || !item.source?.file) {
      throw new Error(
        `Malformed RawRequirementItem from ${item.source?.app ?? "unknown app"}: ` +
          `feature, title, and source.app/file are required. Got: ${JSON.stringify(item)}`
      );
    }
    if (!item.given?.length || !item.when?.length || !item.then?.length) {
      throw new Error(
        `RawRequirementItem "${item.title}" (${item.source.app}/${item.source.file}) is missing ` +
          `Given/When/Then steps — every unified requirement must carry acceptance criteria.`
      );
    }

    const counterKey = `${item.source.app}::${slug(item.feature)}`;
    const next = (counters.get(counterKey) ?? 0) + 1;
    counters.set(counterKey, next);
    const id = `${slug(item.source.app)}-${slug(item.feature)}-${String(next).padStart(3, "0")}`;

    return {
      ...item,
      id,
      userStory: item.userStory ?? synthesizeUserStory(item),
    };
  });
}

/**
 * Merge already-normalized requirement lists from multiple adapters into one
 * unified set. Purely mechanical concatenation + grouping — no app knowledge.
 * @param {Array<ReturnType<typeof normalize>>} normalizedLists
 */
export function merge(...normalizedLists) {
  return normalizedLists.flat();
}
