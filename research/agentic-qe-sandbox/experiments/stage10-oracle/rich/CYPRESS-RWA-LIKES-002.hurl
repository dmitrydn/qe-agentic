# Setup: capture an existing transaction id and the current like count on it
GET {{host}}/transactions
Authorization: Token {{token}}
HTTP 200
[Captures]
transaction_id: jsonpath "$.results[0].id"

GET {{host}}/likes/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.likes" isCollection
[Captures]
likes_before: jsonpath "$.likes" count

# Create a new like for a transaction
POST {{host}}/likes/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200

# Verify the like was actually persisted for the authenticated user
GET {{host}}/likes/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.likes" isCollection
jsonpath "$.likes[-1].userId" == "{{user_id}}"
jsonpath "$.likes[-1].transactionId" == "{{transaction_id}}"

# Unauthenticated request is rejected
POST {{host}}/likes/{{transaction_id}}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Malformed transactionId path segment is rejected
# (likes has no request body fields to validate, so the transactionId path
# parameter is the only validated input on this endpoint)
POST {{host}}/likes/1234
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "transactionId"

# Liking a well-formed but unknown transaction is not found
POST {{host}}/likes/{{unknown_id}}
Authorization: Token {{token}}
HTTP 404
