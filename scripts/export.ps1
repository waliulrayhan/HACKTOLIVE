# ===================================
# Export Docker Images
# Usage: .\scripts\export.ps1
# ===================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Exporting HACKTOLIVE Docker Images" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Create exports directory if it doesn't exist
if (-not (Test-Path "exports")) {
    New-Item -ItemType Directory -Path "exports" | Out-Null
    Write-Host "Created exports directory" -ForegroundColor Green
}

# Export backend image
Write-Host "`nExporting backend image..." -ForegroundColor Yellow
docker save hacktolive-backend:latest -o exports/backend-docker.tar
if ($LASTEXITCODE -eq 0) {
    $backendSize = (Get-Item exports/backend-docker.tar).Length / 1MB
    Write-Host "Backend exported successfully! (Size: $([math]::Round($backendSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "Backend export failed!" -ForegroundColor Red
    exit 1
}

# Export frontend image
Write-Host "`nExporting frontend image..." -ForegroundColor Yellow
docker save hacktolive-frontend:latest -o exports/frontend-docker.tar
if ($LASTEXITCODE -eq 0) {
    $frontendSize = (Get-Item exports/frontend-docker.tar).Length / 1MB
    Write-Host "Frontend exported successfully! (Size: $([math]::Round($frontendSize, 2)) MB)" -ForegroundColor Green
} else {
    Write-Host "Frontend export failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "Export completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host "`nExported files:" -ForegroundColor Cyan
Get-ChildItem exports/*.tar | ForEach-Object {
    $size = $_.Length / 1MB
    Write-Host "  $($_.Name) - $([math]::Round($size, 2)) MB" -ForegroundColor White
}
