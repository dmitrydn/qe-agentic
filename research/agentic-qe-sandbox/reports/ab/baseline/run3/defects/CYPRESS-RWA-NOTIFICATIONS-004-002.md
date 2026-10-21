# Defect report: CYPRESS-RWA-NOTIFICATIONS-004-002

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-004
**Test case:** PATCH /notifications/:notificationId returns 422 when isRead has invalid type
**Confidence:** high

## Rationale
The test correctly sends an invalid type for isRead (string 'notABoolean' instead of boolean) and expects exactly 1 validation error per the acceptance criteria. However, the API returns 2 errors: one for the invalid isRead field and another for notificationId with value ':notificationId'. The second error indicates the path parameter was not properly substituted/parsed, causing the validator to reject the literal string ':notificationId' as an invalid notificationId. This is a real defect in the application's request handling - either the path parameter substitution is broken or the validator is incorrectly triggered on the raw template string.

## Repro steps
1. Authenticate as a seeded user (e.g., primaryUser)
1. GET /notifications to obtain a valid notificationId from results[0].id
1. PATCH /notifications/{notificationId} with body {"isRead": "notABoolean"}
1. Observe: response status 422 with errors array containing 2 items instead of 1
1. Expected: errors array should contain only 1 error for the invalid isRead field
1. Actual: errors array contains 2 errors - one for isRead and one for notificationId with value ':notificationId'
