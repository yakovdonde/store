'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin panel - setup wizard is disabled
    router.push('/en/admin/settings')
  }, [router])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Redirecting to Admin Panel...</h1>
      <p>The setup wizard has been disabled. Please configure your store from the admin panel.</p>
    </div>
  )
}

/* DISABLED - Setup wizard functionality moved to admin panel

function SetupPageOld() {
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
        // Redirect to homepage
        setTimeout(() => {
          window.location.href = '/en'
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

}

*/