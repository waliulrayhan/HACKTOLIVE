#!/bin/bash

# ==============================================
# HACKTOLIVE - Quick Update Script
# ==============================================
# Use this for quick updates after code changes
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/hacktolive"
COMPONENT=${1:-"all"}

echo -e "${GREEN}Updating HACKTOLIVE - Component: ${COMPONENT}${NC}"

update_backend() {
    echo -e "${YELLOW}Updating backend...${NC}"
    cd ${APP_DIR}/backend
    pnpm install --prod
    pnpm run build
    npx prisma migrate deploy
    npx prisma generate
    pm2 restart hacktolive-backend
}

update_frontend() {
    echo -e "${YELLOW}Updating frontend...${NC}"
    cd ${APP_DIR}/frontend
    pnpm install --prod
    pnpm run build
    pm2 restart hacktolive-frontend
}

case $COMPONENT in
    "backend")
        update_backend
        ;;
    "frontend")
        update_frontend
        ;;
    "all")
        update_backend
        update_frontend
        ;;
    *)
        echo "Usage: $0 {backend|frontend|all}"
        exit 1
        ;;
esac

echo -e "${GREEN}Update completed!${NC}"
pm2 status
