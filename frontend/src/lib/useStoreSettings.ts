'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'

export interface StoreSettings {
  id?: number
  site_title?: string
  site_title_en?: string
  site_title_az?: string
  site_title_he?: string
  site_title_ru?: string
  top_description?: string
  banner_url?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
  logo_url?: string
  tagline?: string
  favicon_url?: string
  primary_color?: string
  setup_config?: any
  created_at?: string
  updated_at?: string
}

/**
 * Hook to fetch store settings from database (public endpoint)
 * Returns empty values if no settings configured yet
 */
export function useStoreSettings() {
  const locale = useLocale()
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

  // Map locale to field suffix
  const getLocaleFieldSuffix = (locale: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'en',
      'az': 'az',
      'he': 'he',
      'ru': 'ru',
    }
    return localeMap[locale] || 'en'
  }

  // Get locale-specific store name
  const getStoreName = (): string => {
    if (!settings) return ''
    
    const suffix = getLocaleFieldSuffix(locale)
    const multilingualField = `site_title_${suffix}` as keyof StoreSettings
    
    // Try locale-specific field first
    if (settings[multilingualField]) {
      return settings[multilingualField] as string
    }
    
    // Fall back to general site_title
    if (settings.site_title) {
      return settings.site_title
    }
    
    return ''
  }

  return {
    settings,
    loading,
    // Return actual values or empty strings (no defaults)
    storeName: getStoreName(),
    storeDescription: settings?.top_description || '',
    storeEmail: settings?.email || '',
    storePhone: settings?.phone || '',
    storeWhatsapp: settings?.whatsapp || '',
    storeAddress: settings?.address || '',
    bannerUrl: settings?.banner_url || '',
    logoUrl: settings?.logo_url || '',
    tagline: settings?.tagline || '',
    faviconUrl: settings?.favicon_url || '',
    primaryColor: settings?.primary_color || '',
  }
}
