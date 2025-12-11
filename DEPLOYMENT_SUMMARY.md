# 🎯 Deployment Setup Summary

## What Has Been Created

Your HACKTOLIVE project now has a complete automated deployment system for Hostinger hosting!

### 📂 New Files Created

#### 1. GitHub Actions Workflow
- **File**: `.github/workflows/deploy-hostinger.yml`
- **Purpose**: Automatically builds and deploys on push to main branch
- **Features**:
  - Builds Next.js frontend (standalone mode)
  - Builds NestJS backend
  - Deploys via FTP to Hostinger
  - Production-only dependencies
  - Automatic deployment on push

#### 2. Documentation
- **DEPLOYMENT.md** - Complete deployment guide (step-by-step)
- **DEPLOYMENT_QUICK_REFERENCE.md** - Quick commands reference
- **DEPLOYMENT_ARCHITECTURE.md** - Visual architecture diagrams
- **DEPLOYMENT_CHECKLIST.md** - Comprehensive deployment checklist
- **README.md** - Updated with deployment section

#### 3. Configuration Files
- **ecosystem.config.json** - PM2 process manager configuration
- **backend/.env.production.example** - Backend environment template
- **frontend/.env.production.example** - Frontend environment template

#### 4. Helper Scripts
- **scripts/hostinger-setup.sh** - Server initialization script
- **scripts/test-deployment.ps1** - Test build locally
- **scripts/verify-deployment.ps1** - Verify deployment readiness

## 🚀 How It Works

### The Automated Flow

```
1. You push code to GitHub (main branch)
   ↓
2. GitHub Actions triggers automatically
   ↓
3. Builds backend (NestJS) → dist/
   ↓
4. Builds frontend (Next.js) → .next/standalone
   ↓
5. Uploads to Hostinger via FTP
   ↓
6. PM2 automatically restarts apps
   ↓
7. Your site is live! ✨
```

### Directory Structure on Hostinger

```
~/public_html/                    # Your domain root
├── .next/                        # Frontend build
├── public/                       # Static files
├── server.js                     # Next.js server
├── node_modules/                 # Frontend deps (prod only)
├── package.json
├── .env                          # Frontend environment
│
└── backend/                      # Backend folder
    ├── dist/                     # NestJS build
    ├── prisma/                   # Database schema
    ├── node_modules/             # Backend deps (prod only)
    ├── package.json
    └── .env                      # Backend environment
```

## 📝 Next Steps

### Step 1: Configure GitHub Secrets (Required)

Go to: `https://github.com/ShabikunShahria/HACKTOLIVE/settings/secrets/actions`

Click "New repository secret" and add:

| Secret Name | Value | Example |
|-------------|-------|---------|
| FTP_SERVER | Your Hostinger FTP server | ftp.yourdomain.com |
| FTP_USERNAME | Your FTP username | user@yourdomain.com |
| FTP_PASSWORD | Your FTP password | YourStrongPassword123 |
| NEXT_PUBLIC_API_URL | Backend URL | https://yourdomain.com/backend |

**Where to find FTP credentials:**
1. Login to Hostinger hPanel
2. Go to Files → FTP Accounts
3. Use existing or create new FTP account

### Step 2: Test Deployment Locally (Recommended)

Before pushing to GitHub, test the build process:

```powershell
# Verify everything is configured correctly
.\scripts\verify-deployment.ps1

# Test the build process locally
.\scripts\test-deployment.ps1
```

This will show you if there are any build errors before deploying.

### Step 3: First Deployment

```powershell
# Commit all the new deployment files
git add .
git commit -m "Setup automated deployment to Hostinger"
git push origin main
```

**Monitor deployment:**
1. Go to GitHub repository
2. Click "Actions" tab
3. Watch the deployment progress
4. Check for any errors

### Step 4: Server Configuration (After First Deploy)

SSH into your Hostinger server and run:

```bash
# Connect via SSH
ssh your-username@your-server.com

# Install PM2 (if not installed)
npm install -g pm2

# Navigate to backend
cd ~/public_html/backend

# Create .env file
nano .env
```

Add your backend environment:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-super-secret-jwt-key-change-this-to-something-secure"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Navigate to frontend
cd ~/public_html

# Create .env file
nano .env
```

Add your frontend environment:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
NODE_ENV=production
PORT=3000
```

Save and exit (Ctrl+X, Y, Enter)

