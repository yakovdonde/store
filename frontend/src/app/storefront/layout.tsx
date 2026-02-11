import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Storefront',
  description: 'Browse Judaica products and categories',
  openGraph: {
    title: 'Storefront',
    description: 'Browse Judaica products and categories',
    type: 'website',
    url: '/storefront',
  },
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
