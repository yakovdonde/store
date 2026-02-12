'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface BrandingSettings {
  id: number
  logo_url?: string
  tagline?: string
  favicon_url?: string
  primary_color?: string
  created_at: string
  updated_at: string
}

export default function BrandingPage() {
  const t = useTranslations('adminBranding')
  const tCommon = useTranslations('common')
  const [branding, setBranding] = useState<BrandingSettings | null>(null)
  const [formData, setFormData] = useState({
    logo_url: '',
    tagline: '',
    favicon_url: '',
    primary_color: '',
  })

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch branding settings on mount
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/settings')
        if (response.data.success) {
          const setting = response.data.data

          if (setting) {
            setBranding(setting)
            setFormData({
              logo_url: setting.logo_url || '',
              tagline: setting.tagline || '',
              favicon_url: setting.favicon_url || '',
              primary_color: setting.primary_color || '',
            })
          }
        }
      } catch (err: any) {
        setError(t('failedToLoad'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBranding()
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
      const response = await apiClient.put('/settings/1', formData)

      if (response.data.success) {
        setBranding(response.data.data)
        setMessage(t('brandingSaved'))
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
      <p className={styles.description}>{t('description')}</p>

      {message && (
        <div className={styles.successMessage}>{message}</div>
      )}
      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label htmlFor="logo_url">{t('logoUrl')}</label>
            <input
              type="url"
              id="logo_url"
              name="logo_url"
              value={formData.logo_url}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="https://example.com/logo.png"
            />
            <small>{t('logoUrlHint')}</small>
            {formData.logo_url && (
              <div className={styles.preview}>
                <img src={formData.logo_url} alt="Logo Preview" />
              </div>
            )}
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
              placeholder={t('taglinePlaceholder')}
              maxLength={255}
            />
            <small>{t('taglineHint')}</small>
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
              placeholder="https://example.com/favicon.ico"
            />
            <small>{t('faviconUrlHint')}</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="primary_color">{t('primaryColor')}</label>
            <div className={styles.colorInputGroup}>
              <input
                type="text"
                id="primary_color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleChange}
                disabled={isSaving}
                placeholder="#FF5733"
                maxLength={7}
              />
              {formData.primary_color && /^#[0-9A-F]{6}$/i.test(formData.primary_color) && (
                <div
                  className={styles.colorPreview}
                  style={{ backgroundColor: formData.primary_color }}
                  title={formData.primary_color}
                />
              )}
            </div>
            <small>{t('primaryColorHint')}</small>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSaving}
        >
          {isSaving ? t('saving') : t('saveBranding')}
        </button>
      </form>
    </div>
  )
}
