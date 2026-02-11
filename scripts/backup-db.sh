#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup-db.sh

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"
CONTAINER_NAME="judaica-store-db"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "🔄 Starting database backup..."

# Backup database
docker-compose exec -T db pg_dump -U postgres judaica_store > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"

# Get file size
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo "✅ Database backup completed!"
echo "📁 File: $BACKUP_FILE"
echo "📊 Size: $SIZE"

# Keep only last 7 backups
echo "🧹 Cleaning up old backups (keeping last 7)..."
ls -t "$BACKUP_DIR"/backup_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm

echo "✨ Done!"
