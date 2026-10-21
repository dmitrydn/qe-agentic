# Update a user
PATCH {{host}}/users/{{user_id}}
Authorization: Token {{token}}
{
  "firstName": "UpdatedRichOracleName"
}
HTTP 204
