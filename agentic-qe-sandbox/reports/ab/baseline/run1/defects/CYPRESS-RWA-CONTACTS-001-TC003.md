# Defect report: CYPRESS-RWA-CONTACTS-001-TC003

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Get contacts for non-existent username
**Confidence:** high

## Rationale
The application returns a 500 Internal Server Error with a TypeError 'Cannot read properties of undefined (reading id)' when requesting contacts for a non-existent username. The test expects either 200 or 404, both of which are valid HTTP responses for this scenario. A 500 error indicates the backend code fails to handle the case where a username does not exist in the database, attempting to access properties on an undefined object instead of gracefully returning 404 (not found) or an empty result set with 200. This is a clear application defect in error handling.

## Repro steps
1. Ensure database is seeded with known users
1. Send GET /contacts/nonexistentuser12345
1. Observe: 500 Internal Server Error with TypeError in getUserId function
1. Expected: 404 Not Found or 200 with empty contacts array
