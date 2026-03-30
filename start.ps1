# ============================================================
#  JobMart — Quick Start (run this after setup.bat is done)
# ============================================================

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath  = Join-Path $ROOT "backend"
$frontendPath = Join-Path $ROOT "frontend"

Clear-Host
Write-Host ""
Write-Host "  Starting JobMart..." -ForegroundColor Cyan
Write-Host ""

# Check .env exists
if (-not (Test-Path (Join-Path $backendPath ".env"))) {
    Write-Host "  [!] backend\.env not found. Run setup.bat first." -ForegroundColor Red
    Start-Sleep -Seconds 4
    exit 1
}

# Check node_modules exist
if (-not (Test-Path (Join-Path $backendPath "node_modules")) -or
    -not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "  [!] Packages not installed. Run setup.bat first." -ForegroundColor Red
    Start-Sleep -Seconds 4
    exit 1
}

# Launch backend
Start-Process "cmd.exe" -ArgumentList "/k title JobMart - Backend  &&  cd /d `"$backendPath`"  &&  node server.js"

Write-Host "  Waiting for backend..." -ForegroundColor Gray
Start-Sleep -Seconds 4

# Launch frontend
Start-Process "cmd.exe" -ArgumentList "/k title JobMart - Frontend  &&  cd /d `"$frontendPath`"  &&  npm start"

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║  App  ->  http://localhost:3000          ║" -ForegroundColor White
Write-Host "  ║  API  ->  http://localhost:5000          ║" -ForegroundColor White
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 3
