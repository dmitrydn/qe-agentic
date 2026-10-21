# Setup: capture an existing bank account id belonging to the authenticated user
GET {{host}}/bankAccounts
Authorization: Token {{token}}
HTTP 200
[Captures]
bank_account_id: jsonpath "$.results[0].id"

# Get a single bank account
GET {{host}}/bankAccounts/{{bank_account_id}}
Authorization: Token {{token}}
HTTP 200
