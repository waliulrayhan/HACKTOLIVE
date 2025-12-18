#!/bin/bash

# ==============================================
# Database Backup Script
# Backs up MySQL database to local file
# ==============================================

set -e

# Configuration
BACKUP_DIR="/root/backups"
CONTAINER_NAME="hacktolive-mysql"
DB_NAME="hacktolive"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/hacktolive_${TIMESTAMP}.sql"

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}🗄️  Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Backup database
docker exec "$CONTAINER_NAME" mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

echo -e "${GREEN}✅ Backup completed: ${BACKUP_FILE}.gz${NC}"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "hacktolive_*.sql.gz" -mtime +7 -delete

echo -e "${GREEN}📊 Recent backups:${NC}"
ls -lh "$BACKUP_DIR" | tail -5
