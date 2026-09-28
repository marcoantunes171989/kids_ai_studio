# Inicia apenas o frontend (painel web) em modo desenvolvimento.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Iniciando frontend em http://localhost:5173 ..." -ForegroundColor Cyan
npm run dev:frontend
