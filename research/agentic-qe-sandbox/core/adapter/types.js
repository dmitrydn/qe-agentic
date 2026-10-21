/**
 * The app-agnostic adapter contract. Every app the agentic-QE core targets
 * (every onboarded app) implements this shape. The
 * core only ever talks to apps through these six methods — it never imports
 * an app-specific module directly.
 *
 * @typedef {Object} ReadyResult
 * @property {Record<string,string>} baseUrls - e.g. { web: "http://localhost:3000", api: "http://localhost:3001" }
 * @property {() => Promise<boolean>} ready - polls until the app is reachable; resolves true or throws on timeout
 *
 * @typedef {Object} AuthSession
 * @property {"cookie"|"bearer-token"} type
 * @property {Record<string,string>} headers - ready-to-use headers (or Cookie) for authenticated requests
 *
 * @typedef {Object} RawRequirementItem
 * Format-specific extractors (one per adapter) emit this generic shape. The
 * core normalizer never parses an app's source files itself — it only
 * consumes already-extracted items in this shape, which is what keeps the
 * core agnostic to any one requirements-document format vs. another vs.
 * whatever the next requirements format turns out to be.
 * @property {string} feature - grouping label, e.g. "Articles", "Bank Accounts"
 * @property {string} title - short requirement title
 * @property {string} [userStory] - "As a ... I want ... so that ..."; normalizer synthesizes a fallback if omitted
 * @property {string[]} given
 * @property {string[]} when
 * @property {string[]} then
 * @property {{ app: string, format: string, file: string, line?: number, specId?: string }} source
 *
 * @typedef {Object} RequirementsSourceDescriptor
 * @property {string} format - id of the requirements format, opaque label defined by the adapter
 * @property {string} rootDir - absolute path to the source artifacts
 * @property {() => Promise<RawRequirementItem[]>} extract - runs the adapter's own format-specific parser
 *
 * @typedef {Object} AppAdapter
 * @property {string} id - opaque adapter label, e.g. "app-a", "app-b"
 * @property {() => Promise<ReadyResult>} run - start the app locally
 * @property {() => Promise<void>} seed - get to a known data state
 * @property {() => Promise<void>} reset - alias/variant of seed for re-seeding between scenarios
 * @property {(credentials?: Record<string,string>) => Promise<AuthSession>} auth
 * @property {() => RequirementsSourceDescriptor} requirementsSource
 * @property {() => Promise<void>} teardown
 */

export class NotImplementedError extends Error {
  constructor(adapterId, method, note) {
    super(`${adapterId}.${method}() is not implemented. ${note ?? ""}`.trim());
    this.name = "NotImplementedError";
    this.adapterId = adapterId;
    this.method = method;
  }
}

/**
 * Generic, app-agnostic sanity check: does this object satisfy the AppAdapter
 * shape? Used by the core workflow before invoking any adapter method. This
 * is the only place core code is allowed to reason about "what an adapter
 * is" — it checks shape, never app-specific behavior.
 * @param {Partial<AppAdapter>} adapter
 */
export function assertImplementsAppAdapter(adapter) {
  const required = ["id", "run", "seed", "reset", "auth", "requirementsSource", "teardown"];
  const missing = required.filter((key) => adapter[key] === undefined);
  if (missing.length > 0) {
    throw new Error(
      `Adapter is missing required member(s): ${missing.join(", ")}. ` +
        `An AppAdapter must implement: ${required.join(", ")}.`
    );
  }
}
