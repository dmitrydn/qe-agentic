# Setup: create a disposable bank account to delete
POST {{host}}/bankAccounts
Authorization: Token {{token}}
{
  "bankName": "Delete Me Bank",
  "accountNumber": "111111111",
  "routingNumber": "222222222"
}
HTTP 200
[Captures]
delete_account_id: jsonpath "$.account.id"

# Delete a bank account
DELETE {{host}}/bankAccounts/{{delete_account_id}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.account.id" == "{{delete_account_id}}"
# A delete must actually mark the resource as deleted, not silently no-op
jsonpath "$.account.isDeleted" == true

# The deleted account must no longer appear in the default list
GET {{host}}/bankAccounts
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results[?(@.id=='{{delete_account_id}}')]" not exists

# Unauthenticated request is rejected
DELETE {{host}}/bankAccounts/{{delete_account_id}}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"

# Malformed bankAccountId is rejected
DELETE {{host}}/bankAccounts/1234
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "bankAccountId"

# Unknown (but well-formed) bankAccountId is not found
DELETE {{host}}/bankAccounts/{{unknown_id}}
Authorization: Token {{token}}
HTTP 404

# Deleting another user's bank account is forbidden
DELETE {{host}}/bankAccounts/{{other_user_bank_account_id}}
Authorization: Token {{token}}
HTTP 403
