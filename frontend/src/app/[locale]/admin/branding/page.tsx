'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import apiClient from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/config'
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
  logo_url?: string
  tagline?: string
  favicon_url?: string
  primary_color?: string
  created_at: string
  updated_at: string
}

const fontOptions = [
  { label: 'Classic Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Modern Serif', value: '"Palatino Linotype", Palatino, serif' },
  { label: 'Clean Sans', value: '"Segoe UI", Tahoma, Arial, sans-serif' },
  { label: 'Neutral Sans', value: 'Arial, "Helvetica Neue", Helvetica, sans-serif' },
  { label: 'Elegant Sans', value: '"Trebuchet MS", "Lucida Sans Unicode", sans-serif' },
  { label: 'Mono Accent', value: '"Courier New", Courier, monospace' },
]

const alignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

const verticalAlignOptions = [
  { label: 'Top', value: 'top' },
  { label: 'Center', value: 'center' },
  { label: 'Bottom', value: 'bottom' },
]

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
    banner_background_color: '',
    banner_background_image: '',
    banner_title_font_family: '',
    banner_title_font_size: '',
    banner_title_color: '',
    banner_title_align: 'center',
    banner_title_vertical_align: 'center',
    banner_description_font_family: '',
    banner_description_font_size: '',
    banner_description_color: '',
    banner_description_align: 'center',
    banner_description_vertical_align: 'center',
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
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)
  const [uploadingBannerBg, setUploadingBannerBg] = useState(false)
  const [bannerBgUploadProgress, setBannerBgUploadProgress] = useState(0)
  const [bannerBgSource, setBannerBgSource] = useState<'upload' | 'url'>('upload')
  const [logoSource, setLogoSource] = useState<'upload' | 'url'>('upload')
  const [faviconSource, setFaviconSource] = useState<'upload' | 'url'>('upload')
  const bannerBgPreviewUrl = resolveImageUrl(formData.banner_background_image)
  const logoPreviewUrl = resolveImageUrl(formData.logo_url)
  const faviconPreviewUrl = resolveImageUrl(formData.favicon_url)

  // Fetch branding settings on mount
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/settings')
        if (response.data.success) {
          const setting = response.data.data

          if (setting) {
            const initialBannerBgSource = /^https?:\/\//i.test(setting.banner_background_image || '')
              ? 'url'
              : 'upload'
            const initialLogoSource = /^https?:\/\//i.test(setting.logo_url || '')
              ? 'url'
              : 'upload'
            const initialFaviconSource = /^https?:\/\//i.test(setting.favicon_url || '')
              ? 'url'
              : 'upload'

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
              banner_background_color: setting.banner_background_color || '',
              banner_background_image: setting.banner_background_image || '',
              banner_title_font_family: setting.banner_title_font_family || '',
              banner_title_font_size: setting.banner_title_font_size ? String(setting.banner_title_font_size) : '',
              banner_title_color: setting.banner_title_color || '',
              banner_title_align: setting.banner_title_align || 'center',
              banner_title_vertical_align: setting.banner_title_vertical_align || 'center',
              banner_description_font_family: setting.banner_description_font_family || '',
              banner_description_font_size: setting.banner_description_font_size ? String(setting.banner_description_font_size) : '',
              banner_description_color: setting.banner_description_color || '',
              banner_description_align: setting.banner_description_align || 'center',
              banner_description_vertical_align: setting.banner_description_vertical_align || 'center',
              logo_url: setting.logo_url || '',
              tagline: setting.tagline || '',
              favicon_url: setting.favicon_url || '',
              primary_color: setting.primary_color || '',
            })
            setBannerBgSource(initialBannerBgSource)
            setLogoSource(initialLogoSource)
            setFaviconSource(initialFaviconSource)
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (logoSource !== 'upload') return
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', file)

      const response = await apiClient.post('/upload/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        const imageUrl = response.data.data.imageUrl
        setFormData((prev) => ({
          ...prev,
          logo_url: imageUrl,
        }))
      }
    } catch (error) {
      console.error('Logo upload failed:', error)
      setError(t('logoUploadFailed'))
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (faviconSource !== 'upload') return
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFavicon(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', file)

      const response = await apiClient.post('/upload/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        const imageUrl = response.data.data.imageUrl
        setFormData((prev) => ({
          ...prev,
          favicon_url: imageUrl,
        }))
      }
    } catch (error) {
      console.error('Favicon upload failed:', error)
      setError(t('faviconUploadFailed'))
    } finally {
      setUploadingFavicon(false)
    }
  }

  const handleBannerBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (bannerBgSource !== 'upload') return
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingBannerBg(true)
    setBannerBgUploadProgress(0)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('image', file)

      const response = await apiClient.post('/upload/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!event.total) return
          const percent = Math.round((event.loaded * 100) / event.total)
          setBannerBgUploadProgress(percent)
        },
      })

      if (response.data.success) {
        const imageUrl = response.data.data.imageUrl
        setFormData((prev: any) => ({
          ...prev,
          banner_background_image: imageUrl,
        }))
      }
    } catch (error) {
      console.error('Banner background upload failed:', error)
      setError(t('bannerBgUploadFailed'))
    } finally {
      setUploadingBannerBg(false)
      setBannerBgUploadProgress(0)
    }
  }

  const handleBannerBgSourceChange = (source: 'upload' | 'url') => {
    setBannerBgSource(source)
    setFormData((prev) => ({
      ...prev,
      banner_background_image: '',
    }))
  }

  const handleLogoSourceChange = (source: 'upload' | 'url') => {
    setLogoSource(source)
    setFormData((prev) => ({
      ...prev,
      logo_url: '',
    }))
  }

  const handleFaviconSourceChange = (source: 'upload' | 'url') => {
    setFaviconSource(source)
    setFormData((prev) => ({
      ...prev,
      favicon_url: '',
    }))
  }

  const handleDeleteBannerBg = () => {
    if (window.confirm(t('confirmDeleteBannerBg'))) {
      setFormData((prev) => ({
        ...prev,
        banner_background_image: '',
      }))
    }
  }

  const handleDeleteLogo = () => {
    if (window.confirm(t('confirmDeleteLogo'))) {
      setFormData((prev) => ({
        ...prev,
        logo_url: '',
      }))
    }
  }

  const handleDeleteFavicon = () => {
    if (window.confirm(t('confirmDeleteFavicon'))) {
      setFormData((prev) => ({
        ...prev,
        favicon_url: '',
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const parsedBannerTitleFontSize = Number.parseInt(formData.banner_title_font_size, 10)
      const parsedBannerDescriptionFontSize = Number.parseInt(formData.banner_description_font_size, 10)

      // Include fallback site_title (use English if available, otherwise first available)
      const dataToSave = {
        ...formData,
        banner_title_font_size: Number.isFinite(parsedBannerTitleFontSize) ? parsedBannerTitleFontSize : null,
        banner_description_font_size: Number.isFinite(parsedBannerDescriptionFontSize) ? parsedBannerDescriptionFontSize : null,
        site_title: formData.site_title_en || formData.site_title_az || formData.site_title_he || formData.site_title_ru || 'Store',
      }
      
      const response = await apiClient.put('/settings/1', dataToSave)

      if (response.data.success) {
        setBranding(response.data.data)
        setMessage(t('brandingSaved'))
        setModalType('success')
        setShowModal(true)
        setTimeout(() => setShowModal(false), 3000)
        
        // Trigger dynamic styles update
        window.dispatchEvent(new CustomEvent('brandingUpdated', { 
          detail: { primary_color: response.data.data.primary_color }
        }))
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
          <h3 className={styles.sectionTitle}>{t('bannerTextStyles')}</h3>
          <p className={styles.sectionDescription}>{t('bannerTextStylesDescription')}</p>

          <div className={styles.styleGrid}>
            <div className={styles.styleCard}>
              <div className={styles.styleCardTitle}>{t('bannerTitleStyle')}</div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_title_font_family">{t('bannerFontFamily')}</label>
                <select
                  id="banner_title_font_family"
                  name="banner_title_font_family"
                  value={formData.banner_title_font_family}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  <option value="">{t('bannerFontFamilyDefault')}</option>
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_title_font_size">{t('bannerFontSize')}</label>
                <input
                  type="number"
                  id="banner_title_font_size"
                  name="banner_title_font_size"
                  value={formData.banner_title_font_size}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder={t('bannerFontSizePlaceholder')}
                  min={12}
                  max={120}
                />
                <small>{t('bannerFontSizeHint')}</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_title_color">{t('bannerTextColor')}</label>
                <div className={styles.colorInputGroup}>
                  <div className={styles.colorPickerInput}>
                    <input
                      type="color"
                      id="banner_title_color_picker"
                      name="banner_title_color_picker"
                      value={formData.banner_title_color || '#ffffff'}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, banner_title_color: e.target.value }))
                      }}
                      disabled={isSaving}
                      title={t('bannerTextColor')}
                    />
                  </div>
                  <input
                    type="text"
                    id="banner_title_color"
                    name="banner_title_color"
                    value={formData.banner_title_color}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="#ffffff"
                    maxLength={7}
                    className={styles.hexInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_title_align">{t('bannerTextAlign')}</label>
                <select
                  id="banner_title_align"
                  name="banner_title_align"
                  value={formData.banner_title_align}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  {alignOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`align${option.label}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_title_vertical_align">{t('bannerTextVerticalAlign')}</label>
                <select
                  id="banner_title_vertical_align"
                  name="banner_title_vertical_align"
                  value={formData.banner_title_vertical_align}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  {verticalAlignOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`align${option.label}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.styleCard}>
              <div className={styles.styleCardTitle}>{t('bannerDescriptionStyle')}</div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_description_font_family">{t('bannerFontFamily')}</label>
                <select
                  id="banner_description_font_family"
                  name="banner_description_font_family"
                  value={formData.banner_description_font_family}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  <option value="">{t('bannerFontFamilyDefault')}</option>
                  {fontOptions.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_description_font_size">{t('bannerFontSize')}</label>
                <input
                  type="number"
                  id="banner_description_font_size"
                  name="banner_description_font_size"
                  value={formData.banner_description_font_size}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder={t('bannerFontSizePlaceholder')}
                  min={10}
                  max={80}
                />
                <small>{t('bannerFontSizeHint')}</small>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_description_color">{t('bannerTextColor')}</label>
                <div className={styles.colorInputGroup}>
                  <div className={styles.colorPickerInput}>
                    <input
                      type="color"
                      id="banner_description_color_picker"
                      name="banner_description_color_picker"
                      value={formData.banner_description_color || '#d4d4d4'}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, banner_description_color: e.target.value }))
                      }}
                      disabled={isSaving}
                      title={t('bannerTextColor')}
                    />
                  </div>
                  <input
                    type="text"
                    id="banner_description_color"
                    name="banner_description_color"
                    value={formData.banner_description_color}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="#d4d4d4"
                    maxLength={7}
                    className={styles.hexInput}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_description_align">{t('bannerTextAlign')}</label>
                <select
                  id="banner_description_align"
                  name="banner_description_align"
                  value={formData.banner_description_align}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  {alignOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`align${option.label}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="banner_description_vertical_align">{t('bannerTextVerticalAlign')}</label>
                <select
                  id="banner_description_vertical_align"
                  name="banner_description_vertical_align"
                  value={formData.banner_description_vertical_align}
                  onChange={handleChange}
                  disabled={isSaving}
                >
                  {verticalAlignOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(`align${option.label}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>{t('bannerStyling')}</h3>
          <p className={styles.sectionDescription}>{t('bannerStylingDescription')}</p>

          <div className={styles.formGroup}>
            <label htmlFor="banner_background_color">{t('bannerBackgroundColor')}</label>
            <div className={styles.colorPickerWrapper}>
              <div className={styles.colorInputGroup}>
                <div className={styles.colorPickerInput}>
                  <input
                    type="color"
                    id="banner_background_color_picker"
                    name="banner_background_color_picker"
                    value={formData.banner_background_color || '#f5f5f5'}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, banner_background_color: e.target.value }))
                    }}
                    disabled={isSaving}
                    title={t('bannerBackgroundColorHint')}
                  />
                </div>
                <input
                  type="text"
                  id="banner_background_color"
                  name="banner_background_color"
                  value={formData.banner_background_color}
                  onChange={handleChange}
                  disabled={isSaving}
                  placeholder="#f5f5f5"
                  maxLength={7}
                  className={styles.hexInput}
                />
              </div>
              {formData.banner_background_color && /^#[0-9A-F]{6}$/i.test(formData.banner_background_color) && (
                <div 
                  className={styles.colorPreview} 
                  style={{ backgroundColor: formData.banner_background_color }}
                ></div>
              )}
            </div>
            <small>{t('bannerBackgroundColorHint')}</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="banner_background_image">{t('bannerBackgroundImage')}</label>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
                  {t('bannerBgSourceLabel')}
                </span>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="banner_bg_source"
                      value="upload"
                      checked={bannerBgSource === 'upload'}
                      onChange={() => handleBannerBgSourceChange('upload')}
                      disabled={isSaving}
                    />
                    {t('bannerBgSourceUpload')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="banner_bg_source"
                      value="url"
                      checked={bannerBgSource === 'url'}
                      onChange={() => handleBannerBgSourceChange('url')}
                      disabled={isSaving}
                    />
                    {t('bannerBgSourceUrl')}
                  </label>
                </div>
                <small style={{ display: 'block', color: '#6b7280', marginTop: '0.4rem' }}>
                  {t('bannerBgSourceHint')}
                </small>
              </div>

              {bannerBgSource === 'upload' && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      id="banner_bg_upload"
                      accept="image/*"
                      onChange={handleBannerBgUpload}
                      disabled={uploadingBannerBg || isSaving}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    {uploadingBannerBg && <p style={{ fontSize: '0.9rem', color: '#3498db', margin: '0.5rem 0' }}>{tCommon('uploading')}</p>}
                    {uploadingBannerBg && (
                      <div className={styles.uploadProgressWrap}>
                        <div className={styles.uploadProgress}>
                          <div
                            className={styles.uploadProgressBar}
                            style={{ width: `${bannerBgUploadProgress}%` }}
                          />
                        </div>
                        <span className={styles.uploadProgressText}>
                          {t('uploadProgress')} {bannerBgUploadProgress}%
                        </span>
                      </div>
                    )}
                    <small style={{ display: 'block', color: '#60a5fa', marginBottom: '0.75rem' }}>
                      {t('bannerBgResolution')}
                    </small>
                  </div>
                </div>
              )}

              {bannerBgSource === 'url' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label htmlFor="banner_background_image" style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}>
                    {t('bannerBgSourceUrl')}
                  </label>
                  <input
                    type="url"
                    id="banner_background_image"
                    name="banner_background_image"
                    value={formData.banner_background_image}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="https://example.com/banner-bg.jpg"
                  />
                </div>
              )}
            </div>
            <small>{t('bannerBackgroundImageHint')}</small>
            {bannerBgPreviewUrl && (
              <div className={styles.preview}>
                <img src={bannerBgPreviewUrl} alt="Banner Background Preview" />
                <button
                  type="button"
                  onClick={handleDeleteBannerBg}
                  className={styles.deleteButton}
                  disabled={isSaving}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {t('deleteBannerBg')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label htmlFor="logo_url">{t('logoUrl')}</label>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
                  {t('logoSourceLabel')}
                </span>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="logo_source"
                      value="upload"
                      checked={logoSource === 'upload'}
                      onChange={() => handleLogoSourceChange('upload')}
                      disabled={isSaving}
                    />
                    {t('logoSourceUpload')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="logo_source"
                      value="url"
                      checked={logoSource === 'url'}
                      onChange={() => handleLogoSourceChange('url')}
                      disabled={isSaving}
                    />
                    {t('logoSourceUrl')}
                  </label>
                </div>
                <small style={{ display: 'block', color: '#6b7280', marginTop: '0.4rem' }}>
                  {t('logoSourceHint')}
                </small>
              </div>

              {logoSource === 'upload' && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      id="logo_upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo || isSaving}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    {uploadingLogo && (
                      <p style={{ fontSize: '0.9rem', color: '#3498db', margin: '0.5rem 0' }}>
                        {tCommon('uploading')}
                      </p>
                    )}
                    <small style={{ display: 'block', color: '#60a5fa', marginBottom: '0.75rem' }}>
                      {t('logoResolution')}
                    </small>
                  </div>
                </div>
              )}

              {logoSource === 'url' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label
                    htmlFor="logo_url"
                    style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}
                  >
                    {t('logoSourceUrl')}
                  </label>
                  <input
                    type="url"
                    id="logo_url"
                    name="logo_url"
                    value={formData.logo_url}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              )}
            </div>
            <small>{t('logoUrlHint')}</small>
            {logoPreviewUrl && (
              <div className={styles.preview}>
                <img src={logoPreviewUrl} alt="Logo Preview" />
                <button
                  type="button"
                  onClick={handleDeleteLogo}
                  className={styles.deleteButton}
                  disabled={isSaving}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {t('deleteLogo')}
                </button>
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
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', color: '#374151', marginBottom: '0.5rem' }}>
                  {t('faviconSourceLabel')}
                </span>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="favicon_source"
                      value="upload"
                      checked={faviconSource === 'upload'}
                      onChange={() => handleFaviconSourceChange('upload')}
                      disabled={isSaving}
                    />
                    {t('faviconSourceUpload')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                      type="radio"
                      name="favicon_source"
                      value="url"
                      checked={faviconSource === 'url'}
                      onChange={() => handleFaviconSourceChange('url')}
                      disabled={isSaving}
                    />
                    {t('faviconSourceUrl')}
                  </label>
                </div>
                <small style={{ display: 'block', color: '#6b7280', marginTop: '0.4rem' }}>
                  {t('faviconSourceHint')}
                </small>
              </div>

              {faviconSource === 'upload' && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      id="favicon_upload"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      disabled={uploadingFavicon || isSaving}
                      style={{ marginBottom: '0.5rem' }}
                    />
                    {uploadingFavicon && (
                      <p style={{ fontSize: '0.9rem', color: '#3498db', margin: '0.5rem 0' }}>
                        {tCommon('uploading')}
                      </p>
                    )}
                    <small style={{ display: 'block', color: '#60a5fa', marginBottom: '0.75rem' }}>
                      {t('faviconResolution')}
                    </small>
                  </div>
                </div>
              )}

              {faviconSource === 'url' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label
                    htmlFor="favicon_url"
                    style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginBottom: '0.5rem' }}
                  >
                    {t('faviconSourceUrl')}
                  </label>
                  <input
                    type="url"
                    id="favicon_url"
                    name="favicon_url"
                    value={formData.favicon_url}
                    onChange={handleChange}
                    disabled={isSaving}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              )}
            </div>
            <small>{t('faviconUrlHint')}</small>
            {faviconPreviewUrl && (
              <div className={styles.preview}>
                <img src={faviconPreviewUrl} alt="Favicon Preview" style={{ width: '32px', height: '32px' }} />
                <button
                  type="button"
                  onClick={handleDeleteFavicon}
                  className={styles.deleteButton}
                  disabled={isSaving}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  {t('deleteFavicon')}
                </button>
              </div>
            )}
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
