# 🚀 Quick Start - Automated Deployment

## ✅ What's Ready

Your project now has **automated deployment to Hostinger**!

### Files Created:
- ✅ `.github/workflows/deploy-hostinger.yml` - GitHub Actions workflow
- ✅ `DEPLOYMENT.md` - Complete deployment guide
- ✅ `DEPLOYMENT_QUICK_REFERENCE.md` - Quick reference
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- ✅ `DEPLOYMENT_ARCHITECTURE.md` - Architecture diagrams
- ✅ `DEPLOYMENT_SUMMARY.md` - Overview and summary
- ✅ `ecosystem.config.json` - PM2 configuration
- ✅ `backend/.env.production.example` - Backend env template
- ✅ `frontend/.env.production.example` - Frontend env template
- ✅ Helper scripts in `scripts/` folder

## 🎯 Next: 3 Steps to Deploy

### Step 1: Add GitHub Secrets

1. Go to: `https://github.com/ShabikunShahria/HACKTOLIVE/settings/secrets/actions`
2. Click "New repository secret"
3. Add these 4 secrets:

| Name | Value |
|------|-------|
| `FTP_SERVER` | `ftp.hacktolive.io` (or `145.79.25.73`) |
| `FTP_USERNAME` | `u977893394.hacktolive` |
| `FTP_PASSWORD` | `Shemul@1821` |
| `NEXT_PUBLIC_API_URL` | `https://backend.hacktolive.io` |

**Get FTP credentials:** Hostinger hPanel → Files → FTP Accounts

### Step 2: Push to GitHub

```powershell
git add .
git commit -m "Setup automated deployment"
git push origin main
```

**Monitor:** GitHub → Actions tab

### Step 3: Configure Server (First time only)

SSH into Hostinger:

```bash
ssh username@yourserver.com
npm install -g pm2

# Backend .env
cd ~/public_html/backend
nano .env
# Add: DATABASE_URL, JWT_SECRET, etc.

# Frontend .env  
cd ~/public_html
nano .env
# Add: NEXT_PUBLIC_API_URL

# Run migrations
cd ~/public_html/backend
npx prisma migrate deploy

# Start apps
pm2 start dist/main.js --name "hacktolive-backend"
cd ~/public_html
pm2 start server.js --name "hacktolive-frontend"
pm2 save
pm2 startup
```

## 🎊 Done!

From now on:
```powershell
git push origin main
```
= Automatic deployment! ✨

## 📚 Full Documentation

- **Complete Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Commands:** [DEPLOYMENT_QUICK_REFERENCE.md](./DEPLOYMENT_QUICK_REFERENCE.md)
- **Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Architecture:** [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)

## 🆘 Need Help?

1. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to verify everything
3. Review [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) to understand how it works

---

**Happy Deploying! 🚀**
