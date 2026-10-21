# Defect report: CYPRESS-RWA-COMMENTS-002-negative-003

**Requirement:** CYPRESS-RWA-COMMENTS-002
**Test case:** Post comment on unknown transaction returns 404
**Confidence:** high

## Rationale
The acceptance criteria explicitly states that POST /comments/{{unknown_id}} with body { "content": "Comment on unknown transaction" } should return status 404. The test correctly implements this requirement by posting to a non-existent transaction ID (99999999). However, the application returns 500 Internal Server Error with a TypeError indicating that getTransactionById returns undefined and the code attempts to destructure properties from it without proper null/undefined handling. This is a real application defect: the API should gracefully handle requests for non-existent transactions and return 404, not crash with an unhandled exception. The test is correctly written per the requirement, and the failure is deterministic (all 3 runs produced identical 500 errors).

## Repro steps
1. Authenticate as a valid user
1. POST /comments/99999999 with body {"content": "Comment on unknown transaction"}
1. Observe: returns 500 Internal Server Error with TypeError about undefined destructuring
1. Expected: should return 404 Not Found
