# Setup: capture an existing notification id belonging to the authenticated user
GET {{host}}/notifications
Authorization: Token {{token}}
HTTP 200
[Captures]
notification_id: jsonpath "$.results[0].id"

# Errors when an invalid field is sent (missing isRead)
PATCH {{host}}/notifications/{{notification_id}}
Authorization: Token {{token}}
{
  "notANotificationField": "not a notification field"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "isRead"

# isRead sent with the wrong type must also be rejected
PATCH {{host}}/notifications/{{notification_id}}
Authorization: Token {{token}}
{
  "isRead": "not-a-boolean"
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors" count == 1
jsonpath "$.errors[0].param" == "isRead"

# Malformed notificationId path segment must also be rejected
PATCH {{host}}/notifications/1234
Authorization: Token {{token}}
{
  "isRead": true
}
HTTP 422
[Asserts]
jsonpath "$.errors" isCollection
jsonpath "$.errors[0].param" == "notificationId"

# Unauthenticated request is rejected
PATCH {{host}}/notifications/{{notification_id}}
{
  "isRead": true
}
HTTP 401
[Asserts]
jsonpath "$.error" == "Unauthorized"
