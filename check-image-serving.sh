#!/bin/bash

# Check and Fix Image Serving Issues
# Run this on the production server

echo "🔍 Checking image serving configuration..."

# Check uploads directory
echo ""
echo "📁 Uploads directory status:"
ls -la /var/www/hacktolive/backend/uploads/

echo ""
echo "📝 Checking nginx configuration for static files..."
if [ -f /etc/nginx/sites-available/hacktolive ]; then
    grep -A 5 "uploads" /etc/nginx/sites-available/hacktolive || echo "No uploads configuration found in nginx"
fi

echo ""
echo "🔧 Recommended nginx configuration for /etc/nginx/sites-available/hacktolive:"
echo ""
cat << 'EOF'
# Add this inside the server block for api.hacktolive.io

location /uploads/ {
    alias /var/www/hacktolive/backend/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}

# Or if you're using reverse proxy, ensure this is present:
location / {
    proxy_pass http://localhost:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Important: Increase timeouts and sizes
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    client_max_body_size 10M;
}
EOF

echo ""
echo "🔨 To apply nginx configuration:"
echo "1. Edit: nano /etc/nginx/sites-available/hacktolive"
echo "2. Test: nginx -t"
echo "3. Reload: systemctl reload nginx"
