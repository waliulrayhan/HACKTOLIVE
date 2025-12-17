#!/bin/bash

# Fix Nginx Configuration for Static File Serving
echo "🔧 Configuring Nginx to serve upload files..."

# Backup existing config
cp /etc/nginx/sites-available/hacktolive /etc/nginx/sites-available/hacktolive.backup

# Check if uploads location exists
if grep -q "location /uploads/" /etc/nginx/sites-available/hacktolive; then
    echo "⚠️  Upload location already exists, updating..."
else
    echo "➕ Adding upload location..."
fi

# Display current config
echo ""
echo "📋 Current nginx config for api.hacktolive.io:"
echo "---"
grep -A 30 "server_name api.hacktolive.io" /etc/nginx/sites-available/hacktolive | head -40
echo "---"
echo ""

echo "📝 Add this configuration to your nginx config:"
echo ""
cat << 'EOF'

# Inside the server block for api.hacktolive.io, add:

    # Serve static upload files directly
    location /uploads/ {
        alias /var/www/hacktolive/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Handle missing files
        try_files $uri =404;
    }

    # Proxy API requests to NestJS
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
        client_max_body_size 10M;
    }

EOF

echo ""
echo "🔨 To apply:"
echo "1. nano /etc/nginx/sites-available/hacktolive"
echo "2. Add the location /uploads/ block above"
echo "3. nginx -t"
echo "4. systemctl reload nginx"
