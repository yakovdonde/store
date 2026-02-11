# 🚀 Deployment Guide

This guide covers deploying the Judaica Store platform to production.

## 📋 Prerequisites

- Linux server (Ubuntu 20.04+ or similar)
- Docker & Docker Compose installed
- Domain name pointing to the server
- SSL certificate (Let's Encrypt recommended)
- 2GB+ RAM, 20GB+ disk space

## 🔧 Server Setup

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install git
sudo apt install -y git
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/store.donde.az.git
cd store.donde.az
sudo chown -R $USER:$USER .
```

### 3. Configure Environment

```bash
# Copy and edit production environment file
cp .env.example .env.production

# Edit with secure values
nano .env.production
```

**Critical Settings:**
- `JWT_SECRET`: Generate a long random string (min 32 chars)
  ```bash
  openssl rand -base64 32
  ```
- `POSTGRES_PASSWORD`: Use a strong password
- `DATABASE_URL`: Set correct host/credentials
- `NEXT_PUBLIC_API_URL`: Set to your domain

## 🐳 Deploy with Docker Compose

### 1. Start Production Stack

```bash
# Using production config
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Verify all containers running
docker-compose ps
docker-compose logs -f
```

### 2. Verify Deployment

```bash
# Health check
curl http://localhost:3001/api/health

# Check frontend
curl http://localhost:3000

# View logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

## 🔒 SSL/HTTPS Setup with Nginx

### 1. Install Nginx

```bash
sudo apt install -y nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/store.donde.az
```

Add this configuration:

```nginx
upstream backend {
    server backend:3001;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name store.donde.az;
    
    # Redirect all HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name store.donde.az;
    
    # SSL Certificate (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/store.donde.az/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/store.donde.az/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files with caching
    location /_next/ {
        proxy_pass http://frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Frontend routes
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Enable Nginx Config

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/store.donde.az /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 4. Setup Let's Encrypt SSL

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d store.donde.az

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📊 Database Management

### Backup

```bash
# Manual backup
docker-compose exec db pg_dump -U postgres judaica_store > backup-$(date +%Y%m%d).sql

# Automated daily backups (add to crontab)
0 2 * * * docker-compose -f /opt/store.donde.az/docker-compose.prod.yml exec db pg_dump -U postgres judaica_store > /opt/store.donde.az/backups/backup-$(date +\%Y\%m\%d).sql
```

### Restore

```bash
# Restore from backup
docker-compose exec -T db psql -U postgres judaica_store < backup-20260211.sql
```

### Database Maintenance

```bash
# Connect to database
docker-compose exec db psql -U postgres -d judaica_store

# Common psql commands
\dt                    # List tables
\d categories          # Describe table
SELECT * FROM users;   # Query data
```

## 🔄 Container Management

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service (last 100 lines)
docker-compose logs --tail 100 backend
docker-compose logs --tail 100 frontend
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild containers
docker-compose build --no-cache

# Restart services
docker-compose down
docker-compose up -d

# Verify
docker-compose logs
```

### Stop/Restart Services

```bash
# Stop all
docker-compose down

# Start all
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Restart specific service
docker-compose restart backend
```

## 📈 Monitoring & Logs

### View Real-time Logs

```bash
# Combined logs with timestamps
docker-compose logs -f --timestamps

# Filter by service
docker-compose logs -f backend | grep -i error
```

### Check Container Status

```bash
# See all containers
docker-compose ps

# Check resource usage
docker stats
```

### Database Logs

```bash
# PostgreSQL logs
docker-compose logs db | tail -50
```

## 🛡️ Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secret with `openssl rand -base64 32`
- [ ] Enable SSL/HTTPS with Let's Encrypt
- [ ] Configure firewall to allow only 80, 443, 22
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Enable HTTP security headers (in Nginx config)
- [ ] Disable direct database access from internet
- [ ] Use strong PostgreSQL password
- [ ] Keep Docker images updated

## 🚨 Troubleshooting

### Containers won't start
```bash
# Check logs
docker-compose logs

# Check resource limits
free -m
df -h

# Restart Docker daemon
sudo systemctl restart docker
```

### Database connection errors
```bash
# Test connection
docker-compose exec db pg_isready -U postgres

# Check environment variables
docker-compose config | grep DATABASE_URL
```

### Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Verify API connectivity
docker-compose exec frontend curl http://backend:3001/api/health
```

### API errors
```bash
# Check backend logs
docker-compose logs backend

# Test API endpoint
curl -v http://localhost:3001/api/health

# Check database tables
docker-compose exec db psql -U postgres -d judaica_store -c "SELECT * FROM users;"
```

## 📞 Support

For issues or questions:
1. Check Docker logs: `docker-compose logs`
2. Review the main README.md
3. Check API documentation in docs/API.md

## 🔄 Regular Maintenance

### Weekly
- Monitor disk space
- Review error logs
- Check backup success

### Monthly
- Update OS packages: `sudo apt update && sudo apt upgrade`
- Rebuild Docker images: `docker-compose build --no-cache`
- Review security settings

### Quarterly
- Renew SSL certificates (automated)
- Audit user access
- Performance review
