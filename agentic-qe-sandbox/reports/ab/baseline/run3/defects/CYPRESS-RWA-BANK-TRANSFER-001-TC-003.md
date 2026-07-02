# Defect report: CYPRESS-RWA-BANK-TRANSFER-001-TC-003

**Requirement:** CYPRESS-RWA-BANK-TRANSFER-001
**Test case:** Secondary user gets their own bank transfers
**Confidence:** high

## Rationale
The application returns 404 'Cannot GET /bankTransfer' for an authenticated secondary user, indicating the endpoint does not exist or is not properly registered. The requirement explicitly states that a GET /bankTransfer request should return 200 with bank transfers for the authenticated user. The test correctly authenticates as secondaryUser and makes the documented GET /bankTransfer request. The 404 response with HTML error page shows the route is not handled by the application, which is a clear defect in the API implementation. All three runs produced identical 404 failures, ruling out flakiness.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded secondary user via session-cookie login
1. Send GET request to /bankTransfer
1. Observe: 404 'Cannot GET /bankTransfer' instead of expected 200 with transfers array
