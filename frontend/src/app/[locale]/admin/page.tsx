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
          <span className={styles.label}>{t('activeItems')}</span>
        </div>

        <div className={styles.statCard}>
          <h3>{t('categories')}</h3>
          <p className={styles.number}>{stats.totalCategories}</p>
          <span className={styles.label}>{t('productCategories')}</span>
        </div>

        <div className={styles.statCard}>
          <h3>{t('orders')}</h3>
          <p className={styles.number}>{stats.totalOrders}</p>
          <span className={styles.label}>{t('thisMonth')}</span>
        </div>

        <div className={styles.statCard}>
          <h3>{t('revenue')}</h3>
          <p className={styles.number}>${stats.revenue.toFixed(2)}</p>
          <span className={styles.label}>{t('thisMonth')}</span>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>{t('quickActions')}</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>{t('addProduct')}</button>
          <button className={styles.actionButton}>{t('addCategory')}</button>
          <button className={styles.actionButton}>{t('viewOrders')}</button>
          <button className={styles.actionButton}>{t('settings')}</button>
        </div>
      </div>
    </div>
  )
}
