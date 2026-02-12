import { Router } from 'express'
import * as setupController from '@/controllers/setupController'

const router = Router()

// Public setup routes
router.get('/status', setupController.checkSetupStatus)
router.get('/', setupController.getSetupConfig)
router.post('/', setupController.completeSetup)

export default router
