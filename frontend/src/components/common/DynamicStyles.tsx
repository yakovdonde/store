'use client'

import { useEffect } from 'react';
import { activeStoreConfig } from '@/config/storeConfig';

export default function DynamicStyles() {
  useEffect(() => {
    const root = document.documentElement;

    // Try to fetch setup configuration from the backend
    const fetchAndApplySetupConfig = async () => {
      try {
        const response = await fetch('/api/admin/setup', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Setup config retrieved:', data);
          
          // If we have custom colors from setup, use them
          if (data.data) {
            const setupData = data.data;
            
            // Apply colors from setup if they exist in setup_config
            if (setupData.setup_config) {
              const config = typeof setupData.setup_config === 'string' 
                ? JSON.parse(setupData.setup_config) 
                : setupData.setup_config;
              
              console.log('Applying setup colors:', config);
              root.style.setProperty('--color-primary', config.primaryColor || activeStoreConfig.colors.primary);
              root.style.setProperty('--color-primary-hover', config.primaryHoverColor || activeStoreConfig.colors.primaryHover);
              root.style.setProperty('--color-secondary', config.secondaryColor || activeStoreConfig.colors.secondary);
              root.style.setProperty('--color-text', config.textColor || activeStoreConfig.colors.text);
              root.style.setProperty('--color-footer-bg', config.footerBgColor || activeStoreConfig.colors.footerBg);
              return; // Successfully applied setup config
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch setup config, using defaults:', error);
      }

      // Fallback to hardcoded config
      const colors = activeStoreConfig.colors;
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-primary-hover', colors.primaryHover);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-text', colors.text);
      root.style.setProperty('--color-footer-bg', colors.footerBg);
      root.style.setProperty('--color-footer-border', colors.footerBorder);
    };

    fetchAndApplySetupConfig();
  }, []);

  return null;
}
