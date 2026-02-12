'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface Settings {
  id: number
  site_title: string
  banner_url?: string
  top_description?: string
  address?: string
  phone?: string
  email?: string
  whatsapp?: string
  logo_url?: string
  tagline?: string
  favicon_url?: string
  primary_color?: string
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const t = useTranslations('adminSettings')
  const tCommon = useTranslations('common')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [formData, setFormData] = useState({
    site_title: '',
    banner_url: '',
    top_description: '',
    logo_url: '',
    tagline: '',
    favicon_url: '',
    primary_color: '',
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
  })

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/settings')
        if (response.data.success) {
          const setting = response.data.data
          
          // Handle both null (empty store) and existing settings
          if (setting) {
            setSettings(setting)
            setFormData({
              site_title: setting.site_title || '',
              banner_url: setting.banner_url || '',
              top_description: setting.top_description || '',
              logo_url: setting.logo_url || '',
              tagline: setting.tagline || '',
              favicon_url: setting.favicon_url || '',
              primary_color: setting.primary_color || '',
              address: setting.address || '',
              phone: setting.phone || '',
              email: setting.email || '',
              whatsapp: setting.whatsapp || '',
            })
          }
          // If setting is null, keep empty formData - user will create new settings
        }
      } catch (err: any) {
        setError(t('failedToLoad'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      let response
      if (settings) {
        // Update existing settings
        response = await apiClient.put(`/settings/${settings.id}`, formData)
      } else {
        // Create new settings (for empty stores)
        response = await apiClient.post('/settings', formData)
      }
      
      if (response.data.success) {
        setSettings(response.data.data)
        setMessage(t('settingsSaved'))
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || t('failedToSave'))
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>{t('title')}</h1>
        <p>{tCommon('loading')}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>{t('title')}</h1>
      
      {!settings && (
        <div style={{ color: '#2980b9', padding: '1rem', marginBottom: '1rem', backgroundColor: '#d6eaf8', borderRadius: '4px' }}>
          ℹ️ {t('noSettingsYet')}
        </div>
      )}

      {message && <div style={{ color: '#27ae60', padding: '1rem', marginBottom: '1rem', backgroundColor: '#d5f4e6', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: '#c0392b', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fadbd8', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2>{t('storeInformation')}</h2>

          <div className={styles.formGroup}>
            <label htmlFor="site_title">{t('storeTitle')}</label>
            <input
              type="text"
              id="site_title"
              name="site_title"
              value={formData.site_title}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="top_description">{t('storeDescription')}</label>
            <textarea
              id="top_description"
              name="top_description"
              value={formData.top_description}
              onChange={handleChange}
              rows={3}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="banner_url">{t('bannerImageUrl')}</label>
            <input
              type="url"
              id="banner_url"
              name="banner_url"
              value={formData.banner_url}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('siteBranding')}</h2>

          <div className={styles.formGroup}>
            <label htmlFor="logo_url">{t('logoUrl')}</label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tagline">{t('tagline')}</label>
            <input
              type="text"
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="Your store's tagline or motto"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="favicon_url">{t('faviconUrl')}</label>
            <input
              type="url"
              id="favicon_url"
              name="favicon_url"
              value={formData.favicon_url}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="primary_color">{t('primaryColor')}</label>
            <input
              type="text"
              id="primary_color"
              name="primary_color"
              value={formData.primary_color}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="#FF5733"
            />
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#555' }}>
              {t('primaryColorDescription')}
            </small>
          </div>
        </section>

        <section className={styles.section}>
          <h2>{t('contactInformation')}</h2>

          <div className={styles.formGroup}>
            <label htmlFor="address">{t('address')}</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">{t('phone')}</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">{t('email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSaving}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="whatsapp">{t('whatsapp')}</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              disabled={isSaving}
              placeholder={t('whatsappPlaceholder')}
            />
          </div>
        </section>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSaving}
        >
          {isSaving ? t('saving') : t('saveSettings')}
        </button>
      </form>
    </div>
  )
}

