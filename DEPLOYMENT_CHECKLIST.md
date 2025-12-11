# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment Preparation

### 1. Local Development Complete
- [ ] All features working locally
- [ ] No console errors in frontend
- [ ] Backend API endpoints tested
- [ ] Database schema finalized
- [ ] All tests passing (if applicable)

### 2. Code Quality
- [ ] Code linted and formatted
- [ ] No TypeScript errors
- [ ] Build successful locally:
  - [ ] `cd backend && npm run build` ✅
  - [ ] `cd frontend && npm run build` ✅
- [ ] Environment variables documented

### 3. Git Repository
- [ ] All changes committed
- [ ] `.gitignore` properly configured
- [ ] `.env` files NOT committed (security)
- [ ] `node_modules` NOT committed
- [ ] Push to GitHub repository

## GitHub Configuration

### 4. Repository Secrets
Go to: Repository → Settings → Secrets and variables → Actions

- [ ] `FTP_SERVER` - Your Hostinger FTP server (e.g., ftp.yourdomain.com)
- [ ] `FTP_USERNAME` - Your FTP username
- [ ] `FTP_PASSWORD` - Your FTP password (use strong password)
- [ ] `NEXT_PUBLIC_API_URL` - Your backend URL (e.g., https://yourdomain.com/backend)

### 5. Workflow File
- [ ] `.github/workflows/deploy-hostinger.yml` exists
- [ ] Workflow configured for correct branch (main)
- [ ] FTP paths correct for your Hostinger setup

## Hostinger Server Setup

### 6. Server Access
- [ ] SSH access to Hostinger enabled
- [ ] Can connect via SSH: `ssh username@yourserver.com`
- [ ] FTP access verified

### 7. Server Requirements
SSH into your server and verify:

```bash
# Check Node.js (should be v18+)
node --version

# Check npm
npm --version

# Check disk space
df -h
```

- [ ] Node.js 18+ installed
- [ ] npm available
- [ ] Sufficient disk space (>500MB free)

### 8. Database Setup
- [ ] MySQL database created in Hostinger hPanel
- [ ] Database name noted
- [ ] Database username noted
- [ ] Database password noted
- [ ] Database host noted (usually localhost)

### 9. PM2 Installation
```bash
npm install -g pm2
pm2 --version
```
- [ ] PM2 installed globally
- [ ] PM2 accessible from command line

## First Deployment

### 10. Trigger First Deploy
- [ ] Push to main branch or manually trigger workflow
- [ ] Monitor deployment in GitHub Actions
- [ ] Wait for successful completion
- [ ] Check for any errors in Actions log

### 11. Post-Deployment Server Configuration

SSH into your server:

```bash
ssh username@yourserver.com
cd ~/public_html
```

#### A. Backend Setup
```bash
cd backend

# Create .env file
nano .env
```

Add your backend environment variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"
```

- [ ] Backend `.env` file created
- [ ] DATABASE_URL configured correctly
- [ ] JWT_SECRET is strong and unique (min 32 characters)

#### B. Frontend Setup
```bash
cd ~/public_html

# Create .env file
nano .env
```

Add your frontend environment variables:
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
NODE_ENV=production
PORT=3000
```

- [ ] Frontend `.env` file created
- [ ] NEXT_PUBLIC_API_URL points to your backend

#### C. Database Migrations
```bash
cd ~/public_html/backend
npx prisma migrate deploy
```

- [ ] Migrations run successfully
- [ ] Database tables created
- [ ] No migration errors

#### D. Start Applications
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
# Run the command it outputs
```

- [ ] Backend started successfully
- [ ] Frontend started successfully
- [ ] PM2 configuration saved
- [ ] PM2 startup script configured

### 12. Verify Deployment

#### Check PM2 Status
```bash
pm2 status
```
Both apps should show "online" status.

- [ ] Both applications show "online" status
- [ ] No restart loops

#### Check Logs
```bash
pm2 logs hacktolive-backend --lines 50
pm2 logs hacktolive-frontend --lines 50
```

- [ ] No error messages in backend logs
- [ ] No error messages in frontend logs
- [ ] Backend connected to database
- [ ] Frontend loaded successfully

#### Test Endpoints
```bash
# Test backend health (from server)
curl http://localhost:3001/

# Test frontend (from server)
curl http://localhost:3000/
```

- [ ] Backend responds on port 3001
- [ ] Frontend responds on port 3000

### 13. Configure Domain/Proxy

#### Option A: Hostinger Node.js App Setup
1. Login to Hostinger hPanel
2. Go to Advanced → Node.js
3. Create applications:
   - Frontend: `public_html/` → `server.js`
   - Backend: `public_html/backend/` → `dist/main.js`

- [ ] Node.js apps configured in hPanel
- [ ] Domain pointed to frontend app
- [ ] Backend accessible at /backend path

#### Option B: Apache Configuration
Edit `.htaccess` if needed for custom routing.

- [ ] Apache proxy configured (if applicable)
- [ ] Rewrite rules working

### 14. SSL/HTTPS
- [ ] SSL certificate enabled in Hostinger hPanel
- [ ] HTTPS working for domain
- [ ] Mixed content warnings resolved

### 15. Final Testing

#### Frontend Tests
- [ ] Homepage loads without errors
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] No console errors
- [ ] Responsive design working

#### Backend Tests
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Authentication working (if applicable)
- [ ] File uploads working (if applicable)
- [ ] CORS configured correctly

#### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] Login/Registration works (if applicable)
- [ ] Data displays correctly from API
- [ ] Forms submit successfully

### 16. Performance Check
- [ ] Page load times acceptable (<3 seconds)
- [ ] API response times good (<500ms)
- [ ] No memory leaks (check `pm2 monit`)
- [ ] CPU usage reasonable (<50% average)

## Ongoing Maintenance

### 17. Monitoring Setup
- [ ] Setup uptime monitoring (e.g., UptimeRobot)
- [ ] Configure error notifications
- [ ] Regular log reviews scheduled

### 18. Backup Strategy
- [ ] Database backup scheduled in Hostinger
- [ ] Code backed up in GitHub (already done ✅)
- [ ] `.env` files backed up securely (offline)

### 19. Security
- [ ] Strong passwords used for all accounts
- [ ] SSH keys configured (recommended)
- [ ] Database only accessible from localhost
- [ ] Firewall rules reviewed
- [ ] Security headers configured

### 20. Documentation
- [ ] Deployment process documented
- [ ] Team members aware of deployment process
- [ ] Emergency contacts listed
- [ ] Rollback procedure documented

## Post-Deployment

### 21. Communication
- [ ] Team notified of successful deployment
- [ ] Stakeholders informed
- [ ] Documentation updated
- [ ] Change log updated

### 22. Monitoring First 24 Hours
- [ ] Check logs regularly: `pm2 logs`
- [ ] Monitor server resources: `pm2 monit`
- [ ] Watch for errors
- [ ] Monitor user feedback

## Troubleshooting Reference

### If Build Fails
```powershell
# Test locally first
cd backend
npm run build

cd frontend
npm run build
```

### If FTP Fails
- Verify GitHub Secrets
- Check FTP credentials in Hostinger
- Ensure FTP user has write permissions

### If App Won't Start
```bash
# Check logs
pm2 logs

# Check environment
cd ~/public_html/backend
cat .env

# Restart
pm2 restart all
```

### If Database Connection Fails
- Verify DATABASE_URL format
- Check database exists in hPanel
- Test connection: `mysql -u user -p database`

---

## 🎉 Deployment Complete!

Once all items are checked:
- ✅ Your application is live
- 🚀 Auto-deployment is working
- 📊 Monitoring is in place
- 🔒 Security is configured

**Next Deployment**: Just push to main branch!

```powershell
git add .
git commit -m "Update feature"
git push origin main
```

GitHub Actions will handle the rest automatically! 🎊
