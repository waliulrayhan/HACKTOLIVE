#!/bin/bash

# ==============================================
# HACKTOLIVE - SSL Certificate Setup Script
# ==============================================
# Automatically setup SSL certificates
# ==============================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get domain from user
echo -e "${YELLOW}Enter your domain name (e.g., example.com):${NC}"
read DOMAIN

echo -e "${YELLOW}Enter your email for SSL certificate notifications:${NC}"
read EMAIL

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Setup${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Obtain certificate
echo -e "${YELLOW}Obtaining SSL certificate...${NC}"
sudo certbot --nginx \
    -d ${DOMAIN} \
    -d www.${DOMAIN} \
    -d api.${DOMAIN} \
    --email ${EMAIL} \
    --agree-tos \
    --non-interactive \
    --redirect

# Setup auto-renewal
echo -e "${YELLOW}Setting up auto-renewal...${NC}"
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
echo -e "${YELLOW}Testing auto-renewal...${NC}"
sudo certbot renew --dry-run

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SSL Certificate Setup Completed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${YELLOW}Your site is now secured with HTTPS${NC}"
echo -e "Certificate will auto-renew before expiration"
