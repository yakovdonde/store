'use client'

import SetupForm from '@/components/setup/SetupForm'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()

  const handleSetupComplete = async (config: any) => {
    try {
      // Save configuration to backend
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        // Redirect to login or dashboard
        window.location.href = '/en/login'
      } else {
        alert('Setup failed. Please try again.')
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert('An error occurred during setup.')
    }
  }

  return <SetupForm onComplete={handleSetupComplete} />
}
