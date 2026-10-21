# Defect report: CYPRESS-RWA-NOTIFICATIONS-004-TC2

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-004
**Test case:** PATCH notification with invalid field (missing isRead) returns 422
**Confidence:** high

## Rationale
The test correctly sends a PATCH request with an invalid field (missing required 'isRead') and expects exactly 1 error about the missing 'isRead' parameter. However, the API returns 2 errors: one for the missing 'isRead' and another for 'notificationId' validation. The acceptance criteria explicitly states 'jsonpath "$.errors" count == 1' and 'jsonpath "$.errors[0].param" == "isRead"' for this scenario. The API is incorrectly validating the path parameter when it should only report the body validation error for the missing required field.

## Repro steps
1. Authenticate as primaryUser
1. GET /notifications to obtain a valid notification_id (e.g., '8NnQy36xaMtB')
1. PATCH /notifications/8NnQy36xaMtB with body {"notANotificationField": "not a notification field"}
1. Observe: Response status is 422 (correct) but errors array contains 2 items instead of 1
1. Expected: errors array should contain only 1 error with param='isRead'
1. Actual: errors array contains 2 errors: one for 'isRead' and one for 'notificationId'
