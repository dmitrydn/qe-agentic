# Defect report: CYPRESS-RWA-USERS-004-negative-001

**Requirement:** CYPRESS-RWA-USERS-004
**Test case:** Get user profile by username - nonexistent username
**Confidence:** high

## Rationale
The API returns 200 OK with an empty user object when queried for a nonexistent username, instead of returning 404 or 400 as expected for a resource-not-found scenario. This is a real defect: the application fails to properly handle the case where the requested username does not exist in the database. The behavior is consistent across all 3 runs, ruling out flakiness. The API hint documents this endpoint exists and accepts username parameters, but the implementation does not validate whether the username exists before returning success.

## Repro steps
1. Seed the database with cy.task('db:seed')
1. Authenticate as a seeded user via session-cookie login
1. Send GET /users/profile/nonexistentuser999
1. Observe: response status is 200 with body {"user":{}}
1. Expected: response status should be 404 or 400 indicating the user was not found
