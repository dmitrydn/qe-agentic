# Get a single user (self)
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.user.id" == "{{user_id}}"
jsonpath "$.user.firstName" isString
jsonpath "$.user.lastName" isString
jsonpath "$.user.username" isString
jsonpath "$.user.email" isString
jsonpath "$.user.balance" isInteger
# Passwords must never be exposed
jsonpath "$.user.password" not exists

# Unauthenticated request is rejected
GET {{host}}/users/{{user_id}}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Reading another user's full account record is forbidden
GET {{host}}/users/{{other_user_id}}
Authorization: Token {{token}}
HTTP 403
