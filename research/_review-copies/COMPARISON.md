# Sandbox Evaluation: Conduit (RealWorld) vs. Cypress RealWorld App

Hands-on evaluation of two candidate full-stack apps as the sandbox for an agentic QE
workflow. Both were cloned, installed, and run locally — nothing here is judged from
READMEs alone.

**Recommendation: Cypress RealWorld App.** Rationale and risks below.

---

## 1. Scoring

| Criterion | Conduit (+ realworld-spec) | Cypress RealWorld App |
|---|---|---|
| Local runnability & setup friction | **2/5** — required real source-code workarounds: substituting SQLite for the documented Postgres/MySQL/Docker requirement (none available in this sandbox), a manual `config.js` edit, and fixing a genuine missing-foreign-key migration bug just to get seed data to persist. | **4/5** — documented steps work as-is; the only blocker was the host Node version (25.x) exceeding the app's pinned `engines` range. Once run on Node 22 (and yarn's nested-postinstall engine check bypassed via `.yarnrc`), `yarn dev` booted cleanly on the first try with zero source edits. Reproduced identically from a second, completely clean clone. |
| Requirements completeness & ease of conversion to user stories + AC | **5/5** — the companion `realworld-spec` repo provides a maintained OpenAPI 3.1 contract, Hurl API assertions (already Given/When/Then in spirit), a shared Playwright E2E suite, and a `SELECTORS.md` selector contract. Machine-readable and demonstrably converts to Gherkin in minutes (see §3). | **3/5** — no formal spec artifact. Requirements must be reverse-engineered from the README, TypeScript models, and the existing Cypress test files. Workable (proven in §3) but it's "tests-as-requirements," not a maintained requirements document. |
| Full-stack coverage (UI+API+DB) | **4/5** — genuine React+Express+Sequelize/SQL stack, but the documented DB (Postgres/MySQL) wasn't available here, and the implementation has real schema-correctness bugs (below). | **5/5** — React+Express+lowdb, all three layers genuinely wired, zero-config DB (JSON file), no schema bugs found in two independent boot attempts. |
| Existing test suite as baseline oracle | **1/5** — only 3 trivial unit-test files, and they fail out of the box (`jsdom` is referenced by `vitest.config.js` but not installed as a dependency). Not usable as-is. | **5/5** — 8 unit-test files (44 passed / 10 skipped, clean run, ~28s) plus 8 API spec files and 7 UI spec files covering every domain entity. Confirmed not just by reading the suite but by actually running it: `cypress run` against `api-users.spec.ts` passed **13/13**. (An initial attempt to launch Cypress appeared to fail with a macOS-incompatibility error; root-caused afterward to a local tooling artifact — see §5 — not an app or platform issue.) |
| Maintenance & license suitability | **3/5** — MIT, but small (117 stars), single maintainer, mostly Dependabot-driven commits, last push 2026-06-01, 19 open issues. | **5/5** — MIT, officially maintained by Cypress (cypress-io org), 5,899 stars, last push 2026-06-21 — a commit literally titled "chore: standardize on Node.js 22," addressing the exact engine constraint this evaluation hit. 40 open issues with visible active triage. |
| **Overall fit for an agentic QE demo** | **3/5** — pairs with a uniquely strong formal spec, but the implementation itself is fragile (two distinct defects found) and needs real source patches just to boot reliably — risky for a live demo. | **5/5** — boots cleanly on a supported Node version with zero source patches, has the richest and most reliable test suite of the two, is the most actively maintained, and its requirements are provably extractable from its own code/tests. |
| **Total** | **18/30** | **27/30** |

---

## 2. Exact, verified local-run steps

### Cypress RealWorld App — RECOMMENDED (verified twice: original clone + a second, completely clean clone)

Prerequisites actually required (beyond the documented ones): a Node version in the
app's pinned range. The host had Node 25.x; the app's `package.json` pins
`"node": "^22.0.0 || ^24.0.0"`. Without a matching Node, the Express backend crashes at
startup (`TypeError: Cannot read properties of undefined (reading 'prototype')` in
`buffer-equal-constant-time`, a transitive dependency of `jsonwebtoken`/`jws` — it
references the `SlowBuffer` API, which no longer exists on Node 25). This is exactly
why the `engines` field is enforced — confirmed by the maintainers' own most recent
commit, "chore: standardize on Node.js 22."

