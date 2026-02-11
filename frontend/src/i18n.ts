import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'ru', 'he', 'az'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  he: 'עברית',
  az: 'Azərbaycan'
};

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }
  
  // Load messages for the current locale
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});



