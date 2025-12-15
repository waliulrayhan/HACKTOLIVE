# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [ ] VPS purchased and accessible via SSH
- [ ] Domain name registered
- [ ] DNS A records configured:
  - `yourdomain.com` → VPS IP
  - `www.yourdomain.com` → VPS IP
  - `api.yourdomain.com` → VPS IP

## VPS Setup (First Time Only)

- [ ] SSH into VPS: `ssh root@72.62.71.250`
- [ ] Clone repository to `/var/www/hacktolive`
- [ ] Run initial setup: `./scripts/vps-initial-setup.sh`
- [ ] Configure MySQL database
- [ ] Setup MySQL password

## Environment Configuration

### Backend (.env.production)
- [ ] Set `DATABASE_URL` with MySQL credentials
- [ ] Generate and set `JWT_SECRET` (32+ characters)
- [ ] Set `FRONTEND_URL` with your domain(s)
- [ ] Set `UPLOAD_PATH` to `/var/www/hacktolive/uploads`

### Frontend (.env.production)
- [ ] Set `NEXT_PUBLIC_API_URL` to `https://api.yourdomain.com`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com`
- [ ] Set `NEXT_PUBLIC_UPLOAD_URL` to `https://api.yourdomain.com/uploads`

## Deployment

- [ ] Run deployment script: `./scripts/deploy-app.sh`
- [ ] Copy Nginx config: `cp nginx/hacktolive-vps.conf /etc/nginx/sites-available/hacktolive`
- [ ] Update domain in Nginx config
- [ ] Enable Nginx site: `ln -s /etc/nginx/sites-available/hacktolive /etc/nginx/sites-enabled/`
- [ ] Test Nginx: `nginx -t`
- [ ] Restart Nginx: `systemctl restart nginx`

## SSL Setup

- [ ] Install SSL: `certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com`
- [ ] Test auto-renewal: `certbot renew --dry-run`

## Post-Deployment

- [ ] Check PM2 status: `pm2 status`
- [ ] Test frontend: Visit `https://yourdomain.com`
- [ ] Test backend: Visit `https://api.yourdomain.com/api`
- [ ] Setup automated backups (cron jobs)
- [ ] Configure firewall: `ufw enable`
- [ ] Create uploads directory structure

## Monitoring

- [ ] Setup PM2 monitoring: `pm2 monit`
- [ ] Configure log rotation
- [ ] Setup backup schedule (daily)
- [ ] Test backup/restore process

## Security

- [ ] Change all default passwords
- [ ] Setup SSH keys (disable password auth)
- [ ] Configure firewall rules
- [ ] Enable fail2ban (optional)
- [ ] Review Nginx security headers

## Performance

- [ ] Test website speed
- [ ] Check database indexes
- [ ] Enable Nginx gzip
- [ ] Configure caching
- [ ] Monitor resource usage

---

## Quick Commands Reference

```bash
# Check status
pm2 status
pm2 logs
systemctl status nginx
systemctl status mysql

# Restart services
pm2 restart all
systemctl restart nginx
systemctl restart mysql

# Update application
./scripts/update.sh all

# Backup
./scripts/backup-all.sh

# View logs
pm2 logs hacktolive-backend
pm2 logs hacktolive-frontend
tail -f /var/log/nginx/error.log
```

---

## Emergency Contacts

- **VPS Provider:** Hostinger Support
- **Server IP:** 72.62.71.250
- **SSH:** root@72.62.71.250

---

**Last Updated:** 2025-12-16
