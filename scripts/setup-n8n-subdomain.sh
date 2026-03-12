#!/bin/bash
# =============================================================================
# Setup n8n.hacktolive.net SSL + nginx
# Run AFTER adding DNS A record: n8n → 72.62.71.250
# =============================================================================

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[$(date '+%H:%M:%S')] $*${NC}"; }
warn() { echo -e "${YELLOW}[WARN] $*${NC}"; }
die()  { echo -e "${RED}[ERROR] $*${NC}"; exit 1; }

# Always restart nginx on exit (even on error) so the site stays up
_nginx_restart() { docker compose -f /root/HACKTOLIVE/docker-compose.yml up -d nginx 2>/dev/null || true; }
trap _nginx_restart EXIT

# ── 1. Verify DNS resolves ────────────────────────────────────────────────────
log "Checking DNS for n8n.hacktolive.net..."
RESOLVED=$(dig +short n8n.hacktolive.net A 2>/dev/null | head -1)
if [ "$RESOLVED" != "72.62.71.250" ]; then
    die "DNS not ready. n8n.hacktolive.net resolves to '${RESOLVED:-nothing}' (expected 72.62.71.250). Add the A record first."
fi
log "DNS OK → $RESOLVED"

# ── 2. Get SSL cert via certbot standalone ─────────────────────────────────
log "Stopping nginx briefly to obtain SSL certificate..."
cd /root/HACKTOLIVE
docker stop hacktolive-nginx

certbot certonly --standalone \
    -d n8n.hacktolive.net \
    --email admin@hacktolive.net \
    --agree-tos \
    --non-interactive || die "certbot failed — check /var/log/letsencrypt/letsencrypt.log"

# ── 3. Copy certs to nginx ssl directory ──────────────────────────────────
log "Installing SSL certificate..."
cp /etc/letsencrypt/live/n8n.hacktolive.net/fullchain.pem /root/HACKTOLIVE/nginx/ssl/n8n-fullchain.pem
cp /etc/letsencrypt/live/n8n.hacktolive.net/privkey.pem   /root/HACKTOLIVE/nginx/ssl/n8n-privkey.pem
log "Certs installed."

# ── 4. Pull latest nginx config from git ─────────────────────────────────
log "Pulling latest nginx config..."
git stash ; git pull origin main ; git stash drop || true

# ── 5. Test and start nginx ──────────────────────────────────────────────
log "Starting nginx and testing config..."
docker compose -f /root/HACKTOLIVE/docker-compose.yml up -d nginx
sleep 2
docker exec hacktolive-nginx nginx -t || die "nginx config test failed"
docker exec hacktolive-nginx nginx -s reload
log "nginx reloaded."

# ── 6. Verify ────────────────────────────────────────────────────────────
log "Verifying n8n.hacktolive.net..."
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://n8n.hacktolive.net/ 2>/dev/null || echo "FAILED")
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  n8n subdomain setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  URL :  https://n8n.hacktolive.net"
echo -e "  HTTP:  $HTTP_CODE"
echo -e "  Cert:  $(openssl x509 -enddate -noout -in /root/HACKTOLIVE/nginx/ssl/n8n-fullchain.pem 2>/dev/null | cut -d= -f2)"
echo ""
