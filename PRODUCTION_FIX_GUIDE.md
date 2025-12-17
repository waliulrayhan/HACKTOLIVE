# Production Deployment Fix Guide

## Issues Fixed

### ✅ 1. Git Merge Conflict
**Problem:** Local changes on server prevent git pull
**Solution:** Stash changes before pulling

### ✅ 2. NestJS Errors Visible in Production
**Problem:** Stack traces and debug info showing in production
**Solution:** 
- Disabled Swagger in production
- Limited logging to errors/warnings only
- Conditional logging based on NODE_ENV

### ✅ 3. Images Not Loading
**Problem:** Images work localhost but not in production
**Solution:**
- Proper environment configuration
- Nginx static file serving
- Correct upload directory permissions

---

## Quick Deployment Steps

### Option 1: Use PowerShell Script (Recommended for Windows)

```powershell
.\deploy-production.ps1
```

### Option 2: Manual Deployment

```powershell
ssh root@72.62.71.250 "cd /var/www/hacktolive && git stash && git pull origin main && cd backend && pnpm install && pnpm run build && pm2 restart hacktolive-backend && cd ../frontend && npm install && npm run build && pm2 restart hacktolive-frontend"
```

---

## Server Configuration (Run Once)

### 1. Fix Environment Variables

SSH into server and run:

```bash
ssh root@72.62.71.250
```

Then copy and run this script:

```bash
# Backend .env
cat > /var/www/hacktolive/backend/.env << 'EOF'
DATABASE_URL="mysql://root:HackTo@Live2026@localhost:3306/hacktolive"
JWT_SECRET="H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m"
JWT_EXPIRES_IN="7d"
PORT=4000
NODE_ENV="production"
FRONTEND_URL="https://hacktolive.io,https://www.hacktolive.io"
MAX_FILE_SIZE=10485760
UPLOAD_DIR="uploads"
EOF

# Frontend .env
cat > /var/www/hacktolive/frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.hacktolive.io
NEXT_PUBLIC_SITE_URL=https://hacktolive.io
NODE_ENV=production
EOF

# Set permissions
mkdir -p /var/www/hacktolive/backend/uploads/{avatars,documents,images}
chown -R www-data:www-data /var/www/hacktolive/backend/uploads
chmod -R 755 /var/www/hacktolive/backend/uploads
```

### 2. Configure Nginx for Static Files

Edit nginx config:

```bash
nano /etc/nginx/sites-available/hacktolive
```

Add this inside the `api.hacktolive.io` server block:

```nginx
# Static file serving for uploads
location /uploads/ {
    alias /var/www/hacktolive/backend/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# API proxy (ensure this exists)
location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    client_max_body_size 10M;
}
```

Test and reload nginx:

```bash
nginx -t
systemctl reload nginx
```

### 3. Rebuild and Restart

```bash
cd /var/www/hacktolive/backend
pnpm run build
pm2 restart hacktolive-backend

cd /var/www/hacktolive/frontend
npm run build
pm2 restart hacktolive-frontend

pm2 save
```

---

## Verify Deployment

### Check Backend
```bash
curl https://api.hacktolive.io/api  # Should NOT show Swagger in production
curl https://api.hacktolive.io/uploads/avatars/your-image.jpg
```

### Check PM2 Status
```bash
ssh root@72.62.71.250 "pm2 status"
```

### Check Logs
```bash
ssh root@72.62.71.250 "pm2 logs hacktolive-backend --lines 50"
ssh root@72.62.71.250 "pm2 logs hacktolive-frontend --lines 50"
```

---

## What Changed in Code

### backend/src/main.ts
- ✅ Production-only logging (errors/warnings)
- ✅ Swagger disabled in production
- ✅ Conditional console output
- ✅ Environment-aware configuration

### Deployment Scripts
- ✅ `deploy-production.ps1` - Windows deployment
- ✅ `deploy-production.sh` - Linux/Mac deployment
- ✅ `fix-production-env.sh` - Environment setup
- ✅ `check-image-serving.sh` - Diagnostics

---

## Troubleshooting

### Images Still Not Loading?
1. Check uploads directory exists: `ls -la /var/www/hacktolive/backend/uploads`
2. Check permissions: `ls -la /var/www/hacktolive/backend/uploads`
3. Check nginx logs: `tail -f /var/log/nginx/error.log`
4. Test direct access: `curl -I https://api.hacktolive.io/uploads/test.jpg`

### Errors Still Showing?
1. Verify NODE_ENV: `ssh root@72.62.71.250 "cd /var/www/hacktolive/backend && cat .env | grep NODE_ENV"`
2. Check PM2 env: `ssh root@72.62.71.250 "pm2 show hacktolive-backend"`
3. Rebuild: `ssh root@72.62.71.250 "cd /var/www/hacktolive/backend && pnpm run build && pm2 restart hacktolive-backend"`

### Git Pull Failing?
```bash
ssh root@72.62.71.250 "cd /var/www/hacktolive && git stash && git pull"
```

---

## Daily Deployment Workflow

1. Make changes locally
2. Test locally
3. Commit and push to GitHub
4. Run: `.\deploy-production.ps1`
5. Verify: https://hacktolive.io

---

## Notes

- Swagger UI is **disabled in production** for security
- Backend only logs errors/warnings in production
- Images served via both NestJS and Nginx
- Environment variables critical for production mode
- Always stash before pulling to avoid conflicts
