# Salary Management System

Production-oriented salary management tool for HR teams, built for 10,000 employees.

## Architecture

```mermaid
flowchart LR
  UI[React 18 + Vite + MUI] --> API[Express REST API]
  API --> DB[(PostgreSQL 16)]
```

- Frontend: React 18, Vite, TypeScript, MUI, MUI Data Grid.
- Backend: Node.js, Express, TypeScript, Knex, Zod.
- Database: PostgreSQL with indexed employee table and SQL aggregations for insights.
- Money storage choice: `salary` is stored in PostgreSQL as `DECIMAL(12,2)`.

## Features

- Employee CRUD from UI (create, list, update, soft delete/deactivate).
- Server-side pagination, sorting, search, and filtering.
- Salary insights:
  - Min / max / avg / median / total payroll by country
  - Avg / min / max by country + job title
  - Summary cards and top-country / top-department breakdowns
- 10,000 employee seed with realistic distribution and bulk inserts.

## Repository Layout

```text
backend/   Express API, migrations, seed script, tests
frontend/  React + Vite UI, MUI components, tests
docker/    SQL init script for compose setup
docs/      DEMO script, planning & design notes
```

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for PostgreSQL)
- GNU Make (optional; for `make start` and other root commands)

## Environment Setup

1. Copy `.env.example` values into your environment or local `.env` files.
2. Core values:
   - `DATABASE_URL=postgresql://salary_user:salary_password@localhost:5432/salary_db`
   - `DATABASE_URL_TEST=postgresql://salary_user:salary_password@localhost:5432/salary_db_test`
   - `PORT=3001`
   - `VITE_API_URL=http://localhost:3001/api`

## Quick Start (root workspace)

From the repository root:

```bash
make install          # or: npm install
make db-up            # start PostgreSQL
make migrate
make seed ARGS="-- --reset"
make start            # starts API + UI together
```

Equivalent npm scripts:

```bash
npm install
npm run db:up
npm run migrate
npm run seed -- --reset
npm start             # same as make start
```

- API: `http://localhost:3001`
- UI: `http://localhost:5173`

One-shot first-time setup:

```bash
make install
make setup            # db-up + migrate + seed --reset
make start
```

**Windows PowerShell** (if WSL `make` fails):

```powershell
.\scripts\setup.ps1
.\scripts\start.ps1
```

**WSL / Linux bash** (if `make install` shows getcwd or stack errors):

```bash
bash scripts/install.sh
bash scripts/setup.sh
bash scripts/start.sh
```

### Root commands

| Make | npm | Description |
|------|-----|-------------|
| `make install` | `npm install` | Install backend + frontend deps |
| `make start` | `npm start` | Run both apps in dev mode |
| `make build` | `npm run build` | Production build both packages |
| `make test` | `npm run test` | Run all tests |
| `make migrate` | `npm run migrate` | Apply DB migrations |
| `make seed` | `npm run seed` | Run seed script |
| `make db-up` | `npm run db:up` | Start PostgreSQL container |

## Local Development (manual)

### 1) Start PostgreSQL

```bash
docker compose up -d db
```

If your shell only supports legacy command style, use:

```bash
docker-compose up -d db
```

### 2) Install dependencies

```bash
npm install
```

Or per package:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Run migrations and seed

```bash
npm run migrate
npm run seed -- --reset
```

### 4) Run backend and frontend

```bash
make start
```

Or in separate terminals:

```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```

## Seed Details

- Source files:
  - `backend/data/first_names.txt`
  - `backend/data/last_names.txt`
- Output: exactly 10,000 employees.
- Employee number pattern: `EMP-00001` to `EMP-10000`.
- Bulk insertion batch size: 1000.
- Last measured runtime: ~1 second in local run.

## API Endpoints

Base URL: `http://localhost:3001/api`

### Health

- `GET /health`

### Employees

