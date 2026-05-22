# Salary Management System — root Makefile
#
# Run from the repository root, OR pass an explicit path:
#   make -C /mnt/c/Users/pmore/Projects/salary-management-system-workspace install
#
# WSL 1 on /mnt/c often breaks GNU make (getcwd / npm). Prefer:
#   bash scripts/install.sh
#   bash scripts/setup.sh
# Or Windows PowerShell: .\scripts\setup.ps1

NPM ?= npm
DOCKER_COMPOSE ?= docker compose
SHELL := /bin/bash

.PHONY: help install start dev build test test-backend test-frontend migrate seed db-up setup stop check-env

define REQUIRE_ROOT
	@if [ ! -f package.json ] || [ ! -d backend ] || [ ! -d frontend ]; then \
		echo "ERROR: Run make from the salary-management-system-workspace root."; \
		echo ""; \
		echo "WSL 1 + /mnt/c often breaks make. Use one of:"; \
		echo "  make -C /mnt/c/Users/pmore/Projects/salary-management-system-workspace install"; \
		echo "  bash scripts/install.sh"; \
		echo "  bash scripts/setup.sh"; \
		echo "  PowerShell: .\\scripts\\setup.ps1"; \
		exit 1; \
	fi
endef

help:
	@echo "Salary Management System"
	@echo ""
	@echo "  make install        Install all workspace dependencies"
	@echo "  make start          Start backend API + frontend UI (dev)"
	@echo "  make dev            Alias for make start"
	@echo "  make build          Build backend and frontend"
	@echo "  make test           Run backend and frontend tests"
	@echo "  make migrate        Run database migrations"
	@echo "  make seed           Seed database (pass ARGS='-- --reset' to reset)"
	@echo "  make db-up          Start PostgreSQL via Docker Compose"
	@echo "  make setup          db-up + migrate + seed --reset"
	@echo "  make stop           Stop Docker Compose services"
	@echo ""
	@echo "WSL 1 / getcwd errors: bash scripts/install.sh  OR  PowerShell .\\scripts\\setup.ps1"

check-env:
	$(REQUIRE_ROOT)
	@if [ -f /proc/version ] && grep -qi microsoft /proc/version; then \
		if ! grep -qi "WSL2" /proc/version 2>/dev/null && grep -qi "Microsoft" /proc/version; then \
			echo "WARNING: WSL 1 detected — npm/make may fail. Use WSL 2 or PowerShell scripts."; \
		fi; \
	fi
	@if ! command -v npm >/dev/null 2>&1; then \
		echo "ERROR: npm not found."; exit 1; \
	fi
	@npm --version >/dev/null 2>&1 || { \
		echo "ERROR: npm cannot run (common on WSL 1)."; \
		echo "  bash scripts/install.sh   OR   .\\scripts\\setup.ps1"; \
		exit 1; \
	}

install: check-env
	$(REQUIRE_ROOT)
	$(NPM) install

start: check-env
	$(REQUIRE_ROOT)
	$(NPM) run start

dev: start

build: check-env
	$(REQUIRE_ROOT)
	$(NPM) run build

test: check-env
	$(REQUIRE_ROOT)
	$(NPM) run test

test-backend: check-env
	$(REQUIRE_ROOT)
	$(NPM) run test:backend

test-frontend: check-env
	$(REQUIRE_ROOT)
	$(NPM) run test:frontend

migrate: check-env
	$(REQUIRE_ROOT)
	NODE_ENV=development $(NPM) run migrate

seed: check-env
	$(REQUIRE_ROOT)
	NODE_ENV=development $(NPM) run seed $(ARGS)

db-up:
	$(REQUIRE_ROOT)
	@$(DOCKER_COMPOSE) up -d db 2>/dev/null || docker-compose up -d db || \
		{ echo "ERROR: Could not start PostgreSQL. Is Docker Desktop running?"; exit 1; }

setup: check-env db-up
	$(REQUIRE_ROOT)
	@if [ ! -f backend/.env ] && [ -f backend/.env.example ]; then \
		cp backend/.env.example backend/.env; \
		echo "Created backend/.env from .env.example"; \
	fi
	NODE_ENV=development $(NPM) run migrate
	NODE_ENV=development $(NPM) run seed -w backend -- --reset

stop:
	$(REQUIRE_ROOT)
	@$(DOCKER_COMPOSE) down 2>/dev/null || docker-compose down || true
