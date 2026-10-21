# Setup: get an existing transaction id to patch against
GET {{host}}/transactions
Authorization: Token {{token}}
HTTP 200
[Captures]
transaction_id: jsonpath "$.results[0].id"

# Errors when an invalid field is sent (unknown requestStatus enum value)
PATCH {{host}}/transactions/{{transaction_id}}
Authorization: Token {{token}}
{
  "requestStatus": "not-a-real-status"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "requestStatus"

# Missing requestStatus entirely must also be rejected
PATCH {{host}}/transactions/{{transaction_id}}
Authorization: Token {{token}}
{
  "notATransactionField": "not a transaction field"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "requestStatus"

# Malformed transactionId path segment must also be rejected
PATCH {{host}}/transactions/1234
Authorization: Token {{token}}
{
  "requestStatus": "accepted"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "transactionId"

# Unauthenticated request is rejected
PATCH {{host}}/transactions/{{transaction_id}}
{
  "requestStatus": "accepted"
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
