# HACKTOLIVE Manual Deployment Commands

## Server Access
```bash
# SSH into server
ssh root@72.62.71.250
# Password: HackTo@Live2026

# Or using hostname
ssh root@srv1201587.hstgr.cloud
```

## Database Access (Local MySQL Connection)
```bash
# Create SSH tunnel to access MySQL from local machine
ssh -L 3307:localhost:3306 root@72.62.71.250
# Then connect to: localhost:3307
```

## Manual Deployment Process

### Pre-check (Important)
```bash
# These deploy methods require /root/HACKTOLIVE to be a Git repo
ssh root@72.62.71.250 "[ -d /root/HACKTOLIVE/.git ] && echo 'OK: git repo present' || echo 'ERROR: .git missing in /root/HACKTOLIVE'"
```

### Method 1: Quick Deploy (Recommended)
```bash
# Connect to server and deploy in one command
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git stash push -u -m deploy-temp || true && git pull origin main && git stash drop || true && chown -R 1000:1000 backend/uploads/ && docker compose up -d --force-recreate"
```

### Method 2: Step-by-Step Deploy
```bash
# 1. SSH into server
ssh root@72.62.71.250

# 2. Navigate to project directory
cd /root/HACKTOLIVE

# 3. Stash any local server-only env changes, pull, restore
git stash push -u -m deploy-temp || true
git pull origin main
git stash drop || true

# 4. Ensure upload directory permissions (backend runs as uid=1000)
chown -R 1000:1000 backend/uploads/

# 5. Recreate and restart containers (zero-downtime - no rebuild)
docker compose up -d --force-recreate

# 6. Check container status
docker compose ps

# 7. View logs if needed
docker compose logs -f
```

### Method 3: Full Rebuild (Use if major changes)
```bash
# 1. SSH into server
ssh root@72.62.71.250

# 2. Navigate to project directory
cd /root/HACKTOLIVE

# 3. Stop all containers
docker compose down

# 4. Stash local env changes and pull latest code
git stash push -u -m deploy-temp || true
git pull origin main
git stash drop || true

# 5. Ensure upload directory permissions
chown -R 1000:1000 backend/uploads/

# 6. Rebuild images and start
docker compose build
docker compose up -d

# 7. Verify everything is running
docker compose ps
```

## Health Check Commands

### Check Container Status
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose ps"
```

### Check Specific Container Logs
```bash
# Backend logs
ssh root@72.62.71.250 "docker logs hacktolive-backend --tail 50"

# Frontend logs
ssh root@72.62.71.250 "docker logs hacktolive-frontend --tail 50"

# Nginx logs
ssh root@72.62.71.250 "docker logs hacktolive-nginx --tail 50"
```

### Check Live Logs (Real-time)
```bash
# All containers
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose logs -f"

# Specific service
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose logs -f backend"
```

### Test API Health
```bash
# From server
ssh root@72.62.71.250 "curl http://localhost:4000/health"

# From local machine
curl https://api.hacktolive.net/health
curl https://hacktolive.net
```

## Troubleshooting Commands

### Restart Specific Service
```bash
# Restart backend only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose restart backend"

# Restart frontend only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose restart frontend"

# Restart nginx only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose restart nginx"
```

### Fix Upload Permissions (if needed)
```bash
# Backend runs as uid=1000 (node user) — use chown, NOT chmod 777
ssh root@72.62.71.250 "chown -R 1000:1000 /root/HACKTOLIVE/backend/uploads"
```

### Clean Up Docker Resources
```bash
# Remove unused images (older than 24h)
ssh root@72.62.71.250 "docker image prune -af --filter 'until=24h'"

# Remove all stopped containers and unused images
ssh root@72.62.71.250 "docker system prune -a --volumes"
```

### Force Rebuild Everything
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker compose down && git stash push -u -m deploy-temp || true && git pull origin main && git stash drop || true && chown -R 1000:1000 backend/uploads/ && docker compose build --no-cache && docker compose up -d"
```

