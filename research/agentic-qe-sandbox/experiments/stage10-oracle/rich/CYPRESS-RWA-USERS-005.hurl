# Get users by email
GET {{host}}/users/search?q={{other_user_email}}
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.results[0].firstName" isString
jsonpath "$.results[0].email" == "{{other_user_email}}"
# Query filter correctness: an email search must return only matching users
jsonpath "$.results[?(@.email!='{{other_user_email}}')]" count == 0

# A query that matches no user must return an empty array, not an error
GET {{host}}/users/search?q=no-such-user-should-ever-match-this-string@example.com
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count == 0

# Missing query parameter is rejected
GET {{host}}/users/search
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection

# Unauthenticated request is rejected
GET {{host}}/users/search?q={{other_user_email}}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
