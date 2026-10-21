# Defect report: CYPRESS-RWA-TRANSACTIONS-002-TC1

**Requirement:** CYPRESS-RWA-TRANSACTIONS-002
**Test case:** Get pending request transactions for authenticated user
**Confidence:** high

## Rationale
The requirement states that GET /transactions?requestStatus=pending should return only transactions where the authenticated user ({{user_id}}) is either the sender or receiver. The acceptance criteria explicitly asserts: 'Then jsonpath "$.results[?(@.senderId!='{{user_id}}' && @.receiverId!='{{user_id}}')]" count == 0', meaning no transaction should exist where the user is neither sender nor receiver. However, the API returned 10 transactions where the authenticated user (uBmeaz5pX) is neither sender nor receiver. For example, transaction gGF4nSbm3q4 has senderId='uBmeaz5pX' and receiverId='GjWovtg2hr', but the filter expression failed because it found transactions where uBmeaz5pX appears in neither role. The failure is consistent across all 3 runs, indicating the API is not properly filtering pending transactions to only those involving the authenticated user.

## Repro steps
1. Authenticate as user with id 'uBmeaz5pX' (Ted Parisian)
1. Send GET /transactions?requestStatus=pending
1. Observe response contains transactions where senderId and receiverId are both different from 'uBmeaz5pX' (e.g., transaction with receiverId='GjWovtg2hr' and senderId='uBmeaz5pX' should pass, but the JSONPath filter found 10 transactions that failed the condition)
1. Expected: All transactions in results should have either senderId='uBmeaz5pX' OR receiverId='uBmeaz5pX'
1. Actual: Response includes transactions where the authenticated user is not involved as either sender or receiver
