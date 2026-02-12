'use client'

import SetupForm from '@/components/setup/SetupForm'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SetupPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetupComplete = async (config: any) => {
    console.log('Setup submission started with config:', config)
    setError(null)
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
      const responseText = await response.text()
      console.log('Response body:', responseText)

      if (response.ok) {
        try {
          const data = JSON.parse(responseText)
          console.log('Setup completed successfully:', data)
        } catch (e) {
          console.log('Response was not JSON')
        }
        // Redirect to login or dashboard
        setTimeout(() => {
          window.location.href = '/en/login'
        }, 1000)
      } else {
        const errorMsg = `Setup failed with status ${response.status}: ${responseText || response.statusText}`
        console.error('Setup failed:', errorMsg)
        setError(errorMsg)
        setIsSubmitting(false)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Setup error:', error)
      setError(`An error occurred during setup: ${errorMessage}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c33',
          padding: '16px',
          marginBottom: '16px',
          borderRadius: '4px',
          marginLeft: '20px',
          marginRight: '20px',
          marginTop: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <SetupForm onComplete={handleSetupComplete} isSubmitting={isSubmitting} />
    </div>
  )
}

