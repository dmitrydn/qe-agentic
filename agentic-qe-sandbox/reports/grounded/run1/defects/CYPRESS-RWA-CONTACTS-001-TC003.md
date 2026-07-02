# Defect report: CYPRESS-RWA-CONTACTS-001-TC003

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Get contacts for non-existent username
**Confidence:** high

## Rationale
The application crashes with a 500 Internal Server Error when requesting contacts for a non-existent username. The stack trace shows 'TypeError: Cannot read properties of undefined (reading id)' in getUserId at backend/database.ts, indicating the code does not handle the case where a username lookup returns undefined. The test correctly expects either 200 or 404, but the application fails to gracefully handle the missing user and instead throws an unhandled exception. This is a clear application defect - the endpoint should return 404 for non-existent users, not crash.

## Repro steps
1. Send GET /contacts/nonexistentuser12345
1. Observe 500 Internal Server Error with TypeError about reading 'id' of undefined
1. Expected: 404 Not Found or 200 with empty contacts array
