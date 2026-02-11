import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'

type PageViewPayload = {
  path?: string
  referrer?: string | null
  userAgent?: string
}

export const trackPageView = asyncHandler(async (req: Request, res: Response) => {
  const { path, referrer, userAgent } = req.body as PageViewPayload

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ success: false, error: 'Path is required' })
  }

  console.log('[analytics] pageview', {
    path,
    referrer: referrer || null,
    userAgent: userAgent || null,
    timestamp: new Date().toISOString(),
  })

  res.json({ success: true })
})
