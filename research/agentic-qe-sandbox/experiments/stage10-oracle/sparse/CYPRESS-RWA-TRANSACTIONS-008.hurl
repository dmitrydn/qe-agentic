# Setup: capture the sender's balance before the request - a request must not move money
GET {{host}}/users/{{user_id}}
Authorization: Token {{token}}
HTTP 200
[Captures]
sender_balance_before: jsonpath "$.user.balance"

# Create a new request
POST {{host}}/transactions
Authorization: Token {{token}}
{
  "transactionType": "request",
  "source": "",
  "receiverId": "{{other_user_id}}",
  "description": "Rich oracle request test",
  "amount": 2500,
  "privacyLevel": "public"
}
HTTP 200
