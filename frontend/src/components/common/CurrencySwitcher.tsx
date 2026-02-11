'use client'

import React from 'react'
import { useCurrency, currencyOptions, CurrencyCode } from '@/lib/currency'
import styles from './Header.module.css'

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode)
  }

  return (
    <div className={styles.currencySwitcher}>
      <select className={styles.currencySelect} value={currency} onChange={handleChange}>
        {currencyOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code} - {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
