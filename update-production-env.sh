#!/bin/bash

# Update Production Environment with API_URL
echo "🔧 Updating production environment variables..."

cat > /var/www/hacktolive/backend/.env << 'EOF'
# Database Configuration
DATABASE_URL="mysql://root:HackTo@Live2026@localhost:3306/hacktolive"

# JWT Configuration
JWT_SECRET="H4ckT0L1v3_JWT_S3cr3t_K3y_2026_Pr0duct10n_S3cur3_R4nd0m"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4000
NODE_ENV="production"
API_URL="https://api.hacktolive.io"

# Frontend Configuration
FRONTEND_URL="https://hacktolive.io,https://www.hacktolive.io"

# Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR="uploads"
EOF

echo "✅ Environment updated!"
echo "📋 Next: cd /var/www/hacktolive/backend && pnpm run build && pm2 restart hacktolive-backend"
