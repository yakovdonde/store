'use client'

import React, { useState, useEffect } from 'react'
import { Header, Footer, CartSidebar } from '@/components/common'
import { ProductGrid } from '@/components/storefront'
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

interface Product {
  id: string
  title: string
  price: number
  description: string
  categoryId: string
  imageUrl?: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('Category')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCartItems(getCart())
    fetchCategoryData()
  }, [params.id])

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError('')

      // Fetch category info
      const categoryRes = await apiClient.get(`/categories/${params.id}`)
      if (categoryRes.data.success) {
        setCategoryName(categoryRes.data.data.name)
      }

      // Fetch products for this category
      const productsRes = await apiClient.get('/products')
      if (productsRes.data.success) {
        const categoryProducts = productsRes.data.data
          .filter((p: any) => p.category_id === parseInt(params.id))
          .map((p: any) => ({
            id: p.id.toString(),
            title: p.title,
            price: parseFloat(p.price),
            description: p.description,
            categoryId: p.category_id.toString(),
            imageUrl: p.image_url || 'https://via.placeholder.com/250x200?text=Product',
          }))

        setProducts(categoryProducts)
      }
    } catch (err) {
      setError('Failed to load category data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    }
    const updated = addToCart(cartItem)
    setCartItems(updated)
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const updated = updateCartItemQuantity(productId, quantity)
    setCartItems(updated)
  }

  const handleRemoveItem = (productId: string) => {
    const updated = removeFromCart(productId)
    setCartItems(updated)
  }

  const handleViewDetails = (productId: string) => {
    window.location.href = `/storefront/product/${productId}`
  }

  return (
    <>
      <Header cartItemCount={cartItems.length} onCartClick={() => setCartOpen(!cartOpen)} />

      <CartSidebar
        items={cartItems}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>{categoryName}</h1>
          {error && <p style={{ color: '#c0392b' }}>{error}</p>}
          {!error && (
            <p>
              {loading ? 'Loading products...' : `Showing ${products.length} products`}
            </p>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>No products in this category</p>
        ) : (
          <ProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      <Footer />
    </>
  )
}
