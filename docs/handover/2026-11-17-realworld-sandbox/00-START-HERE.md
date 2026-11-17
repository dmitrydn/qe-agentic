# Handover: RealWorld (Conduit) sandbox — start here

**Date:** 2026-11-17 · **Owner:** Dmitry (QE Manager) · **Status:** app selected; sandbox installation spec written but not yet run end to end; BA backlog drafted, not yet reviewed by a human.

## Read in this order

| # | File | What it gives you |
|---|---|---|
| 1 | `01-app-selection.md` | Which app was chosen, why, what was rejected, and what the choice does **not** prove |
| 2 | `02-sandbox-architecture.md` | How the sandbox is built: repos, pinned versions, what agents may and may not read, known risks |
| 3 | `03-next-task-business-requirements.md` | **Your task**: turn the existing draft backlog into business requirements ready for human BA review |

## These documents override older text in this repo

The repo still contains statements written before the app was selected. Where they conflict with this handover, **this handover wins**:

| Location | Outdated statement | Current position |
|---|---|---|
| `sandboxes/README.md` | Cypress RWA working copy is the sandbox | Conduit lives in `sandboxes/realworld/` |
| `research/agentic-qe-sandbox/requirements/unified-requirements.md` | 191 requirements | Derived from RWA's test files, so it breaks principle P2 (`intent.md` §3). Do not use |

`intent.md` was updated to v2.1 on 2026-11-17 to match this handover. Everything in it (principles P1–P8, capabilities C1–C5, rules in §5, eval method in §8) applies.

## Files in this handover

| Path | Content | Origin |
|---|---|---|
| `docs/handover/2026-11-17-realworld-sandbox/` | These four Markdown files | Written 2026-11-17 |
| `sandboxes/realworld/install/` | `INSTALL.md`, `scripts/` (3), `patches/` (1): standalone installation and verification spec | Package `realworld-sandbox-package.zip`, Draft v1, 2026-10-24 |
| `sandboxes/realworld/requirements/source/Conduit-backlog.xlsx` | Draft BA backlog: 7 epics, 23 user stories, 89 business rules, 72 Gherkin acceptance criteria, 54 open questions | Claude-authored, 2026-10-30, Status "Draft" on every story, 0 of 54 questions answered |
| `research/realworld-spike/` | Measurement spike results, 73-requirement baseline v0.1, 210-requirement independent recount, run logs | 2026-10-23, **on the older spec pin `450bbc5`** (see `02-sandbox-architecture.md` §3) |

Committed 2026-11-17 on branch `realworld-sandbox-handover` (not pushed).
