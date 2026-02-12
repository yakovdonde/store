import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { getSettings, updateSettings } from '@/models/settings'

export const getStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getSettings()
  res.json({ success: true, data: settings })
})

export const createStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const {
    site_title,
    site_title_en,
    site_title_az,
    site_title_he,
    site_title_ru,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
    logo_url,
    tagline,
    favicon_url,
    primary_color,
  } = req.body

  // updateSettings handles both insert and update
  const created = await updateSettings({
    site_title,
    site_title_en,
    site_title_az,
    site_title_he,
    site_title_ru,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
    logo_url,
    tagline,
    favicon_url,
    primary_color,
  })

  res.json({ success: true, data: created })
})

export const updateStoreSettings = asyncHandler(async (req: Request, res: Response) => {
  const {
    site_title,
    site_title_en,
    site_title_az,
    site_title_he,
    site_title_ru,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
    logo_url,
    tagline,
    favicon_url,
    primary_color,
  } = req.body

  const updated = await updateSettings({
    site_title,
    site_title_en,
    site_title_az,
    site_title_he,
    site_title_ru,
    banner_url,
    top_description,
    address,
    phone,
    email,
    whatsapp,
    logo_url,
    tagline,
    favicon_url,
    primary_color,
  })

  res.json({ success: true, data: updated })
})
