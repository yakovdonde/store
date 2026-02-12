# Quick Start Command Reference

## 🚀 Fastest Setup (Docker Compose)

```bash
# One-command setup (requires Docker)
docker-compose up

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api/health
# Admin: http://localhost:3000/admin
# Login: admin@store.local / admin123
```

**⚠️ Important:** Your store starts **completely empty**. After starting:
1. Visit http://localhost:3000/admin
2. Login with credentials above
3. Go to **Settings** to configure your store
4. Add **Categories** for organizing products
5. Add **Products** to populate your store

See [EMPTY_STORE_INITIALIZATION.md](./EMPTY_STORE_INITIALIZATION.md) for details.

---

## 🚀 Fast Setup (Copy & Paste)

### Step 1: PostgreSQL Setup
```bash
# On Windows, use SQL Server Management Studio or psql:
psql -U postgres
CREATE DATABASE judaica_store;
\q
```

### Step 2: Backend Setup
```bash
cd backend
npm install
# Edit .env.local with your DATABASE_URL
npm run db:migrate
npm run dev
```

**Backend should now run on:** http://localhost:3001/api/health

### Step 3: Frontend Setup (New Terminal)
```bash
cd frontend
npm install
# .env.local is already pre-configured
npm run dev
```

**Frontend should now run on:** http://localhost:3000

---

## 📋 Available Scripts

### Backend
```bash
npm run dev          # Start development server (with hot reload)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled production build
npm run db:migrate   # Setup database schema
npm run lint         # Check code quality
```

### Frontend
```bash
npm run dev          # Start development server on port 3000
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check code quality
npm run type-check   # Run TypeScript type checking
```

---

## 🧪 Testing the API

### Quick Test Commands

**1. Health Check**
```bash
curl http://localhost:3001/api/health
```

**2. List Categories**
```bash
curl http://localhost:3001/api/categories
```

**3. List Products**
```bash
curl http://localhost:3001/api/products
```

**4. Register Admin User**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@store.com",
    "password": "password123",
    "role": "owner"
  }'
```

**5. Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@store.com",
    "password": "password123"
  }'
```

Copy the `token` from response, then use it in headers:

**6. Create Product (requires token)**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Silver Kiddush Cup",
    "description": "Elegant sterling silver kiddush cup",
    "price": 89.99,
    "category_id": 2,
    "image_url": "https://via.placeholder.com/250"
  }'
```

---

## � Production Deployment (One Command)

```bash
# Copy and configure production environment
cp .env.example .env.production
nano .env.production  # Edit with your values

# Run production setup script
chmod +x scripts/setup-prod.sh
./scripts/setup-prod.sh

# That's it! Services will start and run on:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Admin: http://localhost:3000/admin
```

**Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

```bash
# Start PostgreSQL container
docker run --name judaica-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=judaica_store \
  -p 5432:5432 \
  -d postgres:15

# Stop container
docker stop judaica-postgres

# Start it again
docker start judaica-postgres
```

Then update backend `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/judaica_store
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process on port 3001 (Windows)
netstat -ano | findstr :3001

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Error
```bash
# Test PostgreSQL connection
psql -U postgres -d judaica_store
```

### Clear Node Modules and Reinstall
```bash
# Frontend
cd frontend
rm -r node_modules
npm install

# Backend
cd backend
rm -r node_modules
npm install
```

### Reset Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Drop and recreate
DROP DATABASE judaica_store;
CREATE DATABASE judaica_store;

# Run migrations again
npm run db:migrate
```

---

## 📂 File Structure Reference

```
store.donde.az/
  frontend/           # Next.js app (port 3000)
    src/
      app/            # Pages and layouts
      components/     # Reusable components
      lib/            # Utilities (cart, API client)
    .env.local        # Frontend env (ready to use)
    package.json      # Frontend dependencies

  backend/            # Express API (port 3001)
    src/
      index.ts        # Entry point
      routes/         # API routes
      controllers/    # Business logic
      models/         # Database queries
      middleware/     # Auth & errors
    .env.local        # Backend env (needs DATABASE_URL)
    package.json      # Backend dependencies

  docs/
    SETUP.md          # Detailed setup guide
    API.md            # Complete API reference

  PRD.md              # Product requirements
  BUILD_SUMMARY.md    # Build overview
```

---

## 🌐 URLs Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Storefront & Admin |
| Backend | http://localhost:3001 | API Server |
| API Health | http://localhost:3001/api/health | Test API |
| Admin Panel | http://localhost:3000/admin | Manage store |
| Storefront | http://localhost:3000/storefront | Browse products |

---

## 🔐 Default Admin Account

The database is automatically seeded with a default admin user:

**Email:** `admin@store.local`  
**Password:** `admin123`

Use these credentials to login at http://localhost:3000/admin

⚠️ **Important:** Change this password immediately in production!

### Reset Admin Password (Development)

```bash
# Drop and recreate database
docker-compose exec db psql -U postgres -c "DROP DATABASE judaica_store;"
docker-compose exec db psql -U postgres -c "CREATE DATABASE judaica_store;"

# Run migrations to reseed
docker-compose exec backend npm run db:migrate
```

---

## 📝 Environment Variables

### Backend (.env.local)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/judaica_store
NODE_ENV=development
PORT=3001
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

### Frontend (.env.local) - Already configured
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `judaica_store` created
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend `.env.local` configured with DATABASE_URL
- [ ] Backend migrations run (`npm run db:migrate`)
- [ ] Backend server started (`npm run dev`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server started (`npm run dev`)
- [ ] Test: http://localhost:3000 loads
- [ ] Test: http://localhost:3001/api/health returns OK

---

**Once all steps completed, your Judaica Store platform is ready! 🎉**
