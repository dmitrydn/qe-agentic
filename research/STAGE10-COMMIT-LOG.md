# Stage 10 — original commit log (recovered metadata)

These 8 commits were made locally on 2026-07-20/21 and never pushed to GitHub (origin stopped at 2fe15d9). The local .git later lost objects (OneDrive sync), so the commits' file contents can no longer be exported. Their files survive in the working tree (research/agentic-qe-sandbox/experiments/stage10-oracle/ and related) and were re-committed during the 2026-10-21 restructure. This file preserves the original hashes, timestamps and messages, in particular db961fd, which recorded that the RICH oracle set was frozen before any runner or results existed.

```
commit 07d7afad0f6fe3613847db59e86901212e10d151
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-21 09:23:48 +0300
CommitDate: 2026-07-21 09:23:48 +0300

Stage 10: executor robustness, ambient fixtures, context declaration, analysis + orchestrator

commit 739c37f1dfac39fa93889973e096908847620ad2
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-21 09:11:13 +0300
CommitDate: 2026-07-21 09:11:13 +0300

Stage 10: executor supports negative index, JSONPath filters, integer type, deep-eq

commit 8c63c9f43fc25b9730a333f69ab78fc4d92ed09f
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-21 08:56:32 +0300
CommitDate: 2026-07-21 08:56:32 +0300

Stage 10: wire ambient identity fixtures + resolve {{capture}} in paths

commit 2ce860ecaa26c16db76dbe60b5d91746341ae3db
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-20 19:54:53 +0300
CommitDate: 2026-07-20 19:54:53 +0300

Stage 10: experiment analysis core + I/O + orchestrator (unit 3)

commit 6c07bc0128f138577977432de5ebffe49c90434f
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-20 19:37:55 +0300
CommitDate: 2026-07-20 19:37:55 +0300

Stage 10: wire rich/sparse dose requirement sources onto live cypress-rwa

commit d75ee8dced95bcd2ffa37f1415a4ecd811eb3811
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-20 19:08:16 +0300
CommitDate: 2026-07-20 19:08:16 +0300

Stage 10: AQE_STRIP_APIHINTS flag (both doses stand on own oracle)

Factor hint selection into pure api-hints-policy.js (resolveApiHints,
stripAllFromEnv); apiHintsFor delegates. Under the flag, curated AND auto
hints return none; loadRequirements additionally drops the apiHints field
that core's toRequirement backfills via inferApiHints, on both return paths.
No core change (boundary green). Verified: flag OFF 41/44 keep hints,
flag ON 0/44. Full suite 279/279.

commit 97fed343642776465e93ce0b7cbf7d5b7abd9012
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-20 18:46:53 +0300
CommitDate: 2026-07-20 18:46:53 +0300

Stage 10: add SPARSE-dose stripper + invariant tests

Deterministic, purely-subtractive derivation of the SPARSE oracle dose from
the frozen RICH set. Strips value/shape assertions and negative cases while
preserving each requirement's headline request, status, title, and fixtures
so the doses differ only by oracle content. 123 invariant assertions.
SPARSE files themselves are derived (regenerate via node strip-oracle.js).

commit db961fda8c32d3e238c61c361abc5bafaba7d4d2
Author:     dmitrydn <dmitrydn@gmail.com>
AuthorDate: 2026-07-20 18:17:06 +0300
CommitDate: 2026-07-20 18:17:06 +0300

Stage 10: freeze blind-authored RICH oracle set (24 Cypress RWA reqs)

Authored by a clean-room pass with zero exposure to the seeded-defect
catalog (fault-injector.js), eval/, verify.sh, PROGRESS.md, or spec docs.
Committed before any runner/strip/defect-linked code exists so the oracles
are provably not tuned to results. 24 .hurl files, 96 oracle blocks, 57
negative cases. See rich/AUTHORING-NOTES.md for the blindness attestation.

```
