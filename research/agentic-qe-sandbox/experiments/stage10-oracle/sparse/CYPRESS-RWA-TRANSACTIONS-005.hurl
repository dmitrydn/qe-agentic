# Setup: capture page one's first result so page two can be proven distinct
GET {{host}}/transactions/contacts?page=1
Authorization: Token {{token}}
HTTP 200
[Captures]
page1_first_id: jsonpath "$.results[0].id"
total_pages: jsonpath "$.pageData.totalPages"

# Get contacts' transactions, page two
GET {{host}}/transactions/contacts?page=2
Authorization: Token {{token}}
HTTP 200
