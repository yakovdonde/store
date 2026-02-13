'use client'

import { useEffect } from 'react';
import { activeStoreConfig } from '@/config/storeConfig';

export default function DynamicStyles() {
  useEffect(() => {
    const root = document.documentElement;

    const applyPrimaryColor = (color: string) => {
      console.log('Applying primary color:', color);
      root.style.setProperty('--color-primary', color);
      root.style.setProperty('--color-primary-hover', adjustBrightness(color, -20));
    };

    const fetchAndApplyColors = async () => {
      let primaryColorApplied = false;

      // First, try to get primary_color from settings (from branding page)
      try {
        const settingsResponse = await fetch(`/api/settings?t=${Date.now()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          if (settingsData.success && settingsData.data?.primary_color) {
            const primaryColor = settingsData.data.primary_color;
            console.log('Applying primary color from branding settings:', primaryColor);
            applyPrimaryColor(primaryColor);
            primaryColorApplied = true;
          }
        }
      } catch (error) {
        console.log('Could not fetch settings:', error);
      }

      // Next, try to fetch setup configuration for other colors
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
              // Only apply primary color from setup if not already applied from settings
              if (!primaryColorApplied && config.primaryColor) {
                root.style.setProperty('--color-primary', config.primaryColor);
                root.style.setProperty('--color-primary-hover', config.primaryHoverColor || adjustBrightness(config.primaryColor, -20));
              } else if (!primaryColorApplied) {
                root.style.setProperty('--color-primary', activeStoreConfig.colors.primary);
                root.style.setProperty('--color-primary-hover', activeStoreConfig.colors.primaryHover);
              }
              root.style.setProperty('--color-secondary', config.secondaryColor || activeStoreConfig.colors.secondary);
              root.style.setProperty('--color-text', config.textColor || activeStoreConfig.colors.text);
              root.style.setProperty('--color-footer-bg', config.footerBgColor || activeStoreConfig.colors.footerBg);
              return; // Successfully applied setup config
            }
          }
        }
      } catch (error) {
        console.log('Could not fetch setup config:', error);
      }

      // Fallback to hardcoded config if nothing was applied
      if (!primaryColorApplied) {
        const colors = activeStoreConfig.colors;
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-primary-hover', colors.primaryHover);
      }
      root.style.setProperty('--color-secondary', activeStoreConfig.colors.secondary);
      root.style.setProperty('--color-text', activeStoreConfig.colors.text);
      root.style.setProperty('--color-footer-bg', activeStoreConfig.colors.footerBg);
      root.style.setProperty('--color-footer-border', activeStoreConfig.colors.footerBorder);
    };

    // Listen for branding updates
    const handleBrandingUpdate = (event: CustomEvent) => {
      console.log('Branding updated event received:', event.detail);
      if (event.detail?.primary_color) {
        applyPrimaryColor(event.detail.primary_color);
      }
    };

    window.addEventListener('brandingUpdated', handleBrandingUpdate as EventListener);
    fetchAndApplyColors();

    return () => {
      window.removeEventListener('brandingUpdated', handleBrandingUpdate as EventListener);
    };
  }, []);

  return null;
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + (R * 0x10000) + (G * 0x100) + B).toString(16).slice(1);
}
