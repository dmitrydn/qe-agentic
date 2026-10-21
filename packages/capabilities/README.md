# capabilities

| Folder | Capability | Uses AI? |
|---|---|---|
| c1-requirement-check | Can the requirement be tested, and is it true of the system? | Ratings by AI; verdict by rules |
| c2-independent-test-design | Tests per acceptance criterion, from the requirement only | Drafting by AI; coverage by rules |
| c3-execution-evidence | What ran, for which requirement version, with what result; changes since | No (rule-based) |
| c4-claim-check | Does the claimed status match the evidence? | Rules first; AI only for how well a test checks a criterion |
| c5-readiness-report | One repeatable release view for the person who signs | No (summary text optional) |

Build order: C3 → C1 → C4 → C2 → C5 (see `../../intent.md` §7).
