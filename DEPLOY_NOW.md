# 🚀 HACKTOLIVE - Ready to Deploy

## ✅ Configuration Complete

All files have been configured with your actual credentials and domain:

### 🌐 Domain Configuration
- **Main Site:** hacktolive.io
- **WWW:** www.hacktolive.io
- **API:** api.hacktolive.io
- **VPS IP:** 72.62.71.250

### 🔐 Credentials Configured
- **MySQL Root Password:** HackTo@Live2026
- **JWT Secret:** H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m
- **Database Name:** hacktolive

---

## 📋 DNS Setup Required (Do This First!)

Before deployment, configure your DNS records at your domain registrar:

```
Type    Name    Value           TTL
A       @       72.62.71.250    3600
A       www     72.62.71.250    3600
A       api     72.62.71.250    3600
```

**Wait 10-30 minutes** for DNS propagation before proceeding.

---

## 🚀 Deployment Steps

### Step 1: Upload Code to VPS

From your local machine (Windows PowerShell):

```powershell
# Option A: Using Git (Recommended)
# First, push your code to GitHub, then on VPS:
ssh root@72.62.71.250
cd /var/www
git clone https://github.com/YOUR_USERNAME/HACKTOLIVE.git hacktolive
cd hacktolive
```

```powershell
# Option B: Using SCP to upload directly
cd C:\Users\Rayhan\Desktop
scp -r HACKTOLIVE root@72.62.71.250:/var/www/hacktolive
```

### Step 2: Connect to VPS

```bash
ssh root@72.62.71.250
# Password: HackTo@Live2026
```

### Step 3: Run Initial Setup

```bash
cd /var/www/hacktolive

# Make scripts executable
chmod +x scripts/*.sh

# Run initial VPS setup (installs Node.js, MySQL, Nginx, PM2)
./scripts/vps-initial-setup.sh
```

This will take 5-10 minutes and install:
- ✅ Node.js 20
- ✅ pnpm package manager
- ✅ MySQL 8.0 (with your password)
- ✅ Nginx web server
- ✅ PM2 process manager
- ✅ Certbot for SSL
- ✅ UFW Firewall

### Step 4: Deploy Application

```bash
# Deploy backend and frontend
./scripts/deploy-app.sh
```

This will:
- ✅ Install dependencies
- ✅ Build backend and frontend
- ✅ Run database migrations
- ✅ Start services with PM2

### Step 5: Configure Nginx

```bash
# Copy nginx config
sudo cp nginx/hacktolive-vps.conf /etc/nginx/sites-available/hacktolive

# Enable the site
sudo ln -s /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/

# Remove default config (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 6: Setup SSL Certificate

```bash
# Install SSL certificates for all domains
sudo certbot --nginx -d hacktolive.io -d www.hacktolive.io -d api.hacktolive.io

# Follow the prompts:
# - Enter email: your@email.com
# - Agree to terms: Y
# - Share email: N (optional)
# - Redirect HTTP to HTTPS: 2 (Yes)
```

### Step 7: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Should show:
# ┌─────┬────────────────────────┬─────────┬─────────┐
# │ id  │ name                   │ status  │ restart │
# ├─────┼────────────────────────┼─────────┼─────────┤
# │ 0   │ hacktolive-backend     │ online  │ 0       │
# │ 1   │ hacktolive-frontend    │ online  │ 0       │
# └─────┴────────────────────────┴─────────┴─────────┘

# View logs
pm2 logs

# Check Nginx
sudo systemctl status nginx

# Check MySQL
sudo systemctl status mysql
```

### Step 8: Test Your Website

Open in browser:
- ✅ https://hacktolive.io (Frontend)
- ✅ https://www.hacktolive.io (Frontend)
- ✅ https://api.hacktolive.io/api (Swagger API Docs)

---

## 🔄 Setup Automated Backups

```bash
# Setup daily backups at 2 AM
crontab -e
```

Add these lines:
```cron
# Daily database backup at 2 AM
0 2 * * * /var/www/hacktolive/scripts/backup-database.sh

# Weekly full backup on Sunday at 3 AM
0 3 * * 0 /var/www/hacktolive/scripts/backup-all.sh
```

---

## 📊 Monitoring & Maintenance

```bash
# Check server status
./scripts/monitor.sh

# Health check
./scripts/health-check.sh

# View application logs
pm2 logs hacktolive-backend
pm2 logs hacktolive-frontend

# Restart services if needed
pm2 restart all

# Update application (after code changes)
git pull
./scripts/update.sh all
```

---

## 🔐 Security Checklist

After deployment:

- [ ] DNS records configured and propagated
- [ ] SSL certificates installed (HTTPS working)
- [ ] Firewall enabled (UFW)
- [ ] Automated backups scheduled
- [ ] PM2 startup script enabled
- [ ] Change VPS root password (optional but recommended)
- [ ] Setup SSH key authentication (optional but recommended)

---

## 🆘 Quick Troubleshooting

### If services won't start:
```bash
pm2 logs
# Check for errors

# Restart PM2
pm2 restart all
```

### If website shows 502 Bad Gateway:
```bash
# Check backend is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### If database connection fails:
```bash
# Test MySQL connection
mysql -u root -pHackTo@Live2026 -e "SHOW DATABASES;"

# Check backend logs
pm2 logs hacktolive-backend
```

---

## 📱 Contact & Support

- **VPS IP:** 72.62.71.250
- **SSH:** root@72.62.71.250
- **Location:** Malaysia - Kuala Lumpur

---

## ⚠️ Important Security Notes

1. **Change Root Password After Setup:**
   ```bash
   passwd
   # Enter new password twice
   ```

2. **Setup SSH Key Authentication:**
   ```bash
   # On your local machine, generate SSH key if you don't have one
   ssh-keygen -t rsa -b 4096

   # Copy public key to VPS
   ssh-copy-id root@72.62.71.250
   ```

3. **Disable Password Authentication (After SSH key setup):**
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

4. **Keep System Updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 🎉 You're All Set!

Your HACKTOLIVE platform is now configured and ready to deploy!

**Estimated Deployment Time:** 30-45 minutes

**What happens after deployment:**
- ✅ Website accessible at https://hacktolive.io
- ✅ API running at https://api.hacktolive.io
- ✅ Automatic SSL renewal
- ✅ Daily automated backups
- ✅ Production-ready infrastructure

---

**Last Updated:** December 16, 2025  
**Configured For:** hacktolive.io (72.62.71.250)
