import pool from '../config/database'

const seedProducts = async () => {
  console.log('🌱 Seeding database with products...')

  // Get category IDs
  const categoriesResult = await pool.query('SELECT id, name FROM categories')
  const categories: { [key: string]: number } = {}
  categoriesResult.rows.forEach((row) => {
    categories[row.name] = row.id
  })

  const products = [
    // Menorahs
    {
      title: 'Classic Silver Menorah',
      description: 'Beautiful handcrafted silver menorah with intricate designs. Perfect for Hanukkah celebrations.',
      price: 149.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1608068810508-63b955eb9b66?w=500',
      item_order_index: 1
    },
    {
      title: 'Modern Brass Menorah',
      description: 'Contemporary brass menorah with clean lines and minimalist design.',
      price: 89.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?w=500',
      item_order_index: 2
    },
    {
      title: 'Antique Bronze Menorah',
      description: 'Traditional bronze menorah with ornate decorative elements.',
      price: 199.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1607107958872-c5deef797c8b?w=500',
      item_order_index: 3
    },
    {
      title: 'Children\'s Colorful Menorah',
      description: 'Fun and colorful menorah designed for children. Safe and durable.',
      price: 45.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
      item_order_index: 4
    },

    // Mezuzahs
    {
      title: 'Sterling Silver Mezuzah',
      description: 'Elegant sterling silver mezuzah case with Star of David design.',
      price: 79.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1604514628550-37477afdf4e3?w=500',
      item_order_index: 5
    },
    {
      title: 'Wooden Mezuzah Set',
      description: 'Handcrafted wooden mezuzah from Jerusalem olive wood.',
      price: 34.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500',
      item_order_index: 6
    },
    {
      title: 'Crystal Mezuzah',
      description: 'Beautiful crystal mezuzah with gold accents.',
      price: 124.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
      item_order_index: 7
    },
    {
      title: 'Ceramic Mezuzah',
      description: 'Hand-painted ceramic mezuzah with colorful Jerusalem designs.',
      price: 29.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      item_order_index: 8
    },

    // Shabbat Items
    {
      title: 'Silver Kiddush Cup',
      description: 'Traditional sterling silver Kiddush cup with ornate engravings.',
      price: 159.99,
      category_id: categories['Shabbat Essentials'],
      image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
      item_order_index: 1
    },
    {
      title: 'Shabbat Candlesticks Pair',
      description: 'Elegant pair of silver-plated Shabbat candlesticks.',
      price: 89.99,
      category_id: categories['Shabbat Essentials'],
      image_url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500',
      item_order_index: 2
    },
    {
      title: 'Challah Board with Knife',
      description: 'Beautiful wooden challah board set with matching knife.',
      price: 64.99,
      category_id: categories['Shabbat Essentials'],
      image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
      item_order_index: 3
    },
    {
      title: 'Challah Cover - Embroidered',
      description: 'Hand-embroidered challah cover with traditional designs.',
      price: 39.99,
      category_id: categories['Shabbat Essentials'],
      image_url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500',
      item_order_index: 4
    },
    {
      title: 'Havdalah Set',
      description: 'Complete Havdalah set including candle holder, spice box, and wine cup.',
      price: 119.99,
      category_id: categories['Shabbat Essentials'],
      image_url: 'https://images.unsplash.com/photo-1554960750-0006dfbdd944?w=500',
      item_order_index: 5
    },

    // Tallit & Tefillin
    {
      title: 'Premium Wool Tallit',
      description: 'High-quality wool tallit with black stripes and decorative atarah.',
      price: 199.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
      item_order_index: 9
    },
    {
      title: 'Silk Tallit - Blue & Gold',
      description: 'Luxurious silk tallit with blue and gold design.',
      price: 279.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1560015534-cee980ba7e13?w=500',
      item_order_index: 10
    },
    {
      title: 'Tallit Bag - Velvet',
      description: 'Elegant velvet tallit bag with embroidered Star of David.',
      price: 44.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500',
      item_order_index: 11
    },
    {
      title: 'Tefillin - Ashkenazi',
      description: 'Kosher Ashkenazi tefillin with quality parchments.',
      price: 449.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1509266272358-7701da638078?w=500',
      item_order_index: 12
    },
    {
      title: 'Tefillin Bag - Leather',
      description: 'Premium leather tefillin bag with multiple compartments.',
      price: 59.99,
      category_id: categories['Ritual Objects'],
      image_url: 'https://images.unsplash.com/photo-1590739225847-5461d9d8bd66?w=500',
      item_order_index: 13
    },

    // Holiday Items
    {
      title: 'Passover Seder Plate',
      description: 'Traditional ceramic Seder plate with Hebrew inscriptions.',
      price: 74.99,
      category_id: categories['Holiday-Specific'],
      image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500',
      item_order_index: 1
    },
    {
      title: 'Purim Grogger Set',
      description: 'Set of 4 colorful wooden groggers for Purim celebrations.',
      price: 29.99,
      category_id: categories['Holiday-Specific'],
      image_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
      item_order_index: 2
    },
    {
      title: 'Shofar - Yemenite Large',
      description: 'Authentic Yemenite shofar, polished and kosher for Rosh Hashanah.',
      price: 189.99,
      category_id: categories['Holiday-Specific'],
      image_url: 'https://images.unsplash.com/photo-1516617442634-75371e0b8b12?w=500',
      item_order_index: 3
    },
    {
      title: 'Sukkah Decorations Set',
      description: 'Beautiful hanging decorations for your sukkah.',
      price: 54.99,
      category_id: categories['Holiday-Specific'],
      image_url: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=500',
      item_order_index: 4
    },
    {
      title: 'Hanukkah Dreidel Set',
      description: 'Set of 6 wooden dreidels in assorted colors.',
      price: 24.99,
      category_id: categories['Holiday-Specific'],
      image_url: 'https://images.unsplash.com/photo-1545083036-f8494c2cae4e?w=500',
      item_order_index: 5
    },

    // Jewelry
    {
      title: 'Star of David Necklace',
      description: '14K gold Star of David pendant with delicate chain.',
      price: 299.99,
      category_id: categories['Art & Home Decor'],
      image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
      item_order_index: 1
    },
    {
      title: 'Hamsa Hand Bracelet',
      description: 'Sterling silver hamsa bracelet with turquoise stone.',
      price: 89.99,
      category_id: categories['Art & Home Decor'],
      image_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
      item_order_index: 2
    },
    {
      title: 'Chai Symbol Ring',
      description: 'Elegant gold Chai symbol ring, adjustable size.',
      price: 159.99,
      category_id: categories['Art & Home Decor'],
      image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
      item_order_index: 3
    },
    {
      title: 'Shema Israel Pendant',
      description: 'Silver pendant engraved with Shema Israel prayer.',
      price: 79.99,
      category_id: categories['Art & Home Decor'],
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
      item_order_index: 4
    },
    {
      title: 'Jerusalem Stone Earrings',
      description: 'Unique earrings featuring authentic Jerusalem stone.',
      price: 64.99,
      category_id: categories['Art & Home Decor'],
      image_url: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f7e?w=500',
      item_order_index: 5
    },

    // Lifecycle Items
    {
      title: 'Bar Mitzvah Tallit Set',
      description: 'Complete tallit set perfect for bar mitzvah celebrations.',
      price: 249.99,
      category_id: categories['Lifecycle & Simcha'],
      image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
      item_order_index: 1
    },
    {
      title: 'Wedding Kiddush Cup Set',
      description: 'Matching bride and groom Kiddush cups for wedding ceremonies.',
      price: 299.99,
      category_id: categories['Lifecycle & Simcha'],
      image_url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500',
      item_order_index: 2
    },
    {
      title: 'Baby Naming Certificate Frame',
      description: 'Beautiful frame for baby naming ceremony certificates.',
      price: 59.99,
      category_id: categories['Lifecycle & Simcha'],
      image_url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=500',
      item_order_index: 3
    },

    // Books
    {
      title: 'Hebrew Prayer Book - Siddur',
      description: 'Traditional Hebrew prayer book with English translation.',
      price: 34.99,
      category_id: categories['Books & Media'],
      image_url: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=500',
      item_order_index: 1
    },
    {
      title: 'Torah Commentary Set',
      description: 'Five-volume Torah commentary by renowned scholars.',
      price: 149.99,
      category_id: categories['Books & Media'],
      image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      item_order_index: 2
    },
    {
      title: 'Children\'s Haggadah',
      description: 'Illustrated Passover Haggadah for children.',
      price: 24.99,
      category_id: categories['Books & Media'],
      image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
      item_order_index: 3
    }
  ]

  // Insert products
  for (const product of products) {
    await pool.query(
      `INSERT INTO products (title, description, price, category_id, image_url, item_order_index, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        product.title,
        product.description,
        product.price,
        product.category_id,
        product.image_url,
        product.item_order_index
      ]
    )
  }

  console.log(`✅ Successfully added ${products.length} products!`)
}

const seedAdmin = async () => {
  try {
    console.log('👤 Seeding default admin user...')
    
    // We need to hash the password - import bcrypt
    const bcrypt = require('bcryptjs')
    const defaultPassword = 'admin123'
    const passwordHash = await bcrypt.hash(defaultPassword, 10)
    
    // Check if admin already exists
    const existingAdmin = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@store.local']
    )
    
    if (existingAdmin.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        ['admin@store.local', passwordHash, 'owner']
      )
      console.log('✓ Default admin user created')
      console.log('  📧 Email: admin@store.local')
      console.log('  🔑 Password: admin123')
    } else {
      console.log('✓ Admin user already exists')
    }
  } catch (error) {
    console.error('Error seeding admin user:', error)
    throw error
  }
}

const main = async () => {
  try {
    await seedAdmin()
    await seedProducts()
    console.log('🎉 Database seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

main()
