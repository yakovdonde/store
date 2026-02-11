'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Header, Footer, CartSidebar } from '@/components/common'
import { CategoryGrid, ProductGrid, Product, SearchBar } from '@/components/storefront'
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

export default function StorefrontHome() {
  const t = useTranslations()
  const locale = useLocale()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loading, setLoading] = useState(true)

  const [storeInfo] = useState({
    address: '123 Jewish Way, New York, NY 10001',
    phone: '(555) 123-4567',
    email: 'info@judaicastore.com',
    whatsapp: '+1 (555) 123-4567',
  })

  useEffect(() => {
    setCartItems(getCart())
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, productsRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ])
      
      const categoriesData = categoriesRes.data?.data || []
      const productsData = productsRes.data?.data || []
      
      const transformedCategories = categoriesData.map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description,
        parent_id: c.parent_id,
        order_index: c.order_index
      }))
      
      setCategories(transformedCategories.filter((c: any) => !c.parent_id))
      
      const products = productsData.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        price: parseFloat(p.price),
        description: p.description,
        categoryId: p.category_id.toString(),
        imageUrl: p.image_url || 'https://via.placeholder.com/250x200?text=Product',
      }))
      
      setFeaturedProducts(products)
    } catch (error) {
      console.error('Error fetching data:', error)
      setCategories([])
      setFeaturedProducts([])
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

  const handleSearch = (results: any[]) => {
    const transformedResults = results.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      price: parseFloat(p.price),
      description: p.description,
      categoryId: p.category_id.toString(),
      imageUrl: p.image_url || 'https://via.placeholder.com/250x200?text=Product',
    }))
    setSearchResults(transformedResults)
    setIsSearching(true)
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearching(false)
  }

  const handleViewDetails = (productId: string) => {
    window.location.href = `/${locale}/storefront/product/${productId}`
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
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>{t('common.appName')}</h1>
            <p>{t('storefront.description')}</p>
          </div>
        </section>

        {loading ? (
          <section className={styles.section}>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
              {t('common.loading')}
            </p>
          </section>
        ) : (
          <>
            <section className={styles.section}>
              <SearchBar 
                categories={categories}
                onSearch={handleSearch}
              />
            </section>

            {isSearching && (
              <section className={styles.section}>
                <h2>{t('common.search')}</h2>
                {searchResults.length > 0 ? (
                  <>
                    <ProductGrid
                      products={searchResults}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                    <button
                      onClick={handleClearSearch}
                      style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      {t('common.cancel')}
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <p>{t('storefront.noProducts')}</p>
                  </div>
                )}
              </section>
            )}

            {!isSearching && (
              <>
                <section className={styles.section}>
                  <h2>{t('storefront.products')}</h2>
                  <ProductGrid
                    products={featuredProducts}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                </section>

                <section className={styles.section}>
                  <h2>{t('storefront.categories')}</h2>
                  <CategoryGrid categories={categories} />
                </section>
              </>
            )}
          </>
        )}
      </main>

      <Footer storeInfo={storeInfo} />
    </>
  )
}
