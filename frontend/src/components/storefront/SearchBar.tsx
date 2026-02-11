'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { getLocalizedCategoryName } from '@/lib/categoryUtils'
import styles from './SearchBar.module.css'

interface Category {
  id: number
  name: string
  name_en?: string
  name_ru?: string
  name_he?: string
  name_az?: string
  parent_id?: number | null
}

interface SearchBarProps {
  categories: Category[]
  onSearch: (results: any[]) => void
  onLoading?: (loading: boolean) => void
}

export default function SearchBar({ categories, onSearch, onLoading }: SearchBarProps) {
  const t = useTranslations('storefront')
  const locale = useLocale()
  
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultsCount, setResultsCount] = useState<number | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      alert(t('pleaseEnterSearchTerm'))
      return
    }

    setLoading(true)
    onLoading?.(true)

    try {
      const params = new URLSearchParams()
      params.append('q', query)
      if (categoryId) params.append('categoryId', categoryId)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)

      const response = await fetch(`http://localhost:3001/api/products/search?${params}`)
      const data = await response.json()

      if (data.success) {
        onSearch(data.data)
        setResultsCount(data.data.length)
      } else {
        alert(t('searchFailed') + ': ' + (data.error || t('failedToSearch')))
      }
    } catch (error) {
      console.error('Search error:', error)
      alert(t('failedToSearch'))
    } finally {
      setLoading(false)
      onLoading?.(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setCategoryId('')
    setMinPrice('')
    setMaxPrice('')
    setResultsCount(null)
    onSearch([])
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchTitle}>{t('searchTitle')}</div>

      <form onSubmit={handleSearch}>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('searchTerm')}</label>
            <input
              type="text"
              className={styles.input}
              placeholder={t('searchByNamePlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('category')}</label>
            <select
              className={styles.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {getLocalizedCategoryName(cat, locale)}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('minPrice')}</label>
            <input
              type="number"
              className={styles.input}
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>{t('maxPrice')}</label>
            <input
              type="number"
              className={styles.input}
              placeholder="999999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={`${styles.button} ${styles.searchBtn} ${loading ? styles.loading : ''}`}
              disabled={loading}
            >
              {loading ? t('searching') : t('searchButton')}
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.resetBtn}`}
              onClick={handleReset}
              disabled={loading}
            >
              {t('reset')}
            </button>
          </div>
        </div>
      </form>

      {resultsCount !== null && (
        <div className={styles.resultsInfo}>
          {t('foundResults')} <strong>{resultsCount}</strong> {t('productsMatching')}
        </div>
      )}
    </div>
  )
}
