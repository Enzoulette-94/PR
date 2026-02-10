#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cleanup() {
  kill 0
}
trap cleanup EXIT INT TERM

(
  cd "$ROOT_DIR/backend"
  bundle exec rails server -p 3000
) &

(
  cd "$ROOT_DIR/frontend"
  npm run dev -- --host 0.0.0.0 --port 5173
) &

wait
