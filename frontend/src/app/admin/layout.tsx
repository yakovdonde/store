'use client'

import React from 'react'
import { AdminNav, ProtectedRoute } from '@/components/admin'
import { Header } from '@/components/common'
import styles from './layout.module.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Header />
      <div className={styles.container}>
        <AdminNav />
        <main className={styles.main}>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
