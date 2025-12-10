# ===================================
# Docker Management Scripts
# PowerShell Scripts for Windows
# ===================================

# Script: Build Docker Images
# Usage: .\scripts\build.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Building HACKTOLIVE Docker Images" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Load environment variables
if (Test-Path .env) {
    Write-Host "Loading environment variables..." -ForegroundColor Green
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

# Build backend
Write-Host "`nBuilding Backend..." -ForegroundColor Yellow
docker build -t hacktolive-backend:latest ./backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Backend built successfully!" -ForegroundColor Green

# Build frontend
Write-Host "`nBuilding Frontend..." -ForegroundColor Yellow
docker build -t hacktolive-frontend:latest ./frontend
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend built successfully!" -ForegroundColor Green

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "All images built successfully!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# List images
Write-Host "`nDocker Images:" -ForegroundColor Cyan
docker images | Select-String "hacktolive"
