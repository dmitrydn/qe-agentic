# 02 — Sandbox architecture

How the Conduit sandbox is put together, which versions are pinned, and which parts an agent may read. The installation itself is specified step by step in `sandboxes/realworld/install/INSTALL.md`; this file explains the design behind it.

## 1. Components

```
$SB/  (default ~/realworld-sandbox, OUTSIDE the qe-agentic repo)
├── INSTALL.md, scripts/, patches/   ← copied from qe-agentic/sandboxes/realworld/install/
├── spec/        realworld-apps/realworld                               specification + official test suites
├── backend/     realworld-apps/nitro-prisma-zod-realworld-example-app  API: Nitro on Bun, Prisma 7 + SQLite, Zod, bcrypt, JWT
│   └── realworld/   backend's own copy of the spec (re-pinned to SPEC_PIN)
└── frontend/    realworld-apps/angular-realworld-example-app           web app: Angular 21
    └── realworld/   frontend's own copy of the spec (re-pinned to SPEC_PIN)
```

| Runtime | Address |
|---|---|
| API | `http://localhost:3000/api` (on macOS it listens on IPv6 `[::1]` only, so use `localhost`, not `127.0.0.1`) |
| Web app | `http://localhost:4200` (started with `bun run start:local`) |
| Demo data | `scripts/seed.sh` creates user `johndoe` / `password123` with one article. **Every backend start wipes the database**, so re-seed each time |

`INSTALL.md` expects to be unzipped from `realworld-sandbox-package.zip`. From the repo, copy the folder instead: `cp -R qe-agentic/sandboxes/realworld/install ~/realworld-sandbox`, then continue at its §3.1 from `export SB=...`.

## 2. Pinned versions

| Name | Repository | Commit |
|---|---|---|
| `SPEC_PIN` | github.com/realworld-apps/realworld | `ebbcdeb8d55b42a3a613c787560498b8ef10003f` (2026-08-26) |
| `BACKEND_BASE` | github.com/realworld-apps/nitro-prisma-zod-realworld-example-app | `c8c66858a436a6e07f445fffe2253a65ff6dcb58` |
| `FRONTEND_BASE` | github.com/realworld-apps/angular-realworld-example-app | `dd99ed2cf39c805d719f943c5d7061a5683d98a8` |

**One specification version everywhere.** There are three copies of the specification (`spec/`, `backend/realworld/`, `frontend/realworld/`). Upstream, the backend bundles a copy 30 commits older than the latest. All three are forced to `SPEC_PIN`, and `scripts/check-pins.sh` enforces it. Agent inputs, the BA backlog and the test oracle must all refer to the same commit.

