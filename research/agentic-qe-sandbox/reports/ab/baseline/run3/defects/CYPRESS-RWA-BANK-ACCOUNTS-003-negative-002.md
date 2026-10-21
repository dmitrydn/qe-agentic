# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-003-negative-002

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-003
**Test case:** creates a new bank account - invalid account number
**Confidence:** high

## Rationale
The test sends a POST /bankAccounts request with an empty accountNumber field (invalid input). The API documentation specifies accountNumber as a required string field. The application should reject this invalid input with a 400 or 422 status code, but instead returns 200 and successfully creates a bank account with an empty accountNumber. This behavior is consistently reproduced across all 3 runs, indicating the application lacks proper input validation for the accountNumber field.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send POST /bankAccounts with body: {"bankName": "Test Bank", "accountNumber": "", "routingNumber": "987654321"}
1. Observe: Response status is 200 with a created account object containing empty accountNumber
1. Expected: Response status should be 400 or 422 rejecting the invalid empty accountNumber
