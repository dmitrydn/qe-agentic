# Setup: capture the sender's balance before the payment for reconciliation
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Captures]
sender_balance_before: jsonpath "$.user.balance"

# Create a new payment
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "payment",
  "source": "",
  "receiverId": "{{other_user_id}}",
  "description": "Rich oracle payment test",
  "amount": 1500,
  "privacyLevel": "public"
}
HTTP 200
[Asserts]
jsonpath "$.transaction.id" isString
jsonpath "$.transaction.senderId" == "{{user_id}}"
jsonpath "$.transaction.receiverId" == "{{other_user_id}}"
jsonpath "$.transaction.description" == "Rich oracle payment test"
jsonpath "$.transaction.privacyLevel" == "public"
# Monetary amounts must be exact: no lost or rounded-away cents
jsonpath "$.transaction.amount" == 1500
# A completed payment settles immediately
jsonpath "$.transaction.status" == "complete"
# A payment (not a request) must not carry a pending requestStatus
jsonpath "$.transaction.requestStatus" not exists
jsonpath "$.transaction.createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"
jsonpath "$.transaction.modifiedAt" matches "^\\d{4}-\\d{2}-\\d{2}T"

# Verify the sender was actually debited: balance must change, not stay frozen
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.user.balance" != "{{sender_balance_before}}"

# Missing receiverId must be rejected
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "payment",
  "description": "Missing receiver",
  "amount": 1500
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "receiverId"

# Invalid transactionType must be rejected
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "not-a-real-type",
  "receiverId": "{{other_user_id}}",
  "description": "Invalid type",
  "amount": 1500
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "transactionType"

# Unauthenticated request is rejected
POST {{host}}/transactions
{
  "transactionType": "payment",
  "receiverId": "{{other_user_id}}",
  "description": "No auth",
  "amount": 1500
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
