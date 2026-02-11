import { Router } from 'express'
import { trackPageView } from '@/controllers/analyticsController'

const router = Router()

router.post('/pageview', trackPageView)

export default router
