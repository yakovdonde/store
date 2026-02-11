'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ProductForm } from '@/components/admin'
import apiClient from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/config'
import styles from './page.module.css'

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

export default function ProductsPage() {
  const t = useTranslations('adminProducts')
  const tCommon = useTranslations('common')
  
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/categories'),
        ])

        if (productsRes.data.success) {
          setProducts(productsRes.data.data)
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data)
        }
      } catch (err: any) {
        setError(tCommon('error'))
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (data: any) => {
    setSubmitting(true)
    try {
      if (editingId) {
        const response = await apiClient.put(`/products/${editingId}`, data)
        if (response.data.success) {
          setProducts(
            products.map((p) => (p.id === editingId ? response.data.data : p))
          )
          setEditingId(null)
        }
      } else {
        const response = await apiClient.post('/products', data)
        if (response.data.success) {
          setProducts([...products, response.data.data])
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
      const response = await apiClient.delete(`/products/${id}`)
      if (response.data.success) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (err: any) {
      setError(err.response?.data?.error || tCommon('error'))
    }
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setShowForm(true)
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown'
  }

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : undefined

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

      {error && <div style={{ color: '#c0392b', padding: '1rem', marginBottom: '1rem', backgroundColor: '#fadbd8', borderRadius: '4px' }}>{error}</div>}

      {showForm && (
        <div className={styles.formContainer}>
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            isLoading={submitting}
          />
          <button 
            onClick={() => {
              setShowForm(false)
              setEditingId(null)
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {tCommon('cancel')}
          </button>
        </div>
      )}

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>{t('productImage')}</th>
              <th>{t('name')}</th>
              <th>{t('price')} (USD)</th>
              <th>{t('category')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  {t('addNew')}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className={styles.thumb}
                      src={resolveImageUrl(product.image_url) || 'https://via.placeholder.com/64x64?text=No+Image'}
                      alt={product.title}
                      loading="lazy"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>${Number(product.price_usd ?? product.price).toFixed(2)}</td>
                  <td>{getCategoryName(product.category_id)}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(product)}
                    >
                      {tCommon('edit')}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product.id)}
                    >
                      {tCommon('delete')}
                    </button>
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
