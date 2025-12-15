#!/bin/bash

# ==============================================
# HACKTOLIVE - ONE-COMMAND DEPLOYMENT
# ==============================================
# Complete automated deployment for hacktolive.io
# Run this on your VPS after uploading the code
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╦ ╦╔═╗╔═╗╦╔═╔╦╗╔═╗╦  ╦╦  ╦╔═╗
╠═╣╠═╣║  ╠╩╗ ║ ║ ║║  ║╚╗╔╝║╣ 
╩ ╩╩ ╩╚═╝╩ ╩ ╩ ╚═╝╩═╝╩ ╚╝ ╚═╝
   AUTOMATED VPS DEPLOYMENT
EOF
echo -e "${NC}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Starting Complete Deployment${NC}"
echo -e "${GREEN}Domain: hacktolive.io${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}Error: Please run this script from the HACKTOLIVE root directory${NC}"
    exit 1
fi

APP_DIR=$(pwd)

# Step 1: Initial VPS Setup
echo -e "\n${YELLOW}[1/7] Setting up VPS environment...${NC}"
chmod +x scripts/*.sh
./scripts/vps-initial-setup.sh

# Step 2: Deploy Application
echo -e "\n${YELLOW}[2/7] Deploying application...${NC}"
./scripts/deploy-app.sh

# Step 3: Configure Nginx
echo -e "\n${YELLOW}[3/7] Configuring Nginx...${NC}"
cp nginx/hacktolive-vps.conf /etc/nginx/sites-available/hacktolive
ln -sf /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Step 4: Setup SSL
echo -e "\n${YELLOW}[4/7] Setting up SSL certificates...${NC}"
echo -e "${YELLOW}Please provide your email for SSL certificate notifications:${NC}"
read EMAIL

certbot --nginx \
    -d hacktolive.io \
    -d www.hacktolive.io \
    -d api.hacktolive.io \
    --email ${EMAIL} \
    --agree-tos \
    --non-interactive \
    --redirect

# Step 5: Setup Automated Backups
echo -e "\n${YELLOW}[5/7] Setting up automated backups...${NC}"
(crontab -l 2>/dev/null; echo "0 2 * * * ${APP_DIR}/scripts/backup-database.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * 0 ${APP_DIR}/scripts/backup-all.sh") | crontab -

# Step 6: Create first backup
echo -e "\n${YELLOW}[6/7] Creating initial backup...${NC}"
./scripts/backup-database.sh

# Step 7: Final verification
echo -e "\n${YELLOW}[7/7] Running health checks...${NC}"
sleep 5
./scripts/health-check.sh

# Display success message
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e ""
echo -e "${BLUE}Your HACKTOLIVE platform is now live at:${NC}"
echo -e ""
echo -e "  🌐 Website:    ${GREEN}https://hacktolive.io${NC}"
echo -e "  🌐 WWW:        ${GREEN}https://www.hacktolive.io${NC}"
echo -e "  🔌 API:        ${GREEN}https://api.hacktolive.io${NC}"
echo -e "  📚 API Docs:   ${GREEN}https://api.hacktolive.io/api${NC}"
echo -e ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Test all URLs above"
echo -e "  2. Create your first admin user"
echo -e "  3. Configure email settings (optional)"
echo -e "  4. Setup monitoring (optional)"
echo -e ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  • Check status:   ${GREEN}pm2 status${NC}"
echo -e "  • View logs:      ${GREEN}pm2 logs${NC}"
echo -e "  • Monitor:        ${GREEN}${APP_DIR}/scripts/monitor.sh${NC}"
echo -e "  • Update app:     ${GREEN}${APP_DIR}/scripts/update.sh all${NC}"
echo -e ""
echo -e "${GREEN}========================================${NC}"
