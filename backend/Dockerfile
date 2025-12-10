# ===================================
# Backend Dockerfile - Multi-stage Build
# ===================================

# Base stage
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set placeholder DATABASE_URL for Prisma generation
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

# Production dependencies stage
FROM base AS prod-deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy necessary files
COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --chown=nestjs:nodejs package.json ./

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

# Run migrations and start
CMD npx prisma migrate deploy && node dist/main
