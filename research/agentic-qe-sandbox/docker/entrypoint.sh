#!/usr/bin/env bash
set -euo pipefail

# Gotcha: ELECTRON_RUN_AS_NODE breaks Cypress's bundled Electron runner if set
# (e.g. inherited from a parent process). Always unset before touching the app.
unset ELECTRON_RUN_AS_NODE || true

cd /app

# yarn dev re-seeds the DB automatically via its "predev" hook
# (data/database-seed.json -> data/database.json), per package.json.
yarn dev >/tmp/app.log 2>&1 &
APP_PID=$!

cleanup() {
  kill "$APP_PID" 2>/dev/null || true
  wait "$APP_PID" 2>/dev/null || true
}
trap cleanup EXIT

echo "Waiting for backend (port 3001) and frontend (port 3000) readiness..."
for i in $(seq 1 90); do
  if curl -sf http://localhost:3001/testData/users >/dev/null 2>&1 \
     && curl -sf http://localhost:3000 >/dev/null 2>&1; then
    echo "App ready."
    break
  fi
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo "App process died during startup. Logs:"
    cat /tmp/app.log
    exit 1
  fi
  sleep 1
  if [ "$i" -eq 90 ]; then
    echo "Timed out waiting for app readiness. Logs:"
    cat /tmp/app.log
    exit 1
  fi
done

if [ "$#" -gt 0 ]; then
  # One-shot mode: run the given command (e.g. test oracle) against the now-ready
  # app, then exit with its status. Used for CI/verification.
  set +e
  "$@"
  EXIT_CODE=$?
  set -e
  exit "$EXIT_CODE"
else
  # Long-running mode: keep the dev server in the foreground for interactive use.
  trap - EXIT
  wait "$APP_PID"
fi
