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
[Asserts]
jsonpath "$.account.id" == "{{bank_account_id}}"
jsonpath "$.account.userId" == "{{user_id}}"
jsonpath "$.account.bankName" isString
jsonpath "$.account.accountNumber" isString
jsonpath "$.account.routingNumber" isString
jsonpath "$.account.isDeleted" isBoolean
jsonpath "$.account.createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"

# Unauthenticated request is rejected
GET {{host}}/bankAccounts/{{bank_account_id}}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Malformed bankAccountId is rejected
GET {{host}}/bankAccounts/1234
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "bankAccountId"

# Unknown (but well-formed) bankAccountId is not found
GET {{host}}/bankAccounts/{{unknown_id}}
Authorization: Token {{token}}
HTTP 404

# Reading another user's bank account is forbidden
GET {{host}}/bankAccounts/{{other_user_bank_account_id}}
Authorization: Token {{token}}
HTTP 403
