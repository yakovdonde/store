import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/authContext'
import { AnalyticsTracker } from '@/components/common'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Judaica Store',
    template: '%s | Judaica Store',
  },
  description: 'Your premier source for Judaica items, ritual objects, and gifts',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Judaica Store',
    description: 'Your premier source for Judaica items, ritual objects, and gifts',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Judaica Store',
    description: 'Your premier source for Judaica items, ritual objects, and gifts',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AnalyticsTracker />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
