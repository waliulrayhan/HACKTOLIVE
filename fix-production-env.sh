#!/bin/bash

# Fix Production Environment Configuration
# Run this on the server to set up proper environment variables

echo "🔧 Configuring production environment..."

# Backend .env configuration
cat > /var/www/hacktolive/backend/.env << 'EOF'
# Database Configuration
DATABASE_URL="mysql://root:HackTo@Live2026@localhost:3306/hacktolive"

# JWT Configuration
JWT_SECRET="H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4000
NODE_ENV="production"

# Frontend Configuration
FRONTEND_URL="https://hacktolive.io,https://www.hacktolive.io"

# Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="uploads"
EOF

# Frontend .env configuration
cat > /var/www/hacktolive/frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.hacktolive.io
NEXT_PUBLIC_SITE_URL=https://hacktolive.io
NODE_ENV=production
EOF

# Set proper permissions for uploads directory
echo "📁 Setting up uploads directory..."
mkdir -p /var/www/hacktolive/backend/uploads/{avatars,documents,images}
chown -R www-data:www-data /var/www/hacktolive/backend/uploads
chmod -R 755 /var/www/hacktolive/backend/uploads

echo "✅ Environment configuration completed!"
echo ""
echo "📋 Next steps:"
echo "1. Rebuild backend: cd /var/www/hacktolive/backend && pnpm run build"
echo "2. Rebuild frontend: cd /var/www/hacktolive/frontend && npm run build"
echo "3. Restart PM2: pm2 restart all"
