# HACKTOLIVE Production Deployment Script (PowerShell)
# This script handles complete deployment to production server

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting HACKTOLIVE deployment..." -ForegroundColor Cyan

$SERVER = "root@72.62.71.250"

Write-Host "`n📦 Step 1: Stashing local changes and pulling latest code..." -ForegroundColor Yellow
ssh $SERVER "cd /var/www/hacktolive && git stash && git pull origin main"
Write-Host "✅ Code updated" -ForegroundColor Green

Write-Host "`n🔧 Step 2: Installing backend dependencies and building..." -ForegroundColor Yellow
ssh $SERVER "cd /var/www/hacktolive/backend && pnpm install && pnpm run build"
Write-Host "✅ Backend built" -ForegroundColor Green

Write-Host "`n🔧 Step 3: Installing frontend dependencies and building..." -ForegroundColor Yellow
ssh $SERVER "cd /var/www/hacktolive/frontend && npm install && npm run build"
Write-Host "✅ Frontend built" -ForegroundColor Green

Write-Host "`n🔄 Step 4: Restarting services..." -ForegroundColor Yellow
ssh $SERVER "pm2 restart hacktolive-backend && pm2 restart hacktolive-frontend && pm2 save"
Write-Host "✅ Services restarted" -ForegroundColor Green

Write-Host "`n📊 Step 5: Checking application status..." -ForegroundColor Yellow
ssh $SERVER "pm2 status"

Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Visit: https://hacktolive.io" -ForegroundColor Green
