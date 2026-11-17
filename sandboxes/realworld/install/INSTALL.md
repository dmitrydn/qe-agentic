# RealWorld (Conduit) sandbox: installation and verification spec

| | |
|---|---|
| Purpose | Install a local, fully working copy of the RealWorld "Conduit" application (a Medium-style blogging app) together with its official test suites, all pinned to fixed versions, and prove the installation is correct by running those suites. |
| Result | A running local environment: API on `http://localhost:3000/api`, web app on `http://localhost:4200`, plus two verified test suites you can re-run at any time. |
| Executor | A human engineer or a coding agent. Written to be followed literally; no prior knowledge of this project is assumed. |
| Platforms | macOS (Apple Silicon: reference run done here) and Linux x64/arm64 (not yet run end to end; see §8). |
| Time | 1.5–3 h, mostly dependency downloads and one ~8 min UI test run. |
| Accounts | None. No GitHub account, forks or push rights are needed. Everything is cloned from public repositories. |
| Status | Draft v1, 2026-10-24. The patch and scripts in this package were built and tested in isolation; **the full sequence has not yet been run end to end on this exact version set.** Your run is that test, so report anything that differs from this document to whoever gave it to you. |

## 0. Rules

1. **Follow the steps in order.** Each step ends with a **Verify** block. Don't start the next step until Verify passes.
2. **Stop and report** when a Verify fails and §9 (Troubleshooting) doesn't cover it. Report the step number, the exact command and the full error output.
3. **Never edit files under `spec/`, `backend/realworld/` or `frontend/realworld/`.** Those folders hold the specification and the official test suites. A failing test is a result to record, not something to fix.
4. **The only source change** is the frontend patch applied in step 4.
5. **Never point anything at the public demo API `api.realworld.show`.** By design it hides other users' content, so tests against it give wrong results. Everything in this spec runs locally.

## 1. What you will have at the end

```
$SB/                                    your workspace (default: ~/realworld-sandbox)
├── INSTALL.md                          this file
├── patches/angular-local-api.patch     frontend patch (step 4)
├── scripts/start-backend.sh            starts the API on a fresh database
├── scripts/seed.sh                     creates the demo user the UI tests need
├── scripts/check-pins.sh               verifies versions and the patch
├── logs/                               created by the runs
├── spec/      ← realworld-apps/realworld                               specification + official test suites
├── backend/   ← realworld-apps/nitro-prisma-zod-realworld-example-app  API server (TypeScript, Nitro, Prisma, SQLite)
│   └── realworld/                      backend's own copy of the spec (pinned to the same commit as spec/)
└── frontend/  ← realworld-apps/angular-realworld-example-app           web app (TypeScript, Angular)
    └── realworld/                      frontend's own copy of the spec (pinned to the same commit as spec/)
```

There are three copies of the specification: `spec/`, `backend/realworld/` and `frontend/realworld/`. **All three must sit at the same commit.** Upstream, the backend bundles a copy 30 commits older than the latest. Fixing that mismatch is a core purpose of this setup, and `check-pins.sh` enforces it.

### Pinned versions

| Name | Repository | Commit | Notes |
|---|---|---|---|
| `SPEC_PIN` | github.com/realworld-apps/realworld | `ebbcdeb8d55b42a3a613c787560498b8ef10003f` (2026-08-26) | Specification, API test suite (Hurl) and UI test suite (Playwright, 139 tests) |
| `BACKEND_BASE` | github.com/realworld-apps/nitro-prisma-zod-realworld-example-app | `c8c66858a436a6e07f445fffe2253a65ff6dcb58` | Listed by the spec maintainers as passing the full API suite |
| `FRONTEND_BASE` | github.com/realworld-apps/angular-realworld-example-app | `dd99ed2cf39c805d719f943c5d7061a5683d98a8` | Highest UI-suite pass rate of the frontends measured |

