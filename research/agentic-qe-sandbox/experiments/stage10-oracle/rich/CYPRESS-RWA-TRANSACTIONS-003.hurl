# Get pending request transactions for user within a time range
GET {{host}}/transactions?requestStatus=pending&rangeStartTs=2018-01-01T00:00:00.000Z&rangeEndTs=2030-12-05T00:00:00.000Z
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.pageData.page" exists
jsonpath "$.pageData.limit" exists
jsonpath "$.results[0].senderId" exists
jsonpath "$.results[0].receiverId" exists
jsonpath "$.results[0].createdAt" matches "^\\d{4}-\\d{2}-\\d{2}T"
# Query filter correctness: status filter must still hold when combined with a time range
jsonpath "$.results[?(@.requestStatus!='pending')]" count == 0
jsonpath "$.results[?(@.senderId!='{{user_id}}' && @.receiverId!='{{user_id}}')]" count == 0

# A time range that cannot contain any transaction (far future window) must return no results,
# not an error - proves the range bounds are actually applied rather than ignored
GET {{host}}/transactions?requestStatus=pending&rangeStartTs=2999-01-01T00:00:00.000Z&rangeEndTs=2999-01-02T00:00:00.000Z
Authorization: Token {{token}}
HTTP 200
[Asserts]
jsonpath "$.results" isCollection
jsonpath "$.results" count == 0

# Unauthenticated request is rejected
GET {{host}}/transactions?requestStatus=pending&rangeStartTs=2018-01-01T00:00:00.000Z&rangeEndTs=2030-12-05T00:00:00.000Z
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
