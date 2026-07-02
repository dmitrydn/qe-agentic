/**
 * The seeded-defect catalog, re-exported from where the patch mechanics
 * actually live (the adapter knows the backend source layout; eval/ just
 * needs the list of ids+descriptions to drive the scoring harness). Single
 * source of truth — no duplicated defect definitions.
 */
export { DEFECT_CATALOG } from "../adapters/cypress-rwa/fault-injector.js";
