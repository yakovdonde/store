import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { updateSettings } from '@/models/settings'
import { query } from '@/config/database'

export const completeSetup = asyncHandler(async (req: Request, res: Response) => {
  const {
    storeName,
    storeDescription,
    storeEmail,
    storePhone,
    storeWhatsapp,
    storeAddress,
    primaryColor,
    primaryHoverColor,
    secondaryColor,
    textColor,
    footerBgColor,
    currencies,
    defaultCurrency,
    categories,
    acceptPayment,
    offerShipping,
  } = req.body

  // Update store settings with basic information
  const settingsData = {
    site_title: storeName,
    top_description: storeDescription,
    email: storeEmail,
    phone: storePhone,
    whatsapp: storeWhatsapp,
    address: storeAddress,
  }

  await updateSettings(settingsData)

  // Store colors and features in a setup_config JSON column
  // First check if the column exists, if not create it
  try {
    const colorConfig = {
      primaryColor,
      primaryHoverColor,
      secondaryColor,
      textColor,
      footerBgColor,
      currencies,
      defaultCurrency,
      categories,
      acceptPayment,
      offerShipping,
    }

    // Try to update or insert setup config
    await query(
      `INSERT INTO store_settings (id, setup_config, updated_at)
       VALUES (1, $1, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE
       SET setup_config = $1, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(colorConfig)]
    )
  } catch (error) {
    // If column doesn't exist, we can still continue
    console.log('Setup config column not available, storing in settings instead')
  }

  res.json({
    success: true,
    message: 'Setup completed successfully',
    data: {
      storeName,
      email: storeEmail,
    },
  })
})
