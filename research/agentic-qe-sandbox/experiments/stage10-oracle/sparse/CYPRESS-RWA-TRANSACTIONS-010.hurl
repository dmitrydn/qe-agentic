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
