import type { Metadata } from 'next'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  let title = 'Storefront';
  let description = 'Browse our store';

  try {
    // Use internal backend URL for server-side rendering (works inside Docker)
    const apiBase = process.env.NEXT_BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${apiBase}/settings`, {
      next: { revalidate: 0 }, // Don't cache to get latest settings immediately
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const settings = data.data;
        
        // Get locale-specific store name
        const localeMap: Record<string, string> = {
          'en': 'en',
          'az': 'az',
          'he': 'he',
          'ru': 'ru',
        };
        const localeKey = localeMap[locale] || 'en';
        const multilingualField = `site_title_${localeKey}` as keyof typeof settings;
        
        if (settings[multilingualField]) {
          title = settings[multilingualField] as string;
        } else if (settings.site_title) {
          title = settings.site_title;
        }
        
        if (settings.top_description) {
          description = settings.top_description;
        }
      }
    }
  } catch (error) {
    // Silently fall back to defaults if API call fails
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
