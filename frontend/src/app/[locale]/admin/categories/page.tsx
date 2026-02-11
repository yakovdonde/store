'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryForm } from '@/components/admin'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface Category {
  id: number
  name: string
  description?: string
  parent_id?: number | null
  order_index: number
  created_at: string
  updated_at: string
}

export default function CategoriesPage() {
  const t = useTranslations('adminCategories')
  const tCommon = useTranslations('common')
  
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await apiClient.get('/categories')
        if (response.data.success) {
          setCategories(response.data.data.sort((a: Category, b: Category) => a.order_index - b.order_index))
        }
      } catch (err: any) {
        setError(tCommon('error'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      if (editingId) {
        const response = await apiClient.put(`/categories/${editingId}`, data)
        if (response.data.success) {
          setCategories(
            categories.map((c) => (c.id === editingId ? response.data.data : c))
          )
          setEditingId(null)
        }
      } else {
        const response = await apiClient.post('/categories', data)
        if (response.data.success) {
          setCategories([...categories, response.data.data])
        }
      }
      setShowForm(false)
    } catch (err: any) {
      setError(err.response?.data?.error || tCommon('error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(t('deleteConfirm'))) return

    try {
      const response = await apiClient.delete(`/categories/${id}`)
      if (response.data.success) {
        setCategories(categories.filter((c) => c.id !== id))
      }
    } catch (err: any) {
      setError(err.response?.data?.error || tCommon('error'))
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleMoveUp = async (index: number) => {
    if (index > 0) {
      const categoryToMove = categories[index]
      const swapWith = categories[index - 1]

      try {
        await Promise.all([
          apiClient.put(`/categories/${categoryToMove.id}`, {
            order_index: swapWith.order_index,
          }),
          apiClient.put(`/categories/${swapWith.id}`, {
            order_index: categoryToMove.order_index,
          }),
        ])

        const updated = [...categories]
        ;[updated[index], updated[index - 1]] = [updated[index - 1], updated[index]]
        setCategories(updated)
      } catch (err: any) {
        setError(tCommon('error'))
      }
    }
  }

  const handleMoveDown = async (index: number) => {
    if (index < categories.length - 1) {
      const categoryToMove = categories[index]
      const swapWith = categories[index + 1]

      try {
        await Promise.all([
          apiClient.put(`/categories/${categoryToMove.id}`, {
            order_index: swapWith.order_index,
          }),
          apiClient.put(`/categories/${swapWith.id}`, {
            order_index: categoryToMove.order_index,
          }),
        ])

        const updated = [...categories]
        ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
        setCategories(updated)
      } catch (err: any) {
        setError('Failed to reorder categories')
      }
    }
  }

  const editingCategory = editingId ? categories.find((c) => c.id === editingId) : undefined
  const getParentName = (parentId?: number | null) => {
    if (!parentId) return '-'
    return categories.find((c) => c.id === parentId)?.name || '-'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <p>{tCommon('loading')}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{t('title')}</h1>
        <button 
          className={styles.addButton} 
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          + {t('addNew')}
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {showForm && (
        <div className={styles.formContainer}>
          <CategoryForm
            category={editingCategory}
            categories={categories}
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
          <button 
            onClick={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            className={styles.cancelBtn}
          >
            {tCommon('cancel')}
          </button>
        </div>
      )}

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>
                <div className={styles.columnHeader}>
                  <span className={styles.columnIcon}>📋</span>
                  {t('name')}
                </div>
              </th>
              <th>
                <div className={styles.columnHeader}>
                  <span className={styles.columnIcon}>📝</span>
                  {t('description')}
                </div>
              </th>
              <th>
                <div className={styles.columnHeader}>
                  <span className={styles.columnIcon}>🧭</span>
                  {t('parent')}
                </div>
              </th>
              <th>
                <div className={styles.columnHeader}>
                  <span className={styles.columnIcon}>🔢</span>
                  {t('order')}
                </div>
              </th>
              <th>
                <div className={styles.columnHeader}>
                  <span className={styles.columnIcon}>⚙️</span>
                  {t('actions')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>
                    <div style={{ fontSize: '3rem' }}>📁</div>
                    <p>{t('addNew')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.description || '-'}</td>
                  <td>{getParentName(category.parent_id)}</td>
                  <td>
                    <div className={styles.orderButtons}>
                      <button
                        className={styles.orderBtn}
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        className={styles.orderBtn}
                        onClick={() => handleMoveDown(index)}
                        disabled={index === categories.length - 1}
                        title="Move down"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(category)}
                      >
                        ✎ {tCommon('edit')}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(category.id)}
                      >
                        🗑 {tCommon('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
