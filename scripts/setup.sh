#!/usr/bin/env bash
# Reliable setup for WSL/Linux (db + migrate + seed)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export NODE_ENV=development

if [ ! -f backend/.env ] && [ -f backend/.env.example ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env from .env.example"
fi

if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up -d db
elif command -v docker >/dev/null 2>&1; then
  docker compose up -d db
else
  echo "WARNING: Docker not found. Start PostgreSQL manually."
fi

sleep 3
npm run migrate
npm run seed -w backend -- --reset

echo ""
echo "Setup complete. Start with: npm start"
