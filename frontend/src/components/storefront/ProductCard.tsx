'use client'

import React from 'react'
import styles from './ProductCard.module.css'

export interface Product {
  id: string
  title: string
  price: number
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
          <span className={styles.price}>${product.price.toFixed(2)}</span>
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
