'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './ProductForm.module.css'
import apiClient from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/config'

interface Product {
  id: number
  title: string
  price: number
  price_usd?: number
  price_eur?: number
  price_ils?: number
  price_azn?: number
  description: string
  category_id: number
  image_url?: string
  item_order_index: number
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
  parent_id?: number | null
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export default function ProductForm({
  product,
  categories,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const t = useTranslations('adminProducts')
  
  const [formData, setFormData] = useState({
    title: '',
    price_usd: 0,
    price_eur: 0,
    price_ils: 0,
    price_azn: 0,
    description: '',
    category_id: '',
    image_url: '',
  })

  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        price_usd: product.price_usd ?? product.price ?? 0,
        price_eur: product.price_eur ?? 0,
        price_ils: product.price_ils ?? 0,
        price_azn: product.price_azn ?? 0,
        description: product.description,
        category_id: product.category_id.toString(),
        image_url: product.image_url || '',
      })
      if (product.image_url) {
        setPreviewImage(resolveImageUrl(product.image_url))
      }
    }
  }, [product])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const isPriceField = name.startsWith('price_')
    setFormData((prev) => ({
      ...prev,
      [name]: isPriceField ? parseFloat(value) || 0 : value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
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
          image_url: imageUrl,
        }))
        setPreviewImage(resolveImageUrl(imageUrl))
      }
    } catch (error) {
      console.error('Image upload failed:', error)
      alert('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      category_id: parseInt(formData.category_id),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">{t('productTitle')}</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
          placeholder={t('titlePlaceholder')}
        />
      </div>

      <div className={styles.formGroup}>
        <label>{t('prices')}</label>
        <div className={styles.priceGrid}>
          <div className={styles.priceField}>
            <label htmlFor="price_usd">USD</label>
            <input
              type="number"
              id="price_usd"
              name="price_usd"
              value={formData.price_usd}
              onChange={handleChange}
              step="0.01"
              required
              disabled={isLoading}
              min="0"
            />
          </div>
          <div className={styles.priceField}>
            <label htmlFor="price_eur">EUR</label>
            <input
              type="number"
              id="price_eur"
              name="price_eur"
              value={formData.price_eur}
              onChange={handleChange}
              step="0.01"
              disabled={isLoading}
              min="0"
            />
          </div>
          <div className={styles.priceField}>
            <label htmlFor="price_ils">ILS</label>
            <input
              type="number"
              id="price_ils"
              name="price_ils"
              value={formData.price_ils}
              onChange={handleChange}
              step="0.01"
              disabled={isLoading}
              min="0"
            />
          </div>
          <div className={styles.priceField}>
            <label htmlFor="price_azn">AZN</label>
            <input
              type="number"
              id="price_azn"
              name="price_azn"
              value={formData.price_azn}
              onChange={handleChange}
              step="0.01"
              disabled={isLoading}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="category_id">{t('category')}</label>
        <select
          id="category_id"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          disabled={isLoading}
        >
          <option value="">{t('selectCategory')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image_upload">{t('productImage')}</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <input
              type="file"
              id="image_upload"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage || isLoading}
              style={{ marginBottom: '0.5rem' }}
            />
            {uploadingImage && <p style={{ fontSize: '0.9rem', color: '#3498db' }}>{t('uploading')}</p>}
            {formData.image_url && (
              <p style={{ fontSize: '0.85rem', color: '#27ae60' }}>{t('imageUploaded')}</p>
            )}
          </div>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #ecf0f1',
              }}
            />
          )}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">{t('description')}</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          disabled={isLoading}
          placeholder={t('descriptionPlaceholder')}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading || uploadingImage}>
        {isLoading ? t('saving') : product ? t('updateProduct') : t('createProduct')}
      </button>
    </form>
  )
}
