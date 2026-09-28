# Executa o build de producao de todos os pacotes (engine, backend, frontend).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== Build de producao ===" -ForegroundColor Cyan
npm run typecheck
npm run build
Write-Host "`nBuild concluido." -ForegroundColor Green
