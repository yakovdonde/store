import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/authContext';
import { AnalyticsTracker } from '@/components/common';
import { locales } from '@/i18n';
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

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  // Determine text direction based on locale
  const direction = locale === 'he' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AnalyticsTracker />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
