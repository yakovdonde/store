import { query } from '@/config/database'

export async function runMigrations() {
  try {
    console.log('Starting database migrations...')

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor')),
        status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ users table created')

    // Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ categories table created')

    await query(`
      ALTER TABLE categories
      ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
    `)

    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image_url VARCHAR(500),
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        item_order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ products table created')

    // Create store_settings table
    await query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id SERIAL PRIMARY KEY,
        site_title VARCHAR(255),
        banner_url VARCHAR(500),
        top_description TEXT,
        address VARCHAR(500),
        phone VARCHAR(20),
        email VARCHAR(255),
        whatsapp VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ store_settings table created')

    // Insert default categories if they don't exist
    const defaultCategories = [
      { name: 'Ritual Objects', order_index: 1 },
      { name: 'Shabbat Essentials', order_index: 2 },
      { name: 'Holiday-Specific', order_index: 3 },
      { name: 'Lifecycle & Simcha', order_index: 4 },
      { name: 'Books & Media', order_index: 5 },
      { name: 'Art & Home Decor', order_index: 6 },
    ]

    for (const cat of defaultCategories) {
      await query(`
        INSERT INTO categories (name, order_index)
        VALUES ($1, $2)
        ON CONFLICT (name) DO NOTHING
      `, [cat.name, cat.order_index])
    }
    console.log('✓ default categories inserted')

    // Insert default store settings
    await query(`
      INSERT INTO store_settings (site_title, top_description, address, phone, email)
      VALUES (
        'Judaica Store',
        'Your premier source for authentic Judaica items',
        '123 Jewish Way, New York, NY 10001',
        '(555) 123-4567',
        'info@judaicastore.com'
      )
      ON CONFLICT DO NOTHING
    `)
    console.log('✓ default settings inserted')

    console.log('✅ Database migrations completed!')
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    throw error
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
