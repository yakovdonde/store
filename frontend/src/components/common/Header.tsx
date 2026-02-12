'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import { useStoreText } from '@/lib/storeUtils'
import { useSetupConfig } from '@/lib/setupConfig'
import styles from './Header.module.css'

interface HeaderProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const t = useTranslations()
  const locale = useLocale()
  const storeText = useStoreText(locale)
  const { storeName: setupStoreName } = useSetupConfig()
  const [displayName, setDisplayName] = useState(storeText.storeName)

  useEffect(() => {
    // Use setup store name if available, otherwise use default
    if (setupStoreName && setupStoreName !== 'Store') {
      setDisplayName(setupStoreName)
    }
  }, [setupStoreName])

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.logo}>
          <h1>{displayName}</h1>
        </Link>

        <div className={styles.actions}>
          <LanguageSwitcher />
          <CurrencySwitcher />
          <button
            className={styles.cartButton}
            onClick={onCartClick}
            aria-label={t('nav.cart')}
          >
            🛒 {t('nav.cart')} ({cartItemCount})
          </button>
        </div>
      </div>
    </header>
  )
}
