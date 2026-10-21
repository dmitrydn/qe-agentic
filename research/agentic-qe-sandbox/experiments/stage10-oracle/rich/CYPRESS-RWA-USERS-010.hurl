# Errors when an invalid field is sent on user creation (no recognized user field present)
POST {{host}}/users
{
  "notAUserField": "not a user field"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1

# An unrecognized value for a known enum field (defaultPrivacyLevel) must also be rejected
POST {{host}}/users
{
  "firstName": "Rich",
  "lastName": "Oracle",
  "username": "rich_oracle_user",
  "password": "password123",
  "defaultPrivacyLevel": "not-a-real-privacy-level"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "defaultPrivacyLevel"

# A non-numeric balance must be rejected
POST {{host}}/users
{
  "firstName": "Rich",
  "lastName": "Oracle",
  "username": "rich_oracle_user2",
  "password": "password123",
  "balance": "not-a-number"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "balance"
