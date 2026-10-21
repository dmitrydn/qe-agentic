/**
 * faultInjector(defectId) -> { apply(), revert() }. The backend source is
 * baked into the container image (no host bind-mount — see docker/Dockerfile),
 * so injection patches the file INSIDE the running container via `docker
 * exec`, relying on the backend's existing nodemon watch (yarn dev runs
 * `nodemon --watch backend`) to pick up the change and restart automatically.
 * Used only by the eval harness, never by the clean-run loop.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function readFileInContainer(containerName, path) {
  const { stdout } = await execFileAsync("docker", ["exec", containerName, "cat", path]);
  return stdout;
}

async function writeFileInContainer(containerName, path, content) {
  await new Promise((resolve, reject) => {
    const proc = execFile("docker", ["exec", "-i", containerName, "sh", "-c", `cat > ${path}`], (err) => {
      if (err) reject(err);
      else resolve();
    });
    proc.stdin.write(content);
    proc.stdin.end();
  });
}

async function waitForBackendReady(baseUrl, timeoutMs = 30_000) {
  // nodemon (backend's --watch backend) needs a beat to notice the file
  // change and restart before the old process actually goes away; without
  // this, the first readiness probe can succeed against the stale process.
  await new Promise((r) => setTimeout(r, 1500));
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/testData/users`);
      if (res.ok) return true;
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`backend did not become ready within ${timeoutMs}ms after fault injection change: ${lastErr?.message ?? ""}`);
}

/**
 * The seeded-defect catalog: WHICH known defects this adapter can inject and
 * HOW (in-container file + exact text to swap). `eval/` only references
 * these by id — the patch mechanics are app-specific and live here, never in
 * eval/ or workflow/. Each `find` string was confirmed unique in its file at
 * authoring time (see VERIFICATION.md Stage 6 / 6b sections).
 *
 * `severity` is informational (blatant | moderate | subtle), reported by the
 * eval harness, never used to change scoring.
 *
 * `expectCaught` (default true when omitted) marks a NEGATIVE CONTROL when
 * set to `false`: a real defect in a code path the current generated suite
 * legitimately does not assert on, so it is expected to slip through. These
 * exist so the catch rate is a measurement, not a foregone 100% — see
 * VERIFICATION.md Stage 6b, workstream B.
 */
