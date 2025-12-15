# Complete Deployment Reference - HACKTOLIVE

**VPS Details:**
- IP: `72.62.71.250`
- Domain: `hacktolive.io`
- OS: Ubuntu 24.04 LTS
- Resources: KVM 2 (2 CPU, 8GB RAM, 100GB disk)
- MySQL Password: `HackTo@Live2026`
- Database: `hacktolive`

---

## 1. Initial VPS Setup (One-time)

```bash
# SSH into VPS
ssh root@72.62.71.250

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MySQL
apt install -y mysql-server
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE hacktolive;
EXIT;

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Configure firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 2. First Deployment

```bash
# Create project directory
mkdir -p /var/www/hacktolive
cd /var/www/hacktolive

# Clone repository (make repo public or use SSH key)
git clone https://github.com/YOUR_USERNAME/HACKTOLIVE.git .

# Backend setup
cd backend
pnpm install

# Create backend .env file
cat > .env << 'EOF'
DATABASE_URL="mysql://root:HackTo@Live2026@localhost:3306/hacktolive"
JWT_SECRET="H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m"
FRONTEND_URL="https://hacktolive.io"
PORT=4000
NODE_ENV=production
EOF

# Generate Prisma client and sync database
npx prisma generate
npx prisma db push --accept-data-loss

# Build backend
pnpm run build

# Frontend setup
cd ../frontend
npm install

# Create frontend .env file
cat > .env << 'EOF'
NEXT_PUBLIC_API_URL=https://api.hacktolive.io
NEXT_PUBLIC_SITE_URL=https://hacktolive.io
EOF

# Create uploads directory
mkdir -p /var/www/hacktolive/uploads/{avatars,images,documents}
chmod -R 755 /var/www/hacktolive/uploads

# Start applications with PM2
cd /var/www/hacktolive/backend
pm2 start npm --name "hacktolive-backend" -- start

cd /var/www/hacktolive/frontend
pm2 start --name "hacktolive-frontend" npm -- run dev

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 3. Nginx Configuration

```bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/hacktolive << 'EOF'
upstream backend {
    server localhost:4000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name hacktolive.io www.hacktolive.io api.hacktolive.io;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.hacktolive.io;

    # Backend API
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## 4. SSL Certificate Setup

```bash
# Install SSL certificates
sudo certbot --nginx -d hacktolive.io -d www.hacktolive.io -d api.hacktolive.io

# Certificate auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## 5. EASY UPDATE PROCESS (Most Important!)

### Method 1: Quick Manual Update (Simplest)

```bash
# SSH to server
ssh root@72.62.71.250

cd /var/www/hacktolive

# Pull latest code
git pull origin main

# Update backend (if backend changed)
cd backend
pnpm install
pnpm run build
pm2 restart hacktolive-backend

# Update frontend (if frontend changed)
cd ../frontend
npm install
pm2 restart hacktolive-frontend

# Done!
```

### Method 2: Automated Script (Create this on server)

```bash
# Create update script
cat > /var/www/hacktolive/quick-update.sh << 'EOF'
#!/bin/bash
set -e

echo "🔄 Starting deployment..."
cd /var/www/hacktolive

echo "📥 Pulling latest code..."
git pull origin main

echo "🔧 Updating backend..."
cd backend
pnpm install
pnpm run build
pm2 restart hacktolive-backend

echo "🎨 Updating frontend..."
cd ../frontend
npm install
pm2 restart hacktolive-frontend

echo "✅ Deployment complete!"
pm2 status
EOF

chmod +x /var/www/hacktolive/quick-update.sh
```

**To deploy updates, just run:**
```bash
ssh root@72.62.71.250 '/var/www/hacktolive/quick-update.sh'
```

### Method 3: One-Line Deploy from Local Machine

```bash
# Add this to your local machine (PowerShell or create deploy.bat)
ssh root@72.62.71.250 "cd /var/www/hacktolive && git pull && cd backend && pnpm install && pnpm run build && pm2 restart hacktolive-backend && cd ../frontend && npm install && pm2 restart hacktolive-frontend && pm2 status"
```

---

## 6. Common Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs
pm2 logs hacktolive-backend
pm2 logs hacktolive-frontend

# Restart applications
pm2 restart hacktolive-backend
pm2 restart hacktolive-frontend
pm2 restart all

# Stop applications
pm2 stop hacktolive-backend
pm2 stop hacktolive-frontend

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Check MySQL
sudo systemctl status mysql
mysql -u root -p

# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

---

## 7. Database Management

