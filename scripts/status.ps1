# ===================================
# HACKTOLIVE Status Check
# Usage: .\scripts\status.ps1
# ===================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "HACKTOLIVE System Status" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check Node.js
Write-Host "`nNode.js:" -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Not installed" -ForegroundColor Red
}

# Check Docker
Write-Host "`nDocker:" -ForegroundColor Yellow
$dockerVersion = docker --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Installed: $dockerVersion" -ForegroundColor Green
    
    # Check if Docker is running
    docker ps >$null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Running" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Not running (Start Docker Desktop)" -ForegroundColor Red
    }
} else {
    Write-Host "  ✗ Not installed" -ForegroundColor Red
}

# Check Docker Compose
Write-Host "`nDocker Compose:" -ForegroundColor Yellow
$composeVersion = docker-compose --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Installed: $composeVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Not installed" -ForegroundColor Red
}

# Check environment file
Write-Host "`nConfiguration:" -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "  ✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "  ✗ .env file missing (copy from .env.example)" -ForegroundColor Red
}

# Check dependencies
Write-Host "`nDependencies:" -ForegroundColor Yellow

if (Test-Path "backend\node_modules") {
    Write-Host "  ✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend dependencies missing (run 'cd backend && npm install')" -ForegroundColor Red
}

if (Test-Path "frontend\node_modules") {
    Write-Host "  ✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend dependencies missing (run 'cd frontend && npm install')" -ForegroundColor Red
}

# Check Docker images
Write-Host "`nDocker Images:" -ForegroundColor Yellow
$backendImage = docker images -q hacktolive-backend:latest 2>$null
if ($backendImage) {
    Write-Host "  ✓ Backend image built" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend image not built (run '.\scripts\build.ps1')" -ForegroundColor Yellow
}

$frontendImage = docker images -q hacktolive-frontend:latest 2>$null
if ($frontendImage) {
    Write-Host "  ✓ Frontend image built" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend image not built (run '.\scripts\build.ps1')" -ForegroundColor Yellow
}

# Check running containers
Write-Host "`nRunning Containers:" -ForegroundColor Yellow
$backendContainer = docker ps -q -f name=hacktolive-backend 2>$null
if ($backendContainer) {
    Write-Host "  ✓ Backend running" -ForegroundColor Green
    Write-Host "    URL: http://localhost:3001" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Backend not running" -ForegroundColor Yellow
}

$frontendContainer = docker ps -q -f name=hacktolive-frontend 2>$null
if ($frontendContainer) {
    Write-Host "  ✓ Frontend running" -ForegroundColor Green
    Write-Host "    URL: http://localhost:3000" -ForegroundColor Cyan
} else {
    Write-Host "  ✗ Frontend not running" -ForegroundColor Yellow
}

# Check exports directory
Write-Host "`nExports:" -ForegroundColor Yellow
if (Test-Path "exports\backend-docker.tar") {
    $size = (Get-Item "exports\backend-docker.tar").Length / 1MB
    Write-Host "  ✓ Backend export exists ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend export not found" -ForegroundColor Yellow
}

if (Test-Path "exports\frontend-docker.tar") {
    $size = (Get-Item "exports\frontend-docker.tar").Length / 1MB
    Write-Host "  ✓ Frontend export exists ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend export not found" -ForegroundColor Yellow
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Status Check Complete" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nQuick Actions:" -ForegroundColor Cyan
Write-Host "  Setup:   .\scripts\dev-setup.ps1" -ForegroundColor White
Write-Host "  Build:   .\scripts\build.ps1" -ForegroundColor White
Write-Host "  Start:   .\scripts\start.ps1" -ForegroundColor White
Write-Host "  Stop:    .\scripts\stop.ps1" -ForegroundColor White
Write-Host "  Logs:    .\scripts\logs.ps1" -ForegroundColor White
Write-Host "  Export:  .\scripts\export.ps1" -ForegroundColor White
