import styles from './login.module.css'
import { LoginForm } from '@/components/admin'

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Enter your credentials to access the admin panel</p>
        <LoginForm />
      </div>
    </div>
  )
}
