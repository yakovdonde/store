#!/bin/bash

# Production Deployment Setup Script
# Usage: ./scripts/setup-prod.sh

set -e

echo "🚀 Judaica Store - Production Setup"
echo "==================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  exit 1
fi

echo "✅ Docker found"

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose first."
  exit 1
fi

echo "✅ Docker Compose found"

# Create necessary directories
echo ""
echo "📁 Creating directories..."
mkdir -p backups
mkdir -p ./backend/uploads
mkdir -p ./backend/logs
mkdir -p ./frontend/logs

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
  echo ""
  echo "⚠️  .env.production not found. Creating from template..."
  cp .env.example .env.production
  
  echo ""
  echo "⚡ IMPORTANT: Edit .env.production with your production values:"
  echo "   - Change DATABASE_URL to use your production database"
  echo "   - Generate a strong JWT_SECRET: openssl rand -base64 32"
  echo "   - Set NEXT_PUBLIC_API_URL to your domain"
  echo "   - Change all passwords to strong values"
  echo ""
  echo "📝 Edit now? (y/n)"
  read -r response
  if [[ "$response" =~ ^[Yy]$ ]]; then
    nano .env.production
  fi
fi

echo ""
echo "🔍 Checking environment variables..."

# Source .env.production for validation
set +e
source .env.production
set -e

# Validate critical variables
if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET is not set in .env.production"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL is not set in .env.production"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "❌ NEXT_PUBLIC_API_URL is not set in .env.production"
  exit 1
fi

echo "✅ Environment variables validated"

# Make scripts executable
echo ""
echo "🔐 Making scripts executable..."
chmod +x ./scripts/backup-db.sh
chmod +x ./scripts/restore-db.sh

# Build images
echo ""
echo "🏗️  Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Start services
echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check health
echo ""
echo "🏥 Health check..."
docker-compose -f docker-compose.prod.yml ps

# Test API
echo ""
echo "📡 Testing API connection..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
  echo "✅ Backend API is responding"
else
  echo "⚠️  Backend API not responding yet. Check logs with: docker-compose logs backend"
fi

echo ""
echo "=================================="
echo "✅ Setup completed successfully!"
echo "=================================="
echo ""
echo "📊 Next steps:"
echo "1. Access admin dashboard: http://localhost:3000/login"
echo "   Username: admin@store.local"
echo "   Password: admin123"
echo ""
echo "2. Change default admin password immediately!"
echo ""
echo "3. For SSL/HTTPS setup, see DEPLOYMENT.md"
echo ""
echo "4. View logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "5. Database operations:"
echo "   Backup: ./scripts/backup-db.sh"
echo "   Restore: ./scripts/restore-db.sh <backup-file>"
echo ""
