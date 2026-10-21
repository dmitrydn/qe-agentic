# Defect report: CYPRESS-RWA-TRANSACTIONS-008-negative-001

**Requirement:** CYPRESS-RWA-TRANSACTIONS-008
**Test case:** Create request transaction with invalid receiver id
**Confidence:** high

## Rationale
The API accepts a transaction request with an invalid/non-existent receiverId ({{unknown_id}} = '00000000-0000-0000-0000-000000000000') and returns 200 OK, creating a transaction with status 'pending'. The test correctly expects 400 or 404 for an unknown receiver. The failure is consistent across all 3 runs with identical behavior, indicating the application does not validate that the receiverId corresponds to an existing user before creating the transaction.

## Repro steps
1. Authenticate as primaryUser
1. POST /transactions with body containing transactionType='request', receiverId='00000000-0000-0000-0000-000000000000' (non-existent user ID), and valid other fields
1. Observe: API returns 200 OK and creates transaction with the invalid receiverId
1. Expected: API should return 400 or 404 rejecting the invalid receiverId
