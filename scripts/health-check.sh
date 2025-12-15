# ==============================================
# HACKTOLIVE - Health Check Script
# ==============================================
# Check if all services are running properly
# ==============================================

#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

API_URL="http://localhost:4000"
FRONTEND_URL="http://localhost:3000"

check_service() {
    local service=$1
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✓ $service is running${NC}"
        return 0
    else
        echo -e "${RED}✗ $service is not running${NC}"
        return 1
    fi
}

check_http() {
    local url=$1
    local name=$2
    if curl -s -o /dev/null -w "%{http_code}" $url | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ $name is responding${NC}"
        return 0
    else
        echo -e "${RED}✗ $name is not responding${NC}"
        return 1
    fi
}

echo -e "${YELLOW}Checking HACKTOLIVE Health...${NC}\n"

# Check system services
check_service mysql
check_service nginx

# Check PM2 apps
echo -e "\n${YELLOW}Checking PM2 Applications:${NC}"
if pm2 status | grep -q "online"; then
    echo -e "${GREEN}✓ PM2 applications are running${NC}"
    pm2 status
else
    echo -e "${RED}✗ PM2 applications are not running${NC}"
fi

# Check HTTP endpoints
echo -e "\n${YELLOW}Checking HTTP Endpoints:${NC}"
check_http $API_URL "Backend API"
check_http $FRONTEND_URL "Frontend"

# Check database connection
echo -e "\n${YELLOW}Checking Database Connection:${NC}"
if mysql -u root -p${MYSQL_PASSWORD} -e "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}✓ MySQL connection successful${NC}"
else
    echo -e "${RED}✗ MySQL connection failed${NC}"
fi

# Check disk space
echo -e "\n${YELLOW}Checking Disk Space:${NC}"
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo -e "${GREEN}✓ Disk space OK ($DISK_USAGE%)${NC}"
else
    echo -e "${RED}✗ Disk space critical ($DISK_USAGE%)${NC}"
fi

echo ""
