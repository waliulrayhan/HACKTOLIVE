# ===================================
# Clean Docker Resources
# Usage: .\scripts\clean.ps1
# ===================================

param(
    [switch]$all,
    [switch]$volumes
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cleaning HACKTOLIVE Docker Resources" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Stop and remove containers
Write-Host "`nStopping and removing containers..." -ForegroundColor Yellow
docker-compose down

# Remove images
if ($all) {
    Write-Host "`nRemoving Docker images..." -ForegroundColor Yellow
    docker rmi hacktolive-backend:latest hacktolive-frontend:latest 2>$null
}

# Remove volumes
if ($volumes -or $all) {
    Write-Host "`nRemoving Docker volumes..." -ForegroundColor Yellow
    docker-compose down -v
}

# Remove dangling resources
Write-Host "`nRemoving dangling images and containers..." -ForegroundColor Yellow
docker system prune -f

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Cleanup completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nUsage:" -ForegroundColor Cyan
Write-Host "  .\scripts\clean.ps1          - Basic cleanup" -ForegroundColor White
Write-Host "  .\scripts\clean.ps1 -all     - Remove images too" -ForegroundColor White
Write-Host "  .\scripts\clean.ps1 -volumes - Remove volumes too" -ForegroundColor White