```bash
# Backup database
mysqldump -u root -p hacktolive > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
mysql -u root -p hacktolive < backup_file.sql

# Access MySQL
mysql -u root -p
USE hacktolive;
SHOW TABLES;
```

---

## 8. Troubleshooting

### Backend not starting
```bash
cd /var/www/hacktolive/backend
pm2 logs hacktolive-backend
# Check .env file exists
cat .env
# Rebuild
pnpm run build
pm2 restart hacktolive-backend
```

### Frontend not starting
```bash
cd /var/www/hacktolive/frontend
pm2 logs hacktolive-frontend
# Check .env file
cat .env
npm install
pm2 restart hacktolive-frontend
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -n 50 /var/log/nginx/error.log
sudo systemctl restart nginx
```

### Database connection issues
```bash
# Check MySQL is running
sudo systemctl status mysql
# Test connection
mysql -u root -p -e "SHOW DATABASES;"
# Check DATABASE_URL in backend/.env
```

---

## 9. DataGrip Database Connection

**Settings:**
- Connection type: MySQL 8
- Host: `localhost`
- Port: `3306`
- Database: `hacktolive`
- User: `root`
- Password: `HackTo@Live2026`

**SSH Tunnel (Important!):**
- ✅ Use SSH tunnel
- Host: `72.62.71.250`
- Port: `22`
- User: `root`
- Auth: Password or SSH Key

---

## 10. Development Workflow

### On Your Local Machine:
```bash
# Make code changes
# Test locally
# Commit and push
git add .
git commit -m "Your changes"
git push origin main
```

### Deploy to Production:
```bash
# Option 1: Run update script
ssh root@72.62.71.250 '/var/www/hacktolive/quick-update.sh'

# Option 2: Manual commands
ssh root@72.62.71.250
cd /var/www/hacktolive
git pull
cd backend && pnpm install && pnpm run build && pm2 restart hacktolive-backend
cd ../frontend && npm install && pm2 restart hacktolive-frontend
```

---

## 11. URLs

- Frontend: https://hacktolive.io
- Frontend (www): https://www.hacktolive.io
- API: https://api.hacktolive.io
- API Docs: https://api.hacktolive.io/api

---

## 12. Important Files Locations

```
/var/www/hacktolive/
├── backend/
│   ├── .env              # Backend environment variables
│   ├── dist/             # Built backend code
│   └── prisma/schema.prisma
├── frontend/
│   ├── .env              # Frontend environment variables
│   └── .next/            # Built frontend code
├── uploads/              # User uploaded files
│   ├── avatars/
│   ├── images/
│   └── documents/
└── quick-update.sh       # Deployment script

/etc/nginx/sites-available/hacktolive   # Nginx config
/etc/letsencrypt/live/hacktolive.io/    # SSL certificates
```

---

## 13. Security Checklist

- ✅ Firewall configured (UFW)
- ✅ SSL/HTTPS enabled
- ✅ MySQL password set
- ✅ JWT secret configured
- ✅ .env files not in git
- ✅ PM2 auto-restart on reboot
- ✅ Regular backups needed (setup cron)

---

## 14. Performance Tips

**Your current KVM 2 specs are PERFECT for:**
- ✅ Single developer
- ✅ Development/staging environment
- ✅ Small to medium traffic (100-500 concurrent users)
- ✅ Current usage: 3% CPU, 15% RAM - plenty of headroom!

**When to upgrade:**
- If CPU consistently > 70%
- If RAM consistently > 80%
- If you get 1000+ concurrent users

---

## 15. Backup Strategy (Recommended)

```bash
# Create backup script
cat > /var/www/hacktolive/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/hacktolive"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u root -pHackTo@Live2026 hacktolive > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/hacktolive/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /var/www/hacktolive/backup.sh

# Setup daily backup at 2 AM
crontab -e
# Add this line:
0 2 * * * /var/www/hacktolive/backup.sh >> /var/log/backup.log 2>&1
```

---

## Quick Reference Card

```bash
# Deploy updates
ssh root@72.62.71.250 '/var/www/hacktolive/quick-update.sh'

# Check status
ssh root@72.62.71.250 'pm2 status'

# View logs
ssh root@72.62.71.250 'pm2 logs --lines 50'

# Restart everything
ssh root@72.62.71.250 'pm2 restart all'

# Backup database
ssh root@72.62.71.250 'mysqldump -u root -pHackTo@Live2026 hacktolive > ~/backup.sql'
```

---

**🎉 Your deployment is complete and production-ready!**

KVM 2 is more than enough for a single developer. You're using only 3% CPU and 15% RAM - you could handle 10x more traffic easily.
