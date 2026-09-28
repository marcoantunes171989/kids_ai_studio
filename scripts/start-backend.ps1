# Inicia apenas o backend (API + motor de renderizacao) em modo desenvolvimento.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Iniciando backend em http://localhost:4000 ..." -ForegroundColor Cyan
npm run dev:backend