```bash
# Run database migrations
cd ~/public_html/backend
npx prisma migrate deploy

# Start backend
pm2 start dist/main.js --name "hacktolive-backend"

# Start frontend
cd ~/public_html
pm2 start server.js --name "hacktolive-frontend"

# Save PM2 configuration
pm2 save

# Setup auto-restart on server reboot
pm2 startup
# Run the command it outputs
```

### Step 5: Verify Everything Works

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Visit your website
# https://yourdomain.com
```

## 🎊 You're Done!

From now on, deployment is automatic:

1. Make changes to your code
2. Commit: `git commit -m "Your changes"`
3. Push: `git push origin main`
4. ✨ Automatically deployed!

## 📚 Documentation Reference

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **DEPLOYMENT.md** | Complete guide | First-time setup, detailed info |
| **DEPLOYMENT_QUICK_REFERENCE.md** | Quick commands | Daily reference, common tasks |
| **DEPLOYMENT_ARCHITECTURE.md** | System diagrams | Understanding the architecture |
| **DEPLOYMENT_CHECKLIST.md** | Step-by-step checklist | Ensuring nothing is missed |
| **README.md** | Project overview | General information |

## 🛠️ Common Commands

### On Your Local Machine

```powershell
# Push changes (triggers deployment)
git push origin main

# Test build locally
.\scripts\test-deployment.ps1

# Verify configuration
.\scripts\verify-deployment.ps1
```

### On Hostinger Server (SSH)

```bash
# Check status
pm2 status

# View logs
pm2 logs

# Restart apps
pm2 restart all

# Monitor resources
pm2 monit

# Stop apps
pm2 stop all

# Delete and restart from config
pm2 delete all
pm2 start ecosystem.config.json
```

## 🔍 Monitoring Deployment

### GitHub Actions
- Go to repository → Actions tab
- Click on the workflow run
- View build logs
- Check for errors

### Server Logs
```bash
ssh username@yourserver.com
pm2 logs
```

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain secrets
2. **Use strong passwords** - Especially for FTP and JWT_SECRET
3. **Keep dependencies updated** - Run `npm update` regularly
4. **Monitor logs** - Check `pm2 logs` after each deployment
5. **Test locally first** - Use `test-deployment.ps1` before pushing

## 🐛 Troubleshooting

### Build Fails on GitHub Actions
- Check Actions tab for error details
- Run `.\scripts\test-deployment.ps1` locally
- Ensure all dependencies are in package.json

### FTP Upload Fails
- Verify GitHub Secrets are correct
- Check FTP credentials in Hostinger hPanel
- Ensure FTP user has write permissions

### App Won't Start on Server
- Check PM2 logs: `pm2 logs`
- Verify `.env` files exist and are correct
- Ensure Node.js version is 18+
- Check database connection

### Database Connection Issues
- Verify DATABASE_URL in backend `.env`
- Check MySQL database exists in Hostinger
- Test: `mysql -h localhost -u user -p database`

## 🎯 What's Different from Docker?

Instead of Docker containers, this deployment uses:
- **Native Node.js** - Runs directly on server
- **PM2** - Process manager for Node.js apps
- **FTP** - For file transfer
- **Apache** - Web server (built into Hostinger)

**Advantages:**
- ✅ Works on shared hosting (Hostinger)
- ✅ No Docker required on server
- ✅ Fully automated via GitHub Actions
- ✅ Easy to manage with PM2

## 💡 Pro Tips

1. **Before each deployment**, check GitHub Actions is passing
2. **After deployment**, check `pm2 status` on server
3. **Monitor regularly** with `pm2 logs`
4. **Keep backups** of your `.env` files (offline)
5. **Use environment templates** for team members

## 🆘 Getting Help

1. **Check documentation** - Start with DEPLOYMENT.md
2. **Check logs** - `pm2 logs` on server
3. **Check GitHub Actions** - For build errors
4. **Review checklist** - DEPLOYMENT_CHECKLIST.md

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ GitHub Actions shows green checkmark
- ✅ `pm2 status` shows both apps "online"
- ✅ No errors in `pm2 logs`
- ✅ Website loads without errors
- ✅ Backend API responds

---

**Congratulations! Your automated deployment is ready! 🚀**

Every push to main branch will now automatically deploy to your Hostinger hosting.

**Questions?** Check the documentation in this repository or review the logs.
