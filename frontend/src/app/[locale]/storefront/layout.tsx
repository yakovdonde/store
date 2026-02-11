import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'storefront' })
  
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      url: `/${locale}/storefront`,
    },
  }
}

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
