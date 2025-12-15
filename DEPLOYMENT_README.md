# 📦 HACKTOLIVE VPS Deployment Package

This directory contains all necessary files for deploying HACKTOLIVE to your VPS.

## 📁 File Structure

```
HACKTOLIVE/
├── backend/                    # NestJS Backend API
│   ├── .env.production        # Production environment variables
│   ├── Dockerfile             # Docker configuration
│   └── ...
├── frontend/                   # Next.js Frontend
│   ├── .env.production        # Production environment variables
│   ├── Dockerfile             # Docker configuration
│   └── ...
├── scripts/                    # Deployment & maintenance scripts
│   ├── vps-initial-setup.sh   # Initial VPS setup
│   ├── deploy-app.sh          # Application deployment
│   ├── update.sh              # Quick update script
│   ├── backup-database.sh     # Database backup
│   ├── backup-uploads.sh      # Files backup
│   ├── backup-all.sh          # Complete backup
│   ├── restore-database.sh    # Database restore
│   ├── monitor.sh             # Server monitoring
│   └── health-check.sh        # Health check
├── nginx/                      # Nginx configurations
│   ├── nginx.conf             # Docker nginx config
│   └── hacktolive-vps.conf    # VPS nginx config
├── docker-compose.yml          # Docker Compose configuration
├── ecosystem.config.js         # PM2 configuration
├── .env.example               # Environment variables template
├── .env.docker                # Docker environment template
├── DEPLOYMENT_GUIDE.md        # Complete deployment guide
└── DEPLOYMENT_CHECKLIST.md    # Quick checklist

```

## 🚀 Quick Start

### Option 1: Automated Deployment (Recommended)

1. **SSH into your VPS:**
   ```bash
   ssh root@72.62.71.250
   ```

2. **Clone repository:**
   ```bash
   cd /var/www
   git clone <your-repo> hacktolive
   cd hacktolive
   ```

3. **Run setup:**
   ```bash
   chmod +x scripts/*.sh
   ./scripts/vps-initial-setup.sh
   ./scripts/deploy-app.sh
   ```

4. **Configure domain and SSL:**
   - Update Nginx config with your domain
   - Run: `sudo certbot --nginx -d yourdomain.com`

### Option 2: Docker Deployment

1. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```

2. **Configure and start:**
   ```bash
   cp .env.docker .env
   nano .env  # Update with your settings
   docker-compose up -d
   ```

## 📋 Pre-Deployment Checklist

- [ ] VPS accessible via SSH (root@72.62.71.250)
- [ ] Domain DNS configured (A records)
- [ ] Environment variables configured
- [ ] MySQL password set
- [ ] JWT secret generated

## 🔧 Configuration Required

### Backend (.env.production)
```env
DATABASE_URL="mysql://user:password@localhost:3306/hacktolive"
JWT_SECRET="your-32-character-secret"
FRONTEND_URL="https://yourdomain.com"
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📖 Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist
- **[SECURITY.md](./SECURITY.md)** - Security guidelines
- **[README.md](./README.md)** - Project overview

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `vps-initial-setup.sh` | Setup VPS (Node, MySQL, Nginx, etc.) |
| `deploy-app.sh` | Deploy/update application |
| `update.sh` | Quick update (backend/frontend/all) |
| `backup-database.sh` | Backup MySQL database |
| `backup-all.sh` | Complete backup |
| `monitor.sh` | View server status |
| `health-check.sh` | Check all services |

## 🔐 Security Features

- ✅ SSL/TLS encryption (Let's Encrypt)
- ✅ JWT authentication
- ✅ Rate limiting (Nginx)
- ✅ Firewall configuration (UFW)
- ✅ Security headers
- ✅ Input validation
- ✅ SQL injection protection (Prisma)

## 💾 Backup Strategy

- **Database:** Daily at 2 AM
- **Uploads:** Weekly on Sunday
- **Retention:** 7 days (database), 30 days (uploads)
- **Location:** `/var/backups/hacktolive/`

## 📊 Monitoring

```bash
# Check status
pm2 status

# Real-time monitoring
pm2 monit

# Server health
./scripts/monitor.sh

# Health check
./scripts/health-check.sh
```

## 🆘 Troubleshooting

### Services not starting?
```bash
pm2 logs
systemctl status nginx
systemctl status mysql
```

### Need to restart?
```bash
pm2 restart all
sudo systemctl restart nginx
```

### Database issues?
```bash
mysql -u root -p
# Check connection and run queries
```

## 📞 Support Resources

- **VPS IP:** 72.62.71.250
- **Location:** Malaysia - Kuala Lumpur
- **Resources:** 2 CPU, 8GB RAM, 100GB Disk
- **OS:** Ubuntu 24.04 LTS

## ⚡ Performance

- **Frontend:** Next.js with static optimization
- **Backend:** NestJS with clustering (PM2)
- **Database:** MySQL with indexed queries
- **Caching:** Nginx reverse proxy cache
- **CDN:** Static assets served via Nginx

## 🎯 Production URLs

After deployment, your application will be available at:

- **Website:** https://yourdomain.com
- **API:** https://api.yourdomain.com
- **API Docs:** https://api.yourdomain.com/api
- **Uploads:** https://api.yourdomain.com/uploads

---

**Need help?** Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.
