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
        price_usd DECIMAL(10, 2),
        price_eur DECIMAL(10, 2),
        price_ils DECIMAL(10, 2),
        price_azn DECIMAL(10, 2),
        image_url VARCHAR(500),
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        item_order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ products table created')

    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2)
    `)
    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS price_eur DECIMAL(10, 2)
    `)
    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS price_ils DECIMAL(10, 2)
    `)
    await query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS price_azn DECIMAL(10, 2)
    `)

    await query(`
      UPDATE products
      SET price_usd = price
      WHERE price_usd IS NULL
    `)

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
        setup_config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ store_settings table created')
    
    // Add setup_config column if it doesn't exist (for existing databases)
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS setup_config JSONB
    `)

    // Add branding columns
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS tagline VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS favicon_url VARCHAR(500)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS primary_color VARCHAR(7)
    `)

    // Add multilingual site titles
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS site_title_en VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS site_title_az VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS site_title_he VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS site_title_ru VARCHAR(255)
    `)

    // Add language label customization columns
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS lang_label_en VARCHAR(100)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS lang_label_ru VARCHAR(100)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS lang_label_he VARCHAR(100)
    `)

    // Add header title columns (top-left display)
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS header_title_en VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS header_title_az VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS header_title_he VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS header_title_ru VARCHAR(255)
    `)

    // Add banner title columns (hero banner center display)
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_en VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_az VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_he VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_ru VARCHAR(255)
    `)

    // Add banner description columns (hero banner description)
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_en TEXT
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_az TEXT
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_he TEXT
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_ru TEXT
    `)

    // Add banner styling columns (background color and image)
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_background_color VARCHAR(7)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_background_image VARCHAR(500)
    `)

    // Add banner typography styling columns
    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_font_family VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_font_size INTEGER
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_color VARCHAR(20)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_align VARCHAR(20)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_title_vertical_align VARCHAR(20)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_font_family VARCHAR(255)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_font_size INTEGER
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_color VARCHAR(20)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_align VARCHAR(20)
    `)

    await query(`
      ALTER TABLE store_settings
      ADD COLUMN IF NOT EXISTS banner_description_vertical_align VARCHAR(20)
    `)

    // No default categories or settings - store starts empty
    console.log('✓ Store will start empty, no default data inserted')

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
