# Defect report: CYPRESS-RWA-NOTIFICATIONS-004-002

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-004
**Test case:** PATCH /notifications/:notificationId returns 422 when isRead has invalid type
**Confidence:** high

## Rationale
The test correctly sends an invalid type for isRead (string 'notABoolean' instead of boolean) and expects exactly 1 validation error per the acceptance criteria. However, the application returns 2 errors: one for the invalid isRead field and another for notificationId parameter validation. The notificationId error is spurious because the test captured a valid ID ('8NnQy36xaMtB') from the GET request and substituted it into the path template. The path parameter validation should not fail when a valid ID is provided. The application is incorrectly validating the path parameter, likely treating the literal string ':notificationId' as the value instead of the substituted captured ID, resulting in an extra error beyond what the requirement specifies.

## Repro steps
1. Authenticate as a seeded user (e.g., primaryUser)
1. GET /notifications to obtain a valid notificationId (e.g., '8NnQy36xaMtB')
1. PATCH /notifications/8NnQy36xaMtB with body {"isRead": "notABoolean"}
1. Observe: response status 422 with 2 errors in errors array
1. Expected: response status 422 with exactly 1 error (for invalid isRead type only)
