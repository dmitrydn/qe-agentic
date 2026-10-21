# Update a user
PATCH {{host}}/users/{{user_id}}
Authorization: Token {{token}}
{
  "firstName": "UpdatedRichOracleName"
}
HTTP 204

# Verify the update actually persisted with the exact submitted value
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.user.firstName" == "UpdatedRichOracleName"

# Unauthenticated request is rejected
PATCH {{host}}/users/{{user_id}}
{
  "firstName": "ShouldNotApply"
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Updating another user's account is forbidden
PATCH {{host}}/users/{{other_user_id}}
Authorization: Token {{token}}
{
  "firstName": "ShouldNotApply"
}
HTTP 403

# Invalid field value (non-string firstName) must be rejected
PATCH {{host}}/users/{{user_id}}
Authorization: Token {{token}}
{
  "firstName": 12345
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "firstName"
