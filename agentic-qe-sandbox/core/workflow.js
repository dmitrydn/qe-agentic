/**
 * The app-agnostic workflow skeleton. This is the only file that ties
 * "adapters" and "normalizer" together, and it does so without importing
 * any app-specific module by name — adapters are passed in by the caller
 * (see ../requirements/build.js for the wiring that does name them, which is
 * the one place app identity is allowed to exist).
 */
import { assertImplementsAppAdapter } from "./adapter/types.js";
import { normalize, merge } from "./normalizer/normalize.js";
import { renderMarkdown } from "./normalizer/render-markdown.js";

/**
 * @param {import('./adapter/types.js').AppAdapter[]} adapters
 */
export async function buildUnifiedRequirements(adapters) {
  adapters.forEach(assertImplementsAppAdapter);

  const perAdapterNormalized = [];
  for (const adapter of adapters) {
    const descriptor = adapter.requirementsSource();
    const raw = await descriptor.extract();
    perAdapterNormalized.push(normalize(raw));
  }

  const unified = merge(...perAdapterNormalized);
  return { unified, markdown: renderMarkdown(unified) };
}

/**
 * Boots an app via its adapter, runs a callback against it, and always tears
 * down — app-agnostic lifecycle management for anything that implements
 * AppAdapter.
 * @param {import('./adapter/types.js').AppAdapter} adapter
 * @param {(ready: import('./adapter/types.js').ReadyResult) => Promise<void>} callback
 */
export async function withRunningApp(adapter, callback) {
  assertImplementsAppAdapter(adapter);
  const readyResult = await adapter.run();
  try {
    await adapter.seed();
    await callback(readyResult);
  } finally {
    await adapter.teardown();
  }
}
