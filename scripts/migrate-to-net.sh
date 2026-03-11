#!/bin/bash

# =============================================================================
# HackToLive Domain Migration: hacktolive.io → hacktolive.net
#
# Run this script ON THE VPS after completing the DNS step below.
#
# PRE-REQUISITE (do this in Hostinger panel for hacktolive.net FIRST):
#   1. Delete A record: @ → 2.57.91.91
#   2. Add    A record: @ → 72.62.71.250
#   3. The existing CNAME: www → hacktolive.net is fine (keep it)
#   4. Add    A record: api → 72.62.71.250
#   5. Wait for DNS propagation (15 min – 24 hours)
#      Test with: nslookup hacktolive.net
#
# USAGE:
#   ssh root@72.62.71.250
#   cd /root/HACKTOLIVE
#   git pull origin main
#   chmod +x scripts/migrate-to-net.sh
#   ./scripts/migrate-to-net.sh
# =============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}▶ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠ $1${NC}"; }
fail() { echo -e "${RED}✖ $1${NC}"; exit 1; }

log "Starting domain migration: hacktolive.io → hacktolive.net"
echo "=================================================="

# ── 1. Verify DNS is propagated for hacktolive.net ────────────────────────────
log "Checking DNS propagation for hacktolive.net..."
RESOLVED=$(dig +short hacktolive.net A 2>/dev/null | head -1)
if [ "$RESOLVED" != "72.62.71.250" ]; then
    fail "DNS not yet propagated. hacktolive.net resolves to '$RESOLVED', expected 72.62.71.250.\n  Wait longer and re-run this script."
fi
log "DNS OK — hacktolive.net → 72.62.71.250"

# ── 2. Install certbot if missing ─────────────────────────────────────────────
if ! command -v certbot &> /dev/null; then
    log "Installing certbot..."
    apt update -qq
    apt install -y certbot
fi

# ── 3. Stop nginx to free port 80 for standalone challenge ────────────────────
log "Stopping nginx..."
cd /root/HACKTOLIVE
docker-compose stop nginx

# ── 4. Obtain SSL cert for hacktolive.net (SAN covers www + api) ──────────────
log "Requesting SSL certificate for hacktolive.net..."
certbot certonly --standalone \
    -d hacktolive.net \
    -d www.hacktolive.net \
    -d api.hacktolive.net \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net

mkdir -p /root/HACKTOLIVE/nginx/ssl
cp /etc/letsencrypt/live/hacktolive.net/fullchain.pem /root/HACKTOLIVE/nginx/ssl/net-fullchain.pem
cp /etc/letsencrypt/live/hacktolive.net/privkey.pem   /root/HACKTOLIVE/nginx/ssl/net-privkey.pem
chmod 644 /root/HACKTOLIVE/nginx/ssl/net-fullchain.pem
chmod 600 /root/HACKTOLIVE/nginx/ssl/net-privkey.pem
log "hacktolive.net SSL cert installed."

# ── 5. Renew / ensure SSL cert for hacktolive.io (used for redirect) ──────────
log "Renewing SSL certificate for hacktolive.io..."
certbot certonly --standalone \
    -d hacktolive.io \
    -d www.hacktolive.io \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net || warn "Could not renew hacktolive.io cert (may already be valid)."

if [ -f /etc/letsencrypt/live/hacktolive.io/fullchain.pem ]; then
    cp /etc/letsencrypt/live/hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/fullchain.pem
    cp /etc/letsencrypt/live/hacktolive.io/privkey.pem   /root/HACKTOLIVE/nginx/ssl/privkey.pem
    chmod 644 /root/HACKTOLIVE/nginx/ssl/fullchain.pem
    chmod 600 /root/HACKTOLIVE/nginx/ssl/privkey.pem
    log "hacktolive.io SSL cert installed."
fi

# ── 6. Renew / ensure SSL cert for api.hacktolive.io ─────────────────────────
log "Renewing SSL certificate for api.hacktolive.io..."
certbot certonly --standalone \
    -d api.hacktolive.io \
    --agree-tos \
    --non-interactive \
    --email admin@hacktolive.net || warn "Could not renew api.hacktolive.io cert (may already be valid)."

if [ -f /etc/letsencrypt/live/api.hacktolive.io/fullchain.pem ]; then
    cp /etc/letsencrypt/live/api.hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/api-fullchain.pem
    cp /etc/letsencrypt/live/api.hacktolive.io/privkey.pem   /root/HACKTOLIVE/nginx/ssl/api-privkey.pem
    chmod 644 /root/HACKTOLIVE/nginx/ssl/api-fullchain.pem
    chmod 600 /root/HACKTOLIVE/nginx/ssl/api-privkey.pem
    log "api.hacktolive.io SSL cert installed."
fi

# ── 7. Rebuild and redeploy all containers with updated config ─────────────────
log "Rebuilding and redeploying containers..."
docker-compose build --no-cache
docker-compose up -d --force-recreate --remove-orphans

log "Waiting 30 seconds for services to stabilise..."
sleep 30

# ── 8. Health checks ──────────────────────────────────────────────────────────
log "Running health checks..."

check_url() {
    local url=$1
    local label=$2
    if curl -fsS --max-time 10 "$url" > /dev/null 2>&1; then
        echo -e "  ${GREEN}✔ $label${NC}"
    else
        echo -e "  ${YELLOW}⚠ $label — not yet reachable (DNS may still be propagating)${NC}"
    fi
}

check_url "https://hacktolive.net"           "https://hacktolive.net (frontend)"
check_url "https://api.hacktolive.net/health" "https://api.hacktolive.net (backend)"
check_url "http://localhost/health"           "localhost health endpoint"

echo ""
echo -e "${GREEN}=================================================="
echo -e "✅ Migration complete!"
echo -e "=================================================="
echo -e "  Primary site  : https://hacktolive.net"
echo -e "  API            : https://api.hacktolive.net"
echo -e "  Redirects      : hacktolive.io → hacktolive.net (301)"
echo ""
echo -e "NEXT STEPS (manual — outside the server):"
echo -e "  1. Google OAuth Console: add https://api.hacktolive.net/auth/google/callback"
echo -e "     as an authorised redirect URI."
echo -e "  2. EPS Payment Gateway: update callback URLs to hacktolive.net."
echo -e "  3. Cloudflare Turnstile: add hacktolive.net as an allowed hostname."
echo -e "==================================================${NC}"
