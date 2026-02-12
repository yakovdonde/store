'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Header, Footer, CartSidebar } from '@/components/common'
import { CategoryGrid, ProductGrid, Product, SearchBar } from '@/components/storefront'
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import { getLocalizedCategoryName } from '@/lib/categoryUtils'
import { useStoreSettings } from '@/lib/useStoreSettings'
import apiClient from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/config'
import { getPriceMap } from '@/lib/currency'
import styles from './page.module.css'

export function StorefrontHome() {
  const t = useTranslations()
  const locale = useLocale()
  const { headerTitle: storeHeaderTitle, bannerTitle, bannerDescription, bannerBackgroundColor, bannerBackgroundImage, storeDescription, storeEmail, storePhone, storeWhatsapp, storeAddress, loading: settingsLoading } = useStoreSettings()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        name_en: c.name_en,
        name_ru: c.name_ru,
        name_he: c.name_he,
        name_az: c.name_az,
        description: c.description,
        parent_id: c.parent_id,
        order_index: c.order_index
      }))
      
      setCategories(transformedCategories.filter((c: any) => !c.parent_id))
      
      const products = productsData.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        price: parseFloat(p.price_usd ?? p.price),
        price_usd: p.price_usd ?? p.price,
        price_eur: p.price_eur ?? null,
        price_ils: p.price_ils ?? null,
        price_azn: p.price_azn ?? null,
        description: p.description,
        categoryId: p.category_id.toString(),
        imageUrl: resolveImageUrl(p.image_url) || 'https://via.placeholder.com/250x200?text=Product',
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
      prices: getPriceMap(product),
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
      price: parseFloat(p.price_usd ?? p.price),
      price_usd: p.price_usd ?? p.price,
      price_eur: p.price_eur ?? null,
      price_ils: p.price_ils ?? null,
      price_azn: p.price_azn ?? null,
      description: p.description,
      categoryId: p.category_id.toString(),
      imageUrl: resolveImageUrl(p.image_url) || 'https://via.placeholder.com/250x200?text=Product',
    }))
    setSearchResults(transformedResults)
    setIsSearching(true)
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearching(false)
  }

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
  }

  const filteredProducts = selectedCategoryId
    ? featuredProducts.filter(p => p.categoryId === selectedCategoryId)
    : featuredProducts

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
        <section 
          className={styles.hero}
          style={{
            ...(bannerBackgroundColor && { backgroundColor: bannerBackgroundColor }),
            ...(bannerBackgroundImage && { 
              backgroundImage: `url(${bannerBackgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            })
          }}
        >
          <div className={styles.heroContent}>
            {bannerTitle && <h1>{bannerTitle}</h1>}
            {bannerDescription && <p>{bannerDescription}</p>}
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
                  <h2>{t('storefront.categories')}</h2>
                  <div className={styles.categoryFilters}>
                    <button
                      className={`${styles.categoryFilterBtn} ${!selectedCategoryId ? styles.active : ''}`}
                      onClick={() => handleCategoryClick(null)}
                    >
                      {t('storefront.allCategories')}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        className={`${styles.categoryFilterBtn} ${selectedCategoryId === cat.id ? styles.active : ''}`}
                        onClick={() => handleCategoryClick(cat.id)}
                      >
                        {getLocalizedCategoryName(cat, locale)}
                      </button>
                    ))}
                  </div>
                </section>

                <section className={styles.section}>
                  <h2>
                    {selectedCategoryId 
                      ? getLocalizedCategoryName(categories.find(c => c.id === selectedCategoryId) || {name: ''}, locale) || t('storefront.products')
                      : t('storefront.products')
                    }
                  </h2>
                  {filteredProducts.length > 0 ? (
                    <ProductGrid
                      products={filteredProducts}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <p>{t('storefront.noProducts')}</p>
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </main>

      <Footer
        storeInfo={{
          address: storeAddress,
          phone: storePhone,
          email: storeEmail,
          whatsapp: storeWhatsapp,
        }}
      />
    </>
  )
}

export default StorefrontHome