```bash
# 1. Clone
git clone https://github.com/cypress-io/cypress-realworld-app.git
cd cypress-realworld-app

# 2. Get a compatible Node (host had 25.x; app needs ^22 || ^24)
brew install node@22   # keg-only, does not touch the global `node` symlink

# 3. Yarn Classic is required (not Yarn Modern). This host already had Yarn 1.22.22.
#    yarn's top-level --ignore-engines flag does NOT propagate to the nested
#    `yarn run postinstall` invocation triggered by the postinstall-postinstall
#    package, so the engine check must be silenced repo-wide:
echo 'ignore-engines true' > .yarnrc

# 4. Install (skip the Chromium download on Apple Silicon, per the README)
PATH="$(brew --prefix node@22)/bin:$PATH" \
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install
# ~20 min: resolves, fetches, links, then runs husky + patch-package (one patch:
# react-virtualized@9.22.5). Two benign warnings about workspaces/peer deps.

# 5. Run (default .env already ships with PORT=3000, VITE_BACKEND_PORT=3001 — no edits needed)
PATH="$(brew --prefix node@22)/bin:$PATH" yarn dev
```

Result: frontend at `http://localhost:3000` (Vite, HTTP 200), backend at
`http://localhost:3001` (Express + lowdb, seeded automatically from
`data/database-seed.json` on every `yarn dev` start — 5 users, contacts, bank accounts,
transactions, likes, comments, notifications, bank transfers). DB setup is genuinely
zero-config: no server, no driver, no migration step. Default login password for every
seeded user is `s3cret`.

Test suite: `yarn test:unit:ci` → **44 passed, 10 skipped, 0 failed**, ~28s, no setup
needed beyond the install above. The Cypress-driven suites also run successfully once
launched correctly (see §5 for the one environment gotcha that initially blocked this):
`yarn cypress:run --spec 'cypress/tests/api/api-users.spec.ts'` → **13 passed, 0
failed** in ~2s.

Reproducibility: repeated from a second, completely clean `git clone` on the same
machine using the same Node 22 + `.yarnrc` workaround. Install output was identical
(same two warnings, same single patch applied). `yarn dev` booted cleanly; the backend
served the same seed data; the frontend gracefully auto-incremented its port when the
original instance's port 3000 was still occupied (Vite's own conflict-resolution, not a
crash). Zero source-code edits were needed in either run — both workarounds (Node
version, `.yarnrc`) are environment/tooling-level, not application patches.

### Conduit (RealWorld) — boots, but only with source-level workarounds

```bash
git clone https://github.com/TonyMckes/conduit-realworld-example-app.git conduit-realworld
cd conduit-realworld
npm install

# Documented setup expects Postgres/MySQL/MariaDB/SQL Server/Oracle (a real server).
# None was available in this sandbox (no Docker, no local DB server). Workaround:
npm install -w backend sqlite3
```

Add a `storage` key to `backend/config/config.js`'s `development` block (not in the
source as shipped):
```js
development: {
  ...
  dialect: process.env.DEV_DB_DIALECT,
  storage: process.env.DEV_DB_STORAGE,   // added — required for the sqlite dialect
  logging: process.env.DEV_DB_LOGGING,
},
```

`backend/.env` (note: must live in `backend/`, not the repo root — `npm run` with
`-w backend` sets cwd to the package dir, so dotenv looks there; also omit
`DEV_DB_LOGGING` entirely — setting it to the string `"false"` makes Sequelize try to
call the literal truthy string as a logging function and crash):
```
PORT=3001
JWT_KEY=supersecretkey_example
DEV_DB_USERNAME=root
DEV_DB_PASSWORD=null
DEV_DB_NAME=database_development
DEV_DB_HOSTNAME=127.0.0.1
DEV_DB_DIALECT=sqlite
DEV_DB_STORAGE=./database.sqlite
```

```bash
npm run sqlz -- db:migrate     # runs the 4 real migrations (tag/article/user/comment)
npm run dev                    # first boot's `sequelize.sync({alter:true})` adds a
                                # missing `userId` FK column to Articles that the
                                # migrations themselves never define (see defects below)
# while that server is still up, in another shell:
npm run sqlz -- db:seed:all    # seeds 5 users + 55 articles
```

Result: UI at `http://localhost:3000` (Vite, HTTP 200), API at
`http://localhost:3001/api` (Express + Sequelize, HTTP 200 JSON). DB setup is **not**
zero-config per the docs (a real SQL server is expected); SQLite is an undocumented
substitution made necessary by this sandbox's lack of Postgres/MySQL/Docker.

Test suite: `npx vitest run` → fails immediately,
`ERR_MODULE_NOT_FOUND: Cannot find package 'jsdom'` — `vitest.config.js` sets
`environment: "jsdom"` but `jsdom` is not listed as a dependency anywhere in
`package.json`. Not usable out of the box.

