#!/bin/bash

# HACKTOLIVE Production Deployment Script
# This script handles complete deployment to production server

set -e

echo "🚀 Starting HACKTOLIVE deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SERVER="root@72.62.71.250"
APP_DIR="/var/www/hacktolive"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo -e "${YELLOW}📦 Step 1: Stashing local changes and pulling latest code...${NC}"
ssh $SERVER << 'ENDSSH'
cd /var/www/hacktolive
git stash
git pull origin main
ENDSSH

echo -e "${GREEN}✅ Code updated${NC}"

echo -e "${YELLOW}🔧 Step 2: Installing backend dependencies and building...${NC}"
ssh $SERVER << 'ENDSSH'
cd /var/www/hacktolive/backend
pnpm install
pnpm run build
ENDSSH

echo -e "${GREEN}✅ Backend built${NC}"

echo -e "${YELLOW}🔧 Step 3: Installing frontend dependencies and building...${NC}"
ssh $SERVER << 'ENDSSH'
cd /var/www/hacktolive/frontend
npm install
npm run build
ENDSSH

echo -e "${GREEN}✅ Frontend built${NC}"

echo -e "${YELLOW}🔄 Step 4: Restarting services...${NC}"
ssh $SERVER << 'ENDSSH'
pm2 restart hacktolive-backend
pm2 restart hacktolive-frontend
pm2 save
ENDSSH

echo -e "${GREEN}✅ Services restarted${NC}"

echo -e "${YELLOW}📊 Step 5: Checking application status...${NC}"
ssh $SERVER << 'ENDSSH'
pm2 status
ENDSSH

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Visit: https://hacktolive.io${NC}"
