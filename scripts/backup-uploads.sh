#!/bin/bash

# ==============================================
# HACKTOLIVE - Uploads Backup Script
# ==============================================
# Backup user uploads (avatars, images, documents)
# ==============================================

set -e

UPLOADS_DIR="/var/www/hacktolive/uploads"
BACKUP_DIR="/var/backups/hacktolive/uploads"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/uploads_${DATE}.tar.gz"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Uploads Backup${NC}"
echo -e "${GREEN}========================================${NC}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Create backup
echo -e "${YELLOW}Creating uploads backup...${NC}"
tar -czf ${BACKUP_FILE} -C $(dirname ${UPLOADS_DIR}) $(basename ${UPLOADS_DIR})

# Check if backup was successful
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo -e "${GREEN}✓ Backup created: ${BACKUP_FILE} (${BACKUP_SIZE})${NC}"
else
    echo -e "${RED}✗ Backup failed!${NC}"
    exit 1
fi

# Delete old backups
echo -e "${YELLOW}Removing backups older than ${RETENTION_DAYS} days...${NC}"
find ${BACKUP_DIR} -name "uploads_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

echo -e "${GREEN}Backup completed successfully!${NC}"
