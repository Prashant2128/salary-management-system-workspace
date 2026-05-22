#!/usr/bin/env bash
# Start API + UI (WSL/Linux)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export NODE_ENV="${NODE_ENV:-development}"

if [ ! -d node_modules ]; then
  bash "$ROOT/scripts/install.sh"
fi

npm start
