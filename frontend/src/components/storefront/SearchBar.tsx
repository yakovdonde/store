'use client'

import { useState } from 'react'
import styles from './SearchBar.module.css'

interface Category {
  id: number
  name: string
  parent_id?: number | null
}

interface SearchBarProps {
  categories: Category[]
  onSearch: (results: any[]) => void
  onLoading?: (loading: boolean) => void
}

export default function SearchBar({ categories, onSearch, onLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultsCount, setResultsCount] = useState<number | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      alert('Please enter a search term')
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
        alert('Search failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Failed to perform search')
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
      <div className={styles.searchTitle}>Search Products</div>

      <form onSubmit={handleSearch}>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Search Term</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Search by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Category</label>
            <select
              className={styles.select}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loading}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Min Price</label>
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
            <label className={styles.label}>Max Price</label>
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
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.resetBtn}`}
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {resultsCount !== null && (
        <div className={styles.resultsInfo}>
          Found <strong>{resultsCount}</strong> product{resultsCount !== 1 ? 's' : ''} matching your search
        </div>
      )}
    </div>
  )
}
