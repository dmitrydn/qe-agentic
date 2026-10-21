# Defect report: CYPRESS-RWA-TRANSACTIONS-003-positive-001

**Requirement:** CYPRESS-RWA-TRANSACTIONS-003
**Test case:** Gets a list of pending request transactions for user between a time range
**Confidence:** high

## Rationale
The test requests pending request transactions within a valid time range (2020-2025) after database seeding, but the API returns an empty results array. The acceptance criteria states the test should 'get a list of pending request transactions for user between a time range' and verify 'results[0]' satisfies isSenderOrReceiver, implying at least one result should exist. The seeded database (database-seed.json) should contain transactions matching these criteria. The consistent empty response across all 3 runs with fresh resets indicates the application is not correctly filtering or returning pending request transactions for the authenticated user within the specified time range.

## Repro steps
1. Seed the database with cy.task('db:seed') using data/database-seed.json
1. Authenticate as a seeded user via session-cookie login (cy.loginByApi)
1. Send GET /transactions?status=pending&requestStatus=pending&rangeStartTs=2020-01-01T00:00:00.000Z&rangeEndTs=2025-12-31T23:59:59.999Z
1. Observe: Response status is 200 but results array is empty []
1. Expected: results array should contain at least one pending request transaction where the authenticated user is sender or receiver
