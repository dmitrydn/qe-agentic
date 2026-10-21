# Setup: capture the sender's balance before the payment for reconciliation
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Captures]
sender_balance_before: jsonpath "$.user.balance"

# Create a new payment
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "payment",
  "source": "",
  "receiverId": "{{other_user_id}}",
  "description": "Rich oracle payment test",
  "amount": 1500,
  "privacyLevel": "public"
}
HTTP 200
