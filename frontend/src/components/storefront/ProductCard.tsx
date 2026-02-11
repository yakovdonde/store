'use client'

import React from 'react'
import styles from './ProductCard.module.css'
import { getProductPriceForCurrency, useCurrency } from '@/lib/currency'

export interface Product {
  id: string
  title: string
  price: number
  price_usd?: number
  price_eur?: number
  price_ils?: number
  price_azn?: number
  description: string
  imageUrl?: string
  categoryId?: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewDetails: (productId: string) => void
}

export default function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
}: ProductCardProps) {
  const { currency, formatAmount } = useCurrency()
  const displayPrice = getProductPriceForCurrency(product, currency)

  return (
    <div className={styles.card}>
      {product.imageUrl && (
        <div
          className={styles.imageContainer}
          onClick={() => onViewDetails(product.id)}
        >
          <img src={product.imageUrl} alt={product.title} />
        </div>
      )}
      <div className={styles.content}>
        <h3>{product.title}</h3>
        <p className={styles.description}>{product.description.slice(0, 60)}...</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatAmount(displayPrice)}</span>
          <button
            className={styles.addButton}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
