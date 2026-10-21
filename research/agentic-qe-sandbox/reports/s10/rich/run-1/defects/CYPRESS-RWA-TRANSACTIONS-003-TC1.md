# Defect report: CYPRESS-RWA-TRANSACTIONS-003-TC1

**Requirement:** CYPRESS-RWA-TRANSACTIONS-003
**Test case:** Get pending request transactions for user within a time range - authenticated
**Confidence:** high

## Rationale
The test expects pending transactions for the authenticated user within the date range 2018-01-01 to 2030-12-05. The API returns 200 with an empty results array, but the acceptance criteria explicitly require that results[0].senderId, results[0].receiverId, and results[0].createdAt exist, implying at least one pending transaction should be present. The requirement also states 'jsonpath "$.results[?(@.senderId!='{{user_id}}' && @.receiverId!='{{user_id}}')]" count == 0', which only makes sense if results is non-empty and contains transactions where the user is either sender or receiver. The application fails to return any pending transactions when it should return at least one. This is reproducible across all 3 runs with identical results.

## Repro steps
1. Authenticate as primaryUser (user_id provided)
1. Send GET /transactions?requestStatus=pending&rangeStartTs=2018-01-01T00:00:00.000Z&rangeEndTs=2030-12-05T00:00:00.000Z
1. Observe: API returns 200 with empty results array and totalPages=0
1. Expected: API should return at least one pending transaction with senderId, receiverId, and createdAt fields populated, where the authenticated user is either sender or receiver