**Only source change:** `patches/angular-local-api.patch` adds a `local` configuration so the Angular app calls `localhost:3000/api`. Upstream it is hard-coded to the public demo API `api.realworld.show`, which must never be used (it hides other users' content by design).

## 3. Version warning: two specification pins exist in this repo

| Material | Spec commit |
|---|---|
| `INSTALL.md`, `Conduit-backlog.xlsx` | **`ebbcdeb8…`** (current pin) |
| `research/realworld-spike/RESULTS.md`, `realworld-requirements-baseline.md` (73), `requirements-recount.md` (210) | `450bbc5410c7c1b7feca0f238e002162468e2a6c` (older, used during the spike) |

Line numbers and some content differ between the two. Example, checked on 2026-11-17: `endpoints.md` line 185 at `ebbcdeb8` says duplicate titles must still produce distinct slugs. At `450bbc5` that line is a heading, which is why the recount flagged baseline item R-031 as unsupported. **Always cite and check against `ebbcdeb8`.** Treat the spike material as history and as a source of gap ideas, not as current line references.

## 4. Information boundary: what agents may read

The test suites that ship with the specification are the **held-out oracle**. They score the agents' work and must never be agent input (`intent.md` P2, P3).

| Class | Paths (inside `spec/`) | Agent access |
|---|---|---|
| Requirement sources | `docs/src/content/docs/specifications/backend/*.md`, `.../frontend/*.md`, `docs/src/content/docs/implementation-creation/features.md`, `specs/api/openapi.yml` | Read |
| Interface contract | `specs/e2e/SELECTORS.md` (UI locators) | Automation agents may read it; requirement work does not use it |
| **Held-out oracle** | `specs/api/hurl/*`, `specs/api/bruno/*`, `specs/e2e/*.spec.ts`, Postman collection | **Never read, grep or list contents** |
| Implementation code | `backend/` and `frontend/` sources | Not read by test-design or requirement agents (`intent.md` §5 rule 1) |

### Unresolved risks

| ID | Risk | Status |
|---|---|---|
| K-2 / L-3 | The oracle sits in three places inside `$SB` (`spec/`, `backend/realworld/`, `frontend/realworld/`). An agent with a shell on the same machine can still read it, and the model may have memorised the public suites | **Decided, `DECISIONS.md` D-03:** sparse checkout without test folders for agents, person approves commands, read log checked after each run, planted problems carry the scores |
| — | `openapi.yml` contains 5 examples (error-response bodies) | **Closed, D-02:** they are requirements; keep them |
| L-1 | Frontend unit tests fail at the pinned commit (`zone.js` import) | Accepted; does not affect the suites |
| — | Fonts and icons load from public CDNs; offline the app works but looks plainer | Accepted |

## 4a. Shared hosted instance (Azure)

| Item | Value |
|---|---|
| URL | https://web-vs-pro-batc-qe-realworld-sandbox-f4crcjf2bcg9c5b6.swedencentral-01.azurewebsites.net/ (API at `/api` on the same host) |
| Deployment | Azure App Service, local git deployment |
| Database | SQLite file inside the web app: **lost on every redeploy**. Option, not yet done: seed default data on database creation, e.g. `johndoe` / `password123` with one article as in `install/scripts/seed.sh` |
| Use | This project only. No test runs while the BA reviews (D-05) |
| Checked 2026-11-17 | Frontend calls its own `/api`, not the public demo. **No session isolation**: anonymous visitors and other members see the same articles and tags. Ownership enforced: another member's edit and delete of an article return 403 `{"errors":{"article":["forbidden"]}}` and the article is unchanged, matching the reference backend in the spike. Test users `claude-check-a` and `claude-check-b` remain (the API has no user deletion); their article was deleted |
| **Not known** | Which commits are deployed. Record the spec, backend and frontend SHAs for every deployment (e.g. a `version.json` served by the app); until then, results on this instance can't be tied to `SPEC_PIN` |

## 5. Expected baseline (Definition of done in `INSTALL.md` §11)

| Check | Pass condition | Evidence so far |
|---|---|---|
| `check-pins.sh` | `ALL PINS OK` | Script tested in isolation (fails on old pin, fails on missing copy, passes when pinned) |
| API suite (Hurl) | 13/13 files, 154 requests, 0 failures | Spike: 154 requests, 692/692 assertions at `450bbc5`; API test files identical at `ebbcdeb8` |
| UI suite (Playwright) | 139 tests run, 0 skipped, ≥ 130 passed, same failures on a second run | Spike: 133/139 at `450bbc5`; UI test files changed since, so the first run on `ebbcdeb8` sets the new baseline |
| Known Angular failures | `comments.spec.ts` duplicate "Sign in" link; `error-handling.spec.ts` "token is invalid"; `user-fetch-errors.spec.ts` token lost after reload | Genuine app/test issues, not install problems |

**Status: `INSTALL.md` (Draft v1, 2026-10-24) has not been run end to end on this version set.** No `BASELINE.md` or run logs are in the repo. The first full run is the test of the spec. Use `TEST_MODE=spa`; `fullstack` (old name `API_MODE=false`) skips 65 of 139 tests.

## 6. How the sandbox serves the five capabilities

| Capability (`intent.md`) | Input from this sandbox | Ground truth |
|---|---|---|
| C1 Requirement check | Specification pages + `openapi.yml`; BA backlog (Markdown, after review) | Real gaps (11–22 found, to be ruled on by a human) plus planted problems |
| C2 Independent test design | Reviewed requirements + public interface (API contract, running UI, `SELECTORS.md`) | Held-out Hurl and Playwright suites; planted defects |
| C3 Execution evidence | Playwright JSON and Hurl reports | Known runs |
| C4 Claim check | Claimed statuses vs C3 records | Planted over-claims |
| C5 Readiness report | Aggregates C1–C4 | Known end-to-end scenarios |
