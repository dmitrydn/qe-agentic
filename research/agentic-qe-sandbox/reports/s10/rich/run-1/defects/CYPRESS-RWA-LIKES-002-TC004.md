# Defect report: CYPRESS-RWA-LIKES-002-TC004

**Requirement:** CYPRESS-RWA-LIKES-002
**Test case:** Non-existent transaction ID returns not found
**Confidence:** high

## Rationale
The requirement explicitly states that POST /likes/{{unknown_id}} should return status 404. The test correctly expects 404 for a non-existent transaction ID (99999999). However, the API consistently returns 422 with a validation error indicating 'Invalid value' for the transactionId parameter. This is a real defect: the API is performing input validation and rejecting the ID format before checking if the transaction exists, when it should first verify existence and return 404 for non-existent resources. The behavior is deterministic across all 3 runs.

## Repro steps
1. Authenticate as a valid user
1. Send POST /likes/99999999 (a non-existent transaction ID)
1. Observe: API returns 422 with validation error
1. Expected: API should return 404 for non-existent transaction
