# Defect report: CYPRESS-RWA-TRANSACTIONS-010-TC2

**Requirement:** CYPRESS-RWA-TRANSACTIONS-010
**Test case:** PATCH /transactions/:transactionId returns 422 when requestStatus has invalid value
**Confidence:** high

## Rationale
The test fails at the setup step (POST /transactions) with a 500 error before reaching the actual test scenario. The error '[Dinero.js] Amount is invalid' indicates the application crashes when creating a transaction with amount=100, which is a valid numeric value. This is an application defect in transaction creation logic, not a test problem. The test correctly attempts to create a transaction as setup, and the requirement expects PATCH to work on valid transactions. The application should handle valid transaction creation without crashing.

## Repro steps
1. Authenticate as primaryUser via session-cookie login
1. POST /transactions with body: {"transactionType": "payment", "amount": 100, "description": "Test transaction for invalid requestStatus test", "receiverId": "secondaryUserId"}
1. Observe 500 Internal Server Error with message '[Dinero.js] Amount is invalid' instead of successful transaction creation (200/201)
