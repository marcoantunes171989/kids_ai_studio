# Executa todos os testes automatizados do projeto (engine + backend).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== Executando testes ===" -ForegroundColor Cyan
npm run test
