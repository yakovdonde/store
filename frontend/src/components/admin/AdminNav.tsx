'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/authContext'
import styles from './AdminNav.module.css'

export default function AdminNav() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const t = useTranslations('admin')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link href="/admin" className={styles.navLink}>
        📊 {t('dashboard')}
      </Link>
      <Link href="/admin/products" className={styles.navLink}>
        📦 {t('products')}
      </Link>
      <Link href="/admin/categories" className={styles.navLink}>
        🏷️ {t('categories')}
      </Link>
      <Link href="/admin/branding" className={styles.navLink}>
        🎨 {t('branding')}
      </Link>
      <Link href="/admin/settings" className={styles.navLink}>
        ⚙️ {t('settings')}
      </Link>
      {user?.role === 'owner' && (
        <Link href="/admin/users" className={styles.navLink}>
          👥 {t('users')}
        </Link>
      )}
      <Link href="/" className={styles.navLink}>
        🏠 {t('backToStore')}
      </Link>
      <div className={styles.divider}></div>
      <div className={styles.userSection}>
        {user && <span className={styles.userEmail}>{user.email}</span>}
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 {t('logout')}
        </button>
      </div>
    </nav>
  )
}
