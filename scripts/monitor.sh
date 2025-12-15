# ==============================================
# HACKTOLIVE - Server Monitoring Script
# ==============================================
# Monitor server resources and application health
# ==============================================

#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Server Status${NC}"
echo -e "${GREEN}========================================${NC}"

# System Information
echo -e "\n${YELLOW}System Information:${NC}"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime -p)"
echo "Date: $(date)"

# CPU Usage
echo -e "\n${YELLOW}CPU Usage:${NC}"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "CPU Usage: " 100 - $1"%"}'

# Memory Usage
echo -e "\n${YELLOW}Memory Usage:${NC}"
free -h | grep Mem | awk '{print "Used: " $3 " / " $2 " (" $3/$2*100 "%)"}'

# Disk Usage
echo -e "\n${YELLOW}Disk Usage:${NC}"
df -h / | tail -1 | awk '{print "Used: " $3 " / " $2 " (" $5 ")"}'

# PM2 Status
echo -e "\n${YELLOW}Application Status (PM2):${NC}"
pm2 status

# MySQL Status
echo -e "\n${YELLOW}MySQL Status:${NC}"
systemctl is-active --quiet mysql && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not Running${NC}"

# Nginx Status
echo -e "\n${YELLOW}Nginx Status:${NC}"
systemctl is-active --quiet nginx && echo -e "${GREEN}✓ Running${NC}" || echo -e "${RED}✗ Not Running${NC}"

# Active Connections
echo -e "\n${YELLOW}Active Network Connections:${NC}"
netstat -an | grep ESTABLISHED | wc -l | awk '{print $1 " connections"}'

# Recent Backups
echo -e "\n${YELLOW}Recent Backups:${NC}"
if [ -d "/var/backups/hacktolive/mysql" ]; then
    ls -lht /var/backups/hacktolive/mysql/*.sql.gz 2>/dev/null | head -3
else
    echo "No backups found"
fi

# Disk Space Warning
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo -e "\n${RED}⚠ WARNING: Disk usage is above 80%!${NC}"
fi

# Memory Warning
MEMORY_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100}' | cut -d. -f1)
if [ $MEMORY_USAGE -gt 80 ]; then
    echo -e "${RED}⚠ WARNING: Memory usage is above 80%!${NC}"
fi

echo -e "\n${GREEN}========================================${NC}"
