# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-001

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete a bank account - positive flow
**Confidence:** high

## Rationale
The test expects the POST /bankAccounts response to contain a top-level 'id' field, but the API consistently returns the bank account data wrapped in an 'account' object. All three runs show the same structure: the response body is {"account":{"id":"...", ...}} rather than {"id":"...", ...}. The 'id' field exists at path 'account.id', not at the root level. This is a real defect in the API's response structure - it does not match the expected contract where the id should be directly accessible for capture.

## Repro steps
1. Authenticate as primaryUser
1. POST /bankAccounts with body {"bankName": "Delete Me Bank", "accountNumber": "111111111", "routingNumber": "222222222"}
1. Observe response status 200 but body structure is {"account":{"id":"cZ2cUWnuq",...}} instead of expected {"id":"cZ2cUWnuq",...}
1. The 'id' field is nested under 'account' key, not at root level as required for the test's capture mechanism
