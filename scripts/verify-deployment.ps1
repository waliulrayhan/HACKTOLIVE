# Verify Deployment Readiness
Write-Host "🔍 Verifying Deployment Readiness..." -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Git Repository
Write-Host "📋 Git Configuration" -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   ✅ Git repository found" -ForegroundColor Green
} else {
    Write-Host "   ❌ Not a Git repository" -ForegroundColor Red
    $allGood = $false
}

# Check GitHub Actions
Write-Host ""
Write-Host "📋 GitHub Actions" -ForegroundColor Yellow
if (Test-Path ".github\workflows\deploy-hostinger.yml") {
    Write-Host "   ✅ Deployment workflow exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Deployment workflow not found" -ForegroundColor Red
    $allGood = $false
}

# Check Backend
Write-Host ""
Write-Host "📋 Backend Configuration" -ForegroundColor Yellow
if (Test-Path "backend\package.json") {
    Write-Host "   ✅ package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ package.json not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "backend\tsconfig.json") {
    Write-Host "   ✅ TypeScript config exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ tsconfig.json not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "backend\prisma\schema.prisma") {
    Write-Host "   ✅ Prisma schema exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ Prisma schema not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "backend\.env.production.example") {
    Write-Host "   ✅ Environment example exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env.production.example not found" -ForegroundColor Yellow
}

# Check Frontend
Write-Host ""
Write-Host "📋 Frontend Configuration" -ForegroundColor Yellow
if (Test-Path "frontend\package.json") {
    Write-Host "   ✅ package.json exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ package.json not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "frontend\next.config.ts") {
    $nextConfig = Get-Content "frontend\next.config.ts" -Raw
    if ($nextConfig -match "output:\s*[`'""]standalone[`'""]") {
        Write-Host "   ✅ Next.js standalone configured" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Next.js standalone not configured" -ForegroundColor Red
        $allGood = $false
    }
} else {
    Write-Host "   ❌ next.config.ts not found" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path "frontend\.env.production.example") {
    Write-Host "   ✅ Environment example exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  .env.production.example not found" -ForegroundColor Yellow
}

# Check Documentation
Write-Host ""
Write-Host "📋 Documentation" -ForegroundColor Yellow
if (Test-Path "DEPLOYMENT.md") {
    Write-Host "   ✅ Deployment guide exists" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  DEPLOYMENT.md not found" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
if ($allGood) {
    Write-Host "✅ All checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure GitHub Secrets (see DEPLOYMENT.md)"
    Write-Host "2. Push to main: git push origin main"
    Write-Host "3. Monitor in GitHub Actions"
} else {
    Write-Host "❌ Some checks failed" -ForegroundColor Red
    Write-Host "Please fix the errors above before deploying" -ForegroundColor Yellow
}
Write-Host ""
