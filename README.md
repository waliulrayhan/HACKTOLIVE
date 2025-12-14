# 🚀 HACKTOLIVE

Full-stack web application built with **NestJS** (Backend) and **Next.js** (Frontend).

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🎯 Overview

HACKTOLIVE is a modern full-stack application featuring:
- **Backend**: RESTful API built with NestJS and Prisma ORM
- **Frontend**: Server-side rendered React application with Next.js and TailwindCSS
- **Database**: MySQL (Hostinger)

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS
- **Database ORM**: Prisma
- **Database**: MySQL
- **Language**: TypeScript
- **Runtime**: Node.js 20

### Frontend
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: TailwindCSS

## 📁 Project Structure

```
HACKTOLIVE/
├── backend/              # NestJS backend application
│   ├── src/             # Source code
│   ├── prisma/          # Database schema and migrations
│   ├── .env            # Backend environment variables
│   └── package.json     # Backend dependencies
├── frontend/            # Next.js frontend application
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   ├── .env.local      # Frontend environment variables
│   └── package.json    # Frontend dependencies
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20+ ([Download](https://nodejs.org/))
- **Git**: Latest version

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShabikunShahria/HACKTOLIVE.git
   cd HACKTOLIVE
   ```

2. **Configure Backend**
   ```bash
   cd backend
   npm install
   
   # Edit .env file with your database credentials
   # The file is already configured with the Hostinger MySQL database
   ```

3. **Configure Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Edit .env.local file with your API URL
   # Already configured for local development
   ```

4. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run start:dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 💻 Development

### Backend Development

```bash
cd backend

# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### Frontend Development

```bash
cd frontend

# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
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

**Need Help?** Open an issue or contact the team.
### Backend (.env)

```env
# Database Configuration
DATABASE_URL="mysql://username:password@host:3306/database_name"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

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