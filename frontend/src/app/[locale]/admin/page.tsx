'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './page.module.css'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  revenue: number
}

export default function AdminDashboard() {
  const t = useTranslations('admin')
  const [stats] = useState<DashboardStats>({
    totalProducts: 24,
    totalCategories: 6,
    totalOrders: 156,
    revenue: 12450.5,
  })

  return (
    <div className={styles.dashboard}>
      <h1>{t('dashboard')}</h1>
      <p className={styles.subtitle}>{t('welcome')}</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>{t('products')}</h3>
          <p className={styles.number}>{stats.totalProducts}</p>
          <span className={styles.label}>Active items</span>
        </div>

        <div className={styles.statCard}>
          <h3>{t('categories')}</h3>
          <p className={styles.number}>{stats.totalCategories}</p>
          <span className={styles.label}>Product categories</span>
        </div>

        <div className={styles.statCard}>
          <h3>{t('orders')}</h3>
          <p className={styles.number}>{stats.totalOrders}</p>
          <span className={styles.label}>This month</span>
        </div>

        <div className={styles.statCard}>
          <h3>Revenue</h3>
          <p className={styles.number}>${stats.revenue.toFixed(2)}</p>
          <span className={styles.label}>This month</span>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>Add Product</button>
          <button className={styles.actionButton}>Add Category</button>
          <button className={styles.actionButton}>View Orders</button>
          <button className={styles.actionButton}>Settings</button>
        </div>
      </div>
    </div>
  )
}
