# Setup: capture the sender's balance before the request - a request must not move money
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Captures]
sender_balance_before: jsonpath "$.user.balance"

# Create a new request
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "request",
  "source": "",
  "receiverId": "{{other_user_id}}",
  "description": "Rich oracle request test",
  "amount": 2500,
  "privacyLevel": "public"
}
HTTP 200
[Asserts]
jsonpath "$.transaction.id" isString
jsonpath "$.transaction.senderId" == "{{user_id}}"
jsonpath "$.transaction.receiverId" == "{{other_user_id}}"
jsonpath "$.transaction.description" == "Rich oracle request test"
# Monetary amounts must be exact
jsonpath "$.transaction.amount" == 2500
# A request must be pending, not settled
jsonpath "$.transaction.status" == "pending"
jsonpath "$.transaction.requestStatus" == "pending"
jsonpath "$.transaction.createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"

# A pending request must not debit or credit any balance until it is accepted
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.user.balance" == "{{sender_balance_before}}"

# Missing amount must be rejected
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "request",
  "receiverId": "{{other_user_id}}",
  "description": "Missing amount"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "amount"

# Unauthenticated request is rejected
POST {{host}}/transactions
{
  "transactionType": "request",
  "receiverId": "{{other_user_id}}",
  "description": "No auth",
  "amount": 2500
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
