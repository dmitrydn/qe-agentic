#!/usr/bin/env bash
# Build and boot the Cypress RealWorld App runtime container.
#
# Usage:
#   ./run.sh build                 # build the image
#   ./run.sh up                    # boot frontend+backend, foreground, seeded
#   ./run.sh verify                # boot, run the oracle test suite inside the
#                                   # container, then exit with its status
#   ./run.sh start                 # boot detached, named container (for adapter use)
#   ./run.sh stop                  # stop+remove the detached named container
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
IMAGE="agentic-qe/cypress-rwa:latest"
DOCKERFILE="agentic-qe-sandbox/docker/Dockerfile"
CONTAINER_NAME="agentic-qe-cypress-rwa"

cmd="${1:-build}"

case "$cmd" in
  build)
    docker build -f "$DOCKERFILE" -t "$IMAGE" "$ROOT_DIR"
    ;;
  up)
    docker run --rm -it -p 3000:3000 -p 3001:3001 "$IMAGE"
    ;;
  verify)
    docker run --rm "$IMAGE" sh -c \
      "yarn test:unit:ci && yarn cypress:run --spec 'cypress/tests/api/api-users.spec.ts'"
    ;;
  start)
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    docker run -d --name "$CONTAINER_NAME" -p 3000:3000 -p 3001:3001 "$IMAGE" >/dev/null
    ;;
  stop)
    docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
    ;;
  *)
    echo "Unknown command: $cmd (expected: build | up | verify | start | stop)" >&2
    exit 1
    ;;
esac
