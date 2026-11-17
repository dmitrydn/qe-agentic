# sandboxes

Demo applications. Phase 1 uses one app, Conduit (`../DECISIONS.md` D-01). Each app gets its own planted-defect catalog.

| App | Stack | Status | Folder |
|---|---|---|---|
| RealWorld (Conduit) | TypeScript: Nitro API, Angular UI; tests in Playwright and Hurl | Selected. Install spec written, not yet run end to end. Draft BA backlog awaiting human review | `realworld/` |
| Java web app with REST API | Java; tests in JUnit with RestAssured and Selenium | **Not in Phase 1** (D-01). Candidates checked so far failed on licence or lacked independent requirements | — |

Cypress Real World App was declined: its only "requirements" are its own tests (breaks P2 in `../intent.md`). Its earlier working copy stays in `research/` for reference.

## realworld/

| Path | Content |
|---|---|
| `install/` | Standalone installation and verification spec (`INSTALL.md`), scripts and frontend patch. Installs to `~/realworld-sandbox`, outside this repo |
| `requirements/source/Conduit-backlog.xlsx` | Draft BA backlog derived from the specification (not stakeholder-authored) |

Background, architecture and the next task: [`../docs/handover/2026-11-17-realworld-sandbox/`](../docs/handover/2026-11-17-realworld-sandbox/00-START-HERE.md).
