# Errors when an invalid (malformed) contactUserId is sent
POST {{host}}/contacts
Authorization: Token {{token}}
{
  "contactUserId": "1234"
}
HTTP 422
