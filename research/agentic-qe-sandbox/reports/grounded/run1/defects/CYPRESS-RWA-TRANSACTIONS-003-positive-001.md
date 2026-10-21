# Defect report: CYPRESS-RWA-TRANSACTIONS-003-positive-001

**Requirement:** CYPRESS-RWA-TRANSACTIONS-003
**Test case:** Gets a list of pending request transactions for user between a time range
**Confidence:** high

## Rationale
The test consistently returns an empty results array when querying for pending request transactions within a valid time range (2020-2025). The requirement states the test should 'get a list of pending request transactions for user between a time range' and expects results[0] to exist and satisfy isSenderOrReceiver (having senderId and receiverId). The database is seeded with data/database-seed.json before each run, so pending request transactions should exist. The API returns 200 with valid structure but zero results across all 3 identical runs, indicating the application is not correctly filtering or returning the expected pending request transactions that should be present in the seeded data.

## Repro steps
1. Seed the database with cy.task('db:seed') using data/database-seed.json
1. Authenticate as a seeded user via session-cookie login
1. Send GET /transactions?status=pending&requestStatus=pending&rangeStartTs=2020-01-01T00:00:00.000Z&rangeEndTs=2025-12-31T23:59:59.999Z
1. Observe: Response is 200 with body {"pageData":{"page":1,"limit":10,"hasNextPages":false,"totalPages":0},"results":[]}
1. Expected: results array should contain at least one pending request transaction with senderId and receiverId fields
