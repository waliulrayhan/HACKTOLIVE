# 🚀 HackToLive - Cybersecurity Learning Platform

A comprehensive cybersecurity education platform with courses, certificates, quizzes, and interactive learning.

## 🎯 Live Application

- **Website**: https://hacktolive.io
- **API**: https://api.hacktolive.io
- **API Documentation**: https://api.hacktolive.io/api

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Chakra UI
- TailwindCSS

**Backend:**
- NestJS
- Prisma ORM
- MySQL 8.0
- JWT Authentication
- File Upload (Multer)

**Infrastructure:**
- Docker & Docker Compose
- MySQL 8.0 (Containerized)
- Nginx Reverse Proxy
- VPS: 72.62.71.250
- CI/CD: GitHub Actions

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 👥 Multi-role system (Admin, Instructor, Student)
- 📚 Course Management
- 📝 Quiz & Assessment System
- 🏆 Certificate Generation
- 📊 Progress Tracking
- 💬 Reviews & Ratings
- 📤 File Upload (Images, Documents)
- 🎓 Instructor Management
- 📈 Admin Dashboard

## � Project Structure

```
HackToLive/
├── backend/              # NestJS backend application
│   ├── src/
│   │   ├── academy/     # Academy features (courses, quizzes, certificates)
│   │   ├── auth/        # Authentication & authorization
│   │   ├── admin/       # Admin management
│   │   ├── instructor/  # Instructor management
│   │   ├── student/     # Student management
│   │   ├── users/       # User management
│   │   └── upload/      # File upload service
│   ├── prisma/          # Database schema and migrations
│   └── package.json
├── frontend/            # Next.js frontend application
│   ├── src/
│   │   ├── app/         # Next.js app router
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React contexts
│   │   └── types/       # TypeScript types
│   └── package.json
└── COMPLETE_DEPLOYMENT_REFERENCE.md  # Full deployment guide
```

## 🚀 Getting Started
│   └── package.json    # Frontend dependencies

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MySQL 8.0+
- pnpm (recommended) or npm

### Local Development Setup

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/HackToLive.git
cd HackToLive
```

**2. Backend Setup**
```bash
cd backend
pnpm install

# Copy environment file
cp .env.example .env

# Configure your DATABASE_URL in .env
# DATABASE_URL="mysql://user:password@localhost:3306/hacktolive"

# Generate Prisma client and sync database
npx prisma generate
npx prisma db push

# Start backend (http://localhost:4000)
pnpm run dev
```

**3. Frontend Setup**
```bash
cd frontend
npm install

# Copy environment file
cp .env.example .env

# Configure your API URL in .env
# NEXT_PUBLIC_API_URL=http://localhost:4000

# Start frontend (http://localhost:3000)
npm run dev
```

**4. Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api

## 💻 Development

### Backend Commands

```bash
cd backend

# Development with hot reload
pnpm run dev

# Production build
pnpm run build
pnpm run start

# Database management
npx prisma generate         # Generate Prisma client
npx prisma db push          # Sync schema with database
npx prisma studio           # Open database GUI

# Testing
pnpm run test              # Unit tests
pnpm run test:e2e          # E2E tests
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

## 🌐 Deployment

### 🐳 Docker Deployment (Recommended)

The application uses Docker for consistent, production-ready deployment.

**Quick Start:**

1. **On your server (one-time setup):**
```bash
ssh root@72.62.71.250
cd /root
git clone https://github.com/YOUR_USERNAME/HackToLive.git
cd HackToLive
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

2. **Configure GitHub Actions:**
   - Go to: Settings → Secrets → Actions
   - Add: `VPS_HOST`, `VPS_USERNAME`, `VPS_PASSWORD`

3. **Deploy automatically:**
```bash
git push origin main  # Automatic deployment via GitHub Actions
```

**Documentation:**
- 📖 [Complete Deployment Guide](DEPLOYMENT.md)
- 🚀 [Quick Start](QUICK_START.md)
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- 🏗️ [Architecture Diagram](ARCHITECTURE.txt)

**Benefits:**
- ✅ Identical development and production environments
- ✅ Automatic deployment on Git push
- ✅ Easy rollback and version control
- ✅ Built-in health monitoring
- ✅ Simplified scaling

### Manual Update (If needed)

```bash
ssh root@72.62.71.250
### Deployment
- [Complete Deployment Guide](DEPLOYMENT.md) - Full Docker deployment guide
- [Quick Start](QUICK_START.md) - Quick reference
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [Docker Setup Summary](DOCKER_SETUP.md) - Overview of Docker configuration
- [Architecture](ARCHITECTURE.txt) - System architecture diagram

### Development
- [Authentication Guide](AUTHENTICATION_GUIDE.md) - JWT auth implementation (if exists)
- [Course Completion](COURSE_COMPLETION_IMPLEMENTATION.md) - Course progress tracking (if exists)
- [Security Guidelines](SECURITY.md) - Security best practices (if exists)
## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://root:password@localhost:3306/hacktolive"
JWT_SECRET="your-super-secret-jwt-key"
FRONTEND_URL="https://hacktolive.io"
PORT=4000
NODE_ENV=production
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://api.hacktolive.io
NEXT_PUBLIC_SITE_URL=https://hacktolive.io
```

See [.env.example](.env.example) for complete list.

## 📚 Documentation

- [Complete Deployment Reference](COMPLETE_DEPLOYMENT_REFERENCE.md) - Full VPS setup and deployment guide
- [Authentication Guide](AUTHENTICATION_GUIDE.md) - JWT auth implementation
- [Course Completion](COURSE_COMPLETION_IMPLEMENTATION.md) - Course progress tracking
- [Security Guidelines](SECURITY.md) - Security best practices

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- HTTPS/SSL encryption
- Environment-based secrets
- Input validation & sanitization
- SQL injection prevention (Prisma ORM)

## 📝 License

Private project - All rights reserved

## 👨‍💻 Developer

Built and maintained by a solo developer

---

**Live Application**: https://hacktolive.io  
**Need Help?** Check the documentation or open an issue.

# Server Configuration
PORT=3001
NODE_ENV=development
API_PREFIX=api/v1

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000,http://192.168.0.166:3000
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Disable Next.js Telemetry
NEXT_TELEMETRY_DISABLED=1
```