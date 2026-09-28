# Instala as dependencias do Kids AI Studio (workspaces npm).
# Nao reinstala o FFmpeg se ja estiver presente em tools\ffmpeg.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "=== Instalando dependencias (npm workspaces) ===" -ForegroundColor Cyan
npm install

$ffmpeg = Join-Path $root "tools\ffmpeg\bin\ffmpeg.exe"
if (Test-Path $ffmpeg) {
    Write-Host "[OK] FFmpeg ja esta instalado em tools\ffmpeg\bin. Nada a fazer." -ForegroundColor Green
} else {
    Write-Host "[AVISO] FFmpeg nao encontrado. Baixe um build estatico (ex: https://www.gyan.dev/ffmpeg/builds/)" -ForegroundColor Yellow
    Write-Host "         e extraia de forma que ffmpeg.exe fique em tools\ffmpeg\bin\ffmpeg.exe" -ForegroundColor Yellow
}

Write-Host "`nInstalacao concluida. Use scripts\start-all.ps1 para iniciar a produtora." -ForegroundColor Cyan
