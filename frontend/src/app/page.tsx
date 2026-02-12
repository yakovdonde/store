'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSetupAndRedirect = async () => {
      try {
        const response = await fetch('/api/admin/setup/status')
        if (response.ok) {
          const data = await response.json()
          
          if (data.data?.isSetupComplete) {
            // Setup is complete, redirect to default locale
            router.push('/en')
          } else {
            // Setup not complete, redirect to setup wizard
            router.push('/setup')
          }
        } else {
          // If we can't check status, assume setup is needed
          router.push('/setup')
        }
      } catch (error) {
        console.error('Error checking setup status:', error)
        // On error, go to setup to be safe
        router.push('/setup')
      } finally {
        setIsChecking(false)
      }
    }

    checkSetupAndRedirect()
  }, [router])

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    )
  }

  return null
}
