'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import styles from './AdminNav.module.css'

export default function AdminNav() {
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link href="/admin" className={styles.navLink}>
        📊 Dashboard
      </Link>
      <Link href="/admin/products" className={styles.navLink}>
        📦 Products
      </Link>
      <Link href="/admin/categories" className={styles.navLink}>
        🏷️ Categories
      </Link>
      <Link href="/admin/settings" className={styles.navLink}>
        ⚙️ Settings
      </Link>
      {user?.role === 'owner' && (
        <Link href="/admin/users" className={styles.navLink}>
          👥 Users
        </Link>
      )}
      <Link href="/" className={styles.navLink}>
        🏠 Back to Store
      </Link>
      <div className={styles.divider}></div>
      <div className={styles.userSection}>
        {user && <span className={styles.userEmail}>{user.email}</span>}
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </nav>
  )
}
