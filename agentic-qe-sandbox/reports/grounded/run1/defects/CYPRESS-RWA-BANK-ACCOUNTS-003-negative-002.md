# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-003-negative-002

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-003
**Test case:** creates a new bank account - invalid account number
**Confidence:** high

## Rationale
The API accepts an empty string for accountNumber and returns 200 OK, creating a bank account with accountNumber=''. According to the API hints, accountNumber is a required string field in the request body. The application should validate this field and reject empty/invalid values with a 400 or 422 status code. Instead, it accepts the invalid input and persists it to the database. This behavior is consistent across all 3 runs, indicating a missing validation defect in the backend.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. POST /bankAccounts with body: {"bankName":"Test Bank","accountNumber":"","routingNumber":"987654321"}
1. Observe: Response status is 200 and account is created with empty accountNumber
1. Expected: Response status should be 400 or 422 rejecting the invalid/empty accountNumber
