# qe-agentic

QE checks for agent-built software: five standalone capabilities that check delivery work against the requirement. Each runs on its own or as a pipeline step, on any stack, requirement source or approved AI provider.

**Start with [`intent.md`](intent.md)**: what we are building, why, and how we prove it works.

| Folder | What's in it |
|---|---|
| `intent.md` | Current intent (v2.2, 2026-11-17) |
| `DECISIONS.md` | Decisions made after intent v2 (D-01…) |
| `packages/` | Product code: `core/`, `connectors/`, `capabilities/` (C1–C5), `cli/` |
| `pipelines/` | Azure DevOps templates |
| `evals/` | Per capability: measurement plan (frozen before runs), test sets, results |
| `sandboxes/` | Phase 1 demo application: `realworld/` (Conduit, TypeScript) |
| `docs/` | `intent/` history and reviews · `architecture/` · `batc-integration/` · `handover/` briefs for the next person or agent |
| `reference/` | BATC accelerator source (separate git repo, read-only) |
| `research/` | Earlier experiments and evidence (Stages 1–10), unchanged |
| `linkedin-campaign/` | Communication material; not part of the product |

Status: intent agreed; Phase 1 build not started. TypeScript sandbox app selected (RealWorld / Conduit); next step is BA review of its derived requirements: see [`docs/handover/2026-11-17-realworld-sandbox/`](docs/handover/2026-11-17-realworld-sandbox/00-START-HERE.md).
