# Defect report: CYPRESS-RWA-NOTIFICATIONS-004-TC3

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-004
**Test case:** PATCH notification with invalid isRead type returns 422
**Confidence:** high

## Rationale
The test correctly validates that PATCH /notifications/{notification_id} with invalid isRead type should return 422 with exactly 1 error about the 'isRead' parameter. However, the API returned 2 errors: one for 'isRead' (expected) and one for 'notificationId' with value '{8NnQy36xaMtB}' (unexpected). The path parameter was not properly substituted - the literal string '{8NnQy36xaMtB}' was sent instead of the captured notification ID '8NnQy36xaMtB'. This indicates a defect in the API's path parameter handling or routing logic that causes it to treat a malformed path as a validation error rather than properly parsing the parameter. The test assertion is correct per the acceptance criteria which expects exactly 1 error for the isRead parameter.

## Repro steps
1. Authenticate as a valid user
1. GET /notifications to obtain a valid notification_id (e.g., '8NnQy36xaMtB')
1. PATCH /notifications/{8NnQy36xaMtB} with body {"isRead": "not-a-boolean"}
1. Observe: Response is 422 but contains 2 errors instead of 1
1. Expected: Single error with param='isRead'
1. Actual: Two errors - param='isRead' and param='notificationId' with value '{8NnQy36xaMtB}'
