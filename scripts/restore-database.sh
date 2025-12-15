#!/bin/bash

# ==============================================
# HACKTOLIVE - Database Restore Script
# ==============================================
# Restore MySQL database from backup
# ==============================================

set -e

BACKUP_DIR="/var/backups/hacktolive/mysql"
DB_NAME="hacktolive"
DB_USER="root"
DB_PASSWORD="HackTo@Live2026"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Database Restore${NC}"
echo -e "${GREEN}========================================${NC}"

# List available backups
echo -e "${YELLOW}Available backups:${NC}"
ls -lh ${BACKUP_DIR}/*.sql.gz 2>/dev/null || {
    echo -e "${RED}No backups found!${NC}"
    exit 1
}

# Get backup file from user or use latest
if [ -z "$1" ]; then
    BACKUP_FILE=$(ls -t ${BACKUP_DIR}/*.sql.gz | head -1)
    echo -e "${YELLOW}Using latest backup: ${BACKUP_FILE}${NC}"
else
    BACKUP_FILE="$1"
fi

# Confirm restoration
echo -e "${RED}WARNING: This will overwrite the current database!${NC}"
read -p "Are you sure you want to continue? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Restore cancelled."
    exit 0
fi

# Decompress and restore
echo -e "${YELLOW}Restoring database...${NC}"
gunzip -c ${BACKUP_FILE} | mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Database restored successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
