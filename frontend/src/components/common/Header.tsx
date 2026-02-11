'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import CurrencySwitcher from './CurrencySwitcher'
import styles from './Header.module.css'

interface HeaderProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.logo}>
          <h1>{t('common.appName')}</h1>
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