**Two defects found and reproduced (not patched, per the instruction to evaluate
hands-on):**
1. **Missing FK column in migrations.** The CLI migrations never define a `userId`
   column on `Articles`; it only gets added implicitly by the runtime
   `sequelize.sync({alter:true})` call in `backend/index.js`. A fresh `db:migrate` +
   immediate `db:seed:all` (without first booting the server) fails with
   `SQLITE_ERROR: table Articles has no column named userId`.
2. **Restart fragility on SQLite.** Because the app re-runs `sequelize.sync({alter:true})`
   on every boot (not just the first), restarting the server against an existing SQLite
   file is unreliable. Reproduced twice in this evaluation with two different failure
   modes: a `SequelizeUniqueConstraintError` on `Users_backup.id` during `alter`'s
   internal backup-table strategy, and (on an independent re-check while drafting this
   report) a `SequelizeForeignKeyConstraintError` / `SQLITE_CONSTRAINT: FOREIGN KEY
   constraint failed` on `DROP TABLE Users`. Both are consistent with the same root
   cause: SQLite's `alter`-sync strategy doesn't tolerate being re-run against
   already-populated, FK-related tables. This is a real defect in the app's own startup
   logic, independent of the SQLite-vs-Postgres substitution.

---

## 3. Requirements → user story + Gherkin acceptance criteria (verified against real behavior)

### Conduit — "Favorite an article" (source: `realworld-spec/specs/api/hurl/favorites.hurl`, cross-checked against `realworld-spec/specs/api/openapi.yml` and the running app's `backend/routes/articles.js`, which mounts a dedicated `favorites` sub-route)

> **User story:** As a registered user, I want to favorite and unfavorite articles so
> that I can track content I'm interested in and see accurate favorite counts on
> articles.

- **Given** I am authenticated and an article exists with `favorited: false` and
  `favoritesCount: 0`, **when** I `POST /api/articles/:slug/favorite`, **then** the
  response returns the article with `favorited: true` and `favoritesCount: 1`.
- **Given** I have just favorited an article, **when** I subsequently
  `GET /api/articles/:slug`, **then** the persisted `favorited`/`favoritesCount` values
  match what the favorite call returned (the favorite persists, it isn't just an
  in-memory response artifact).
- **Given** an article has been favorited by at least one user, **when** anyone calls
  `GET /api/articles?favorited=<username>`, **then** that article appears in the
  results with `favoritesCount` as a non-negative integer ≥ 1.
- **Given** I am authenticated and have favorited an article, **when** I
  `DELETE /api/articles/:slug/favorite`, **then** the response returns
  `favorited: false` and `favoritesCount: 0`, and this persists on a follow-up `GET`.
- **Given** I am not authenticated, **when** I attempt to favorite or unfavorite any
  article, **then** the API returns `401 Unauthorized`.

*Verified live*, this session: registered a user, fetched a seeded article slug,
confirmed initial `favorited: false`/`favoritesCount: 0`, `POST .../favorite` →
`favorited: true`/`favoritesCount: 1`, `DELETE .../favorite` →
`favorited: false`/`favoritesCount: 0`, and an unauthenticated `POST` →
`401`. All match the Hurl spec's assertions exactly.

### Cypress RealWorld App — "Submit a payment to another user" (source: `cypress/tests/ui/new-transaction.spec.ts`, cross-checked against `backend/transaction-routes.ts`, `backend/validators.ts`, and `backend/database.ts`)

> **User story:** As a logged-in user, I want to send a payment to one of my contacts
> so that I can settle a shared expense and see both balances update immediately.

- **Given** I am logged in and have sufficient balance, **when** I `POST /transactions`
  with `transactionType: "payment"`, a valid `receiverId`, `description`, and `amount`
  (in dollars), **then** the response returns a transaction with `status: "complete"`
  and `amount` equal to my input × 100 (stored in cents).
- **Given** a payment transaction completes, **when** I check both users' balances
  immediately afterward, **then** the sender's balance has decreased by exactly the
  payment amount and the receiver's has increased by exactly the same amount.
- **Given** a payment transaction completes, **when** I `GET /transactions` as the
  sender, **then** the new transaction (with its description) appears in the list.
- **Given** I am not authenticated, **when** I attempt `POST /transactions`, **then**
  the API returns `401 Unauthorized`.
- **Given** a payment request type (not a plain payment) is created instead, **when**
  I inspect the resulting transaction, **then** its status remains `"pending"` rather
  than auto-completing (payments settle immediately; requests do not).

