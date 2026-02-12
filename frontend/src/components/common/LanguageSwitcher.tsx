'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

interface CustomLanguageLabels {
  lang_label_en?: string;
  lang_label_ru?: string;
  lang_label_he?: string;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [customLabels, setCustomLabels] = useState<CustomLanguageLabels>({});

  useEffect(() => {
    // Fetch custom language labels from API
    const fetchCustomLabels = async () => {
      try {
        const response = await fetch('/api/settings', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const settings = data.data;
            setCustomLabels({
              lang_label_en: settings.lang_label_en,
              lang_label_ru: settings.lang_label_ru,
              lang_label_he: settings.lang_label_he,
            });
          }
        }
      } catch (error) {
        console.error('Could not fetch custom language labels:', error);
      }
    };

    fetchCustomLabels();
  }, []);

  const handleChange = (newLocale: string) => {
    // Replace the locale in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  const getLanguageLabel = (loc: Locale): string => {
    if (loc === 'en' && customLabels.lang_label_en) return customLabels.lang_label_en;
    if (loc === 'ru' && customLabels.lang_label_ru) return customLabels.lang_label_ru;
    if (loc === 'he' && customLabels.lang_label_he) return customLabels.lang_label_he;
    return localeNames[loc];
  };

  return (
    <div className={styles.languageSwitcher}>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        className={styles.select}
        aria-label="Change language"
      >
        {locales.filter((loc) => loc !== 'az').map((loc) => (
          <option key={loc} value={loc}>
            {getLanguageLabel(loc as Locale)}
          </option>
        ))}
      </select>
    </div>
  );
}
