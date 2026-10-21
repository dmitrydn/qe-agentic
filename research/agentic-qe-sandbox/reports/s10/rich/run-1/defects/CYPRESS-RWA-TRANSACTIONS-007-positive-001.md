# Defect report: CYPRESS-RWA-TRANSACTIONS-007-positive-001

**Requirement:** CYPRESS-RWA-TRANSACTIONS-007
**Test case:** Create a new payment successfully
**Confidence:** high

## Rationale
The test consistently fails across all 3 runs with the same error: the API returns transaction.amount as 150000 instead of the expected 1500. The test sends amount: 1500 in the POST /transactions request body, and the acceptance criteria explicitly states 'Then jsonpath "$.transaction.amount" == 1500'. The API response shows {"amount":150000,...} in all three runs, indicating the application is multiplying the amount by 100 (likely treating cents as dollars or vice versa). This is a deterministic, reproducible defect in the transaction creation logic.

## Repro steps
1. Authenticate as primaryUser and obtain user_id
1. POST /transactions with body {"transactionType": "payment", "source": "{{other_user_bank_account_id}}", "receiverId": "{{other_user_id}}", "description": "Rich oracle payment test", "amount": 1500, "privacyLevel": "public"}
1. Observe response status 200 with transaction.amount = 150000
1. Expected: transaction.amount should equal 1500 (the value sent in request)
1. Actual: transaction.amount equals 150000 (100x the requested amount)
