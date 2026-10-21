# Get pending request transactions for user within a time range
GET {{host}}/transactions?requestStatus=pending&rangeStartTs=2018-01-01T00:00:00.000Z&rangeEndTs=2030-12-05T00:00:00.000Z
Authorization: Token {{token}}
HTTP 200
