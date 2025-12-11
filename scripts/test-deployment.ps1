# Test Deployment Build Locally
# This script simulates what GitHub Actions will do

Write-Host "🧪 Testing Deployment Build Process..." -ForegroundColor Cyan
Write-Host ""

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
Remove-Item -Path ".\deploy" -Recurse -Force -ErrorAction SilentlyContinue

# Create deploy directory
New-Item -ItemType Directory -Path ".\deploy" -Force | Out-Null
New-Item -ItemType Directory -Path ".\deploy\backend" -Force | Out-Null
New-Item -ItemType Directory -Path ".\deploy\public_html" -Force | Out-Null

# Build Backend
Write-Host ""
Write-Host "🔨 Building Backend..." -ForegroundColor Yellow
Set-Location backend
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ Backend build successful" -ForegroundColor Green

# Copy backend files
Write-Host "📦 Preparing backend deployment files..." -ForegroundColor Yellow
Copy-Item -Path "dist" -Destination "..\deploy\backend\dist" -Recurse
Copy-Item -Path "package.json" -Destination "..\deploy\backend\"
Copy-Item -Path "package-lock.json" -Destination "..\deploy\backend\"
Copy-Item -Path "prisma" -Destination "..\deploy\backend\prisma" -Recurse
Copy-Item -Path ".env.production.example" -Destination "..\deploy\backend\.env.example"

Set-Location ..

# Build Frontend
Write-Host ""
Write-Host "🔨 Building Frontend..." -ForegroundColor Yellow
Set-Location frontend
$env:NEXT_PUBLIC_API_URL = "https://yourdomain.com/backend"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ Frontend build successful" -ForegroundColor Green

# Copy frontend files
Write-Host "📦 Preparing frontend deployment files..." -ForegroundColor Yellow
Copy-Item -Path ".next\standalone\*" -Destination "..\deploy\public_html\" -Recurse
Copy-Item -Path ".next\static" -Destination "..\deploy\public_html\.next\static" -Recurse
Copy-Item -Path "public" -Destination "..\deploy\public_html\public" -Recurse
Copy-Item -Path "package.json" -Destination "..\deploy\public_html\"
Copy-Item -Path "package-lock.json" -Destination "..\deploy\public_html\"
Copy-Item -Path ".env.production.example" -Destination "..\deploy\public_html\.env.example"

Set-Location ..

# Summary
Write-Host ""
Write-Host "✅ Build test completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Deployment files are in the 'deploy' folder:" -ForegroundColor Cyan
Write-Host "   - deploy\backend\ (Backend files)"
Write-Host "   - deploy\public_html\ (Frontend files)"
Write-Host ""
Write-Host "📊 Deployment size:" -ForegroundColor Cyan

$backendSize = (Get-ChildItem -Path ".\deploy\backend" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
$frontendSize = (Get-ChildItem -Path ".\deploy\public_html" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "   - Backend: $([math]::Round($backendSize, 2)) MB"
Write-Host "   - Frontend: $([math]::Round($frontendSize, 2)) MB"
Write-Host "   - Total: $([math]::Round($backendSize + $frontendSize, 2)) MB"
Write-Host ""
Write-Host "⚠️  Note: Production node_modules not installed (would add ~100-200MB)"
Write-Host "    GitHub Actions will handle this during deployment"
Write-Host ""
