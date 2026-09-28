# Comando unico para iniciar a produtora completa (backend + frontend).
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== Iniciando Kids AI Studio ===" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; npm run dev:backend" -WindowStyle Normal
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root'; npm run dev:frontend" -WindowStyle Normal

Write-Host "`nBackend:  http://localhost:4000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "`nDuas janelas do PowerShell foram abertas com os logs do backend e do frontend." -ForegroundColor Yellow
Write-Host "Acesse http://localhost:5173 no navegador para usar a produtora." -ForegroundColor Cyan
