'use client'

import React, { useState, useEffect } from 'react'
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
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [formData, setFormData] = useState({
    site_title: '',
    banner_url: '',
    top_description: '',
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
              address: setting.address || '',
              phone: setting.phone || '',
              email: setting.email || '',
              whatsapp: setting.whatsapp || '',
            })
          }
          // If setting is null, keep empty formData - user will create new settings
        }
      } catch (err: any) {
        setError('Failed to load settings')
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
        setMessage('Settings saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Store Settings</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1>Store Settings</h1>
      
      {!settings && (
        <div style={{ color: '#2980b9', padding: '1rem', marginBottom: '1rem', backgroundColor: '#d6eaf8', borderRadius: '4px' }}>
          ℹ️ Your store has no settings yet. Fill out the form below to configure your store.
        </div>
      )}

      {message && <div style={{ color: '#27ae60', padding: '1rem', marginBottom: '1rem', backgroundColor: '#d5f4e6', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ color: '#c0392b', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fadbd8', borderRadius: '4px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2>Store Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="site_title">Store Title</label>
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
            <label htmlFor="top_description">Store Description</label>
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
            <label htmlFor="banner_url">Banner Image URL</label>
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
          <h2>Contact Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
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
            <label htmlFor="phone">Phone</label>
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
            <label htmlFor="email">Email</label>
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
            <label htmlFor="whatsapp">WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              disabled={isSaving}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </section>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

