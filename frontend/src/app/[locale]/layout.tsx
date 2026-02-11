import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/authContext';
import { AnalyticsTracker } from '@/components/common';
import { locales } from '@/i18n';
import { CurrencyProvider } from '@/lib/currency';
import '../globals.css';

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
};

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
              <AnalyticsTracker />
              {children}
            </AuthProvider>
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
