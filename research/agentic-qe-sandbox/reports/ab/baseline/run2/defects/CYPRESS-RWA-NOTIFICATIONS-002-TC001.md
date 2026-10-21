# Defect report: CYPRESS-RWA-NOTIFICATIONS-002-TC001

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-002
**Test case:** Creates notifications for transaction, like and comment as authenticated user
**Confidence:** high

## Rationale
The application returns 404 'Cannot POST /notifications' when the requirement explicitly documents POST /notifications as a valid endpoint in the API hints. The test correctly authenticates as a seeded user and sends a POST request to /notifications expecting a success status (200/201/204), but the endpoint does not exist or is not registered in the application. This is a clear defect: the documented API contract specifies this endpoint should exist, but the application does not implement it.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded user via session-cookie login
1. Send POST request to /notifications with empty body
1. Observe: 404 'Cannot POST /notifications' returned
1. Expected: Success status (200, 201, or 204) indicating notifications were created
