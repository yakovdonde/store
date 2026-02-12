import { Router } from 'express'
import * as setupController from '@/controllers/setupController'

const router = Router()

// Public setup route (no authentication required for initial setup)
router.post('/', setupController.completeSetup)

export default router
