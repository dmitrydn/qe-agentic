# Errors when an invalid field is sent on user creation (no recognized user field present)
POST {{host}}/users
{
  "notAUserField": "not a user field"
}
HTTP 422
