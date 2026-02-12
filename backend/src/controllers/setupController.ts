import { Request, Response } from 'express'
import { asyncHandler } from '@/middleware/errorHandler'
import { updateSettings, getSettings } from '@/models/settings'
import { query } from '@/config/database'

export const getSetupConfig = asyncHandler(async (req: Request, res: Response) => {
  console.log('Getting setup configuration')
  
  try {
    const settings = await getSettings()
    console.log('Retrieved settings:', settings)
    
    // Return setup config if it exists, otherwise return basic settings
    res.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('Error retrieving setup config:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve setup configuration',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

export const completeSetup = asyncHandler(async (req: Request, res: Response) => {
  console.log('Setup endpoint hit with body:', JSON.stringify(req.body, null, 2))
  
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

  // Validate required fields
  if (!storeName || !storeEmail) {
    console.log('Validation failed: missing required fields')
    return res.status(400).json({
      success: false,
      message: 'Store name and email are required',
    })
  }

  try {
    // Update store settings with basic information
    const settingsData = {
      site_title: storeName,
      top_description: storeDescription,
      email: storeEmail,
      phone: storePhone,
      whatsapp: storeWhatsapp,
      address: storeAddress,
    }

    console.log('Updating store settings:', settingsData)
    await updateSettings(settingsData)
    console.log('Store settings updated successfully')

    // Store colors and features in a setup_config JSON column
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

      console.log('Updating setup config:', colorConfig)
      // Try to update or insert setup config
      await query(
        `INSERT INTO store_settings (id, setup_config, updated_at)
         VALUES (1, $1, CURRENT_TIMESTAMP)
         ON CONFLICT (id) DO UPDATE
         SET setup_config = $1, updated_at = CURRENT_TIMESTAMP`,
        [JSON.stringify(colorConfig)]
      )
      console.log('Setup config saved successfully')
    } catch (configError) {
      console.log('Setup config save failed (not critical):', configError)
      // If column doesn't exist, we can still continue
    }

    console.log('Setup completed successfully')
    return res.json({
      success: true,
      message: 'Setup completed successfully',
      data: {
        storeName,
        email: storeEmail,
      },
    })
  } catch (error) {
    console.error('Setup error:', error)
    return res.status(500).json({
      success: false,
      message: 'Setup failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
