# Get public transactions
GET {{host}}/transactions/public
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.pageData.page" exists
jsonpath "$.pageData.limit" exists
jsonpath "$.pageData.totalPages" exists
jsonpath "$.results[0].id" isString
jsonpath "$.results[0].privacyLevel" exists
jsonpath "$.results[0].senderId" exists
jsonpath "$.results[0].receiverId" exists
jsonpath "$.results[0].createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"

# Unauthenticated request is rejected
GET {{host}}/transactions/public
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
