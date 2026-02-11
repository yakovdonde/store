# Backend Setup Guide

## Quick Start

### 1. PostgreSQL Setup

#### Windows (using PostgreSQL installer)
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and remember your password
- Create the database:

```sql
CREATE DATABASE judaica_store;
```

#### Or using Docker
```bash
docker run --name judaica-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=judaica_store \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure Environment

Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/judaica_store
NODE_ENV=development
PORT=3001
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
```

### 4. Run Database Migrations

```bash
npm run db:migrate
```

### 5. Start Server

```bash
npm run dev
```

Server will run on http://localhost:3001

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register new user
  ```json
  {"email": "admin@store.com", "password": "password123", "role": "owner"}
  ```
- **POST** `/api/auth/login` - Login
  ```json
  {"email": "admin@store.com", "password": "password123"}
  ```
- **POST** `/api/auth/refresh` - Refresh token (requires JWT header)

### Products (Guest: GET, Admin: POST/PUT/DELETE)
- **GET** `/api/products` - List all products
- **GET** `/api/products?categoryId=1` - List products by category
- **GET** `/api/products/1` - Get product details
- **POST** `/api/products` - Create product (admin)
- **PUT** `/api/products/1` - Update product (admin)
- **DELETE** `/api/products/1` - Delete product (owner)
- **POST** `/api/products/reorder` - Reorder products (admin)

### Categories (Guest: GET, Admin: POST/PUT/DELETE)
- **GET** `/api/categories` - List all categories
- **GET** `/api/categories/1` - Get category details
- **POST** `/api/categories` - Create category (admin)
- **PUT** `/api/categories/1` - Update category (admin)
- **DELETE** `/api/categories/1` - Delete category (owner)
- **POST** `/api/categories/reorder` - Reorder categories (admin)

### Settings (Guest: GET, Owner: PUT)
- **GET** `/api/settings` - Get store settings
- **PUT** `/api/settings` - Update settings (owner only)

### Health Check
- **GET** `/api/health` - Server status

## Authentication

Include JWT token in API requests:
```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Users Table
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- role (owner | editor)
- status (active | inactive)
- created_at, updated_at

### Categories Table
- id (PRIMARY KEY)
- name (UNIQUE)
- description
- order_index
- created_at, updated_at

### Products Table
- id (PRIMARY KEY)
- title
- description
- price
- image_url
- category_id (FOREIGN KEY)
- item_order_index
- created_at, updated_at

### Store Settings Table
- id (PRIMARY KEY)
- site_title
- banner_url
- top_description
- address
- phone
- email
- whatsapp
- created_at, updated_at

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL in .env.local
- Ensure port 5432 is available

### TypeScript Errors
```bash
npm run build
```

### Database Reset
```bash
# Connect to PostgreSQL
psql -U postgres

# Drop and recreate database
DROP DATABASE judaica_store;
CREATE DATABASE judaica_store;
```

Then run migrations again:
```bash
npm run db:migrate
```
