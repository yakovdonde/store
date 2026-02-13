'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth } from '@/lib/authContext'
import styles from './AdminNav.module.css'

export default function AdminNav() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('admin')
  const adminBasePath = `/${locale}/admin`

  const handleLogout = () => {
    logout()
    router.push(`/${locale}/login`)
  }

  return (
    <nav className={styles.nav}>
      <Link href={adminBasePath} className={styles.navLink}>
        📊 {t('dashboard')}
      </Link>
      <Link href={`${adminBasePath}/products`} className={styles.navLink}>
        📦 {t('products')}
      </Link>
      <Link href={`${adminBasePath}/categories`} className={styles.navLink}>
        🏷️ {t('categories')}
      </Link>
      <Link href={`${adminBasePath}/branding`} className={styles.navLink}>
        🎨 {t('branding')}
      </Link>
      <Link href={`${adminBasePath}/settings`} className={styles.navLink}>
        ⚙️ {t('settings')}
      </Link>
      {user?.role === 'owner' && (
        <Link href={`${adminBasePath}/users`} className={styles.navLink}>
          👥 {t('users')}
        </Link>
      )}
      <Link href={`/${locale}`} className={styles.navLink}>
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
