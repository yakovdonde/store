'use client'

import React from 'react'
import styles from './ProductGrid.module.css'
import ProductCard, { Product } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onViewDetails: (productId: string) => void
}

export default function ProductGrid({
  products,
  onAddToCart,
  onViewDetails,
}: ProductGridProps) {
  // Safety check - ensure products is an array
  if (!Array.isArray(products)) {
    console.error('ProductGrid received non-array products:', products)
    return null
  }

  if (products.length === 0) {
    return <div className={styles.empty}>No products found</div>
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
