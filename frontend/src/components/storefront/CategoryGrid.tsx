'use client'

import React from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { getLocalizedCategoryName, type Category as CategoryType } from '@/lib/categoryUtils'
import styles from './CategoryGrid.module.css'

export interface Category {
  id: string
  name: string
  name_en?: string
  name_ru?: string
  name_he?: string
  name_az?: string
  description?: string
  parent_id?: number | null
  order_index: number
}

interface CategoryGridProps {
  categories: Category[]
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const locale = useLocale()
  
  const icons: { [key: string]: string } = {
    'Ritual Objects': '📿',
    'Shabbat Essentials': '🕯️',
    'Holiday-Specific': '🕎',
    'Lifecycle & Simcha': '💍',
    'Books & Media': '📚',
    'Art & Home Decor': '🖼️',
  }

  // Safety check - ensure categories is an array
  if (!Array.isArray(categories)) {
    console.error('CategoryGrid received non-array categories:', categories)
    return null
  }

  if (categories.length === 0) {
    return <div className={styles.grid}>No categories available.</div>
  }

  return (
    <div className={styles.grid}>
      {categories.map((category) => {
        const displayName = getLocalizedCategoryName(category as any, locale)
        return (
          <Link
            key={category.id}
            href={`/storefront/category/${category.id}`}
            className={styles.categoryCard}
          >
            <div className={styles.icon}>
              {icons[category.name] || '📦'}
            </div>
            <h3>{displayName}</h3>
            {category.description && <p>{category.description}</p>}
          </Link>
        )
      })}
    </div>
  )
}
