'use client'

import { useState, useEffect } from 'react'

export interface SetupConfig {
  storeName?: string
  storeDescription?: string
  storeEmail?: string
  storePhone?: string
  storeWhatsapp?: string
  storeAddress?: string
  primaryColor?: string
  primaryHoverColor?: string
  secondaryColor?: string
  textColor?: string
  footerBgColor?: string
  currencies?: string
  defaultCurrency?: string
  categories?: Array<{ name: string; description: string; icon: string }>
  acceptPayment?: boolean
  offerShipping?: boolean
}

export interface StoreSettings {
  id?: number
  site_title?: string
  top_description?: string
  banner_url?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  setup_config?: string | SetupConfig
  created_at?: string
  updated_at?: string
}

export function useSetupConfig() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [setupConfig, setSetupConfig] = useState<SetupConfig | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await fetch('/api/admin/setup', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setSettings(data.data)

            // Parse setup_config if it exists
            if (data.data.setup_config) {
              const config = typeof data.data.setup_config === 'string'
                ? JSON.parse(data.data.setup_config)
                : data.data.setup_config
              setSetupConfig(config)
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch setup config:', error)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return {
    settings,
    setupConfig,
    loading,
    storeName: setupConfig?.storeName || settings?.site_title || 'Store',
    storeDescription: setupConfig?.storeDescription || settings?.top_description,
    storeEmail: setupConfig?.storeEmail || settings?.email,
    storePhone: setupConfig?.storePhone || settings?.phone,
  }
}
