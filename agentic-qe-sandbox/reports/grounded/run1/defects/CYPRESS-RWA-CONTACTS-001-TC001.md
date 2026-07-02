# Defect report: CYPRESS-RWA-CONTACTS-001-TC001

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Authenticated user gets a list of contacts by username
**Confidence:** high

## Rationale
The application returns a 500 Internal Server Error with a TypeError: 'Cannot read properties of undefined (reading id)' at getUserId in backend/database.ts. The stack trace shows the error originates in getContactsByUsername called from the contact-routes handler. The requirement specifies that an authenticated user making a GET /contacts/:username request should receive a 200 status with contacts data including userId property. The consistent 500 error across all 3 runs indicates the backend code has a defect where it attempts to access the 'id' property of an undefined object when retrieving contacts by username.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded user via session-cookie login (cy.loginByApi)
1. Send GET /contacts/:username where :username is the authenticated user's username
1. Observe: 500 Internal Server Error with TypeError about undefined 'id' property
1. Expected: 200 status with response body containing contacts array with userId properties
