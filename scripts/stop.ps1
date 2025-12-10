# ===================================
# Stop Docker Containers
# Usage: .\scripts\stop.ps1
# ===================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Stopping HACKTOLIVE Services" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nServices stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "`nFailed to stop services!" -ForegroundColor Red
    exit 1
}
