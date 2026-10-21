# Setup: capture an existing transaction id and the current like count on it
GET {{host}}/transactions
Authorization: Token {{token}}
HTTP 200
[Captures]
transaction_id: jsonpath "$.results[0].id"

GET {{host}}/likes/{{transaction_id}}
Authorization: Token {{token}}
HTTP 200
