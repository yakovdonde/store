'use client'

import React, { useState, useEffect } from 'react'
import { Header, Footer, CartSidebar } from '@/components/common'
import { CategoryGrid, ProductGrid, Product, SearchBar } from '@/components/storefront'
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import apiClient from '@/lib/apiClient'
import styles from './page.module.css'

export default function StorefrontHome() {
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
      // Fetch categories and products in parallel
      const [categoriesRes, productsRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/products')
      ])
      
      console.log('Categories response:', categoriesRes.data)
      console.log('Products response:', productsRes.data)
      
      // API returns {success: true, data: [...]}
      // Extract the actual array from the response
      const categoriesData = categoriesRes.data?.data || []
      const productsData = productsRes.data?.data || []
      
      console.log('Categories data:', categoriesData)
      console.log('Products data:', productsData)
      
      // Transform categories to match the Category interface
      const transformedCategories = categoriesData.map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description,
        parent_id: c.parent_id,
        order_index: c.order_index
      }))
      
      console.log('Transformed categories:', transformedCategories)
      setCategories(transformedCategories.filter((c: any) => !c.parent_id))
      
      // Transform products to match the Product interface
      const products = productsData.map((p: any) => ({
        id: p.id.toString(),
        title: p.title,
        price: parseFloat(p.price),
        description: p.description,
        categoryId: p.category_id.toString(),
        imageUrl: p.image_url || 'https://via.placeholder.com/250x200?text=Product',
      }))
      
      console.log('Transformed products:', products)
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
    // Transform search results to match Product interface
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
    // Navigate to product detail page
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
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Welcome to Judaica Store</h1>
            <p>Your premier source for authentic Judaica items, ritual objects, and gifts</p>
          </div>
        </section>

        {loading ? (
          <section className={styles.section}>
            <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>Loading products...</p>
          </section>
        ) : (
          <>
            {/* Search Section */}
            <section className={styles.section}>
              <SearchBar 
                categories={categories}
                onSearch={handleSearch}
              />
            </section>

            {/* Search Results */}
            {isSearching && (
              <section className={styles.section}>
                <h2>Search Results</h2>
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
                      Clear Search
                    </button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <p>No products found matching your search criteria.</p>
                  </div>
                )}
              </section>
            )}

            {/* Featured Products - Only show when not searching */}
            {!isSearching && (
              <>
                <section className={styles.section}>
                  <h2>Featured Products</h2>
                  <ProductGrid
                    products={featuredProducts}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                </section>

                {/* Categories */}
                <section className={styles.section}>
                  <h2>Shop by Category</h2>
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
