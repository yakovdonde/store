# Judaica Store - Backend API

Express.js backend for the Judaica Store platform.

## Project Structure

```
src/
├── index.ts                    # Server entry point
├── config/
│   └── database.ts             # Database connection
├── database/
│   └── migrations.ts           # Database setup
├── middleware/
│   ├── auth.ts                 # JWT authentication
│   └── errorHandler.ts         # Error handling
├── models/
│   ├── user.ts                 # User model
│   ├── category.ts             # Category model
│   └── product.ts              # Product model
├── routes/
│   ├── index.ts                # Main router
│   ├── auth.ts                 # Authentication routes
│   ├── products.ts             # Product routes
│   ├── categories.ts           # Category routes
│   └── settings.ts             # Settings routes
└── controllers/
    ├── authController.ts       # Auth logic
    ├── productController.ts    # Product logic
    ├── categoryController.ts   # Category logic
    └── settingsController.ts   # Settings logic
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE judaica_store;
```

2. Run migrations:
```bash
npm run db:migrate
```

### Run Development Server

```bash
npm run dev
```

Server runs on http://localhost:3001

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Setup database schema
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Settings
- `GET /api/settings` - Get store settings
- `PUT /api/settings` - Update store settings (admin)
