# Defect report: CYPRESS-RWA-TRANSACTIONS-008-negative-003

**Requirement:** CYPRESS-RWA-TRANSACTIONS-008
**Test case:** fails to create request with invalid amount
**Confidence:** high

## Rationale
The API accepts a negative amount (-50) for a transaction request and returns 200 OK with a created transaction object, when it should reject the invalid input with a 400 or 422 status code. The API hints document that 'amount' is a numeric field but do not specify validation constraints. However, a negative amount for a payment/request transaction is semantically invalid in a financial application context. The test consistently fails across all 3 runs with identical behavior: the server creates a transaction with amount=-5000 (stored as cents) and returns status 200 instead of rejecting the invalid input. This is a missing input validation defect in the POST /transactions endpoint.

## Repro steps
1. Authenticate as a seeded user (e.g., Heath93/uBmeaz5pX)
1. POST /transactions with body: {"transactionType":"request","receiverId":"uBmeaz5pX","description":"Negative amount","amount":-50}
1. Observe: Server returns 200 OK and creates transaction with negative amount
1. Expected: Server should return 400 or 422 and reject the invalid negative amount
