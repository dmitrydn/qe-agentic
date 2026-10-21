# Errors when an invalid (malformed) contactUserId is sent
POST {{host}}/contacts
Authorization: Token {{token}}
{
  "contactUserId": "1234"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "contactUserId"

# A second, differently-malformed contactUserId must also be rejected
POST {{host}}/contacts
Authorization: Token {{token}}
{
  "contactUserId": "!!!not-valid!!!"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "contactUserId"

# Missing contactUserId entirely must be rejected
POST {{host}}/contacts
Authorization: Token {{token}}
{}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "contactUserId"

# Unauthenticated request is rejected
POST {{host}}/contacts
{
  "contactUserId": "1234"
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
