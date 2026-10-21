# Defect report: CYPRESS-RWA-LIKES-002-TC005

**Requirement:** CYPRESS-RWA-LIKES-002
**Test case:** Like transaction with non-existent transaction id
**Confidence:** high

## Rationale
The test expects a 404 status when attempting to like a non-existent transaction (POST /likes/{{unknown_id}}), which is explicitly required by the acceptance criteria. Instead, the API returns a 500 Internal Server Error with a TypeError indicating that getTransactionById returned undefined and the code attempted to destructure properties from it. This is a clear application defect: the API should validate that the transaction exists and return 404 before attempting to create a like record, rather than crashing with an unhandled exception. The failure is consistent across all 3 runs with identical output, ruling out flakiness.

## Repro steps
1. Authenticate as a valid user
1. Send POST /likes/00000000-0000-0000-0000-000000000000 (a well-formed but non-existent transaction ID)
1. Observe: API returns 500 Internal Server Error with TypeError about undefined transaction
1. Expected: API should return 404 status
