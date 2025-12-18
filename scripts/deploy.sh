#!/bin/bash

# ==============================================
# HACKTOLIVE Deployment Script
# Quick deploy script for manual deployment
# ==============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Deploying HACKTOLIVE...${NC}"
echo "=================================="

# Pull latest changes
echo -e "${GREEN}📦 Pulling latest code from GitHub...${NC}"
git pull origin main || git pull origin master

# Build images (without stopping services)
echo -e "${GREEN}🔨 Building Docker images...${NC}"
docker-compose build

# Recreate containers with zero-downtime
echo -e "${GREEN}🔄 Recreating containers...${NC}"
docker-compose up -d --force-recreate --remove-orphans

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to stabilize...${NC}"
sleep 30

# Show status
echo -e "${GREEN}📊 Container Status:${NC}"
docker-compose ps

# Check health
echo -e "${GREEN}🔍 Health Check:${NC}"
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
else
    echo -e "${RED}⚠️ Health check failed. Check logs with: docker-compose logs${NC}"
fi

# Clean up
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -af --filter "until=24h" || true

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop app: docker-compose down"
echo "Restart: docker-compose restart"
