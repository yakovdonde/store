import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import apiRoutes from '@/routes'
import { errorHandler } from '@/middleware/errorHandler'
import { runMigrations } from '@/database/migrations'
import pool from '@/config/database'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3001

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir))

// Routes
app.use('/api', apiRoutes)

// Error handling
app.use(errorHandler)

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🗄️  Running database migrations...')
    await runMigrations()

    // Seed default admin user
    console.log('👤 Seeding default admin user...')
    try {
      const bcrypt = require('bcryptjs')
      const defaultPassword = 'admin123'
      const passwordHash = await bcrypt.hash(defaultPassword, 10)

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
    } catch (seedError) {
      console.log('ℹ️  Admin seeding skipped (user may already exist)')
    }

    app.listen(PORT, () => {
      console.log(`\n✅ Server is running on http://localhost:${PORT}`)
      console.log(`📚 API Documentation:`)
      console.log(`   - Auth: http://localhost:${PORT}/api/auth`)
      console.log(`   - Products: http://localhost:${PORT}/api/products`)
      console.log(`   - Categories: http://localhost:${PORT}/api/categories`)
      console.log(`   - Settings: http://localhost:${PORT}/api/settings`)
      console.log(`\n📝 Health check: http://localhost:${PORT}/api/health\n`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer()
}

export default app
