# Windows PowerShell setup (use this if WSL make/npm fails)
# Run from repo root: .\scripts\setup.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Test-Command($name) {
    return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Host "Salary Management System - setup (Windows)" -ForegroundColor Cyan

if (-not (Test-Command "node")) {
    throw "Node.js not found. Install Node.js 20+ from https://nodejs.org and reopen the terminal."
}
if (-not (Test-Command "npm")) {
    throw "npm not found. Install Node.js 20+ from https://nodejs.org."
}

$nodeVersion = node -v
Write-Host "Using Node $nodeVersion"

$env:NODE_ENV = "development"

if (-not (Test-Path ".\backend\.env")) {
    if (Test-Path ".\backend\.env.example") {
        Copy-Item ".\backend\.env.example" ".\backend\.env"
        Write-Host "Created backend/.env from .env.example"
    }
}

if (-not (Test-Path ".\node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

if (Test-Command "docker-compose") {
    Write-Host "Starting PostgreSQL (Docker)..."
    docker-compose up -d db
    Start-Sleep -Seconds 3
} elseif (Test-Command "docker") {
    Write-Host "Starting PostgreSQL (Docker)..."
    docker compose up -d db
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to start PostgreSQL. Ensure Docker Desktop is running."
    }
    Start-Sleep -Seconds 3
} else {
    Write-Warning "Docker not found. Start PostgreSQL manually and set DATABASE_URL in backend/.env"
}

Write-Host "Running migrations..."
npm run migrate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Seeding database..."
npm run seed -w backend -- --reset
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ""
Write-Host "Setup complete. Start the app with:" -ForegroundColor Green
Write-Host "  npm start"
Write-Host "  or: make start"
Write-Host ""
Write-Host "  API: http://localhost:3001"
Write-Host "  UI:  http://localhost:5173"
