#!/bin/bash

# Database Restore Script
# Usage: ./scripts/restore-db.sh <backup-file>

set -e

if [ $# -eq 0 ]; then
  echo "Usage: $0 <backup-file>"
  echo ""
  echo "Available backups:"
  ls -lh backups/backup_*.sql.gz 2>/dev/null | tail -10
  exit 1
fi

BACKUP_FILE=$1
CONTAINER_NAME="judaica-store-db"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "⚠️  WARNING: This will overwrite the current database!"
read -p "Are you sure? Type 'yes' to continue: " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "❌ Restore cancelled"
  exit 1
fi

echo "🔄 Starting database restore from: $BACKUP_FILE"

# Determine if file is compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
  echo "📦 Decompressing backup..."
  TEMP_FILE=$(mktemp)
  gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
  BACKUP_FILE="$TEMP_FILE"
fi

# Drop existing database and recreate
echo "🗑️  Dropping existing database..."
docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS judaica_store;"

echo "🔨 Creating fresh database..."
docker-compose exec -T db psql -U postgres -c "CREATE DATABASE judaica_store;"

# Restore database
echo "📥 Restoring database from backup..."
docker-compose exec -T db psql -U postgres judaica_store < "$BACKUP_FILE"

# Clean up temp file if created
if [[ -n "$TEMP_FILE" ]]; then
  rm "$TEMP_FILE"
fi

echo "✅ Database restore completed!"
echo "🎉 Ready to use!"
