'use client'

import { useTranslations } from 'next-intl'
import styles from './login.module.css'
import { LoginForm } from '@/components/admin'

export default function LoginPage() {
  const t = useTranslations('auth')
  
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>{t('loginTitle')}</h1>
        <p className={styles.subtitle}>{t('loginDescription')}</p>
        <LoginForm />
      </div>
    </div>
  )
}
