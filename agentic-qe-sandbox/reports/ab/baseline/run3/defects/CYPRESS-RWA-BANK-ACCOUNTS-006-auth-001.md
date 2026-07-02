# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-006-auth-001

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-006
**Test case:** Unauthenticated user cannot create a bank account
**Confidence:** high

## Rationale
The application accepts an unauthenticated GraphQL mutation to create a bank account and returns HTTP 200, when it should reject the request with 401 or 403. The error message 'Cannot read properties of undefined (reading 'id')' indicates the server attempted to process the mutation without a valid user context, rather than properly enforcing authentication. This is a security defect: the endpoint lacks proper authentication guards.

## Repro steps
1. Send POST /graphql with mutation createBankAccount without any authentication cookie or token
1. Include valid mutation variables: bankName='Test Bank', accountNumber='1234567890', routingNumber='987654321'
1. Observe: server returns 200 OK with GraphQL error about undefined 'id' property
1. Expected: server should return 401 or 403 status code rejecting the unauthenticated request
