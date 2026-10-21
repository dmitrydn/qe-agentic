# Defect report: CYPRESS-RWA-COMMENTS-002-negative-001

**Requirement:** CYPRESS-RWA-COMMENTS-002
**Test case:** Post comment with empty body returns 422
**Confidence:** high

## Rationale
The test correctly implements the requirement step 'When POST /comments/{{transaction_id}} with body {} Then the response status is 422 Then jsonpath "$.errors" isCollection Then jsonpath "$.errors[0].param" == "content"'. The API returned 422 as expected, but the first error in the errors array has param="transactionId" instead of param="content". The response body shows two errors: one for transactionId with value "{J5Fd3dlBEBu}" (indicating the path parameter was not properly substituted and was treated as a literal string) and one for content. The requirement explicitly states that when posting with an empty body, the first error should be about the missing 'content' parameter, but the API is returning the transactionId error first. This is a defect in either the parameter substitution logic or the error ordering in the API.

## Repro steps
1. GET /transactions to obtain a valid transaction_id (e.g., J5Fd3dlBEBu)
1. POST /comments/{{transaction_id}} with body {} (authenticated)
1. Observe response status 422 with errors array
1. Expected: errors[0].param == "content"
1. Actual: errors[0].param == "transactionId" (value shows "{J5Fd3dlBEBu}" indicating path parameter substitution failure)
