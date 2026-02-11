'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CurrencyCode = 'USD' | 'EUR' | 'ILS' | 'AZN'

export const currencyOptions: { code: CurrencyCode; label: string }[] = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'ILS', label: 'New Israeli Shekel' },
  { code: 'AZN', label: 'Azerbaijani Manat' },
]

const CURRENCY_STORAGE_KEY = 'judaica-currency'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
  formatAmount: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null
    if (stored && currencyOptions.some((c) => c.code === stored)) {
      setCurrencyState(stored)
    }
  }, [])

  const setCurrency = (next: CurrencyCode) => {
    setCurrencyState(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, next)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatAmount,
    }),
    [currency]
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext)
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return ctx
}

export const getProductPriceForCurrency = (
  product: {
    price?: number
    price_usd?: number
    price_eur?: number
    price_ils?: number
    price_azn?: number
  },
  currency: CurrencyCode
) => {
  switch (currency) {
    case 'EUR':
      return product.price_eur ?? product.price_usd ?? product.price ?? 0
    case 'ILS':
      return product.price_ils ?? product.price_usd ?? product.price ?? 0
    case 'AZN':
      return product.price_azn ?? product.price_usd ?? product.price ?? 0
    case 'USD':
    default:
      return product.price_usd ?? product.price ?? 0
  }
}

export const getPriceMap = (product: {
  price?: number
  price_usd?: number
  price_eur?: number
  price_ils?: number
  price_azn?: number
}) => ({
  USD: product.price_usd ?? product.price ?? 0,
  EUR: product.price_eur ?? product.price_usd ?? product.price ?? 0,
  ILS: product.price_ils ?? product.price_usd ?? product.price ?? 0,
  AZN: product.price_azn ?? product.price_usd ?? product.price ?? 0,
})
