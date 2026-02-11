import { Router } from 'express'
import * as productController from '@/controllers/productController'
import { authenticate, authorize } from '@/middleware/auth'

const router = Router()

// Public routes
router.get('/search', productController.search)
router.get('/', productController.listProducts)
router.get('/:id', productController.getProduct)

// Admin routes
router.post('/', authenticate, authorize(['owner', 'editor']), productController.create)
router.put('/:id', authenticate, authorize(['owner', 'editor']), productController.update)
router.delete('/:id', authenticate, authorize(['owner']), productController.remove)
router.post('/reorder', authenticate, authorize(['owner', 'editor']), productController.reorder)

export default router
