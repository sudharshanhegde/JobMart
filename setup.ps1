# ============================================================
#  JobMart — One-Click Setup (Windows)
#  Just run setup.bat — no input needed
# ============================================================

$ErrorActionPreference = "SilentlyContinue"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Console helpers ──────────────────────────────────────────
function Step($n, $msg) {
    Write-Host ""
    Write-Host "  [$n/5] $msg" -ForegroundColor Cyan
}
function OK($msg)   { Write-Host "        OK  $msg" -ForegroundColor Green }
function INFO($msg) { Write-Host "        ... $msg" -ForegroundColor Gray }
function WARN($msg) { Write-Host "        !   $msg" -ForegroundColor Yellow }
function FAIL($msg) {
    Write-Host ""
    Write-Host "  [FAILED] $msg" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please screenshot this window and share it for help." -ForegroundColor Yellow
    Write-Host ""
    Start-Sleep -Seconds 5
    exit 1
}

function Refresh-Path {
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path","User")
}
function Has($cmd) { return (Get-Command $cmd -ErrorAction SilentlyContinue) -ne $null }

# ── Header ───────────────────────────────────────────────────
Clear-Host
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║         JobMart — Setting Up             ║" -ForegroundColor Cyan
Write-Host "  ║    This will take a few minutes...       ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ════════════════════════════════════════════════════════════
# STEP 1 — Node.js
# ════════════════════════════════════════════════════════════
Step 1 "Checking Node.js..."

if (Has "node") {
    OK "Node.js $(node -v) is already installed."
} else {
    INFO "Not found. Installing Node.js (this may take 2-3 minutes)..."

    if (-not (Has "winget")) {
        FAIL "winget is not available on this PC.`n  Please install Node.js from https://nodejs.org (LTS version) then re-run setup.bat"
    }

    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements | Out-Null
    Refresh-Path

    if (-not (Has "node")) {
        FAIL "Node.js install failed. Please install it manually from https://nodejs.org then re-run setup.bat"
    }
    OK "Node.js $(node -v) installed."
}

# ════════════════════════════════════════════════════════════
# STEP 2 — Create .env
# NOTE: Uses MongoDB Atlas (cloud database) — no local MongoDB needed
# ════════════════════════════════════════════════════════════
Step 2 "Setting up environment..."

$envPath = Join-Path $ROOT "backend\.env"

if (-not (Test-Path $envPath)) {
    INFO "Creating .env..."

@"
PORT=5000
NODE_ENV=development

# MongoDB Atlas (cloud) — no local MongoDB installation needed
MONGO_URI=mongodb+srv://SudharshanHegde:Sudhi%4046@jobmart.pttfgbn.mongodb.net/hyperlocal_jobs?retryWrites=true&w=majority

# Auth secrets
JWT_SECRET=jobmart_dev_jwt_secret_2025
SESSION_SECRET=jobmart_dev_session_secret_2025

# Google OAuth — leave empty to disable Google login locally
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# CORS
FRONTEND_URL=http://localhost:3000
"@ | Set-Content -Path $envPath -Encoding UTF8

    OK ".env created."
} else {
    OK ".env already exists."
}

# ════════════════════════════════════════════════════════════
# STEP 3 — Install backend packages
# ════════════════════════════════════════════════════════════
Step 3 "Installing backend packages..."

$backendPath = Join-Path $ROOT "backend"

if (Test-Path (Join-Path $backendPath "node_modules")) {
    OK "Already installed."
} else {
    INFO "Running npm install (1-2 minutes)..."
    Set-Location $backendPath
    $result = & npm install 2>&1
    if ($LASTEXITCODE -ne 0) { FAIL "npm install failed in backend.`n$result" }
    OK "Backend packages installed."
}

# ════════════════════════════════════════════════════════════
# STEP 4 — Install frontend packages
# ════════════════════════════════════════════════════════════
Step 4 "Installing frontend packages (slow — 3-5 min)..."

$frontendPath = Join-Path $ROOT "frontend"

if (Test-Path (Join-Path $frontendPath "node_modules")) {
    OK "Already installed."
} else {
    INFO "Running npm install..."
    Set-Location $frontendPath
    $result = & npm install 2>&1
    if ($LASTEXITCODE -ne 0) { FAIL "npm install failed in frontend.`n$result" }
    OK "Frontend packages installed."
}

# ════════════════════════════════════════════════════════════
# STEP 5 — Launch both servers
# ════════════════════════════════════════════════════════════
Step 5 "Launching JobMart..."

# Backend window
Start-Process "cmd.exe" -ArgumentList "/k title JobMart - Backend  &&  cd /d `"$backendPath`"  &&  node server.js"

INFO "Waiting for backend to start..."
Start-Sleep -Seconds 4

# Frontend window
Start-Process "cmd.exe" -ArgumentList "/k title JobMart - Frontend  &&  cd /d `"$frontendPath`"  &&  npm start"

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║           JobMart is starting!           ║" -ForegroundColor Green
Write-Host "  ╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "  ║  App  ->  http://localhost:3000          ║" -ForegroundColor White
Write-Host "  ║  API  ->  http://localhost:5000          ║" -ForegroundColor White
Write-Host "  ╠══════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "  ║  Browser will open in a few seconds.     ║" -ForegroundColor Gray
Write-Host "  ║  Keep the two server windows open.       ║" -ForegroundColor Gray
Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Start-Sleep -Seconds 5
