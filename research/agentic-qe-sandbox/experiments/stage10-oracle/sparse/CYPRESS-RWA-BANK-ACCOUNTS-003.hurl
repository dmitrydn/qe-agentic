# Create a new bank account
POST {{host}}/bankAccounts
Authorization: Token {{token}}
{
  "bankName": "Rich Oracle Test Bank",
  "accountNumber": "123456789",
  "routingNumber": "987654321"
}
HTTP 200
