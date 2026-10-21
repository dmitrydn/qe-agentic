# Defect report: CYPRESS-RWA-CONTACTS-001-TC001

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Authenticated user gets a list of contacts by username
**Confidence:** high

## Rationale
The application returns a 500 Internal Server Error with a TypeError: 'Cannot read properties of undefined (reading id)' at getUserId in backend/database.ts. The stack trace shows the error originates in getContactsByUsername called from the contact-routes handler. The requirement specifies a 200 status should be returned when requesting GET /contacts/:username for an authenticated user after database seeding. The error is deterministic (reproduced identically across all 3 runs with fresh state) and indicates the backend code is attempting to access a property on an undefined object, which is a clear application defect. The test assertions are grounded in the acceptance criteria (status 200, contacts array with userId property) and the failure is due to the server crash, not test issues.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded user via session-cookie login (cy.loginByApi)
1. Send GET /contacts/:username where :username is the authenticated user's username
1. Observe: Server returns 500 with TypeError about reading 'id' of undefined in getUserId function
1. Expected: Server returns 200 with a contacts array containing objects with userId property