export const DEFECT_CATALOG = [
  // --- transactions-007 (POST /transactions) ---
  {
    id: "payment-amount-cents",
    description:
      "Payment amount is stored without the dollars-to-cents (x100) conversion, so transaction.amount ends up 100x too small.",
    severity: "blatant",
    file: "/app/backend/database.ts",
    find: "    amount: transactionDetails.amount * 100,",
    replace: "    amount: transactionDetails.amount,",
  },
  {
    id: "auth-gate-post-transactions",
    description:
      "The auth gate is removed from POST /transactions, so an unauthenticated request no longer receives 401.",
    severity: "blatant",
    file: "/app/backend/transaction-routes.ts",
    find:
      'router.post(\n  "/",\n  ensureAuthenticated,\n  validateMiddleware(isTransactionPayloadValidator),\n  (req, res) => {',
    replace:
      'router.post(\n  "/",\n  validateMiddleware(isTransactionPayloadValidator),\n  (req, res) => {',
  },
  {
    id: "receiver-balance-not-credited",
    description:
      "On a completed payment, the receiver's balance is no longer credited (sender is still debited).",
    severity: "blatant",
    file: "/app/backend/database.ts",
    find: "    creditPayAppBalance(receiver, transaction);",
    replace: "    // creditPayAppBalance(receiver, transaction); // seeded-defect: receiver-balance-not-credited",
  },
  {
    id: "payment-amount-rounding-shaved-cent",
    description:
      "Payment amount conversion shaves one cent off every payment (subtle off-by-one rounding bug, distinct from the blatant x100 omission above).",
    severity: "subtle",
    file: "/app/backend/database.ts",
    find: "    amount: transactionDetails.amount * 100,",
    replace: "    amount: transactionDetails.amount * 100 - 1,",
  },

  // --- bank-accounts (GET /bankAccounts) ---
  {
    id: "auth-gate-get-bankaccounts",
    description: "The auth gate is removed from GET /bankAccounts, so an unauthenticated request no longer receives 401.",
    severity: "blatant",
    file: "/app/backend/bankaccount-routes.ts",
    find: 'router.get("/", ensureAuthenticated, (req, res) => {',
    replace: 'router.get("/", (req, res) => {',
  },
  {
    id: "bankaccounts-missing-userid-field",
    description: "GET /bankAccounts results no longer carry the userId field on each account (a partial response-shape regression).",
    severity: "moderate",
    file: "/app/backend/bankaccount-routes.ts",
    find: "  const accounts = getBankAccountsByUserId(req.user?.id!);",
    replace:
      // Cast to any[] first — a plain destructured-param arrow function here
      // (`.map(({ userId, ...rest }) => rest)`) fails this project's
      // noImplicitAny under `strict: true` (TS7031), which would crash
      // ts-node/nodemon instead of injecting the intended defect.
      "  const accounts = (getBankAccountsByUserId(req.user?.id!) as any[]).map(({ userId, ...rest }) => rest);",
  },
  {
    id: "bankaccounts-routingnumber-hardcoded",
    description:
      "A newly created bank account's routingNumber is hardcoded instead of persisting the submitted value. NEGATIVE CONTROL: no generated test calls POST /bankAccounts or asserts on routingNumber, so this is expected to slip through uncaught.",
    severity: "moderate",
    expectCaught: false,
    file: "/app/backend/database.ts",
    find: "    routingNumber: accountDetails.routingNumber!,",
    replace: '    routingNumber: "000000000",',
  },

  // --- users (GET /users) ---
  {
    id: "auth-gate-get-users",
    description: "The auth gate is removed from GET /users, so an unauthenticated request no longer receives 401.",
    severity: "blatant",
    file: "/app/backend/user-routes.ts",
    find: 'router.get("/", ensureAuthenticated, (req, res) => {',
    replace: 'router.get("/", (req, res) => {',
  },
  {
    id: "users-results-not-array",
    description: "GET /users returns a single user object instead of an array of results (collapses the list to its first element).",
    severity: "moderate",
    file: "/app/backend/user-routes.ts",
    find:
      "  const users = removeUserFromResults(req.user?.id!, getAllUsers());\n  res.status(200).json({ results: users });",
    replace:
      "  const users = removeUserFromResults(req.user?.id!, getAllUsers());\n  res.status(200).json({ results: users[0] });",
  },
  {
    id: "users-self-not-excluded",
    description:
      "GET /users no longer excludes the requesting user from their own results list. NEGATIVE CONTROL: no generated test asserts on result count or self-exclusion, so this is expected to slip through uncaught.",
    severity: "subtle",
    expectCaught: false,
    file: "/app/backend/user-routes.ts",
    find: "  const users = removeUserFromResults(req.user?.id!, getAllUsers());",
    replace: "  const users = getAllUsers();",
  },

  // --- transactions-001 (GET /transactions) ---
  {
    id: "auth-gate-get-transactions",
    description: "The auth gate is removed from GET /transactions, so an unauthenticated request no longer receives 401.",
    severity: "blatant",
    file: "/app/backend/transaction-routes.ts",
    find:
      'router.get(\n  "/",\n  ensureAuthenticated,\n  validateMiddleware([\n    sanitizeTransactionStatus,\n    sanitizeRequestStatus,\n    ...isTransactionQSValidator,\n  ]),\n  (req, res) => {',
    replace:
      'router.get(\n  "/",\n  validateMiddleware([\n    sanitizeTransactionStatus,\n    sanitizeRequestStatus,\n    ...isTransactionQSValidator,\n  ]),\n  (req, res) => {',
  },
  {
    id: "transactions-pagination-off-by-one",
    description:
      "Pagination's offset calculation is off by one page (classic off-by-one), so requesting the default first page skips straight to page two's items — for small seeded result sets this can empty out the first page entirely.",
    severity: "subtle",
    file: "/app/src/utils/transactionUtils.ts",
    find: "  const offset = (page - 1) * limit;",
    replace: "  const offset = page * limit;",
  },
];

export function getDefectCatalogEntry(defectId) {
  const entry = DEFECT_CATALOG.find((d) => d.id === defectId);
  if (!entry) {
    throw new Error(`Unknown defectId "${defectId}". Known ids: ${DEFECT_CATALOG.map((d) => d.id).join(", ")}`);
  }
  return entry;
}

/**
 * @param {{ id: string, file: string, find: string, replace: string }} defect
 *   `file` is the absolute in-container path; `find` must occur exactly once.
 */
function applyPatch(content, defect) {
  const occurrences = content.split(defect.find).length - 1;
  if (occurrences !== 1) {
    throw new Error(
      `faultInjector(${defect.id}): expected exactly 1 occurrence of the target text in ${defect.file}, found ${occurrences}`
    );
  }
  return content.replace(defect.find, defect.replace);
}

/**
 * @param {{ containerName: string, apiBaseUrl: string }} env
 * @param {string} defectId
 */
export function createFaultInjector(env, defectId) {
  const defect = getDefectCatalogEntry(defectId);
  let originalContent = null;

  return {
    async apply() {
      const current = await readFileInContainer(env.containerName, defect.file);
      if (!current.includes(defect.find)) {
        throw new Error(`faultInjector(${defect.id}): target text not found in ${defect.file} (already patched, or source changed)`);
      }
      originalContent = current;
      const patched = applyPatch(current, defect);
      await writeFileInContainer(env.containerName, defect.file, patched);
      await waitForBackendReady(env.apiBaseUrl);
    },
    async revert() {
      if (originalContent === null) return;
      await writeFileInContainer(env.containerName, defect.file, originalContent);
      await waitForBackendReady(env.apiBaseUrl);
      originalContent = null;
    },
  };
}
