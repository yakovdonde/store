import { activeStoreConfig } from '@/config/storeConfig';

/**
 * Hook to get dynamic store text based on locale and store config
 */
export function useStoreText(locale: string) {
  const getLocalizedText = (textObject: Record<string, string>): string => {
    const localeMap: Record<string, string> = {
      'en': 'en',
      'he': 'he',
      'ru': 'ru',
      'az': 'az',
      'en-US': 'en',
      'he-IL': 'he',
      'ru-RU': 'ru',
      'az-AZ': 'az'
    };
    
    const mappedLocale = localeMap[locale] || 'en';
    return textObject[mappedLocale] || textObject['en'];
  };

  return {
    storeName: activeStoreConfig.storeName,
    tagline: getLocalizedText(activeStoreConfig.tagline),
    description: getLocalizedText(activeStoreConfig.description),
    heroTitle: getLocalizedText(activeStoreConfig.heroTitle),
    heroSubtitle: getLocalizedText(activeStoreConfig.heroSubtitle),
    storeType: activeStoreConfig.storeType,
    colors: activeStoreConfig.colors
  };
}

/**
 * Get store config value
 */
export function getStoreConfigValue<K extends keyof typeof activeStoreConfig>(
  key: K
): typeof activeStoreConfig[K] {
  return activeStoreConfig[key];
}
