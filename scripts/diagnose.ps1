# Diagnostica o ambiente local do Kids AI Studio: Node, npm, Git, FFmpeg, permissoes e espaco em disco.
$ErrorActionPreference = "Continue"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "=== Kids AI Studio - Diagnostico do ambiente ===" -ForegroundColor Cyan
Write-Host "Diretorio do projeto: $root"

function Test-Command($name, $cmd) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if ($found) {
        $version = & $cmd --version 2>$null
        Write-Host "[OK] $name encontrado: $version" -ForegroundColor Green
    } else {
        Write-Host "[FALTA] $name nao encontrado no PATH." -ForegroundColor Red
    }
}

Test-Command "Node.js" "node"
Test-Command "npm" "npm"
Test-Command "Git" "git"

$ffmpeg = Join-Path $root "tools\ffmpeg\bin\ffmpeg.exe"
if (Test-Path $ffmpeg) {
    Write-Host "[OK] FFmpeg local encontrado em $ffmpeg" -ForegroundColor Green
} else {
    Write-Host "[FALTA] FFmpeg nao encontrado em tools\ffmpeg\bin. Execute scripts\install.ps1." -ForegroundColor Red
}

$drive = (Get-Item $root).PSDrive.Name
$disk = Get-PSDrive -Name $drive -ErrorAction SilentlyContinue
if ($disk) {
    $freeGB = [math]::Round($disk.Free / 1GB, 1)
    Write-Host "Espaco livre em ${drive}: ${freeGB} GB"
}

$dataDir = Join-Path $root "data"
if (Test-Path $dataDir) {
    Write-Host "[OK] Diretorio de dados existe: $dataDir" -ForegroundColor Green
} else {
    Write-Host "[INFO] Diretorio de dados sera criado automaticamente ao iniciar o backend." -ForegroundColor Yellow
}

Write-Host "`nDiagnostico concluido." -ForegroundColor Cyan
