# 🎯 QUICK START - Deploy in 5 Minutes

## Step 1: Configure DNS (Do This First!)

Go to your domain registrar and add these DNS records:

```
Type    Name    Value           TTL
A       @       72.62.71.250    3600
A       www     72.62.71.250    3600
A       api     72.62.71.250    3600
```

**Wait 10-15 minutes** for DNS propagation.

---

## Step 2: Upload Code to VPS

**Option A: Using Git (Recommended)**
```bash
# On your local machine, commit and push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# Then on VPS
ssh root@72.62.71.250
cd /var/www
git clone https://github.com/YOUR_USERNAME/HACKTOLIVE.git hacktolive
```

**Option B: Using SCP (Direct Upload)**
```powershell
# From Windows PowerShell
cd C:\Users\Rayhan\Desktop
scp -r HACKTOLIVE root@72.62.71.250:/var/www/hacktolive
```

---

## Step 3: One-Command Deployment

```bash
# SSH into VPS
ssh root@72.62.71.250

# Go to app directory
cd /var/www/hacktolive

# Run complete deployment (ONE COMMAND!)
chmod +x scripts/deploy-complete.sh
sudo ./scripts/deploy-complete.sh
```

**Enter your email when prompted for SSL certificate.**

That's it! Your site will be live at **https://hacktolive.io** in ~15 minutes!

---

## ✅ Verification

Test these URLs:
- https://hacktolive.io
- https://www.hacktolive.io
- https://api.hacktolive.io
- https://api.hacktolive.io/api (API docs)

Check status:
```bash
pm2 status
./scripts/monitor.sh
```

---

## 📋 Manual Deployment (If Needed)

If you prefer step-by-step:

```bash
cd /var/www/hacktolive

# 1. Initial setup
chmod +x scripts/*.sh
./scripts/vps-initial-setup.sh

# 2. Deploy app
./scripts/deploy-app.sh

# 3. Setup Nginx
sudo cp nginx/hacktolive-vps.conf /etc/nginx/sites-available/hacktolive
sudo ln -s /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# 4. Setup SSL
sudo certbot --nginx -d hacktolive.io -d www.hacktolive.io -d api.hacktolive.io

# 5. Done!
pm2 status
```

---

## 🔧 All Configured Settings

- **Domain:** hacktolive.io
- **API:** api.hacktolive.io
- **VPS IP:** 72.62.71.250
- **MySQL Password:** HackTo@Live2026
- **Database:** hacktolive
- **JWT Secret:** H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m

---

**Ready to Deploy!** 🚀
