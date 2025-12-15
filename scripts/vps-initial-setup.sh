#!/bin/bash

# ==============================================
# HACKTOLIVE - VPS Deployment Script
# ==============================================
# This script deploys the HACKTOLIVE application
# on a fresh Ubuntu VPS
# ==============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="hacktolive.io"
APP_DIR="/var/www/hacktolive"
DB_NAME="hacktolive"
DB_USER="hacktolive_user"
DB_PASSWORD="HackTo@Live2026"
NODE_VERSION="20"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE VPS Deployment${NC}"
echo -e "${GREEN}========================================${NC}"

# Update system
echo -e "${YELLOW}[1/10] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo -e "${YELLOW}[2/10] Installing Node.js ${NODE_VERSION}...${NC}"
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
echo -e "${YELLOW}[3/10] Installing pnpm...${NC}"
sudo npm install -g pnpm

# Install MySQL
echo -e "${YELLOW}[4/10] Installing MySQL...${NC}"
sudo apt install -y mysql-server

# Secure MySQL installation
echo -e "${YELLOW}[5/10] Configuring MySQL...${NC}"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${DB_PASSWORD}';"
sudo mysql -u root -p${DB_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -u root -p${DB_PASSWORD} -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -u root -p${DB_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -u root -p${DB_PASSWORD} -e "FLUSH PRIVILEGES;"

# Install Nginx
echo -e "${YELLOW}[6/10] Installing Nginx...${NC}"
sudo apt install -y nginx

# Install PM2
echo -e "${YELLOW}[7/10] Installing PM2...${NC}"
sudo npm install -g pm2

# Create application directory
echo -e "${YELLOW}[8/10] Setting up application directory...${NC}"
sudo mkdir -p ${APP_DIR}
sudo mkdir -p ${APP_DIR}/uploads/avatars
sudo mkdir -p ${APP_DIR}/uploads/images
sudo mkdir -p ${APP_DIR}/uploads/documents
sudo chown -R $USER:$USER ${APP_DIR}

# Install Certbot for SSL
echo -e "${YELLOW}[9/10] Installing Certbot for SSL...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# Configure firewall
echo -e "${YELLOW}[10/10] Configuring firewall...${NC}"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Initial VPS setup completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Upload your application code to ${APP_DIR}"
echo -e "2. Configure environment variables"
echo -e "3. Run the application deployment script"
echo -e "4. Configure SSL with: sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
