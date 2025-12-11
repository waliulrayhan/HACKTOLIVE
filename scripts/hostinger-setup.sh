#!/bin/bash

# Hostinger Server Setup Script
# Run this script on your Hostinger server after first deployment

echo "🚀 Setting up Hostinger environment for HackToLive..."

# Install PM2 globally (if not already installed)
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 process manager..."
    npm install -g pm2
else
    echo "✅ PM2 already installed"
fi

# Navigate to backend directory
cd ~/public_html/backend || exit

echo "📝 Please create .env file for backend..."
echo "You can copy from .env.example:"
cat .env.example

read -p "Press enter when you've created backend/.env file..."

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy

# Start backend with PM2
echo "🚀 Starting backend service..."
pm2 start dist/main.js --name "hacktolive-backend" --env production
pm2 save

# Navigate to frontend directory
cd ~/public_html || exit

echo "📝 Please create .env file for frontend..."
echo "You can copy from .env.example:"
cat .env.example

read -p "Press enter when you've created frontend/.env file..."

# Start frontend with PM2
echo "🚀 Starting frontend service..."
pm2 start server.js --name "hacktolive-frontend" --env production
pm2 save

# Setup PM2 startup script
pm2 startup

echo ""
echo "✅ Setup completed!"
echo ""
echo "📊 Check status with: pm2 status"
echo "📝 View logs with: pm2 logs"
echo "🔄 Restart apps with: pm2 restart all"
echo ""
echo "🌐 Your applications should now be running!"
