# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-003-negative-002

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-003
**Test case:** creates a new bank account - invalid account number
**Confidence:** high

## Rationale
The API accepts an empty string for accountNumber and returns 200 with a successfully created bank account, when it should reject the request with 400 or 422. The API hints document that accountNumber is a required string field in the request body. All three runs consistently show the same behavior: the server creates a bank account with accountNumber set to empty string instead of validating and rejecting the invalid input. This is a missing input validation defect.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. POST /bankAccounts with body: {"bankName":"Test Bank","accountNumber":"","routingNumber":"987654321"}
1. Observe: response status is 200 and account is created with empty accountNumber
1. Expected: response status should be 400 or 422 rejecting the invalid/empty accountNumber
