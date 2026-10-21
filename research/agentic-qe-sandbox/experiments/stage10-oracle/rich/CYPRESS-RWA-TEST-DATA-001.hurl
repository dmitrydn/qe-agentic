# Get remote mock data for the users entity
GET {{host}}/testData/users
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count > 1

# Get remote mock data for the transactions entity
GET {{host}}/testData/transactions
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count > 1

# Get remote mock data for the bankaccounts entity
GET {{host}}/testData/bankaccounts
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count > 1

# An unrecognized entity name must be rejected, not silently return an empty/wrong list
GET {{host}}/testData/not-a-real-entity
Authorization: Token {{token}}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "entity"
