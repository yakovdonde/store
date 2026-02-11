'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import apiClient from '@/lib/apiClient'

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const query = searchParams?.toString()
    const path = query ? `${pathname}?${query}` : pathname

    apiClient
      .post('/analytics/pageview', {
        path,
        referrer: document.referrer || null,
        userAgent: navigator.userAgent,
      })
      .catch(() => {
        // Ignore analytics errors to avoid user impact
      })
  }, [pathname, searchParams])

  return null
}
