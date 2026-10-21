# Setup: capture page one's first result so page two can be proven distinct
GET {{host}}/transactions/contacts?page=1
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.pageData.page" == 1
jsonpath "$.results" isCollection
[Captures]
page1_first_id: jsonpath "$.results[0].id"
total_pages: jsonpath "$.pageData.totalPages"

# Get contacts' transactions, page two
GET {{host}}/transactions/contacts?page=2
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.pageData.page" == 2
jsonpath "$.pageData.limit" exists
jsonpath "$.pageData.totalPages" == {{total_pages}}
jsonpath "$.results[0].id" isString
# Pagination correctness: page two must not simply repeat page one's data
jsonpath "$.results[0].id" != "{{page1_first_id}}"

# Unauthenticated request is rejected
GET {{host}}/transactions/contacts?page=2
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