All three are MIT-licensed (see each repository's `LICENSE` file).

### The two test suites

| Suite | Location in spec | Tool | What it checks |
|---|---|---|---|
| API suite | `specs/api/hurl/*.hurl` | Hurl | 13 files, 154 HTTP requests against the API |
| UI suite | `specs/e2e/*.spec.ts` | Playwright | 139 browser tests (123 functional + 16 tagged `@security`) against the web app |

## 2. Prerequisites

### 2.1 Tools

| Tool | Version | macOS | Linux |
|---|---|---|---|
| git | ≥ 2.40 | Xcode Command Line Tools, or `brew install git` | distro package |
| Node.js | ≥ 22 | `brew install node` | nvm or NodeSource |
| bun | ≥ 1.4 | `curl -fsSL https://bun.sh/install \| bash` | same |
| Hurl | ≥ 8.0 | `brew install hurl` or `npm i -g @orangeopensource/hurl` | `npm i -g @orangeopensource/hurl` |
| python3 | ≥ 3.9 | preinstalled | distro package |
| curl, make, unzip | any | preinstalled | distro package |
| Google Chrome | optional fallback only (§5) | if installed | not needed |

**Verify**
```bash
git --version && node -v && bun -v && hurl --version | head -1 && python3 -V && make -v | head -1
```
Pass: every command prints a version, and Node is v22 or newer.

### 2.2 Network

The machine must reach these hosts over HTTPS. Corporate proxies and VPNs often block the Prisma and Playwright hosts. If one is blocked, stop and ask for access; don't try to work around it.

`github.com` · `registry.npmjs.org` · `bun.sh` · `binaries.prisma.sh` (database engine, needed in step 5) · `cdn.playwright.dev` / `playwright.azureedge.net` (browser download, step 5)

**Verify**
```bash
for u in https://github.com https://registry.npmjs.org https://binaries.prisma.sh https://playwright.azureedge.net; do
  printf '%-40s ' "$u"; curl -s -o /dev/null -m 10 -w '%{http_code}\n' "$u" || echo FAILED; done
```
Pass: every line prints an HTTP status code. Any code counts, including 403 or 404. `000` or `FAILED` means the host is blocked.

### 2.3 Ports

`3000` (API) and `4200` (web app) must be free.

**Verify**: `lsof -i :3000 -i :4200` prints nothing. On Linux, `ss -ltn | grep -E ':(3000|4200) '` also works.

## 3. Get the code

### 3.1 Workspace

Unzip the package you received; it contains `realworld-sandbox/` with this file, `patches/` and `scripts/`. Use that folder as the workspace:

```bash
unzip realworld-sandbox-package.zip -d ~           # creates ~/realworld-sandbox
export SB=~/realworld-sandbox                      # set this in every new terminal
export SPEC_PIN=ebbcdeb8d55b42a3a613c787560498b8ef10003f
chmod +x $SB/scripts/*.sh
```

### 3.2 Clone at the pinned commits

```bash
cd $SB
git clone https://github.com/realworld-apps/realworld.git spec
git -C spec checkout --detach $SPEC_PIN

git clone https://github.com/realworld-apps/nitro-prisma-zod-realworld-example-app.git backend
git -C backend checkout --detach c8c66858a436a6e07f445fffe2253a65ff6dcb58
git -C backend submodule update --init
git -C backend/realworld fetch origin && git -C backend/realworld checkout --detach $SPEC_PIN

git clone https://github.com/realworld-apps/angular-realworld-example-app.git frontend
git -C frontend checkout --detach dd99ed2cf39c805d719f943c5d7061a5683d98a8
git -C frontend submodule update --init
git -C frontend/realworld fetch origin && git -C frontend/realworld checkout --detach $SPEC_PIN
```

Git prints "You are in 'detached HEAD' state" several times. That's expected: you are on fixed commits, not branches. Afterwards `git -C backend status` and `git -C frontend status` show `realworld` as modified ("new commits"). That's also expected: it's the pin.

**Verify**
```bash
for d in spec backend/realworld frontend/realworld; do echo "$d $(git -C $SB/$d rev-parse HEAD)"; done
```
Pass: all three lines end in `ebbcdeb8d55b42a3a613c787560498b8ef10003f`.

## 4. Patch the frontend to use the local API

The upstream web app hardcodes the public demo API (`src/app/core/interceptors/api.interceptor.ts`, line 4). The patch replaces that with a build-time setting:

- **`local` build configuration** → `http://localhost:3000/api`
- **default and production** → the original public URL, unchanged
- **new npm script** `start:local`, which the patched Playwright config starts automatically
- **`PW_CHANNEL` env var**, to use an installed Google Chrome if Playwright's own browser won't install

```bash
cd $SB/frontend
git apply --check ../patches/angular-local-api.patch && git apply ../patches/angular-local-api.patch
git -c user.name=sandbox -c user.email=sandbox@localhost checkout -b local-sandbox
git -c user.name=sandbox -c user.email=sandbox@localhost commit -am "Local sandbox: configurable API URL (local -> localhost:3000)"
```
The commit is local only. It makes the patch visible in `git log` and keeps `git diff` clean.

**Verify**
```bash
$SB/scripts/check-pins.sh
```
Pass: seven `PASS` lines, the last line is `ALL PINS OK`, and the exit code is 0.

## 5. Install dependencies

```bash
cd $SB/backend  && make setup          # installs packages, generates the database client, creates the schema
cd $SB/frontend && bun install
cd $SB/frontend && npx playwright install chromium     # Linux: npx playwright install --with-deps chromium
```

**Verify**
```bash
ls $SB/backend/node_modules/.bin/nitro $SB/frontend/node_modules/.bin/ng
cd $SB/frontend && TEST_MODE=spa npx playwright test --list | tail -1
```
Pass: both files exist, and the last line reads `Total: 139 tests in 12 files`.

**If the Chromium install stalls.** On the macOS reference machine, the download reached 100% and then extraction hung for 25+ minutes. Cancel it, and if Google Chrome is installed, `export PW_CHANNEL=chrome` in every terminal where you run the UI suite.

## 6. Verify with the official test suites

Use **two terminals** and set `SB` (§3.1) in both. Terminal A runs the API server in the foreground; terminal B runs commands. Each suite run starts from a fresh, empty database: `start-backend.sh` deletes and recreates it every time it starts.

### 6.1 API suite

Terminal A:
```bash
$SB/scripts/start-backend.sh $SB/logs/backend-api-run.log
```
Terminal B:
```bash
until curl -sf http://localhost:3000/api/tags >/dev/null; do sleep 1; done; echo "API up"
cd $SB/backend && HOST=http://localhost:3000 realworld/specs/api/run-api-tests-hurl.sh 2>&1 | tee $SB/logs/api-suite.log
```
Use `localhost`, not `127.0.0.1`: on macOS the server listens on IPv6 `[::1]` only.

**Verify**
```bash
grep -E 'Executed files|Succeeded files|Failed files|Executed requests' $SB/logs/api-suite.log
```
- Pass: `Executed files: 13`, `Executed requests: 154`, `Succeeded files: 13 (100.0%)`, `Failed files: 0 (0.0%)`.
- Reference: the macOS reference run got exactly this result on the same backend commit with identical API test files.
- **Any failure here means the backend doesn't conform. Stop and report;** don't continue to 6.2.

### 6.2 UI suite

Terminal A: press Ctrl-C, then restart on a fresh database:
```bash
$SB/scripts/start-backend.sh $SB/logs/backend-ui-run.log
```
Terminal B:
```bash
until curl -sf http://localhost:3000/api/tags >/dev/null; do sleep 1; done
$SB/scripts/seed.sh                                    # expect: SEED OK: johndoe exists with 1 article(s)
cd $SB/frontend
TEST_MODE=spa API_BASE=http://localhost:3000/api PLAYWRIGHT_JSON_OUTPUT_NAME=$SB/logs/ui-suite.json \
  npx playwright test --reporter=list,json 2>&1 | tee $SB/logs/ui-suite.log
```
- `TEST_MODE=spa` runs the full suite. Don't use `fullstack` (old name: `API_MODE=false`); it skips 65 of the 139 tests.
- `seed.sh` creates the user `johndoe`, which several tests expect to exist. Rerun it after every backend restart.
- `API_BASE` is where the *test runner* creates its test data. The web app reaches the same API through the patch.
- Playwright starts the web app itself (`npm run start:local` on port 4200) and stops it at the end. Port 4200 must be free.

**Verify**
```bash
python3 -c "import json;s=json.load(open('$SB/logs/ui-suite.json'))['stats'];print({k:s[k] for k in ('expected','unexpected','skipped','flaky')})"
```
- `expected` is passed, `unexpected` is failed.
- Pass: the four numbers add up to 139, `skipped` is 0, and `expected` is at least 130.
- Below 130, something is wrong with the installation rather than the app: stop and report the failing test names, which are in `ui-suite.log`.
- Reference: on a slightly older version of the UI suite, the macOS reference run passed 133 of 139 without the seed user; the 3 tests that need `johndoe` then passed once it was seeded. The UI suite changed since, so expect a nearby number, not necessarily that exact one.

Failures previously observed with this frontend. They're genuine app or test issues, not installation problems:
- `comments.spec.ts` › *should require login to post comment*: a "Sign in" link selector matches 2 elements.
- `error-handling.spec.ts` › *should show error message on create article form when network fails*: shows "token is invalid" instead of "Unable to connect". It may disappear here, since the earlier run used a network workaround that this setup removes.
- `user-fetch-errors.spec.ts` › *should allow browsing app in unavailable mode and persist token across reloads*: the login token is lost after a reload.

### 6.3 Repeatability

Restart the backend (terminal A), run `seed.sh`, and run the UI suite once more. Change the output file to `PLAYWRIGHT_JSON_OUTPUT_NAME=$SB/logs/ui-suite-run2.json`.

Pass: the same tests fail as in run 1. Tests that fail in only one run are **flaky**. Tell whoever gave you this document which ones they were.

## 7. Using the running environment

Each session:

| Step | Command | Result |
|---|---|---|
| 1. API (terminal A) | `$SB/scripts/start-backend.sh` | API on `http://localhost:3000/api`, fresh empty database |
| 2. Demo data (terminal B) | `$SB/scripts/seed.sh` | user `johndoe` / password `password123` with one article |
| 3. Web app (terminal B) | `cd $SB/frontend && bun run start:local` | open `http://localhost:4200` |
| 4. Stop | Ctrl-C in each terminal | ports 3000 and 4200 freed |

- **Every backend start wipes the data.** To keep data between sessions, start the server without the script: `cd $SB/backend && JWT_SECRET=sandbox-local-only bun --silent run dev`. On macOS, wrap it in `script -q /dev/null …` if it stays silent (§9).
- **Re-run the suites at any time** with §6.1 and §6.2.
- **Before every use, and after any change:** run `$SB/scripts/check-pins.sh`.

## 8. Linux notes (not yet run end to end; report differences)

- Install Hurl via npm (`npm i -g @orangeopensource/hurl`; checked on Linux x64) and the browser via `npx playwright install --with-deps chromium`, which needs sudo for system libraries.
- `start-backend.sh` already uses the Linux `script -q -c` syntax.
- Headless servers and containers work as-is: Playwright runs headless by default.
- If `localhost:3000` refuses connections while the log says the server is up, check the binding with `ss -ltnp | grep 3000` and report it.
- Sandboxed cloud environments often block `binaries.prisma.sh` and the Playwright download. `make setup` then fails with a Prisma checksum `403`; see §2.2.

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| API server starts, prints nothing, port 3000 never opens | `nitro dev` idles without a terminal | Use `scripts/start-backend.sh` (it runs under `script`) |
| `bun run db:push` hangs | Prisma waits on keyboard input | The script closes stdin. By hand, append `</dev/null` |
| `ECONNREFUSED 127.0.0.1:3000` | macOS server listens on IPv6 only | Use `localhost` |
| `Could not resolve "realworld/assets/theme/styles.css"` | Frontend's spec copy not cloned | `git -C $SB/frontend submodule update --init`, then redo the `checkout $SPEC_PIN` from §3.2 |
| `Failed to fetch sha256 checksum … binaries.prisma.sh … 403` | Network blocks Prisma | §2.2. Don't set `PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING` |
| Chromium install stalls after 100% | Unknown (seen on macOS) | `export PW_CHANNEL=chrome` (needs Google Chrome installed) |
| 3 tests in `social.spec.ts` time out waiting for "Follow" or a heading | `johndoe` not seeded | `scripts/seed.sh` after every backend restart |
| Web app shows other content than your local data, or traces show calls to `api.realworld.show` | Patch missing, or app not started with `start:local` | `scripts/check-pins.sh`; make sure port 4200 was free before the run |
| `EADDRINUSE :4200`, or an old app version is served | A previous `ng serve` still running | `lsof -ti:4200 \| xargs kill`, then rerun |
| `check-pins.sh`: `… not initialised` | Spec copy folder empty | Redo the matching block of §3.2 |
| `git commit` in §4 fails with "Please tell me who you are" | No git identity configured | Use the command exactly as written (it passes `-c user.name/-c user.email`) |

## 10. Known limitations: not in scope, don't fix

| # | Limitation | Impact |
|---|---|---|
| L-1 | Frontend unit tests (`bun run test`) fail at the pinned commit with `Failed to resolve import "zone.js"`, with or without the patch | No frontend unit-test signal; it doesn't affect §6 |
| L-2 | The production frontend build downloads Google Fonts at build time and fails if `fonts.googleapis.com` is blocked | None: only the `local` configuration is used |
| L-3 | The official test suites (`specs/api/hurl`, `specs/api/bruno`, `specs/e2e/*.spec.ts`) sit inside the workspace in three places | If this environment is later used to evaluate tools or AI agents that generate tests, those tools must not be able to read these folders, or the evaluation is contaminated. Decide how to isolate them before such use |

## 11. Definition of done

- [ ] `scripts/check-pins.sh` ends with `ALL PINS OK`
- [ ] API suite: 13/13 files, 154 requests, 0 failures
- [ ] UI suite: 139 tests run, 0 skipped, ≥ 130 passed; second run shows the same failures
- [ ] The app opens at `http://localhost:4200`, and you can log in as `johndoe` / `password123` after seeding
- [ ] Anything you did differently from this document has been passed back to whoever gave it to you
