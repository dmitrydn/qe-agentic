# Instructions for GitHub Copilot in this repository

This repository builds QE capabilities that check agent-built software against its requirements. Start from:

1. `intent.md`: what is being built and the principles P1–P8
2. `DECISIONS.md`: current decisions
3. `docs/handover/2026-11-17-realworld-sandbox/00-START-HERE.md`: the current task and its brief

## Hard rules (always apply)

- **Never read, open, list, grep, download or fetch** RealWorld's official test suites: `specs/api/hurl/`, `specs/api/bruno/`, `specs/e2e/` (including `*.spec.ts`), or the Postman collection. This applies to local copies (for example `~/realworld-sandbox/`) and to GitHub (raw files, API, clones). They are the held-out oracle used to score agent work (`DECISIONS.md` D-03).
- **Never read implementation code** of the RealWorld backend or frontend when designing tests or requirements.
- **Invent nothing.** Every requirement statement cites the specification file and line at commit `ebbcdeb8d55b42a3a613c787560498b8ef10003f`, or is tagged `BA-ASSUMPTION`.
- **Don't edit** `intent.md`, `DECISIONS.md`, anything under `research/`, or `sandboxes/realworld/requirements/source/`.
- **Don't commit, push or merge.** A person reviews your changes as a diff.
- **Keep a read log.** At the end of every run, list every file path and URL you read, in the hand-back file the brief names.
