# Get personal transactions list (default), authenticated
GET {{host}}/transactions
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.pageData.page" exists
jsonpath "$.pageData.limit" exists
jsonpath "$.pageData.totalPages" exists
jsonpath "$.pageData.hasNextPages" isBoolean
jsonpath "$.results[0].id" isString
jsonpath "$.results[0].amount" exists
jsonpath "$.results[0].senderId" exists
jsonpath "$.results[0].receiverId" exists
jsonpath "$.results[0].status" exists
jsonpath "$.results[0].createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"
# Every returned transaction must involve the authenticated user as sender or receiver
# (encoded as "no counter-example exists" since the grammar has no universal/forall predicate)
jsonpath "$.results[?(@.senderId!='{{user_id}}' && @.receiverId!='{{user_id}}')]" count == 0

# Unauthenticated request is rejected
GET {{host}}/transactions
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
