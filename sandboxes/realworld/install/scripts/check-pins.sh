#!/usr/bin/env bash
# Verify that every copy of the spec is at the ONE pinned commit, that both forks are based on the
# measured upstream commits, and that the Angular local-API patch is in place.
# Exit code 0 = all checks pass. Run after every submodule update.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SPEC_PIN="ebbcdeb8d55b42a3a613c787560498b8ef10003f"     # realworld-apps/realworld, 2026-08-26
BACKEND_BASE="c8c66858a436a6e07f445fffe2253a65ff6dcb58"  # nitro-prisma-zod-realworld-example-app
FRONTEND_BASE="dd99ed2cf39c805d719f943c5d7061a5683d98a8" # angular-realworld-example-app
fail=0
ok()  { echo "PASS  $1"; }
bad() { echo "FAIL  $1"; fail=1; }

for p in spec backend/realworld frontend/realworld; do
  dir="$ROOT/$p"
  # An uninitialised submodule is an empty folder inside the parent repo, so `rev-parse HEAD`
  # would silently report the PARENT's commit. Check the folder is its own repo first.
  top=$(git -C "$dir" rev-parse --show-toplevel 2>/dev/null || true)
  if [ -z "$top" ] || [ "$(cd "$top" && pwd -P)" != "$(cd "$dir" 2>/dev/null && pwd -P)" ]; then
    bad "$p not initialised (run: git submodule update --init --recursive)"; continue
  fi
  sha=$(git -C "$dir" rev-parse HEAD)
  [ "$sha" = "$SPEC_PIN" ] && ok "$p at spec pin" || bad "$p at $sha, expected $SPEC_PIN"
done

git -C "$ROOT/backend"  merge-base --is-ancestor "$BACKEND_BASE"  HEAD 2>/dev/null \
  && ok "backend based on $BACKEND_BASE"   || bad "backend does not contain $BACKEND_BASE"
git -C "$ROOT/frontend" merge-base --is-ancestor "$FRONTEND_BASE" HEAD 2>/dev/null \
  && ok "frontend based on $FRONTEND_BASE" || bad "frontend does not contain $FRONTEND_BASE"

grep -q 'CONDUIT_API_URL' "$ROOT/frontend/src/app/core/interceptors/api.interceptor.ts" 2>/dev/null \
  && ok "frontend local-API patch present" || bad "frontend local-API patch missing"
grep -q 'api.realworld.show' "$ROOT/frontend/src/app/core/interceptors/api.interceptor.ts" 2>/dev/null \
  && bad "interceptor still hardcodes the hosted API" || ok "interceptor has no hardcoded hosted API"

[ "$fail" -eq 0 ] && echo "ALL PINS OK" || echo "PIN CHECK FAILED"
exit "$fail"
