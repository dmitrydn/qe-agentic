# Defect report: CYPRESS-RWA-CONTACTS-001-TC001

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Authenticated user gets a list of contacts by username
**Confidence:** high

## Rationale
The application returns a 500 Internal Server Error with a TypeError: 'Cannot read properties of undefined (reading id)' at getUserId in backend/database.ts. The stack trace shows the error originates from getContactsByUsername called by the contact-routes handler. This is a server-side crash when processing a valid GET /contacts/:username request. The requirement specifies a 200 status should be returned, but the application fails to handle the request due to an undefined value being dereferenced. The failure is deterministic (reproduced identically across all 3 runs after fresh resets), indicating a real application defect rather than test or environment issues.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded user (primaryUser) via session-cookie login
1. Send GET /contacts/{primaryUser.username}
1. Observe: 500 Internal Server Error with TypeError in getUserId function
1. Expected: 200 OK with contacts array containing objects with userId property
