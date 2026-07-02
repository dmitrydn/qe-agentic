# Conduit runtime — deferred (Phase 3)

Per the sandbox plan, Conduit is NOT stood up as a second live runtime right
now. This file is the plan for when it actually becomes needed. Until then,
`adapter.js` only implements `requirementsSource()`; `run()`, `seed()`,
`reset()`, `auth()`, and `teardown()` are `NotImplementedError` stubs.

## Why deferred

The sandbox's job in Phase 2 was to prove the core is app-agnostic across
requirements *formats*, not to double runtime maintenance. realworld-spec's
artifacts (OpenAPI + Hurl + Playwright + SELECTORS.md) gave us a second,
independent requirements format without needing Conduit's app code running
at all. Standing up a second live app is a separate cost with its own
payoff (e2e-level cross-app validation, a second JWT-based auth flow to
exercise the adapter contract against) — worth doing later, not blocking now.

## What's cloned today, and its known defects

`sandbox-eval/conduit-realworld` is a clone of
`TonyMckes/conduit-realworld-example-app` (Node/Express backend, SQLite via
Sequelize, React frontend). It was evaluated during app selection
(see `../../PROGRESS.md`) and scored lower than Cypress RWA specifically
because of two real defects found in hands-on testing:

1. **Missing `userId` foreign-key migration.** Some Sequelize associations
   reference a `userId` column that the shipped migrations never actually
   create on the SQLite schema, so certain author/owner queries fail at
   runtime rather than at migration time.
2. **Alter-sync restart fragility on SQLite.** The backend uses
   `sequelize.sync({ alter: true })` against SQLite, which is not robust to
   repeated restarts — schema drift accumulates across alter-syncs and can
   leave the database in a state that requires deleting the SQLite file and
   re-seeding from scratch.

Both are characteristic of the SQLite-patched fork specifically, not of the
Conduit/RealWorld spec itself.

## Plan for when this is actually needed

Do not fight the SQLite alter-sync issue. Either:

- **Run this same fork against Postgres via Docker Compose** (a `postgres:`
  service + the existing backend pointed at it via env vars) instead of
  SQLite — migrations behave correctly against a real RDBMS, sidestepping
  defect #2 outright, and defect #1 should surface as a normal migration
  failure that's then fixable directly, or
- **Pick a more actively-maintained Node Conduit implementation** from the
  community list at https://codebase.show/projects/realworld (filtered to
  Node backends) if one with cleaner migrations turns out to exist.

Either path, the adapter contract this sandbox already defines
(`run/seed/reset/auth/teardown`) does not change — only
`adapters/conduit/adapter.js`'s implementation does, and `auth()` should
return `{ type: "jwt", headers: { Authorization: "Token <jwt>" } }` per the
RealWorld spec's bearer-token convention (vs. Cypress RWA's session cookie),
exercising the one auth-shape difference the adapter interface was designed
to absorb.

## What would need to change in core (expected: nothing)

Bringing this adapter to full implementation should require zero changes to
`core/`. If it turns out otherwise, that's the design-failure signal the
top-level prompt asks to flag explicitly — write it up rather than quietly
patching core to special-case Conduit.
