import { Router } from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import categoryRoutes from './categories'
import settingsRoutes from './settings'
import uploadRoutes from './upload'
import userRoutes from './users'
import analyticsRoutes from './analytics'

const router = Router()

router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/settings', settingsRoutes)
router.use('/upload', uploadRoutes)
router.use('/users', userRoutes)
router.use('/analytics', analyticsRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
