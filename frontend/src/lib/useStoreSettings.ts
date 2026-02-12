'use client'

import { useState, useEffect } from 'react'

export interface StoreSettings {
  id?: number
  site_title?: string
  top_description?: string
  banner_url?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  setup_config?: any
  created_at?: string
  updated_at?: string
}

/**
 * Hook to fetch store settings from database (public endpoint)
 * Returns empty values if no settings configured yet
 */
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setSettings(data.data)
          }
        }
      } catch (error) {
        console.error('Could not fetch store settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    // Return actual values or empty strings (no defaults)
    storeName: settings?.site_title || '',
    storeDescription: settings?.top_description || '',
    storeEmail: settings?.email || '',
    storePhone: settings?.phone || '',
    storeWhatsapp: settings?.whatsapp || '',
    storeAddress: settings?.address || '',
    bannerUrl: settings?.banner_url || '',
  }
}
