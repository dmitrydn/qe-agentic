# Errors when an invalid (malformed) userId is sent
GET {{host}}/users/1234
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "userId"
jsonpath "$.errors[0].msg" exists

# A second, differently-malformed userId must also be rejected the same way
GET {{host}}/users/!!!not-valid!!!
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "userId"

# Unauthenticated request is rejected before validation is even reached
GET {{host}}/users/1234
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# A well-formed but unknown userId is a not-found, not a validation error
GET {{host}}/users/{{unknown_id}}
Authorization: Token {{token}}
HTTP 404
