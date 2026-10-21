# Setup: capture an existing transaction id and the current comment count on it
GET {{host}}/transactions
Authorization: Token {{token}}
HTTP 200
[Captures]
transaction_id: jsonpath "$.results[0].id"

GET {{host}}/comments/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.comments" isCollection
[Captures]
comments_before: jsonpath "$.comments" count

# Create a new comment for a transaction
POST {{host}}/comments/{{transaction_id}}
Authorization: Token {{token}}
{
  "content": "This is a rich oracle test comment"
}
HTTP 200

# Verify the comment was actually persisted with the exact submitted content
GET {{host}}/comments/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.comments" isCollection
jsonpath "$.comments[-1].content" == "This is a rich oracle test comment"
jsonpath "$.comments[-1].userId" == "{{user_id}}"
jsonpath "$.comments[-1].transactionId" == "{{transaction_id}}"

# Missing content must be rejected
POST {{host}}/comments/{{transaction_id}}
Authorization: Token {{token}}
{}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "content"

# Unauthenticated request is rejected
POST {{host}}/comments/{{transaction_id}}
{
  "content": "No auth comment"
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Malformed transactionId path segment must be rejected
POST {{host}}/comments/1234
Authorization: Token {{token}}
{
  "content": "Malformed id comment"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "transactionId"

# Commenting on a well-formed but unknown transaction is not found
POST {{host}}/comments/{{unknown_id}}
Authorization: Token {{token}}
{
  "content": "Comment on unknown transaction"
}
HTTP 404
