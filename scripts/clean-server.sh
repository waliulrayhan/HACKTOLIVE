#!/bin/bash

# ==============================================
# Clean Server and Fresh Start
# WARNING: This will remove all Docker containers,
# images, and volumes. Use with caution!
# ==============================================

set -e

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}======================================"
echo "⚠️  WARNING: CLEAN SERVER SCRIPT"
echo "======================================${NC}"
echo ""
echo "This script will:"
echo "1. Stop all Docker containers"
echo "2. Remove all containers"
echo "3. Remove all Docker images"
echo "4. Remove all Docker volumes (uploaded files will be lost!)"
echo "5. Clean Docker system"
echo "6. Pull latest code from GitHub"
echo "7. Fresh deployment"
echo ""
echo -e "${YELLOW}Are you sure you want to continue? (type 'yes' to confirm)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo -e "${GREEN}Starting clean process...${NC}"

# Navigate to project directory
cd /root/HACKTOLIVE

# Stop all containers
echo -e "${YELLOW}1. Stopping all containers...${NC}"
docker-compose down || true

# Remove all containers
echo -e "${YELLOW}2. Removing all containers...${NC}"
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Remove all images
echo -e "${YELLOW}3. Removing all Docker images...${NC}"
docker rmi -f $(docker images -aq) 2>/dev/null || true

# Remove all volumes
echo -e "${YELLOW}4. Removing all Docker volumes...${NC}"
docker volume rm $(docker volume ls -q) 2>/dev/null || true

# Clean Docker system
echo -e "${YELLOW}5. Cleaning Docker system...${NC}"
docker system prune -af --volumes

# Pull latest code
echo -e "${YELLOW}6. Pulling latest code from GitHub...${NC}"
git fetch --all
git reset --hard origin/main || git reset --hard origin/master

# Fresh deployment
echo -e "${YELLOW}7. Starting fresh deployment...${NC}"
chmod +x scripts/deploy.sh
./scripts/deploy.sh

echo ""
echo -e "${GREEN}======================================"
echo "✅ Server cleaned and fresh deployment complete!"
echo "======================================${NC}"
echo ""
echo "Container status:"
docker-compose ps
