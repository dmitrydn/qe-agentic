# Defect report: CYPRESS-RWA-TRANSACTIONS-010-TC2

**Requirement:** CYPRESS-RWA-TRANSACTIONS-010
**Test case:** PATCH /transactions/:transactionId returns 422 when requestStatus has invalid value
**Confidence:** high

## Rationale
The test fails during the setup step (POST /transactions) with a 500 error before it can even attempt the PATCH request that is the actual subject of the test. The error '[Dinero.js] Amount is invalid' indicates the application crashes when creating a transaction with amount=100, which is a valid numeric value. This is a real defect in the transaction creation logic, not a test problem. The test correctly attempts to create a transaction as setup, and the application should handle this valid request without crashing. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Authenticate as primaryUser via session-cookie login
1. Send POST /transactions with body: {"transactionType": "payment", "amount": 100, "description": "Test transaction for invalid requestStatus test", "receiverId": "secondaryUserId"}
1. Observe: Server returns 500 with error 'Error: [Dinero.js] Amount is invalid' instead of successfully creating the transaction