*Verified live*, this session: seeded users Heath93 (balance $1,509.53) and
Arvilla_Hegmann (balance $930.26). Logged in as Heath93 via `POST /login`
(session-cookie auth), then `POST /transactions` with
`{"transactionType":"payment","receiverId":"<Arvilla's id>","description":"Sushi dinner","amount":35}`.
Response: `status: "complete"`, `amount: 3500`. Confirmed balances afterward:
Heath93 → $1,474.53 (−$35.00 exactly), Arvilla_Hegmann → $965.26 (+$35.00 exactly).
Confirmed the transaction appears in `GET /transactions` for Heath93. Confirmed an
unauthenticated `POST /transactions` returns `401`. This exactly matches the assertions
the existing Cypress spec makes at the UI layer (`new-transaction.spec.ts:54-60`), just
exercised directly against the API.

---

## 4. Risks and caveats

- **Cypress's own test runner initially appeared broken — corrected.** The first
  `yarn cypress verify` failed with `bad option: --no-sandbox` / `--smoke-test` /
  `--ping=...`, which read like a macOS/Cypress-binary incompatibility. Root cause,
  found after digging further: this shell's environment has `ELECTRON_RUN_AS_NODE=1`
  set (inherited from the VSCode extension host this evaluation ran inside), which
  forces *any* Electron-based binary — including Cypress's bundled Electron — to launch
  as plain Node instead of itself. Running `env -u ELECTRON_RUN_AS_NODE npx cypress
  verify` succeeded immediately, and `yarn cypress:run --spec
  'cypress/tests/api/api-users.spec.ts'` passed **13/13**. **This is not a real
  macOS-compatibility issue with the app** — it's an artifact of one specific terminal
  environment, and would not affect a normal shell, CI runner, or most other sandboxes.
  Worth knowing only if this exact harness/VSCode-extension setup is reused: unset
  `ELECTRON_RUN_AS_NODE` before invoking Cypress.
- **An unrelated environment regression was introduced and fixed during this
  evaluation.** Installing `node@22` via Homebrew triggered an automatic `brew cleanup`
  that removed a shared library version (`simdutf`) still needed by the global `node`
  binary's own dependency chain, breaking the system's `node -v`. This was caught and
  fixed (via `brew reinstall node`, which upgraded the global node from 25.9.0 to
  26.3.1) before finalizing this report. Worth knowing if this sandbox is reused: a
  `brew install node@22` keg-only install is not perfectly side-effect-free.
- **Cypress RealWorld App's port-override via ad-hoc environment variables only
  partially works.** Setting `VITE_BACKEND_PORT` as a shell-level env var correctly
  retargeted the backend; setting `PORT` the same way did **not** retarget the Vite
  frontend (it ignored the override and used its own conflict-auto-increment instead).
  The README's port-configuration instructions assume editing `.env` directly, not
  passing ad-hoc env vars — confirmed working when done that way (the default `.env`
  shipped with the repo).
- **Requirements-completeness score is the one place Conduit objectively wins.** If a
  team specifically wants a maintained, machine-readable spec (OpenAPI + Hurl +
  Playwright + selector contract) as the primary requirements input — rather than
  inferring requirements from application code and tests — `realworld-spec` paired
  with a *different*, more stable Conduit-spec implementation may be worth a second
  look. The specific `TonyMckes/conduit-realworld-example-app` reference implementation
  evaluated here, however, is not robust enough to be the demo's runtime component
  without carrying its two known defects as caveats.
- **Node-version pinning is brittle, not just strict.** Cypress RealWorld App pins
  `"node": "^22.0.0 || ^24.0.0"` — both are current LTS, not actually outdated — but the
  failure mode when you don't match it is a confusing transitive-dependency crash
  (`buffer-equal-constant-time` calling the removed `SlowBuffer` API), not a clean
  "wrong Node version" error. Any environment that provisions Node generically (latest,
  or whatever the OS ships) will hit this exact wall and need to know to install Node
  22 or 24 specifically. This is a real, recurring setup cost for an agent-driven
  sandbox that should otherwise "just work."
- **Install footprint is meaningfully larger than Conduit's.** `yarn install` took
  roughly 20 minutes and pulls Cypress's full Electron-based test-runner binary plus a
  large dependency tree, versus Conduit's much lighter, faster `npm install`. For a
  sandbox meant to be rebuilt repeatedly (CI, ephemeral containers, agent-recreated
  environments), this is real friction worth budgeting for, even though it didn't
  change the recommendation here.
- **Maintenance gap is real, not perceived.** Cypress RealWorld App's most recent
  commit (2026-06-21, the day before this evaluation) directly addressed the same
  Node-version constraint this evaluation had to work around — a strong, current signal
  of active upstream maintenance that Conduit's smaller, single-maintainer repo does
  not match.
