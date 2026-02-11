'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, type Locale } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: string) => {
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  return (
    <div className={styles.languageSwitcher}>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className={styles.select}
        aria-label="Change language"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc as Locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
