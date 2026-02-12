'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface BrandingSettings {
  id: number
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
    site_title_en: '',
    site_title_az: '',
    site_title_he: '',
    site_title_ru: '',
    header_title_en: '',
    header_title_az: '',
    header_title_he: '',
    header_title_ru: '',
    banner_title_en: '',
    banner_title_az: '',
    banner_title_he: '',
    banner_title_ru: '',
    banner_description_en: '',
    banner_description_az: '',
    banner_description_he: '',
    banner_description_ru: '',
    logo_url: '',
    tagline: '',
    favicon_url: '',
    primary_color: '',
  })

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'success' | 'error'>('success')

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
              site_title_en: setting.site_title_en || '',
              site_title_az: setting.site_title_az || '',
              site_title_he: setting.site_title_he || '',
              site_title_ru: setting.site_title_ru || '',
              header_title_en: setting.header_title_en || '',
              header_title_az: setting.header_title_az || '',
              header_title_he: setting.header_title_he || '',
              header_title_ru: setting.header_title_ru || '',
              banner_title_en: setting.banner_title_en || '',
              banner_title_az: setting.banner_title_az || '',
              banner_title_he: setting.banner_title_he || '',
              banner_title_ru: setting.banner_title_ru || '',
              banner_description_en: setting.banner_description_en || '',
              banner_description_az: setting.banner_description_az || '',
              banner_description_he: setting.banner_description_he || '',
              banner_description_ru: setting.banner_description_ru || '',
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
      // Include fallback site_title (use English if available, otherwise first available)
      const dataToSave = {
        ...formData,
        site_title: formData.site_title_en || formData.site_title_az || formData.site_title_he || formData.site_title_ru || 'Store',
      }
      
      const response = await apiClient.put('/settings/1', dataToSave)

      if (response.data.success) {
        setBranding(response.data.data)
        setMessage(t('brandingSaved'))
        setModalType('success')
        setShowModal(true)
        setTimeout(() => setShowModal(false), 3000)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || t('failedToSave')
      setError(errorMsg)
      setMessage(errorMsg)
      setModalType('error')
      setShowModal(true)
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

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles[`modal${modalType === 'success' ? 'Success' : 'Error'}`]}`}>
            <div className={styles.modalContent}>
              <div className={styles.modalIcon}>
                {modalType === 'success' ? '✓' : '✕'}
              </div>
              <h2 className={styles.modalTitle}>
                {modalType === 'success' ? tCommon('success') : tCommon('error')}
              </h2>
              <p className={styles.modalMessage}>{message}</p>
              <button
                onClick={() => setShowModal(false)}
                className={styles.modalButton}
              >
                {tCommon('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t('siteTitles')}</h3>
          <p className={styles.sectionDescription}>{t('siteTitlesDescription')}</p>

          <div className={styles.languagesGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="site_title_en">{t('titleEnglish')}</label>
              <input
                type="text"
                id="site_title_en"
                name="site_title_en"
                value={formData.site_title_en}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('titlePlaceholder')}
                maxLength={255}
              />
              <small>{t('titleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="site_title_az">{t('titleAzerbaijani')}</label>
              <input
                type="text"
                id="site_title_az"
                name="site_title_az"
                value={formData.site_title_az}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('titlePlaceholder')}
                maxLength={255}
              />
              <small>{t('titleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="site_title_he">{t('titleHebrew')}</label>
              <input
                type="text"
                id="site_title_he"
                name="site_title_he"
                value={formData.site_title_he}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('titlePlaceholder')}
                maxLength={255}
              />
              <small>{t('titleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="site_title_ru">{t('titleRussian')}</label>
              <input
                type="text"
                id="site_title_ru"
                name="site_title_ru"
                value={formData.site_title_ru}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('titlePlaceholder')}
                maxLength={255}
              />
              <small>{t('titleHint')}</small>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t('headerTitles')}</h3>
          <p className={styles.sectionDescription}>{t('headerTitlesDescription')}</p>

          <div className={styles.languagesGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="header_title_en">{t('headerTitleEnglish')}</label>
              <input
                type="text"
                id="header_title_en"
                name="header_title_en"
                value={formData.header_title_en}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('headerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('headerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="header_title_az">{t('headerTitleAzerbaijani')}</label>
              <input
                type="text"
                id="header_title_az"
                name="header_title_az"
                value={formData.header_title_az}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('headerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('headerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="header_title_he">{t('headerTitleHebrew')}</label>
              <input
                type="text"
                id="header_title_he"
                name="header_title_he"
                value={formData.header_title_he}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('headerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('headerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="header_title_ru">{t('headerTitleRussian')}</label>
              <input
                type="text"
                id="header_title_ru"
                name="header_title_ru"
                value={formData.header_title_ru}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('headerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('headerTitleHint')}</small>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t('bannerTitles')}</h3>
          <p className={styles.sectionDescription}>{t('bannerTitlesDescription')}</p>

          <div className={styles.languagesGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="banner_title_en">{t('bannerTitleEnglish')}</label>
              <input
                type="text"
                id="banner_title_en"
                name="banner_title_en"
                value={formData.banner_title_en}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('bannerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_title_az">{t('bannerTitleAzerbaijani')}</label>
              <input
                type="text"
                id="banner_title_az"
                name="banner_title_az"
                value={formData.banner_title_az}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('bannerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_title_he">{t('bannerTitleHebrew')}</label>
              <input
                type="text"
                id="banner_title_he"
                name="banner_title_he"
                value={formData.banner_title_he}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('bannerTitleHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_title_ru">{t('bannerTitleRussian')}</label>
              <input
                type="text"
                id="banner_title_ru"
                name="banner_title_ru"
                value={formData.banner_title_ru}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerTitlePlaceholder')}
                maxLength={255}
              />
              <small>{t('bannerTitleHint')}</small>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t('bannerDescriptions')}</h3>
          <p className={styles.sectionDescription}>{t('bannerDescriptionsDescription')}</p>

          <div className={styles.languagesGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="banner_description_en">{t('bannerDescriptionEnglish')}</label>
              <textarea
                id="banner_description_en"
                name="banner_description_en"
                value={formData.banner_description_en}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerDescriptionPlaceholder')}
                rows={3}
                maxLength={500}
              />
              <small>{t('bannerDescriptionHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_description_az">{t('bannerDescriptionAzerbaijani')}</label>
              <textarea
                id="banner_description_az"
                name="banner_description_az"
                value={formData.banner_description_az}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerDescriptionPlaceholder')}
                rows={3}
                maxLength={500}
              />
              <small>{t('bannerDescriptionHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_description_he">{t('bannerDescriptionHebrew')}</label>
              <textarea
                id="banner_description_he"
                name="banner_description_he"
                value={formData.banner_description_he}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerDescriptionPlaceholder')}
                rows={3}
                maxLength={500}
              />
              <small>{t('bannerDescriptionHint')}</small>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="banner_description_ru">{t('bannerDescriptionRussian')}</label>
              <textarea
                id="banner_description_ru"
                name="banner_description_ru"
                value={formData.banner_description_ru}
                onChange={handleChange}
                disabled={isSaving}
                placeholder={t('bannerDescriptionPlaceholder')}
                rows={3}
                maxLength={500}
              />
              <small>{t('bannerDescriptionHint')}</small>
            </div>
          </div>
        </div>

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
            <div className={styles.colorPickerWrapper}>
              <div className={styles.colorInputGroup}>
                <div className={styles.colorPickerInput}>
                  <input
                    type="color"
                    id="primary_color_picker"
                    name="primary_color_picker"
                    value={formData.primary_color || '#FF5733'}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, primary_color: e.target.value }))
                    }}
                    disabled={isSaving}
                    title={t('primaryColorHint')}
                  />
                </div>
                <input
                  type="text"
                  id="primary_color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="#FF5733"
                  maxLength={7}
                  className={styles.hexInput}
                />
              </div>
              {formData.primary_color && /^#[0-9A-F]{6}$/i.test(formData.primary_color) && (
                <div
                  className={styles.colorPreviewLarge}
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
