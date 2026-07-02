# Task: Build the phased, decoupled sandbox for our Agentic QE architecture

## Goal
Stand up a sandbox to develop and demo an agentic QE workflow whose two inputs are:
(1) a running full-stack app as the test target, and (2) a requirements set the agent
consumes to generate/run tests. We are deliberately using TWO source apps but NOT paying
to maintain two live runtimes. Decouple the two roles:
  - RUNTIME TARGET (one, live): Cypress RealWorld App.
  - REQUIREMENTS INPUTS (two formats): realworld-spec (formal, machine-readable) AND
    Cypress RWA's own tests/TS models (tests-as-requirements).
This proves the architecture generalizes across requirements formats without doubling
runtime maintenance.

## Hard design constraint (this is the whole point — do not violate it)
The agentic-QE core must be APP-AGNOSTIC. Everything app-specific lives behind a thin
per-app adapter. Adding a new app, or a new requirements format, must require ONLY a new
adapter + config — ZERO changes to the core. Treat any core change forced by app #2 as a
design failure to flag, not to paper over.

Adapter interface (each app implements it):
  - run(): how to start the app locally (returns base URLs + readiness check)
  - seed()/reset(): how to get to a known data state
  - auth(): how to authenticate (Cypress RWA = session cookie; Conduit = JWT)
  - requirementsSource(): where requirements live + their format
  - teardown()

## Phase 1 — Containerize the single live runtime (Cypress RWA)
Convert the known recurring setup costs into a one-time cost by baking everything into a
Docker image / cached layer. Verify it boots reproducibly and the existing test oracle
passes INSIDE the container.

Bake in these already-discovered gotchas (do not rediscover them):
  - Pin Node to 22 (app engines: "^22.0.0 || ^24.0.0"; newer Node crashes via
    buffer-equal-constant-time/SlowBuffer).
  - Yarn Classic; add `.yarnrc` with `ignore-engines true` (top-level --ignore-engines
    does NOT propagate to nested postinstall).
  - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` on install (Apple Silicon).
  - Configure ports via `.env` (PORT=3000, VITE_BACKEND_PORT=3001), NOT ad-hoc env vars.
  - Seed is automatic on `yarn dev` from data/database-seed.json; seeded user password is
    `s3cret`.
  - Before invoking Cypress, ensure `ELECTRON_RUN_AS_NODE` is UNSET (it breaks the
    bundled Electron runner).
Acceptance for Phase 1:
  - `docker build` then a single run command boots frontend + backend with seeded data.
  - Inside the container: `yarn test:unit:ci` passes (~44 passed) AND
    `yarn cypress:run --spec 'cypress/tests/api/api-users.spec.ts'` passes (13/13).
  - Document the exact image/run commands that worked.

## Phase 2 — Dual requirements ingestion (the generalization proof)
Build a small "requirements normalizer" in the core that ingests BOTH sources and emits a
single unified format (user story + Gherkin Given/When/Then acceptance criteria), with
traceability back to the source artifact:
  A. realworld-spec — OpenAPI 3.1 contract + Hurl API assertions + Playwright E2E +
     SELECTORS.md. (Clone gothinkster/realworld + its spec repo for the artifacts ONLY;
     do NOT run the Conduit app in this phase.)
  B. Cypress RWA — backend TypeScript models, backend/validators.ts, and the existing
     cypress/tests specs as the requirements source.
Acceptance for Phase 2:
  - Normalizer produces a unified requirements doc covering >=3 features per app.
  - Each emitted acceptance criterion carries a traceability pointer to its source
    (file/line or spec id).
  - Adding source B after source A required only a new adapter/config — confirm and state
    explicitly whether any core code had to change (if it did, that's a red flag to report).

## Phase 3 — Second live runtime (DEFERRED — scaffold only, do not build now)
Leave a Conduit runtime adapter STUB plus a short notes file. Do NOT stand it up. Record
the plan: when needed, run Conduit on its documented Postgres via Docker (or pick a more
stable Node Conduit impl) rather than the SQLite-patched TonyMckes fork, which has two
known defects (missing userId FK migration; alter-sync restart fragility on SQLite).

## Deliverables (write under ./agentic-qe-sandbox/)
  - docker/ — Dockerfile + compose/run script for the Cypress RWA runtime.
  - core/ — app-agnostic workflow skeleton + the adapter interface + requirements
    normalizer.
  - adapters/cypress-rwa/ — full adapter (run/seed/auth/requirementsSource).
  - adapters/conduit/ — stub + deferral notes only.
  - requirements/unified-requirements.md — normalized output from both sources.
  - README.md — exact verified commands for everything above.
  - VERIFICATION.md — see below.

## Verify before finalizing (put results in VERIFICATION.md)
  - Reproducibility: build + boot the container from a clean checkout; confirm the two
    oracle commands pass inside it.
  - App-agnosticism: confirm that wiring app #2's requirements required only adapter/config
    and zero core changes — state plainly if this held or broke.
  - Traceability: spot-check that >=2 emitted acceptance criteria match real app/spec
    behavior (run the request or point to the exact source assertion).
  - State explicitly anything you could NOT verify, and any one-time vs recurring costs
    a future user of this sandbox should expect.
