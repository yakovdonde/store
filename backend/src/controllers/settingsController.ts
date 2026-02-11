import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { getSettings, updateSettings } from '@/models/settings'

export const getStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getSettings()
  res.json({ success: true, data: settings })
})

export const updateStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const {
    site_title,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
  } = req.body

  const updated = await updateSettings({
    site_title,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
  })

  res.json({ success: true, data: updated })
})
