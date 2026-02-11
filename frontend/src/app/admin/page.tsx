'use client'

import React, { useState } from 'react'
import styles from './page.module.css'

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  revenue: number
}

export default function AdminDashboard() {
  const [stats] = useState<DashboardStats>({
    totalProducts: 24,
    totalCategories: 6,
    totalOrders: 156,
    revenue: 12450.5,
  })

  return (
    <div className={styles.dashboard}>
      <h1>Dashboard</h1>
      <p className={styles.subtitle}>Welcome back! Here's an overview of your store.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Products</h3>
          <p className={styles.number}>{stats.totalProducts}</p>
          <span className={styles.label}>Active items</span>
        </div>

        <div className={styles.statCard}>
          <h3>Categories</h3>
          <p className={styles.number}>{stats.totalCategories}</p>
          <span className={styles.label}>Product categories</span>
        </div>

        <div className={styles.statCard}>
          <h3>Recent Orders</h3>
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
        <div className={styles.actionButtons}>
          <a href="/admin/products" className={styles.actionButton}>
            📦 View Products
          </a>
          <a href="/admin/categories" className={styles.actionButton}>
            🏷️ Manage Categories
          </a>
          <a href="/admin/settings" className={styles.actionButton}>
            ⚙️ Store Settings
          </a>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <ul className={styles.activityList}>
          <li>New product added: Handmade Tallit</li>
          <li>New order received (#1234)</li>
          <li>Category updated: Shabbat Essentials</li>
          <li>Settings saved successfully</li>
        </ul>
      </div>
    </div>
  )
}
