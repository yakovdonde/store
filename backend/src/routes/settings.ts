import { Router } from 'express'
import * as settingsController from '@/controllers/settingsController'
import { authenticate, authorize } from '@/middleware/auth'

const router = Router()

// Public route
router.get('/', settingsController.getStoreSettings)

// Admin routes
router.post('/', authenticate, authorize(['owner']), settingsController.createStoreSettings)
router.put('/', authenticate, authorize(['owner']), settingsController.updateStoreSettings)

export default router
