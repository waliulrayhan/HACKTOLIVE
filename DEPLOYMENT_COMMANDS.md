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

### Method 1: Quick Deploy (Recommended)
```bash
# Connect to server and deploy in one command
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git pull origin main && docker-compose up -d --force-recreate"
```

### Method 2: Step-by-Step Deploy
```bash
# 1. SSH into server
ssh root@72.62.71.250

# 2. Navigate to project directory
cd /root/HACKTOLIVE

# 3. Pull latest code from GitHub
git pull origin main

# 4. Recreate and restart containers (zero-downtime)
docker-compose up -d --force-recreate

# 5. Check container status
docker-compose ps

# 6. View logs if needed
docker-compose logs -f
```

### Method 3: Full Rebuild (Use if major changes)
```bash
# 1. SSH into server
ssh root@72.62.71.250

# 2. Navigate to project directory
cd /root/HACKTOLIVE

# 3. Stop all containers
docker-compose down

# 4. Pull latest code
git pull origin main

# 5. Rebuild images and start
docker-compose build
docker-compose up -d

# 6. Verify everything is running
docker-compose ps
```

## Health Check Commands

### Check Container Status
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose ps"
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
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose logs -f"

# Specific service
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose logs -f backend"
```

### Test API Health
```bash
# From server
ssh root@72.62.71.250 "curl http://localhost:4000/health"

# From local machine
curl https://api.hacktolive.io/health
curl https://hacktolive.io
```

## Troubleshooting Commands

### Restart Specific Service
```bash
# Restart backend only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose restart backend"

# Restart frontend only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose restart frontend"

# Restart nginx only
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose restart nginx"
```

### Fix Upload Permissions (if needed)
```bash
ssh root@72.62.71.250 "chmod -R 777 /root/HACKTOLIVE/backend/uploads"
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
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && docker-compose down && docker-compose build --no-cache && docker-compose up -d"
```

## Database Commands

### Run Prisma Migrations Manually
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE/backend && docker exec hacktolive-backend npx prisma migrate deploy"
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

### Renew Certificates
```bash
ssh root@72.62.71.250 "certbot renew --nginx"
```

### Test Auto-renewal
```bash
ssh root@72.62.71.250 "certbot renew --dry-run"
```

## Quick Reference

### Single Command Deploy (After GitHub Push)
```bash
ssh root@72.62.71.250 "cd /root/HACKTOLIVE && git pull origin main && docker-compose up -d --force-recreate && docker-compose ps"
```

### Check if Site is Live
```bash
curl -I https://hacktolive.io
curl -I https://api.hacktolive.io/health
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
  - https://hacktolive.io
  - https://api.hacktolive.io

## Important Notes
1. Always use `--force-recreate` instead of `down` for zero-downtime deployments
2. The uploads directory needs 777 permissions to work correctly
3. MySQL database is running directly on the host, not in Docker
4. All containers use host network mode
5. SSL certificates are in `/root/HACKTOLIVE/nginx/ssl/`
