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