- `GET /employees`
- `GET /employees/:id`
- `POST /employees`
- `PUT /employees/:id`
- `DELETE /employees/:id` (soft delete -> `isActive=false`)

Example create employee:

```bash
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber":"EMP-12001",
    "fullName":"Taylor Jordan",
    "email":"taylor.jordan12001@company.test",
    "jobTitle":"HR Manager",
    "department":"HR",
    "country":"US",
    "currency":"USD",
    "salary":98000,
    "employmentType":"FULL_TIME",
    "startDate":"2022-06-20"
  }'
```

Example list with filters:

```bash
curl "http://localhost:3001/api/employees?page=1&pageSize=25&search=taylor&country=US&sortBy=salary&sortOrder=desc"
```

### Insights

- `GET /insights/by-country`
- `GET /insights/by-country-and-title?country=US&jobTitle=Software%20Engineer`
- `GET /insights/summary`
- `GET /insights/countries`
- `GET /insights/job-titles?country=US`

Example:

```bash
curl "http://localhost:3001/api/insights/by-country"
curl "http://localhost:3001/api/insights/by-country-and-title?country=US&jobTitle=Software%20Engineer"
```

## Testing

### Backend

```bash
npm run test:backend
```

### Frontend

```bash
npm run test:frontend
```

### All

```bash
make test
```

## Production Build

```bash
make build
```

## Docker Full Stack

Run PostgreSQL + API + frontend:

```bash
docker compose --profile full up --build
```

- Frontend container: `http://localhost:5173`
- Backend container: `http://localhost:3001`

## Deployment Notes

- Backend can be deployed to Render/Railway/Fly.io with managed PostgreSQL.
- Frontend static build can be deployed to Vercel/Netlify/S3+CloudFront.
- Set `VITE_API_URL` to deployed API base.

## Troubleshooting

### `WSL 1 is not supported` / `Could not determine Node.js install directory`

You are running **WSL 1**. Modern Node/npm (especially when installed on Windows) does not work reliably there.

**Option A — Upgrade to WSL 2 (recommended for `make` in Linux terminal):**

```powershell
wsl --list --verbose
wsl --set-version <YourDistroName> 2
```

Then reopen the WSL terminal, install Node inside WSL (e.g. `nvm` or Node 20 from NodeSource), and run `make setup` again.

**Option B — Use Windows PowerShell (no WSL):**

```powershell
cd C:\Users\pmore\Projects\salary-management-system-workspace
.\scripts\setup.ps1
.\scripts\start.ps1
```

### `make: getcwd: No such file or directory` / `cd "/" && npm install`

WSL 1 on `/mnt/c/...` breaks GNU make path resolution (`PROJECT_ROOT` becomes `/`).

**Use bash scripts instead of make:**

```bash
bash scripts/install.sh
bash scripts/setup.sh
bash scripts/start.sh
```

**Or pass an explicit path to make:**

```bash
make -C /mnt/c/Users/pmore/Projects/salary-management-system-workspace install
```

**Or use PowerShell** (recommended on your machine): `.\scripts\setup.ps1`

### `npm error Maximum call stack size exceeded` (WSL)

Usually WSL 1 + Windows npm on `/mnt/c`. Fix: upgrade to **WSL 2**, use `bash scripts/install.sh`, or run from **PowerShell**.

### Docker / database connection errors

- Ensure **Docker Desktop** is running.
- Run `make db-up` or `npm run db-up` before migrate/seed.
- Confirm `DATABASE_URL` in `backend/.env` matches `docker-compose.yml` credentials.

## Documentation

| Document | Description |
|----------|-------------|
| [docs/DEMO.md](docs/DEMO.md) | 60–90 second demo script |
| [docs/PLANNING_AND_DESIGN.md](docs/PLANNING_AND_DESIGN.md) | Architecture, AI prompts, trade-offs, performance, setup instructions |

## Demo

Demo flow script is available in `docs/DEMO.md`.