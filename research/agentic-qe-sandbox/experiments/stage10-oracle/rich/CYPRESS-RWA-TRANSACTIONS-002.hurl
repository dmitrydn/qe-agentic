# Get pending request transactions for user
GET {{host}}/transactions?requestStatus=pending
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.pageData.page" exists
jsonpath "$.pageData.limit" exists
jsonpath "$.pageData.totalPages" exists
jsonpath "$.results[0].senderId" exists
jsonpath "$.results[0].receiverId" exists
# Query filter correctness: every result must actually be a pending request
jsonpath "$.results[?(@.requestStatus!='pending')]" count == 0
# Scoping: every result must involve the authenticated user
jsonpath "$.results[?(@.senderId!='{{user_id}}' && @.receiverId!='{{user_id}}')]" count == 0

# Unauthenticated request is rejected
GET {{host}}/transactions?requestStatus=pending
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