## Database Commands

### Run Prisma Migrations Manually
```bash
ssh root@72.62.71.250 "docker exec hacktolive-backend npx prisma migrate deploy"
```

### Generate Prisma Client
```bash
ssh root@72.62.71.250 "docker exec hacktolive-backend npx prisma generate"
```

### Access MySQL CLI
```bash
ssh root@72.62.71.250 "mysql -u root -p"
# Then use database: use hacktolive;
```

## Git Commands (if needed)

### Discard Local Changes
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git stash"
```

### Check Git Status
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git status"
```

### Hard Reset (destructive - use with caution)
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git reset --hard origin/main"
```

## SSL Certificate Renewal (Certbot)

### Check Certificate Status
```bash
ssh root@72.62.71.250 "certbot certificates"
```

### Renew hacktolive.net cert (SAN: hacktolive.net + www + api)
```bash
# Stop nginx first (standalone mode), renew, restart
ssh root@72.62.71.250 "docker stop hacktolive-nginx && certbot certonly --standalone -d hacktolive.net -d www.hacktolive.net -d api.hacktolive.net && cp /etc/letsencrypt/live/hacktolive.net/fullchain.pem /root/HACKTOLIVE/nginx/ssl/net-fullchain.pem && cp /etc/letsencrypt/live/hacktolive.net/privkey.pem /root/HACKTOLIVE/nginx/ssl/net-privkey.pem && docker start hacktolive-nginx"
```

### Renew hacktolive.io redirect cert (optional — only if browsers visit .io directly)
```bash
ssh root@72.62.71.250 "docker stop hacktolive-nginx && certbot certonly --standalone -d hacktolive.io -d www.hacktolive.io && cp /etc/letsencrypt/live/hacktolive.io/fullchain.pem /root/HACKTOLIVE/nginx/ssl/fullchain.pem && cp /etc/letsencrypt/live/hacktolive.io/privkey.pem /root/HACKTOLIVE/nginx/ssl/privkey.pem && docker start hacktolive-nginx"
```

## Quick Reference

### Single Command Deploy (After GitHub Push)
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git stash push -u -m deploy-temp || true && git pull origin main && git stash drop || true && chown -R 1000:1000 backend/uploads/ && docker compose up -d --force-recreate && docker compose ps"
```

### Check if Site is Live
```bash
curl -I https://hacktolive.net
curl -I https://api.hacktolive.net/health
# .io should 301 redirect to .net:
curl -I https://hacktolive.io
```

### Monitor Container Resources
```bash
ssh root@72.62.71.250 "docker stats --no-stream"
```

## Server Information
- **IP Address**: 72.62.71.250
- **Hostname**: srv1201587.hstgr.cloud
- **Project Path**: /root/HACKTOLIVE
- **MySQL Port**: 3306 (local only)
- **Backend Port**: 4000 (internal)
- **Frontend Port**: 3000 (internal)
- **Public URLs**: 
  - https://hacktolive.net (primary)
  - https://api.hacktolive.net
  - https://hacktolive.io → 301 → hacktolive.net (redirect only)

## Important Notes
1. Always use `--force-recreate` instead of `down` for zero-downtime deployments
2. Upload directory must be owned by uid=1000: `chown -R 1000:1000 backend/uploads/` — backend runs as the `node` user (uid 1000)
3. MySQL database is running directly on the host, not in Docker
4. All containers use host network mode
5. SSL certificates are in `/root/HACKTOLIVE/nginx/ssl/`
   - `net-fullchain.pem` / `net-privkey.pem` — hacktolive.net (SAN: www + api)
   - `fullchain.pem` / `privkey.pem` — hacktolive.io (for redirect only)
6. Server has local env modifications — use `git stash push -u -m deploy-temp || true`, then `git pull`, then `git stash drop || true` (never plain `git pull`)
7. SMTP: port 587 (STARTTLS, NOT 465) — port 465 is blocked by VPS firewall
