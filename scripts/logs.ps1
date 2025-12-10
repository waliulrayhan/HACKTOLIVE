# ===================================
# View Docker Logs
# Usage: .\scripts\logs.ps1 [service]
# ===================================

param(
    [string]$service = "",
    [switch]$follow
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "HACKTOLIVE Docker Logs" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

if ($service -eq "") {
    Write-Host "`nShowing logs for all services..." -ForegroundColor Yellow
    if ($follow) {
        docker-compose logs -f
    } else {
        docker-compose logs --tail=100
    }
} elseif ($service -eq "backend" -or $service -eq "frontend") {
    Write-Host "`nShowing logs for $service..." -ForegroundColor Yellow
    if ($follow) {
        docker-compose logs -f $service
    } else {
        docker-compose logs --tail=100 $service
    }
} else {
    Write-Host "`nInvalid service name!" -ForegroundColor Red
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\scripts\logs.ps1                - Show all logs" -ForegroundColor White
    Write-Host "  .\scripts\logs.ps1 backend        - Show backend logs" -ForegroundColor White
    Write-Host "  .\scripts\logs.ps1 frontend       - Show frontend logs" -ForegroundColor White
    Write-Host "  .\scripts\logs.ps1 -follow        - Follow logs" -ForegroundColor White
    exit 1
}
