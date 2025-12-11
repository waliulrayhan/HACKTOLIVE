# 🚀 Deployment Guide - Hostinger Automated Deployment

This guide explains how to set up automated deployment from GitHub to Hostinger hosting for the HackToLive project.

## 📋 Overview

The deployment system:
- ✅ **Automated**: Push to `main` branch triggers deployment
- 🏗️ **Builds**: Both frontend (Next.js) and backend (NestJS)
- 📦 **Optimized**: Only production dependencies deployed
- 🔄 **FTP Upload**: Deploys to Hostinger via FTP
- 🎯 **Structure**: Frontend in `public_html/`, Backend in `public_html/backend/`

## 🛠️ Prerequisites

### 1. Hostinger Requirements
- **Node.js** installed on server (v18 or higher)
- **SSH access** to your Hostinger account
- **MySQL database** created
- **FTP credentials** available

### 2. GitHub Repository
- Repository: `ShabikunShahria/HACKTOLIVE`
- Branch: `main` (or your default branch)

## 📝 Step-by-Step Setup

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

```
FTP_SERVER=your-hostinger-ftp-server.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
```

**How to get FTP credentials:**
1. Login to Hostinger hPanel
2. Go to Files → FTP Accounts
3. Use existing or create new FTP account
4. Note: Server, Username, Password

### Step 2: Update Next.js Config

The `next.config.ts` already has `output: 'standalone'` which is required for deployment. ✅

### Step 3: First-Time Server Setup

#### A. Connect via SSH to Hostinger

```bash
ssh your-username@your-server.com
```

#### B. Install Node.js (if not installed)

```bash
# Check Node version
node --version

# If not installed or old version, install via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

#### C. Install PM2 Process Manager

```bash
npm install -g pm2
```

#### D. Create MySQL Database

1. Login to Hostinger hPanel
2. Go to Databases → MySQL Databases
3. Create new database
4. Note: Database name, username, password, host

### Step 4: Deploy from GitHub

Once secrets are configured, deployment is automatic:

1. **Commit and push to main branch:**
   ```bash
   git add .
   git commit -m "Setup automated deployment"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to GitHub → Your repo → Actions tab
   - Watch the deployment progress
   - Check for any errors

### Step 5: Post-Deployment Configuration

After first successful deployment, SSH into your server:

```bash
ssh your-username@your-server.com
cd ~/public_html
```

#### A. Setup Backend Environment

```bash
cd backend
nano .env
```

Add your environment variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
```

#### B. Setup Frontend Environment

```bash
cd ~/public_html
nano .env
```

Add your environment variables:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
NODE_ENV=production
PORT=3000
```

#### C. Run Database Migrations

```bash
cd ~/public_html/backend
npx prisma migrate deploy
```

#### D. Start Applications with PM2

```bash
# Start backend
cd ~/public_html/backend
pm2 start dist/main.js --name "hacktolive-backend"

# Start frontend
cd ~/public_html
pm2 start server.js --name "hacktolive-frontend"

# Save PM2 configuration
pm2 save

# Setup auto-restart on server reboot
pm2 startup
# Follow the command it gives you
```

### Step 6: Configure Apache/Node.js Proxy

You need to configure Apache to proxy requests to your Node.js applications.

#### Option A: Using Node.js App in hPanel

1. Go to Hostinger hPanel → Advanced → Node.js
2. Create application:
   - **Application Mode**: Production
   - **Application Root**: `public_html`
   - **Application URL**: Your domain
   - **Application Startup File**: `server.js`
   - **Node.js Version**: 20.x

3. For backend, create another application:
   - **Application Root**: `public_html/backend`
   - **Application URL**: yourdomain.com/backend
   - **Application Startup File**: `dist/main.js`

#### Option B: Manual Apache Configuration

Edit `.htaccess` in `public_html/`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Backend API proxy
  RewriteCond %{REQUEST_URI} ^/backend
  RewriteRule ^backend/(.*)$ http://localhost:3001/$1 [P,L]
  
  # Frontend proxy
  RewriteCond %{REQUEST_URI} !^/backend
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

## 🔄 Ongoing Deployments

After initial setup, deployment is fully automated:

1. Make changes to your code
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. GitHub Actions automatically:
   - Builds frontend and backend
   - Deploys via FTP
   - Applications restart automatically via PM2

## 📊 Managing Applications

### Check Status
```bash
pm2 status
```

### View Logs
```bash
# All logs
pm2 logs

# Specific app
pm2 logs hacktolive-frontend
pm2 logs hacktolive-backend
```

### Restart Applications
```bash
# Restart all
pm2 restart all

# Restart specific
pm2 restart hacktolive-frontend
pm2 restart hacktolive-backend
```

### Stop Applications
```bash
pm2 stop all
```

### Update After Deployment
```bash
# After GitHub Actions deploys new code
pm2 restart all
```

## 🐛 Troubleshooting

### Build Fails on GitHub Actions
- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### FTP Upload Fails
- Verify FTP credentials in GitHub Secrets
- Check FTP server allows connections
- Ensure FTP user has write permissions

### Applications Won't Start
- Check Node.js version: `node --version` (should be 18+)
- Verify `.env` files exist and have correct values
- Check PM2 logs: `pm2 logs`
- Ensure database is accessible

### Database Connection Issues
- Verify `DATABASE_URL` in backend `.env`
- Check database credentials in Hostinger
- Ensure database user has proper permissions
- Test connection: `mysql -h host -u user -p database`

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>

# Restart PM2
pm2 restart all
```

### Module Not Found Errors
```bash
# Reinstall dependencies
cd ~/public_html
npm ci --omit=dev

cd ~/public_html/backend
npm ci --omit=dev
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore` ✅
2. **Use strong JWT secrets** - Generate random strings
3. **Update database credentials** - Don't use defaults
4. **Enable HTTPS** - Use Hostinger's SSL certificate
5. **Restrict FTP access** - Use secure passwords
6. **Regular updates** - Keep dependencies updated

## 📁 Deployment Structure

After deployment, your Hostinger directory structure:

```
~/public_html/
├── .next/              # Next.js build output
├── public/             # Static assets
├── node_modules/       # Frontend dependencies (production only)
├── server.js          # Next.js server
├── package.json       # Frontend package info
├── .env              # Frontend environment variables
├── .htaccess         # Apache configuration
└── backend/
    ├── dist/          # NestJS compiled code
    ├── node_modules/  # Backend dependencies (production only)
    ├── prisma/        # Prisma schema and migrations
    ├── package.json   # Backend package info
    └── .env          # Backend environment variables
```

## 🎯 Performance Optimization

### Frontend
- Next.js builds optimized production bundle
- Static assets served directly
- Server-side rendering for better SEO

### Backend
- Clustered mode via PM2 (if needed)
- Production dependencies only
- Database connection pooling

### Caching
Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check PM2 logs on server
3. Review this documentation
4. Check Hostinger support for server-specific issues

## ✅ Checklist

Before first deployment:
- [ ] GitHub Secrets configured (FTP credentials, API URL)
- [ ] Node.js installed on Hostinger server
- [ ] MySQL database created
- [ ] PM2 installed globally
- [ ] `.env.example` files reviewed

After first deployment:
- [ ] Backend `.env` file created
- [ ] Frontend `.env` file created
- [ ] Database migrations run
- [ ] PM2 applications started
- [ ] PM2 startup configured
- [ ] Apache/Node.js proxy configured
- [ ] SSL certificate enabled (optional but recommended)

---

**Happy Deploying! 🚀**
