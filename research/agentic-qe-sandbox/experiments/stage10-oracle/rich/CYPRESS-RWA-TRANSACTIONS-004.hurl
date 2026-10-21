# Get contacts' transactions, page one (default page)
GET {{host}}/transactions/contacts
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.pageData.page" == 1
jsonpath "$.pageData.limit" exists
jsonpath "$.pageData.totalPages" exists
jsonpath "$.pageData.hasNextPages" isBoolean
jsonpath "$.results[0].id" isString
jsonpath "$.results[0].senderId" exists
jsonpath "$.results[0].receiverId" exists

# Explicit page=1 must be equivalent to the default (no page param) response's page number
GET {{host}}/transactions/contacts?page=1
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.pageData.page" == 1
jsonpath "$.results" isCollection

# Unauthenticated request is rejected
GET {{host}}/transactions/contacts
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
