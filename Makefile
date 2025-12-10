# ===================================
# HACKTOLIVE - Makefile
# Cross-platform build automation
# ===================================

.PHONY: help setup build start stop restart logs clean test dev

# Default target
.DEFAULT_GOAL := help

# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_DIR = backend
FRONTEND_DIR = frontend

## help: Display this help message
help:
	@echo "HACKTOLIVE - Available Commands"
	@echo "================================"
	@grep -E '^## ' $(MAKEFILE_LIST) | sed 's/## /  /'

## setup: Initial project setup
setup:
	@echo "Setting up HACKTOLIVE..."
	@if [ ! -f .env ]; then cp .env.example .env; echo ".env created"; fi
	@echo "Installing backend dependencies..."
	@cd $(BACKEND_DIR) && npm install
	@echo "Installing frontend dependencies..."
	@cd $(FRONTEND_DIR) && npm install
	@echo "Setup complete!"

## build: Build Docker images
build:
	@echo "Building Docker images..."
	@$(DOCKER_COMPOSE) build
	@echo "Build complete!"

## start: Start all services
start:
	@echo "Starting services..."
	@$(DOCKER_COMPOSE) up -d
	@echo "Services started!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend:  http://localhost:3001"

## stop: Stop all services
stop:
	@echo "Stopping services..."
	@$(DOCKER_COMPOSE) down
	@echo "Services stopped!"

## restart: Restart all services
restart: stop start

## logs: View logs (use 'make logs service=backend' for specific service)
logs:
	@$(DOCKER_COMPOSE) logs -f $(service)

## clean: Clean Docker resources
clean:
	@echo "Cleaning Docker resources..."
	@$(DOCKER_COMPOSE) down -v
	@docker system prune -f
	@echo "Cleanup complete!"

## test: Run tests
test:
	@echo "Running backend tests..."
	@cd $(BACKEND_DIR) && npm test
	@echo "Running frontend tests..."
	@cd $(FRONTEND_DIR) && npm test

## dev: Start development servers (without Docker)
dev:
	@echo "Starting development servers..."
	@trap 'kill 0' EXIT; \
		(cd $(BACKEND_DIR) && npm run start:dev) & \
		(cd $(FRONTEND_DIR) && npm run dev)

## lint: Run linters
lint:
	@echo "Linting backend..."
	@cd $(BACKEND_DIR) && npm run lint
	@echo "Linting frontend..."
	@cd $(FRONTEND_DIR) && npm run lint

## format: Format code
format:
	@echo "Formatting backend..."
	@cd $(BACKEND_DIR) && npm run format
	@echo "Formatting frontend..."
	@cd $(FRONTEND_DIR) && npm run format

## prisma-generate: Generate Prisma client
prisma-generate:
	@cd $(BACKEND_DIR) && npx prisma generate

## prisma-migrate: Run Prisma migrations
prisma-migrate:
	@cd $(BACKEND_DIR) && npx prisma migrate dev

## prisma-studio: Open Prisma Studio
prisma-studio:
	@cd $(BACKEND_DIR) && npx prisma studio

## export: Export Docker images
export:
	@echo "Exporting Docker images..."
	@mkdir -p exports
	@docker save hacktolive-backend:latest -o exports/backend-docker.tar
	@docker save hacktolive-frontend:latest -o exports/frontend-docker.tar
	@echo "Export complete!"
