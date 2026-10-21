# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-003-negative-002

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-003
**Test case:** creates a new bank account - invalid account number
**Confidence:** high

## Rationale
The application accepts an empty accountNumber field and returns 200 OK, creating a bank account with an empty account number. According to the API hints, accountNumber is a required string field in the request body. The test correctly expects a 400 or 422 status for invalid input (empty string), but the application fails to validate this required field and instead persists the invalid data. This is consistently reproducible across all 3 runs, indicating a missing input validation defect in the POST /bankAccounts endpoint.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. POST /bankAccounts with body: {"bankName":"Test Bank","accountNumber":"","routingNumber":"987654321"}
1. Observe: Response status is 200 and account is created with empty accountNumber field
1. Expected: Response status should be 400 or 422 rejecting the empty accountNumber
