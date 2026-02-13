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
  header_title_en?: string
  header_title_az?: string
  header_title_he?: string
  header_title_ru?: string
  banner_title_en?: string
  banner_title_az?: string
  banner_title_he?: string
  banner_title_ru?: string
  banner_description_en?: string
  banner_description_az?: string
  banner_description_he?: string
  banner_description_ru?: string
  lang_label_en?: string
  lang_label_ru?: string
  lang_label_he?: string
  top_description?: string
  banner_url?: string
  banner_background_color?: string
  banner_background_image?: string
  banner_title_font_family?: string
  banner_title_font_size?: number
  banner_title_color?: string
  banner_title_align?: string
  banner_title_vertical_align?: string
  banner_description_font_family?: string
  banner_description_font_size?: number
  banner_description_color?: string
  banner_description_align?: string
  banner_description_vertical_align?: string
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
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Add cache-busting to ensure fresh data
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/settings?_t=${timestamp}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
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
  }, [refetchTrigger])

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

  // Get locale-specific header title (top-left display)
  const getHeaderTitle = (): string => {
    if (!settings) return ''
    
    const suffix = getLocaleFieldSuffix(locale)
    const multilingualField = `header_title_${suffix}` as keyof StoreSettings
    
    // Try locale-specific header title first
    if (settings[multilingualField]) {
      return settings[multilingualField] as string
    }
    
    // Fall back to store name if no header title set
    return getStoreName()
  }

  // Get locale-specific banner title (hero banner center display)
  const getBannerTitle = (): string => {
    if (!settings) return ''
    
    const suffix = getLocaleFieldSuffix(locale)
    const multilingualField = `banner_title_${suffix}` as keyof StoreSettings
    
    // Return locale-specific banner title or empty string if not set
    if (settings[multilingualField]) {
      return settings[multilingualField] as string
    }
    
    // Return empty string if no banner title set
    return ''
  }

  // Get locale-specific banner description (hero banner description)
  const getBannerDescription = (): string => {
    if (!settings) return ''
    
    const suffix = getLocaleFieldSuffix(locale)
    const multilingualField = `banner_description_${suffix}` as keyof StoreSettings
    
    // Return locale-specific banner description or empty string if not set
    if (settings[multilingualField]) {
      return settings[multilingualField] as string
    }
    
    // Return empty string if no banner description set
    return ''
  }

  // Function to manually refetch settings
  const refetch = () => {
    setLoading(true)
    setRefetchTrigger((prev: number) => prev + 1)
  }

  return {
    settings,
    loading,
    refetch,
    // Return actual values or empty strings (no defaults)
    storeName: getStoreName(),
    headerTitle: getHeaderTitle(),
    bannerTitle: getBannerTitle(),
    bannerDescription: getBannerDescription(),
    storeDescription: settings?.top_description || '',
    storeEmail: settings?.email || '',
    storePhone: settings?.phone || '',
    storeWhatsapp: settings?.whatsapp || '',
    storeAddress: settings?.address || '',
    bannerUrl: settings?.banner_url || '',
    bannerBackgroundColor: settings?.banner_background_color || '',
    bannerBackgroundImage: settings?.banner_background_image || '',
    bannerTitleFontFamily: settings?.banner_title_font_family || '',
    bannerTitleFontSize: settings?.banner_title_font_size || 0,
    bannerTitleColor: settings?.banner_title_color || '',
    bannerTitleAlign: settings?.banner_title_align || '',
    bannerTitleVerticalAlign: settings?.banner_title_vertical_align || '',
    bannerDescriptionFontFamily: settings?.banner_description_font_family || '',
    bannerDescriptionFontSize: settings?.banner_description_font_size || 0,
    bannerDescriptionColor: settings?.banner_description_color || '',
    bannerDescriptionAlign: settings?.banner_description_align || '',
    bannerDescriptionVerticalAlign: settings?.banner_description_vertical_align || '',
    logoUrl: settings?.logo_url || '',
    tagline: settings?.tagline || '',
    faviconUrl: settings?.favicon_url || '',
    primaryColor: settings?.primary_color || '',
  }
}
