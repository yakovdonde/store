'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './CategoryForm.module.css'

interface Category {
  id: number
  name: string
  name_en?: string
  name_ru?: string
  name_he?: string
  name_az?: string
  description?: string
  parent_id?: number | null
  order_index: number
  created_at: string
  updated_at: string
}

interface CategoryFormProps {
  category?: Category
  categories: Category[]
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export default function CategoryForm({
  category,
  categories,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const t = useTranslations('adminCategories')
  
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    name_ru: '',
    name_he: '',
    name_az: '',
    description: '',
    parent_id: '',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        name_en: category.name_en || '',
        name_ru: category.name_ru || '',
        name_he: category.name_he || '',
        name_az: category.name_az || '',
        description: category.description || '',
        parent_id: category.parent_id ? String(category.parent_id) : '',
      })
    }
  }, [category])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="name">{t('name')} (Internal)</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          placeholder="Internal identifier (e.g., ritual_objects)"
        />
      </div>

      <div className={styles.languageSection}>
        <h3>Category Names by Language</h3>
        
        <div className={styles.formGroup}>
          <label htmlFor="name_en">🇬🇧 English</label>
          <input
            type="text"
            id="name_en"
            name="name_en"
            value={formData.name_en}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="English name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name_ru">🇷🇺 Russian (Русский)</label>
          <input
            type="text"
            id="name_ru"
            name="name_ru"
            value={formData.name_ru}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Название на русском"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name_he">🇮🇱 Hebrew (עברית)</label>
          <input
            type="text"
            id="name_he"
            name="name_he"
            value={formData.name_he}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="שם בעברית"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name_az">🇦🇿 Azerbaijani (Azərbaycan)</label>
          <input
            type="text"
            id="name_az"
            name="name_az"
            value={formData.name_az}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Azərbaycan adı"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">{t('description')}</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isLoading}
          placeholder={t('descriptionPlaceholder')}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="parent_id">{t('parent')}</label>
        <select
          id="parent_id"
          name="parent_id"
          value={formData.parent_id}
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">{t('noParent')}</option>
          {categories
            .filter((c) => !category || c.id !== category.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? t('saving') : category ? t('updateCategory') : t('createCategory')}
      </button>
    </form>
  )
}
