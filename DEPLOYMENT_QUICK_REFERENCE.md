# 🚀 Quick Deployment Reference

## Initial Setup (One-time)

### 1. GitHub Secrets
Add in: Repository → Settings → Secrets → Actions

```
FTP_SERVER=ftp.yourdomain.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
```

### 2. Server Setup (SSH into Hostinger)

```bash
# Install PM2
npm install -g pm2

# After first deployment, create .env files
cd ~/public_html/backend
nano .env  # Add DATABASE_URL, JWT_SECRET, etc.

cd ~/public_html
nano .env  # Add NEXT_PUBLIC_API_URL

# Run migrations
cd ~/public_html/backend
npx prisma migrate deploy

# Start applications
pm2 start dist/main.js --name "hacktolive-backend"
cd ~/public_html
pm2 start server.js --name "hacktolive-frontend"

# Save and auto-restart
pm2 save
pm2 startup
```

## Daily Usage

### Deploy
```bash
git add .
git commit -m "Your changes"
git push origin main
```

That's it! GitHub Actions handles the rest.

### Check Status (on server)
```bash
pm2 status
pm2 logs
```

### Restart After Deployment
```bash
pm2 restart all
```

## Common Commands

```bash
# View logs
pm2 logs hacktolive-frontend
pm2 logs hacktolive-backend

# Restart specific app
pm2 restart hacktolive-frontend

# Stop all
pm2 stop all

# Delete and restart
pm2 delete all
pm2 start ecosystem.config.json
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://user:pass@localhost:3306/dbname"
JWT_SECRET="your-secret-key"
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
PORT=3000
NODE_ENV=production
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check GitHub Actions logs |
| FTP fails | Verify secrets in GitHub |
| App won't start | Check `pm2 logs` |
| Database error | Verify DATABASE_URL |
| Port in use | `pm2 restart all` |

## File Structure

```
public_html/
├── backend/          # NestJS API (port 3001)
│   ├── dist/
│   ├── node_modules/
│   └── .env
└── frontend files    # Next.js (port 3000)
    ├── .next/
    ├── public/
    └── .env
```

## Monitoring

- **GitHub**: Actions tab for deployment status
- **Server**: `pm2 monit` for real-time monitoring
- **Logs**: `pm2 logs` for application logs

---

For detailed documentation, see [DEPLOYMENT.md](./DEPLOYMENT.md)
