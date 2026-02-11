'use client'

import React, { useState, useEffect } from 'react'
import { ProductForm } from '@/components/admin'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface Product {
  id: number
  title: string
  price: number
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
        setError('Failed to load data')
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
      setError(err.response?.data?.error || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await apiClient.delete(`/products/${id}`)
      if (response.data.success) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete product')
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
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Products</h1>
        <button 
          className={styles.addButton} 
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
        >
          + Add Product
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
            Cancel
          </button>
        </div>
      )}

      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                  No products yet. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>${parseFloat(product.price).toFixed(2)}</td>
                  <td>{getCategoryName(product.category_id)}</td>
                  <td>
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
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
