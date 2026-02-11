'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LanguageSwitcher } from './LanguageSwitcher'
import styles from './Header.module.css'

interface HeaderProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations()
  const locale = useLocale()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.logo}>
          <h1>{t('common.appName')}</h1>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.active : ''}`}>
          <Link href={`/${locale}`} className={styles.navLink}>
            {t('nav.home')}
          </Link>
          <Link href={`/${locale}/storefront`} className={styles.navLink}>
            {t('nav.storefront')}
          </Link>
          <Link href={`/${locale}/admin`} className={styles.navLink}>
            {t('nav.admin')}
          </Link>
        </nav>

        <div className={styles.actions}>
          <LanguageSwitcher />
          <button
            className={styles.cartButton}
            onClick={onCartClick}
            aria-label={t('nav.cart')}
          >
            🛒 {t('nav.cart')} ({cartItemCount})
          </button>
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
