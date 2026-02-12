'use client'

import { useEffect } from 'react';
import { activeStoreConfig } from '@/config/storeConfig';

export default function DynamicStyles() {
  useEffect(() => {
    // Apply custom CSS variables based on store configuration
    const root = document.documentElement;
    const colors = activeStoreConfig.colors;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-footer-bg', colors.footerBg);
    root.style.setProperty('--color-footer-border', colors.footerBorder);
  }, []);

  return null;
}
