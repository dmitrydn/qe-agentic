# Defect report: CYPRESS-RWA-TRANSACTIONS-008-positive-001

**Requirement:** CYPRESS-RWA-TRANSACTIONS-008
**Test case:** Create a new request transaction successfully
**Confidence:** high

## Rationale
The test consistently fails across all 3 runs with the same error: the API returns amount=250000 when the request sent amount=2500. The acceptance criteria explicitly states 'Then jsonpath "$.transaction.amount" == 2500', and the test correctly asserts this expectation. The application is multiplying the amount by 100 (likely a currency conversion bug treating cents as dollars or vice versa). This is a deterministic, reproducible defect in the transaction creation logic.

## Repro steps
1. Authenticate as a valid user
1. POST /transactions with body {"transactionType": "request", "source": "", "receiverId": "<valid_other_user_id>", "description": "Rich oracle request test", "amount": 2500, "privacyLevel": "public"}
1. Observe response contains transaction.amount: 250000
1. Expected: transaction.amount should be 2500 (as sent in request)
1. Actual: transaction.amount is 250000 (100x the requested amount)
