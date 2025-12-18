#!/bin/bash

# SSL Certificate Setup for hacktolive.io and api.hacktolive.io
# Run this on your production server

set -e

echo "🔒 Setting up SSL certificates for hacktolive.io and api.hacktolive.io"

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt update
    apt install -y certbot
fi

# Stop nginx temporarily
docker-compose stop nginx || true

# Obtain SSL certificates for both domains
echo "Obtaining SSL certificate for hacktolive.io and api.hacktolive.io..."
certbot certonly --standalone \
    -d hacktolive.io \
    -d www.hacktolive.io \
    -d api.hacktolive.io \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.io

# Copy certificates to nginx ssl directory
echo "Copying certificates to nginx directory..."
mkdir -p /root/HACKTOLIVE/nginx/ssl
cp /etc/letsencrypt/live/hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/
cp /etc/letsencrypt/live/hacktolive.io/privkey.pem /root/HACKTOLIVE/nginx/ssl/

# Set proper permissions
chmod 644 /root/HACKTOLIVE/nginx/ssl/fullchain.pem
chmod 600 /root/HACKTOLIVE/nginx/ssl/privkey.pem

# Restart nginx
cd /root/HACKTOLIVE
docker-compose up -d nginx

echo "✅ SSL certificates installed successfully!"
echo ""
echo "Your sites are now accessible at:"
echo "  - https://hacktolive.io"
echo "  - https://www.hacktolive.io"
echo "  - https://api.hacktolive.io"
echo ""
echo "Certificate will auto-renew. To manually renew:"
echo "  certbot renew"
