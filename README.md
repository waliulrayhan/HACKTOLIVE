# 🚀 HACKTOLIVE

Full-stack web application built with **NestJS** (Backend) and **Next.js** (Frontend), containerized with Docker.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Scripts](#scripts)
- [Automated Deployment](#automated-deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🎯 Overview

HACKTOLIVE is a modern full-stack application featuring:
- **Backend**: RESTful API built with NestJS and Prisma ORM
- **Frontend**: Server-side rendered React application with Next.js and Chakra UI
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Runtime**: Node.js 20

### Frontend
- **Framework**: Next.js 14+
- **UI Library**: Chakra UI
- **Language**: TypeScript
- **Styling**: TailwindCSS + Custom Theme

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions (if configured)

## 📁 Project Structure

```
HACKTOLIVE/
├── backend/              # NestJS backend application
│   ├── src/             # Source code
│   ├── prisma/          # Database schema and migrations
│   ├── Dockerfile       # Backend Docker configuration
│   └── package.json     # Backend dependencies
├── frontend/            # Next.js frontend application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── Dockerfile      # Frontend Docker configuration
│   └── package.json    # Frontend dependencies
├── scripts/            # PowerShell management scripts
│   ├── build.ps1      # Build Docker images
│   ├── start.ps1      # Start services
│   ├── stop.ps1       # Stop services
│   ├── clean.ps1      # Clean Docker resources
│   ├── export.ps1     # Export Docker images
│   ├── logs.ps1       # View logs
│   └── dev-setup.ps1  # Development setup
├── docker-compose.yml  # Docker Compose configuration
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── .dockerignore      # Docker ignore rules
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20+ ([Download](https://nodejs.org/))
- **Docker Desktop**: Latest version ([Download](https://www.docker.com/products/docker-desktop))
- **Git**: Latest version

### Quick Setup

1. **Clone the repository**
   ```powershell
   git clone https://github.com/ShabikunShahria/HACKTOLIVE.git
   cd HACKTOLIVE
   ```

2. **Run development setup**
   ```powershell
   .\scripts\dev-setup.ps1
   ```

3. **Configure environment**
   ```powershell
   # Edit .env file with your configuration
   notepad .env
   ```

4. **Start services**
   ```powershell
   .\scripts\start.ps1
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 💻 Development

### Local Development (Without Docker)

**Backend:**
```powershell
cd backend
npm install
npm run start:dev
```

**Frontend:**
```powershell
cd frontend
npm install
npm run dev
```

### Docker Development

**Build images:**
```powershell
.\scripts\build.ps1
```

**Start services:**
```powershell
.\scripts\start.ps1
```

**View logs:**
```powershell
.\scripts\logs.ps1 -follow
```

**Stop services:**
```powershell
.\scripts\stop.ps1
```

## 🐳 Docker Deployment

### Build and Export

```powershell
# Build Docker images
.\scripts\build.ps1

# Export images for deployment
.\scripts\export.ps1
```

This creates `backend-docker.tar` and `frontend-docker.tar` in the `exports/` directory.

### Deploy to Production Server

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `dev-setup.ps1` | Initial development environment setup |
| `build.ps1` | Build Docker images |
| `start.ps1` | Start all services with Docker Compose |
| `stop.ps1` | Stop all running services |
| `logs.ps1` | View service logs |
| `export.ps1` | Export Docker images as tar files |
| `clean.ps1` | Clean Docker resources |

### Script Usage Examples

```powershell
# View all logs
.\scripts\logs.ps1

# View backend logs only
.\scripts\logs.ps1 backend

# Follow logs in real-time
.\scripts\logs.ps1 -follow

# Clean with volumes
.\scripts\clean.ps1 -volumes

# Clean everything
.\scripts\clean.ps1 -all
```

## 🌐 Automated Deployment

### Hostinger CI/CD Pipeline

The project includes automated deployment to Hostinger using GitHub Actions.

**Features:**
- ✅ Automatic deployment on push to `main` branch
- 🏗️ Builds both frontend and backend automatically
- 📦 Optimized production builds with standalone Next.js
- 🚀 FTP deployment to Hostinger
- 🔄 Zero-downtime deployment with PM2

**Quick Start:**

1. **Configure GitHub Secrets** (Repository → Settings → Secrets → Actions):
   ```
   FTP_SERVER=ftp.yourdomain.com
   FTP_USERNAME=your-ftp-username
   FTP_PASSWORD=your-ftp-password
   NEXT_PUBLIC_API_URL=https://yourdomain.com/backend
   ```

2. **Push to main branch:**
   ```powershell
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

3. **Monitor deployment** in GitHub Actions tab

**Deployment Structure:**
```
Hostinger Server:
public_html/              # Frontend (Next.js)
├── .next/
├── public/
├── server.js
└── backend/              # Backend (NestJS)
    ├── dist/
    ├── prisma/
    └── node_modules/
```

**Documentation:**
- 📖 [Complete Deployment Guide](DEPLOYMENT.md)
- 🚀 [Quick Reference](DEPLOYMENT_QUICK_REFERENCE.md)
- 🏗️ [Architecture Diagram](DEPLOYMENT_ARCHITECTURE.md)

**Helper Scripts:**
```powershell
# Test deployment build locally
.\scripts\test-deployment.ps1

# Verify deployment readiness
.\scripts\verify-deployment.ps1
```

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public

# Backend
PORT=3001
NODE_ENV=development
API_PREFIX=api/v1
JWT_SECRET=your-secret-key

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

See `.env.example` for complete list of variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 👥 Team

- **Repository Owner**: [Md. Waliul Islam Rayhan](https://github.com/waliulrayhan)

---

**Need Help?** Check [DEPLOY.md](DEPLOY.md) for deployment guides or open an issue.
