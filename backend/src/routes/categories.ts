import { Router } from 'express'
import * as categoryController from '@/controllers/categoryController'
import { authenticate, authorize } from '@/middleware/auth'

const router = Router()

// Public routes
router.get('/', categoryController.listCategories)
router.get('/:id', categoryController.getCategory)

// Admin routes
router.post('/', authenticate, authorize(['owner', 'editor']), categoryController.create)
router.put('/:id', authenticate, authorize(['owner', 'editor']), categoryController.update)
router.delete('/:id', authenticate, authorize(['owner']), categoryController.remove)
router.post('/reorder', authenticate, authorize(['owner', 'editor']), categoryController.reorder)

export default router
