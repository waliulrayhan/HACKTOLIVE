# 🚀 HACKTOLIVE VPS Deployment Guide

Complete guide for deploying HACKTOLIVE application on Hostinger VPS (Ubuntu 24.04 LTS).

## 📋 Table of Contents

1. [VPS Information](#vps-information)
2. [Prerequisites](#prerequisites)
3. [Deployment Methods](#deployment-methods)
4. [Method 1: Automated Deployment (Recommended)](#method-1-automated-deployment)
5. [Method 2: Docker Deployment](#method-2-docker-deployment)
6. [Method 3: Manual Deployment](#method-3-manual-deployment)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Backup & Maintenance](#backup--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## 🖥️ VPS Information

**Your Hostinger VPS Details:**
- **IP Address:** 72.62.71.250
- **Hostname:** srv1201587.hstgr.cloud
- **SSH Access:** `root@72.62.71.250`
- **OS:** Ubuntu 24.04 LTS
- **Location:** Malaysia - Kuala Lumpur
- **Resources:** 2 CPU cores, 8 GB RAM, 100 GB Disk

---

## ✅ Prerequisites

Before deployment, ensure you have:

1. **Domain Name** configured with DNS records:
   - `A` record: `yourdomain.com` → `72.62.71.250`
   - `A` record: `www.yourdomain.com` → `72.62.71.250`
   - `A` record: `api.yourdomain.com` → `72.62.71.250`

2. **SSH Access** to your VPS:
   ```bash
   ssh root@72.62.71.250
   ```

3. **Local Machine Setup:**
   - Git installed
   - SSH key configured (optional but recommended)

---

## 🎯 Deployment Methods

Choose one of three deployment methods:

| Method | Difficulty | Setup Time | Best For |
|--------|-----------|------------|----------|
| **Automated** | ⭐ Easy | 15-30 min | Quick production setup |
| **Docker** | ⭐⭐ Medium | 20-40 min | Containerized deployment |
| **Manual** | ⭐⭐⭐ Advanced | 30-60 min | Custom configurations |

---

## 🤖 Method 1: Automated Deployment

### Step 1: Connect to VPS

```bash
ssh root@72.62.71.250
```

### Step 2: Clone Repository

```bash
cd /var/www
git clone https://github.com/yourusername/HACKTOLIVE.git hacktolive
cd hacktolive
```

### Step 3: Configure Environment Variables

```bash
# Backend environment
cd backend
nano .env.production
```

Update these values:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/hacktolive"
JWT_SECRET="generate-a-secure-random-32-character-string"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="https://yourdomain.com,https://www.yourdomain.com"
PORT=4000
NODE_ENV="production"
UPLOAD_PATH="/var/www/hacktolive/uploads"
```

```bash
# Frontend environment
cd ../frontend
nano .env.production
```

Update these values:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_UPLOAD_URL=https://api.yourdomain.com/uploads
```

### Step 4: Run Initial Setup Script

```bash
cd /var/www/hacktolive
chmod +x scripts/*.sh
sudo ./scripts/vps-initial-setup.sh
```

**Enter your configurations when prompted:**
- MySQL root password
- Domain name

### Step 5: Deploy Application

```bash
sudo ./scripts/deploy-app.sh
```

### Step 6: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx/hacktolive-vps.conf /etc/nginx/sites-available/hacktolive

# Update domain names in the config
sudo nano /etc/nginx/sites-available/hacktolive
# Replace all instances of "yourdomain.com" with your actual domain

# Enable site
sudo ln -s /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs

# Visit your website
# https://yourdomain.com
# https://api.yourdomain.com/api (Swagger docs)
```

---

## 🐳 Method 2: Docker Deployment

### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Clone and Configure

```bash
cd /var/www
git clone https://github.com/yourusername/HACKTOLIVE.git hacktolive
cd hacktolive

# Create environment file
cp .env.docker .env
nano .env
```

Update `.env` with your configurations.

### Step 3: Build and Start Containers

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Setup SSL (Nginx in container)

```bash
# Get SSL certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/

# Restart nginx container
docker-compose restart nginx
```

---

## 🔧 Method 3: Manual Deployment

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### Step 2: Configure MySQL

```bash
sudo mysql
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
CREATE DATABASE hacktolive;
CREATE USER 'hacktolive_user'@'localhost' IDENTIFIED BY 'user_password';
GRANT ALL PRIVILEGES ON hacktolive.* TO 'hacktolive_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Deploy Backend

```bash
cd /var/www/hacktolive/backend
pnpm install --prod
pnpm run build
npx prisma migrate deploy
npx prisma generate

# Start with PM2
pm2 start dist/main.js --name hacktolive-backend
pm2 save
pm2 startup
```

### Step 4: Deploy Frontend

```bash
cd /var/www/hacktolive/frontend
pnpm install --prod
pnpm run build

# Start with PM2
pm2 start node_modules/.bin/next --name hacktolive-frontend -- start -p 3000
pm2 save
```

### Step 5: Configure Nginx

Follow steps from Method 1, Step 6-7.

---

## ⚙️ Post-Deployment Configuration

### 1. Setup Automated Backups

```bash
# Edit backup script with your MySQL password
nano scripts/backup-database.sh
# Update DB_PASSWORD

# Setup daily backup cron job
crontab -e
```

Add these lines:
```cron
# Daily database backup at 2 AM
0 2 * * * /var/www/hacktolive/scripts/backup-database.sh

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /var/www/hacktolive/scripts/backup-all.sh
```

### 2. Setup Monitoring

```bash
# PM2 monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View real-time monitoring
pm2 monit
```

### 3. Configure Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 4. Create Uploads Directory Structure

```bash
mkdir -p /var/www/hacktolive/uploads/{avatars,images,documents}
chmod -R 755 /var/www/hacktolive/uploads
chown -R $USER:$USER /var/www/hacktolive/uploads
```

---

## 💾 Backup & Maintenance

### Manual Backup

```bash
# Backup database
./scripts/backup-database.sh

# Backup uploads
./scripts/backup-uploads.sh

# Complete backup
./scripts/backup-all.sh
```

### Restore from Backup

```bash
# Restore database
./scripts/restore-database.sh /path/to/backup.sql.gz

# Restore uploads
tar -xzf /path/to/uploads_backup.tar.gz -C /var/www/hacktolive/
```

### Update Application

```bash
cd /var/www/hacktolive
git pull origin main

# Update backend
./scripts/update.sh backend

# Update frontend
./scripts/update.sh frontend

# Update both
./scripts/update.sh all
```

### Maintenance Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs hacktolive-backend
pm2 logs hacktolive-frontend

# Restart services
pm2 restart all

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check memory usage
free -h

# Check MySQL status
sudo systemctl status mysql
```

---

## 🔍 Troubleshooting

### Issue: Cannot connect to MySQL

```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Issue: Backend not starting

```bash
# Check PM2 logs
pm2 logs hacktolive-backend

# Check if port 4000 is in use
sudo lsof -i :4000

# Restart backend
pm2 restart hacktolive-backend
```

### Issue: Nginx 502 Bad Gateway

```bash
# Check backend is running
pm2 status

# Check Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: Upload files not accessible

```bash
# Check permissions
ls -la /var/www/hacktolive/uploads

# Fix permissions
chmod -R 755 /var/www/hacktolive/uploads
chown -R www-data:www-data /var/www/hacktolive/uploads
```

### Issue: SSL Certificate renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Setup auto-renewal
sudo systemctl enable certbot.timer
```

---

## 📊 Performance Optimization

### Enable Nginx Caching

Add to Nginx configuration:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;
proxy_cache_key "$scheme$request_method$host$request_uri";
```

### Database Optimization

```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE hacktolive;

-- Optimize tables
OPTIMIZE TABLE User, Course, Enrollment;

-- Check indexes
SHOW INDEX FROM User;
```

### PM2 Cluster Mode

```bash
# For better CPU utilization
pm2 start dist/main.js --name hacktolive-backend -i max
```

---

## 🔐 Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Firewall configured (UFW)
- [ ] Strong MySQL passwords
- [ ] JWT secret changed from default
- [ ] SSH key authentication enabled
- [ ] Automatic security updates enabled
- [ ] Regular backups scheduled
- [ ] Nginx security headers configured
- [ ] Rate limiting enabled
- [ ] File upload size limits configured

---

## 📞 Support

If you encounter issues:

1. Check application logs: `pm2 logs`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Review this guide's troubleshooting section
4. Check VPS resources: `htop` or `pm2 monit`

---

## 🎉 Success!

Your HACKTOLIVE application should now be:
- ✅ Running at: `https://yourdomain.com`
- ✅ API accessible at: `https://api.yourdomain.com`
- ✅ API docs at: `https://api.yourdomain.com/api`
- ✅ SSL secured
- ✅ Automatically backed up
- ✅ Production ready!

**Next Steps:**
- Configure your domain DNS
- Test all functionality
- Monitor performance
- Setup error tracking (optional: Sentry)
- Configure email service (optional)
