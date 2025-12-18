#!/bin/bash

# ==============================================
# Server Setup Script for HACKTOLIVE
# Run this script once on your production server
# ==============================================

set -e

echo "🚀 HACKTOLIVE Server Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Updating system packages...${NC}"
apt update && apt upgrade -y

echo -e "${GREEN}Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    # Install Docker
    apt install -y ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
else
    echo -e "${YELLOW}Docker is already installed${NC}"
fi

echo -e "${GREEN}Step 3: Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✅ Docker Compose installed successfully${NC}"
else
    echo -e "${YELLOW}Docker Compose is already installed${NC}"
fi

echo -e "${GREEN}Step 4: Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt install -y git
    echo -e "${GREEN}✅ Git installed successfully${NC}"
else
    echo -e "${YELLOW}Git is already installed${NC}"
fi

echo -e "${GREEN}Step 5: Configuring firewall...${NC}"
# Install UFW if not installed
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
echo "y" | ufw enable

echo -e "${GREEN}✅ Firewall configured${NC}"

echo -e "${GREEN}Step 6: Setting up project directory...${NC}"
mkdir -p /root/HACKTOLIVE
cd /root/HACKTOLIVE

# Ask for GitHub repository URL
echo -e "${YELLOW}Enter your GitHub repository URL (e.g., https://github.com/username/HACKTOLIVE.git):${NC}"
read -r REPO_URL

if [ -d ".git" ]; then
    echo -e "${YELLOW}Repository already exists. Pulling latest changes...${NC}"
    git pull
else
    echo -e "${GREEN}Cloning repository...${NC}"
    git clone "$REPO_URL" .
fi

echo -e "${GREEN}Step 7: Configuring environment variables...${NC}"
echo -e "${YELLOW}Please update the .env.production file with your actual values${NC}"
echo -e "${YELLOW}Also update backend/.env.production and frontend/.env.production${NC}"

echo -e "${GREEN}Step 8: Setting up SSL (Optional)...${NC}"
echo -e "${YELLOW}Do you want to set up SSL with Let's Encrypt? (y/n)${NC}"
read -r SETUP_SSL

if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
    apt install -y certbot
    
    echo -e "${YELLOW}Enter your domain name (e.g., hacktolive.io):${NC}"
    read -r DOMAIN
    
    echo -e "${GREEN}Getting SSL certificate...${NC}"
    certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN"
    
    # Create SSL directory for nginx
    mkdir -p nginx/ssl
    cp /etc/letsencrypt/live/"$DOMAIN"/fullchain.pem nginx/ssl/
    cp /etc/letsencrypt/live/"$DOMAIN"/privkey.pem nginx/ssl/
    
    echo -e "${GREEN}✅ SSL certificate obtained${NC}"
    echo -e "${YELLOW}Don't forget to uncomment SSL configuration in nginx/conf.d/default.conf${NC}"
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update environment variables in:"
echo "   - .env.production"
echo "   - backend/.env.production"
echo "   - frontend/.env.production"
echo ""
echo "2. Start the application:"
echo "   docker-compose up -d"
echo ""
echo "3. Check the logs:"
echo "   docker-compose logs -f"
echo ""
echo "4. Set up GitHub secrets for CI/CD:"
echo "   - VPS_HOST: 72.62.71.250"
echo "   - VPS_USERNAME: root"
echo "   - VPS_PASSWORD: your-server-password"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
