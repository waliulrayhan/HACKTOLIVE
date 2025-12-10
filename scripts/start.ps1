# ===================================
# Start Docker Containers
# Usage: .\scripts\start.ps1
# ===================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Starting HACKTOLIVE Services" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if .env file exists
if (-not (Test-Path .env)) {
    Write-Host "Warning: .env file not found. Using .env.example" -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host ".env file created from .env.example" -ForegroundColor Green
        Write-Host "Please update .env with your configuration" -ForegroundColor Yellow
    } else {
        Write-Host "Error: .env.example not found!" -ForegroundColor Red
        exit 1
    }
}

# Start services
Write-Host "`nStarting services with Docker Compose..." -ForegroundColor Green
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=====================================" -ForegroundColor Cyan
    Write-Host "Services started successfully!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    
    Write-Host "`nService URLs:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  Backend:  http://localhost:3001" -ForegroundColor White
    
    Write-Host "`nView logs with:" -ForegroundColor Yellow
    Write-Host "  docker-compose logs -f" -ForegroundColor White
} else {
    Write-Host "`nFailed to start services!" -ForegroundColor Red
    exit 1
}
