#!/bin/bash

# Complete Nginx Configuration for HACKTOLIVE
# This ensures uploads are served correctly

echo "🔧 Updating Nginx configuration..."

# Create backup
sudo cp /etc/nginx/sites-available/hacktolive /etc/nginx/sites-available/hacktolive.backup.$(date +%Y%m%d_%H%M%S)

# Check current configuration
echo "📋 Current configuration:"
cat /etc/nginx/sites-available/hacktolive

echo ""
echo "---"
echo ""
echo "✏️  Edit the file manually:"
echo "sudo nano /etc/nginx/sites-available/hacktolive"
echo ""
echo "Inside the 'server' block for 'api.hacktolive.io', add this BEFORE the main 'location /' block:"
echo ""
cat << 'EOF'
    # Serve static upload files
    location /uploads/ {
        alias /var/www/hacktolive/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
        try_files $uri =404;
    }
EOF

echo ""
echo "Then test and reload:"
echo "sudo nginx -t"
echo "sudo systemctl reload nginx"
