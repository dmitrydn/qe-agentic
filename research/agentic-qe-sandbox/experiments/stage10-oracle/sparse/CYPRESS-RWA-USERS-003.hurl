# Errors when an invalid (malformed) userId is sent
GET {{host}}/users/1234
Authorization: Token {{token}}
HTTP 422
