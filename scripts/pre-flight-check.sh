#!/bin/bash

# ==============================================
# HACKTOLIVE - Production Pre-flight Check
# ==============================================
# Run this before deployment to verify setup
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ERRORS=0

check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        ((ERRORS++))
    fi
}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Pre-flight Check${NC}"
echo -e "${GREEN}========================================${NC}"

# Check environment files
echo -e "\n${YELLOW}Checking Environment Files:${NC}"

test -f backend/.env.production
check "Backend .env.production exists"

test -f frontend/.env.production
check "Frontend .env.production exists"

# Check if critical environment variables are set
if [ -f backend/.env.production ]; then
    grep -q "DATABASE_URL=" backend/.env.production
    check "DATABASE_URL is set"
    
    grep -q "JWT_SECRET=" backend/.env.production
    check "JWT_SECRET is set"
    
    grep -q "FRONTEND_URL=" backend/.env.production
    check "FRONTEND_URL is set"
fi

if [ -f frontend/.env.production ]; then
    grep -q "NEXT_PUBLIC_API_URL=" frontend/.env.production
    check "NEXT_PUBLIC_API_URL is set"
fi

# Check directories
echo -e "\n${YELLOW}Checking Directories:${NC}"

test -d backend/src
check "Backend source directory exists"

test -d frontend/src
check "Frontend source directory exists"

test -d backend/prisma
check "Prisma directory exists"

# Check dependencies
echo -e "\n${YELLOW}Checking Dependencies:${NC}"

test -f backend/package.json
check "Backend package.json exists"

test -f frontend/package.json
check "Frontend package.json exists"

# Check scripts are executable
echo -e "\n${YELLOW}Checking Scripts:${NC}"

test -x scripts/vps-initial-setup.sh
check "vps-initial-setup.sh is executable"

test -x scripts/deploy-app.sh
check "deploy-app.sh is executable"

test -x scripts/backup-database.sh
check "backup-database.sh is executable"

# Check Nginx config
echo -e "\n${YELLOW}Checking Configuration Files:${NC}"

test -f nginx/hacktolive-vps.conf
check "Nginx VPS config exists"

test -f docker-compose.yml
check "Docker Compose file exists"

test -f ecosystem.config.js
check "PM2 ecosystem config exists"

# Summary
echo -e "\n${GREEN}========================================${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
else
    echo -e "${RED}✗ Found $ERRORS error(s). Please fix before deploying.${NC}"
    exit 1
fi
echo -e "${GREEN}========================================${NC}"
