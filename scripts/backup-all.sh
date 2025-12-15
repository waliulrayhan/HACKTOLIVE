#!/bin/bash

# ==============================================
# HACKTOLIVE - Complete Backup Script
# ==============================================
# Backup database and uploads together
# ==============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}HACKTOLIVE Complete Backup${NC}"
echo -e "${GREEN}========================================${NC}"

# Backup database
echo -e "${YELLOW}[1/2] Backing up database...${NC}"
bash ${SCRIPT_DIR}/backup-database.sh

# Backup uploads
echo -e "${YELLOW}[2/2] Backing up uploads...${NC}"
bash ${SCRIPT_DIR}/backup-uploads.sh

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Complete backup finished!${NC}"
echo -e "${GREEN}========================================${NC}"
