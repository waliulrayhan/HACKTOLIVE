# ===================================
# Development Setup Script
# Usage: .\scripts\dev-setup.ps1
# ===================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "HACKTOLIVE Development Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js not found! Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

# Check Docker
Write-Host "`nChecking Docker..." -ForegroundColor Yellow
$dockerVersion = docker --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker version: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "Docker not found! Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

# Create .env file if not exists
if (-not (Test-Path .env)) {
    Write-Host "`nCreating .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ".env file created! Please update with your configuration" -ForegroundColor Green
} else {
    Write-Host "`n.env file already exists" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "Failed to install backend dependencies!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "Failed to install frontend dependencies!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Set-Location ..

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Development setup completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "  1. Update .env with your configuration" -ForegroundColor White
Write-Host "  2. Run '.\scripts\start.ps1' to start services" -ForegroundColor White
Write-Host "  3. Visit http://localhost:3000 for frontend" -ForegroundColor White
Write-Host "  4. Visit http://localhost:3001 for backend" -ForegroundColor White
