# SSL Certificates Directory

This directory is for SSL/TLS certificates.

## For Let's Encrypt (Automatic)

The setup script can automatically obtain certificates:

```bash
./scripts/setup-server.sh
# Answer 'y' when asked about SSL
```

## Manual Certificate Setup

If you have your own certificates:

1. Copy certificate files here:
   - `fullchain.pem` - Full certificate chain
   - `privkey.pem` - Private key

2. Update nginx configuration in `nginx/conf.d/default.conf`:
   - Uncomment SSL lines
   - Update certificate paths if needed

3. Restart nginx:
   ```bash
   docker-compose restart nginx
   ```

## Certificate Renewal

Let's Encrypt certificates expire every 90 days.

### Automatic Renewal (Recommended)

```bash
# Add to crontab
sudo crontab -e

# Add this line:
0 0 1 * * certbot renew --quiet && cp /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem /root/HACKTOLIVE/nginx/ssl/ && cp /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem /root/HACKTOLIVE/nginx/ssl/ && docker-compose restart nginx
```

### Manual Renewal

```bash
sudo certbot renew
cp /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem ./
cp /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem ./
docker-compose restart nginx
```

## Testing SSL

After setting up SSL:

```bash
# Test SSL configuration
docker exec -it hacktolive-nginx nginx -t

# Check certificate
openssl s_client -connect your-domain.com:443
```

---

**Note:** This directory is gitignored for security. Never commit certificate files to version control.
