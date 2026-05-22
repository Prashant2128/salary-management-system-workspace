#!/usr/bin/env bash
# Reliable install for WSL/Linux (works when make getcwd fails on /mnt/c)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in $ROOT"
  exit 1
fi

echo "Installing dependencies in: $ROOT"
export NODE_ENV="${NODE_ENV:-development}"
npm install

echo "Done. Next: bash scripts/setup.sh  OR  npm start"
