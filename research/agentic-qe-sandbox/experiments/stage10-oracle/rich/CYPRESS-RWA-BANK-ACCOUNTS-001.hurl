# Get bank accounts list for the authenticated user
GET {{host}}/bankAccounts
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count >= 1
jsonpath "$.results[0].id" isString
jsonpath "$.results[0].bankName" isString
jsonpath "$.results[0].accountNumber" isString
jsonpath "$.results[0].routingNumber" isString
jsonpath "$.results[0].isDeleted" isBoolean
# The list must be scoped to the requesting user's own accounts only
jsonpath "$.results[?(@.userId!='{{user_id}}')]" count == 0
# A default list of a user's bank accounts should not surface soft-deleted accounts
jsonpath "$.results[?(@.isDeleted==true)]" count == 0

# Unauthenticated request is rejected
GET {{host}}/bankAccounts
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
