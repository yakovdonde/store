import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/authContext';
import { AnalyticsTracker } from '@/components/common';
import DynamicStyles from '@/components/common/DynamicStyles';
import { locales } from '@/i18n';
import { CurrencyProvider } from '@/lib/currency';
import { activeStoreConfig } from '@/config/storeConfig';
import '../globals.css';

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  let storeName = activeStoreConfig.storeName;
  let description = activeStoreConfig.description.en;
  let faviconUrl = '';

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
          storeName = settings[multilingualField] as string;
        } else if (settings.site_title) {
          storeName = settings.site_title;
        }
        
        if (settings.top_description) {
          description = settings.top_description;
        }
        
        if (settings.favicon_url) {
          faviconUrl = settings.favicon_url;
        }
      }
    }
  } catch (error) {
    // Silently fall back to default config if API call fails
  }

  const metadata: Metadata = {
    title: {
      default: storeName,
      template: `%s | ${storeName}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      title: storeName,
      description,
      type: 'website',
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      title: storeName,
      description,
    },
  };

  if (faviconUrl) {
    metadata.icons = {
      icon: faviconUrl,
    };
  }

  return metadata;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Set the locale for this request - required for getMessages() and translations to work
  unstable_setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr">
      <body>
        <NextIntlClientProvider messages={messages}>
          <CurrencyProvider>
            <AuthProvider>
              <DynamicStyles />
              <AnalyticsTracker />
              {children}
            </AuthProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
