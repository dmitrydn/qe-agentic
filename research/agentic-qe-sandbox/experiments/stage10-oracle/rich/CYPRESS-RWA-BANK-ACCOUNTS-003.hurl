# Create a new bank account
POST {{host}}/bankAccounts
Authorization: Token {{token}}
{
  "bankName": "Rich Oracle Test Bank",
  "accountNumber": "123456789",
  "routingNumber": "987654321"
}
HTTP 200
[Asserts]
jsonpath "$.account.id" isString
jsonpath "$.account.userId" == "{{user_id}}"
# Submitted account details must be stored exactly, not mutated or truncated
jsonpath "$.account.bankName" == "Rich Oracle Test Bank"
jsonpath "$.account.accountNumber" == "123456789"
jsonpath "$.account.routingNumber" == "987654321"
jsonpath "$.account.isDeleted" == false
jsonpath "$.account.createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"
jsonpath "$.account.modifiedAt" matches "^\\d{4}-\\d{2}-\\d{2}T"

# Missing bankName must be rejected
POST {{host}}/bankAccounts
Authorization: Token {{token}}
{
  "accountNumber": "123456789",
  "routingNumber": "987654321"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "bankName"

# Unauthenticated request is rejected
POST {{host}}/bankAccounts
{
  "bankName": "No Auth Bank",
  "accountNumber": "123456789",
  "routingNumber": "987654321"
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
