#!/usr/bin/env bash
# Start the Nitro backend on a FRESH SQLite database, in the foreground (Ctrl-C to stop).
# Usage: scripts/start-backend.sh [log-file]
# Every oracle run must start from a fresh DB, so this script always deletes backend/dev.db first.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"   # the workspace folder
LOG="${1:-$ROOT/logs/backend.log}"
mkdir -p "$(dirname "$LOG")"
cd "$ROOT/backend"

# Any non-empty value works for a local sandbox. Never reuse this value anywhere real.
export JWT_SECRET="${JWT_SECRET:-sandbox-local-only}"

# Stop a previous instance, reset the database, recreate the schema.
pkill -f "node_modules/.bin/nitro" 2>/dev/null || true
rm -f dev.db
bun run db:push </dev/null   # stdin closed: prisma can hang waiting on it

# `nitro dev` stays idle with no output when started without a terminal,
# so run it under a pseudo-terminal. `script` has different syntax on macOS and Linux.
if [ "$(uname)" = "Darwin" ]; then
  exec script -q "$LOG" bun --silent run dev
else
  exec script -q -c "bun --silent run dev" "$LOG"
fi
