'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Header, Footer, CartSidebar } from '@/components/common'
import { addToCart, getCart, removeFromCart, updateCartItemQuantity, CartItem } from '@/lib/cart'
import apiClient from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/config'
import { getPriceMap, getProductPriceForCurrency, useCurrency } from '@/lib/currency'
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
  image_url?: string
  categoryId?: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default function ProductDetailPage({ params }: PageProps) {
  const locale = useLocale()
  const { currency, formatAmount } = useCurrency()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [storeInfo, setStoreInfo] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCartItems(getCart())
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      // Fetch product and settings in parallel
      const [productRes, settingsRes] = await Promise.all([
        apiClient.get(`/products/${params.id}`),
        apiClient.get('/settings')
      ])
      
      if (productRes.data.success) {
        setProduct(productRes.data.data)
      }

      if (settingsRes.data.success && settingsRes.data.data) {
        const settings = settingsRes.data.data
        setStoreInfo({
          phone: settings.phone || '',
          whatsapp: settings.whatsapp || '',
          email: settings.email || '',
          address: settings.address || '',
        })
      }
    } catch (err) {
      setError('Failed to load product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    const cartItem: CartItem = {
      productId: product.id.toString(),
      title: product.title,
      price: Number(product.price_usd ?? product.price),
      prices: getPriceMap(product),
      quantity,
      imageUrl: resolveImageUrl(product.image_url) || 'https://via.placeholder.com/250x200?text=Product',
    }
    const updated = addToCart(cartItem)
    setCartItems(updated)
    setQuantity(1)
  }

  const handleUpdateQuantity = (productId: string, qty: number) => {
    const updated = updateCartItemQuantity(productId, qty)
    setCartItems(updated)
  }

  const handleRemoveItem = (productId: string) => {
    const updated = removeFromCart(productId)
    setCartItems(updated)
  }

  if (loading) {
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
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
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
          <p style={{ textAlign: 'center', padding: '2rem', color: '#c0392b' }}>{error}</p>
        </main>
        <Footer />
      </>
    )
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
        <Link href={`/${locale}/storefront`} className={styles.backLink}>
          ← Back to Store
        </Link>

        <div className={styles.container}>
          <div className={styles.imageSection}>
            <img 
              src={resolveImageUrl(product.image_url) || 'https://via.placeholder.com/500x400?text=Product'} 
              alt={product.title} 
              className={styles.mainImage} 
            />
          </div>

          <div className={styles.detailsSection}>
            <h1>{product.title}</h1>
            <p className={styles.price}>
              {formatAmount(getProductPriceForCurrency(product, currency))}
            </p>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <div className={styles.quantityControl}>
                <label>Quantity:</label>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" min="1" value={quantity} readOnly />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button className={styles.addButton} onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className={styles.contactInfo}>
              <p style={{ marginBottom: '15px', fontSize: '14px', color: '#555' }}>
                💬 Questions about this item? Get in touch:
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {storeInfo.whatsapp && (
                  <a
                    href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}?text=Hi%20I%20have%20a%20question%20about%20${encodeURIComponent(product.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      background: '#25D366',
                      color: 'white',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#1fad50')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
                  >
                    💬 WhatsApp
                  </a>
                )}
                {storeInfo.phone && (
                  <a
                    href={`tel:${storeInfo.phone}`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      background: '#007bff',
                      color: 'white',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#0056b3')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#007bff')}
                  >
                    📞 Call
                  </a>
                )}
                {storeInfo.email && (
                  <a
                    href={`mailto:${storeInfo.email}?subject=Question about ${encodeURIComponent(product.title)}`}
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      background: '#6c757d',
                      color: 'white',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#545b62')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#6c757d')}
                  >
                    📧 Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
