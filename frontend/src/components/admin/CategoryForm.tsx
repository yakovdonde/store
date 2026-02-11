'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import styles from './CategoryForm.module.css'

interface Category {
  id: number
  name: string
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
    description: '',
    parent_id: '',
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
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
        <label htmlFor="name">{t('name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isLoading}
          placeholder={t('namePlaceholder')}
        />
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
