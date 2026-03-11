#!/bin/bash

# SSL Certificate Setup for hacktolive.net (PRIMARY) and hacktolive.io (redirect)
# Run this on the production server after DNS for hacktolive.net is pointed to 72.62.71.250

set -e

echo "🔒 Setting up SSL certificates..."

# Install certbot if not already installed
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    apt update
    apt install -y certbot
fi

# Stop nginx temporarily
docker-compose stop nginx || true

# ── Step 1: SSL cert for hacktolive.net (covers www and api subdomains) ──────
echo "Obtaining SSL certificate for hacktolive.net, www.hacktolive.net, api.hacktolive.net..."
certbot certonly --standalone \
    -d hacktolive.net \
    -d www.hacktolive.net \
    -d api.hacktolive.net \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net

# Copy .net certificates to nginx ssl directory
echo "Copying .net certificates..."
mkdir -p /root/HACKTOLIVE/nginx/ssl
cp /etc/letsencrypt/live/hacktolive.net/fullchain.pem /root/HACKTOLIVE/nginx/ssl/net-fullchain.pem
cp /etc/letsencrypt/live/hacktolive.net/privkey.pem   /root/HACKTOLIVE/nginx/ssl/net-privkey.pem
chmod 644 /root/HACKTOLIVE/nginx/ssl/net-fullchain.pem
chmod 600 /root/HACKTOLIVE/nginx/ssl/net-privkey.pem

# ── Step 2: SSL cert for hacktolive.io (kept for HTTPS → HTTPS redirect) ─────
echo "Obtaining/renewing SSL certificate for hacktolive.io..."
certbot certonly --standalone \
    -d hacktolive.io \
    -d www.hacktolive.io \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net

# Copy .io frontend certificate
cp /etc/letsencrypt/live/hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/fullchain.pem
cp /etc/letsencrypt/live/hacktolive.io/privkey.pem   /root/HACKTOLIVE/nginx/ssl/privkey.pem
chmod 644 /root/HACKTOLIVE/nginx/ssl/fullchain.pem
chmod 600 /root/HACKTOLIVE/nginx/ssl/privkey.pem

# ── Step 3: SSL cert for api.hacktolive.io (kept for HTTPS → HTTPS redirect) ──
echo "Obtaining/renewing SSL certificate for api.hacktolive.io..."
certbot certonly --standalone \
    -d api.hacktolive.io \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net

# Copy .io api certificate
cp /etc/letsencrypt/live/api.hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/api-fullchain.pem
cp /etc/letsencrypt/live/api.hacktolive.io/privkey.pem   /root/HACKTOLIVE/nginx/ssl/api-privkey.pem
chmod 644 /root/HACKTOLIVE/nginx/ssl/api-fullchain.pem
chmod 600 /root/HACKTOLIVE/nginx/ssl/api-privkey.pem

# Restart nginx
cd /root/HACKTOLIVE
docker-compose up -d nginx

echo "✅ SSL certificates installed successfully!"
echo ""
echo "Primary domain (serves app):"
echo "  - https://hacktolive.net"
echo "  - https://www.hacktolive.net  → redirects to https://hacktolive.net"
echo "  - https://api.hacktolive.net"
echo ""
echo "Redirect domain (old, sends users to .net):"
echo "  - https://hacktolive.io  → 301 → https://hacktolive.net"
echo "  - https://api.hacktolive.io  → 301 → https://api.hacktolive.net"
echo ""
echo "Certificate auto-renewal is managed by certbot. To renew manually:"
echo "  docker-compose stop nginx && certbot renew && docker-compose up -d nginx"
