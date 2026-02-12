# Empty Store Initialization

## Overview

When a store goes online for the first time, it starts **completely empty**. This ensures that each new store owner has full control over their store's content from the beginning.

**Important:** There is no setup wizard. All configuration is done through the admin panel at `/admin`.

## What Gets Created Automatically?

### During Database Migration (First Startup)

✅ **Database Tables Only**
- `users` - for admin/editor accounts
- `categories` - empty table, ready for your categories
- `products` - empty table, ready for your products  
- `store_settings` - empty table, ready for your configuration

✅ **Admin User Account**
- Email: `admin@store.local`
- Password: `admin123`
- Role: `owner`

**That's it!** No categories, no products, no store settings are created automatically.

## What Stays Empty?

❌ **No Default Categories**
- The categories table is created but remains empty
- You add your own categories through the admin panel

❌ **No Default Products**
- The products table is created but remains empty
- You add your own products through the admin panel

❌ **No Default Store Settings**
- The store_settings table is created but remains empty
- You configure your store through the Setup Wizard

## Initial Setup Process

### 1. First Access

When you first access your store at `http://localhost:3000`, you'll see an empty storefront with no products or categories.

### 2. Admin Panel Configuration

There is **no setup wizard**. Store owners configure everything directly from the admin panel.

**Access the Admin Panel:**
1. Navigate to `http://localhost:3000/admin`
2. Login with default credentials:
   - Email: `admin@store.local`
   - Password: `admin123`

⚠️ **Important:** Change this password immediately!

### 3. Configure Your Store

**Step 1: Store Settings**
1. Go to Admin Panel > Settings
2. Fill in your store information:
   - Store title
   - Description
   - Banner image URL
   - Contact information (address, phone, email, WhatsApp)
3. Click "Save Settings"

**Step 2: Create Categories**
1. Go to Admin Panel > Categories
2. Click "Add Category"
3. Enter category details in all languages (EN, RU, HE, AZ)
4. Save

**Step 3: Add Products**
1. Go to Admin Panel > Products
2. Click "Add Product"
3. Fill in product details
4. Select a category
5. Upload product image
6. Set prices for each currency
7. Save

### 4. After Configuration

Once you've added settings, categories, and products, your storefront will display them automatically.

## Database Seeding (Development Only)

### Important Note

The `backend/src/database/seed.ts` file contains sample data but is **NOT** used during normal store initialization.

### When to Use Seeding

The seed script is only for:
- **Development/testing** - to populate test data quickly
- **Demo stores** - to showcase the platform with sample products

### How to Run Seeding (Manual)

```bash
cd backend
npm run seed
```

This will populate your database with sample categories and products. **Only use this for development purposes.**

## Admin Panel First Steps

### 1. Login to Admin Panel

Navigate to `/admin` and login with:
- Email: `admin@store.local`
- Password: `admin123`

⚠️ **Important:** Change this password immediately in production!

### 2. Configure Store Settings (First Priority)

1. Go to Admin Panel > Settings
2. You'll see a message: "Your store has no settings yet. Fill out the form below to configure your store."
3. Enter all store information
4. Click "Save Settings"

### 3. Create Categories

1. Go to Admin Panel > Categories
2. Click "Add Category"
3. Enter category details in all languages
4. Save
5. Repeat for all categories you need

### 4. Add Products

1. Go to Admin Panel > Products
2. Click "Add Product"
3. Fill in product details
4. Select a category
5. Upload product image
6. Set prices for each currency
7. Save

## Migration History

### Previous Behavior (Before Empty Store Initiative)

Previously, the database migrations would automatically insert:
- 6 default categories (Ritual Objects, Shabbat Essentials, etc.)
- Default store settings (site title, description, contact info)

### Current Behavior (After Empty Store Initiative)

Now, the database migrations only:
- Create empty tables
- Create the admin user account
- **Do not** insert any default categories or settings

This change ensures that every new store starts with a clean slate and can be customized from the ground up.

## Configuration vs Data

### Store Type Configuration (`storeConfig.ts`)

The `frontend/src/config/storeConfig.ts` file contains:
- **Suggested** categories for different store types
- **Template** color schemes
- **Example** content in multiple languages

These are **suggestions only** - they are not automatically created in the database.

### Actual Store Data (Database)

Your actual store data lives in the PostgreSQL database:
- Categories you create
- Products you add
- Settings you configure

## Summary

| Feature | Automatically Created? | How to Add |
|---------|----------------------|------------|
| Database Tables | ✅ Yes | Automatic on first startup |
| Admin User | ✅ Yes | Automatic on first startup |
| Categories | ❌ No | Through Admin Panel |
| Products | ❌ No | Through Admin Panel |
| Store Settings | ❌ No | Through Admin Panel |

The empty store approach gives you complete control and ensures your store is truly customized from day one.
