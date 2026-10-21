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
