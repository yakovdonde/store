'use client'

import SetupForm from '@/components/setup/SetupForm'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SetupPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSetupComplete = async (config: any) => {
    console.log('Setup submission started with config:', config)
    setIsSubmitting(true)
    
    try {
      // Save configuration to backend
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      console.log('Setup API response:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('Setup completed successfully:', data)
        // Redirect to login or dashboard
        setTimeout(() => {
          window.location.href = '/en/login'
        }, 1000)
      } else {
        const errorData = await response.text()
        console.error('Setup failed:', response.status, errorData)
        alert(`Setup failed with status ${response.status}. Please try again.`)
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert(`An error occurred during setup: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsSubmitting(false)
    }
  }

  return <SetupForm onComplete={handleSetupComplete} isSubmitting={isSubmitting} />
}

