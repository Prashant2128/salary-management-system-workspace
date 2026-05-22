# Windows PowerShell — start API + UI
# Run from repo root: .\scripts\start.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js not found. Install Node.js 20+ or run setup from PowerShell, not WSL 1."
}

if (-not (Test-Path ".\node_modules")) {
    npm install
}

npm start
