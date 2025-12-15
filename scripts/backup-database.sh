#!/bin/bash

# ==============================================
# HACKTOLIVE - Database Backup Script
# ==============================================
# Automated MySQL database backup with rotation
# ==============================================

set -e

# Configuration
BACKUP_DIR="/var/backups/hacktolive/mysql"
DB_NAME="hacktolive"
DB_USER="root"
DB_PASSWORD="HackTo@Live2026"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/hacktolive_${DATE}.sql"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Database Backup${NC}"
echo -e "${GREEN}========================================${NC}"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Perform backup
echo -e "${YELLOW}Creating database backup...${NC}"
mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_FILE}

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip ${BACKUP_FILE}
BACKUP_FILE="${BACKUP_FILE}.gz"

# Check if backup was successful
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo -e "${GREEN}✓ Backup created successfully: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi

# Delete old backups
echo -e "${YELLOW}Removing backups older than ${RETENTION_DAYS} days...${NC}"
find ${BACKUP_DIR} -name "hacktolive_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# List current backups
echo -e "${GREEN}Current backups:${NC}"
ls -lh ${BACKUP_DIR}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
