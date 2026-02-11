'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './Header.module.css'

interface HeaderProps {
  cartItemCount?: number
  onCartClick?: () => void
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <h1>Judaica Store</h1>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.active : ''}`}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
          <Link href="/storefront" className={styles.navLink}>
            Shop
          </Link>
          <Link href="/admin" className={styles.navLink}>
            Admin
          </Link>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.cartButton}
            onClick={onCartClick}
            aria-label="Shopping cart"
          >
            🛒 Cart ({cartItemCount})
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
