#!/bin/bash

# ==============================================
# HACKTOLIVE - Application Deployment Script
# ==============================================
# Run this after initial VPS setup
# ==============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/hacktolive"
BACKEND_DIR="${APP_DIR}/backend"
FRONTEND_DIR="${APP_DIR}/frontend"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deploying HACKTOLIVE Application${NC}"
echo -e "${GREEN}========================================${NC}"

cd ${APP_DIR}

# Install backend dependencies
echo -e "${YELLOW}[1/6] Installing backend dependencies...${NC}"
cd ${BACKEND_DIR}
pnpm install --prod

# Build backend
echo -e "${YELLOW}[2/6] Building backend...${NC}"
pnpm run build

# Run Prisma migrations
echo -e "${YELLOW}[3/6] Running database migrations...${NC}"
npx prisma migrate deploy
npx prisma generate

# Install frontend dependencies
echo -e "${YELLOW}[4/6] Installing frontend dependencies...${NC}"
cd ${FRONTEND_DIR}
pnpm install --prod

# Build frontend
echo -e "${YELLOW}[5/6] Building frontend...${NC}"
pnpm run build

# Start/Restart services
echo -e "${YELLOW}[6/6] Starting services with PM2...${NC}"
pm2 delete all || true
pm2 start ${BACKEND_DIR}/dist/main.js --name "hacktolive-backend" --time
pm2 start ${FRONTEND_DIR}/node_modules/.bin/next --name "hacktolive-frontend" -- start -p 3000
pm2 save
pm2 startup

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Application Status:${NC}"
pm2 status
