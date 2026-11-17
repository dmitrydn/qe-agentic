#!/usr/bin/env bash
# Seed the demo user the UI suite expects in TEST_MODE=spa (`johndoe`) plus one article.
# Idempotent: safe to run more than once against the same database.
# Usage: scripts/seed.sh            (API defaults to http://localhost:3000/api)
#        API_BASE=http://host:port/api scripts/seed.sh
set -euo pipefail

API="${API_BASE:-http://localhost:3000/api}"
USER_JSON='{"user":{"username":"johndoe","email":"johndoe@example.com","password":"password123"}}'
LOGIN_JSON='{"user":{"email":"johndoe@example.com","password":"password123"}}'
TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT

json() { python3 -c "import json,sys; d=json.load(open(sys.argv[1])); print(eval(sys.argv[2]))" "$TMP" "$1"; }

curl -sf -o /dev/null "$API/tags" || { echo "SEED FAILED: API not reachable at $API (start the backend first)" >&2; exit 1; }

code=$(curl -s -o "$TMP" -w '%{http_code}' -X POST "$API/users"-H 'Content-Type: application/json' -d "$USER_JSON")
if [ "$code" != "201" ] && [ "$code" != "200" ]; then
  # Already registered (409/422): log in instead.
  code=$(curl -s -o "$TMP" -w '%{http_code}' -X POST "$API/users/login" -H 'Content-Type: application/json' -d "$LOGIN_JSON")
  [ "$code" = "200" ] || { echo "SEED FAILED: register and login both failed (last HTTP $code): $(cat "$TMP")" >&2; exit 1; }
fi
TOKEN=$(json "d['user']['token']")

curl -s -o "$TMP" "$API/articles?author=johndoe"
if [ "$(json "d['articlesCount']")" -eq 0 ]; then
  code=$(curl -s -o "$TMP" -w '%{http_code}' -X POST "$API/articles" \
    -H 'Content-Type: application/json' -H "Authorization: Token $TOKEN" \
    -d '{"article":{"title":"Seeded by johndoe","description":"seed","body":"seed body","tagList":["seed"]}}')
  [ "$code" = "201" ] || [ "$code" = "200" ] || { echo "SEED FAILED: article create HTTP $code: $(cat "$TMP")" >&2; exit 1; }
fi

curl -s -o "$TMP" "$API/articles?author=johndoe"
echo "SEED OK: johndoe exists with $(json "d['articlesCount']") article(s)"
