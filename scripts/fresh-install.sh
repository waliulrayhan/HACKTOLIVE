#!/bin/bash
# ==============================================
# Complete Server Clean & Fresh Setup
# Run this on your server for a fresh start
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🧹 Starting Complete Server Clean & Fresh Setup...${NC}"

# 1. Stop and remove all Docker containers
echo -e "${YELLOW}1. Stopping all Docker containers...${NC}"
docker stop $(docker ps -aq) 2>/dev/null || true
docker rm -f $(docker ps -aq) 2>/dev/null || true

# 2. Remove all Docker images
echo -e "${YELLOW}2. Removing all Docker images...${NC}"
docker rmi -f $(docker images -aq) 2>/dev/null || true

# 3. Remove all Docker volumes
echo -e "${YELLOW}3. Removing all Docker volumes...${NC}"
docker volume rm -f $(docker volume ls -q) 2>/dev/null || true

# 4. Clean Docker system
echo -e "${YELLOW}4. Cleaning Docker system...${NC}"
docker system prune -af --volumes || true

# 5. Force remove old project directory
echo -e "${YELLOW}5. Removing old project directory...${NC}"
cd /var/www
chmod -R 777 hacktolive 2>/dev/null || true
rm -rf hacktolive
cd /root
chmod -R 777 HACKTOLIVE 2>/dev/null || true
rm -rf HACKTOLIVE

# 6. Clone fresh repository
echo -e "${YELLOW}6. Cloning fresh repository...${NC}"
cd /root
git clone https://github.com/YOUR_USERNAME/HACKTOLIVE.git
cd HACKTOLIVE

# 7. Make scripts executable
echo -e "${YELLOW}7. Making scripts executable...${NC}"
chmod +x scripts/*.sh

# 8. Setup SSL certificates
echo -e "${YELLOW}8. Setting up SSL certificates...${NC}"
./scripts/setup-ssl.sh

# 9. Deploy application
echo -e "${YELLOW}9. Deploying application...${NC}"
./scripts/deploy.sh

echo ""
echo -e "${GREEN}======================================"
echo "✅ Fresh setup complete!"
echo "======================================${NC}"
echo ""
echo "Your application is now running at:"
echo "  - https://hacktolive.io"
echo "  - https://api.hacktolive.io"
echo ""
echo "Check status:"
echo "  docker-compose ps"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
