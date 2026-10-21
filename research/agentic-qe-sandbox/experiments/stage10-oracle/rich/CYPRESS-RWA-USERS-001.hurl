# Get users list
GET {{host}}/users
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.results[0].id" isString
jsonpath "$.results[0].username" isString
jsonpath "$.results[0].firstName" isString
jsonpath "$.results[0].lastName" isString
# A personal users list must exclude the requesting user themselves
jsonpath "$.results[?(@.id=='{{user_id}}')]" not exists
# Passwords must never be exposed in a list response
jsonpath "$.results[0].password" not exists

# Unauthenticated request is rejected
GET {{host}}/users
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
