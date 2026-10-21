# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-001-TC02

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-001
**Test case:** Get bank accounts list returns only authenticated user's accounts
**Confidence:** high

## Rationale
The acceptance criteria explicitly states 'Then jsonpath "$.results[?(@.userId!='{{user_id}}')]" count == 0', meaning the authenticated user should only see their own bank accounts. The test failed consistently across 3 runs with identical results, showing that GET /bankAccounts returned a bank account with userId='uBmeaz5pX' when the authenticated user_id is different. This violates the authorization requirement that users should only see their own bank accounts.

## Repro steps
1. Authenticate as the primary user (user_id={{user_id}})
1. Send GET /bankAccounts
1. Observe response status 200 with results array containing a bank account with userId='uBmeaz5pX'
1. Expected: all accounts in results should have userId matching {{user_id}}
1. Actual: at least one account (id='pgl34JtnfhX') has userId='uBmeaz5pX' which differs from the authenticated user
