# Store Constructor Guide

## Overview

This project is a **configurable multi-store constructor** that allows you to quickly launch different types of e-commerce stores (Judaica store, car parts store, electronics, etc.) using a single codebase. Switch between store types by changing one environment variable.

## Features

- 🎨 **Dynamic Branding** - Store name, tagline, and hero content configurable per store type
- 🎨 **Custom Color Schemes** - Each store type can have its own color palette
- 🌍 **Multi-language Support** - All store content translated to English, Hebrew, Russian, and Azerbaijani
- 📦 **Pre-configured Categories** - Default categories for each store type
- 💱 **Currency Support** - Custom currency options per store type
- 🔧 **Easy Configuration** - Single configuration file to add new store types

## Quick Start

### 1. Choose Your Store Type

Set the store type in your environment:

**Docker (docker-compose.yml):**
```yaml
environment:
  NEXT_PUBLIC_STORE_TYPE: judaica  # or car-parts
```

**Local Development (.env.local):**
```bash
NEXT_PUBLIC_STORE_TYPE=judaica
```

### 2. Available Store Types

#### Judaica Store (`judaica`)
- Religious books, ritual items, mezuzahs, jewelry
- Chassidic-inspired color scheme (burgundy & navy)
- Currencies: USD, ILS, EUR, AZN

#### Car Parts Store (`car-parts`)
- Engine parts, brakes, suspension, lighting, body parts, interior
- Automotive color scheme (red & blue)
- Currencies: USD, EUR, AZN

### 3. Restart Your Application

**Docker:**
```bash
docker-compose down
docker-compose up --build
```

**Local Development:**
```bash
npm run dev
```

Your store will now reflect the selected configuration!

## Creating a New Store Type

### Step 1: Define Store Configuration

Edit `frontend/src/config/storeConfig.ts` and add your new store configuration:

```typescript
export const electronicsStoreConfig: StoreConfig = {
  storeType: 'electronics',
  storeName: 'Donde Electronics',
  
  // Localized taglines
  tagline: {
    en: 'Latest Tech & Electronics',
    he: 'טכנולוגיה ואלקטרוניקה מתקדמת',
    ru: 'Новейшая техника и электроника',
    az: 'Ən Son Texnologiya və Elektronika'
  },
  
  // Localized descriptions
  description: {
    en: 'Find the latest electronics and tech gadgets',
    he: 'מצא את האלקטרוניקה והגאדג׳טים העדכניים ביותר',
    ru: 'Найдите новейшую электронику и гаджеты',
    az: 'Ən son elektronika və qadcetləri tapın'
  },
  
  // Hero section content
  heroTitle: {
    en: 'Welcome to Donde Electronics',
    he: 'ברוכים הבאים לאלקטרוניקה דונדה',
    ru: 'Добро пожаловать в Donde Electronics',
    az: 'Donde Elektronikaya Xoş Gəlmisiniz'
  },
  
  heroSubtitle: {
    en: 'Discover cutting-edge technology and electronics',
    he: 'גלו טכנולוגיה ואלקטרוניקה חדישה',
    ru: 'Откройте для себя передовые технологии и электронику',
    az: 'Ən müasir texnologiya və elektronika kəşf edin'
  },
  
  // Default product categories
  defaultCategories: [
    {
      name: {
        en: 'Smartphones',
        he: 'סמארטפונים',
        ru: 'Смартфоны',
        az: 'Smartfonlar'
      },
      description: {
        en: 'Latest smartphones and accessories',
        he: 'סמארטפונים ואביזרים חדישים',
        ru: 'Новейшие смартфоны и аксессуары',
        az: 'Ən son smartfonlar və aksesuarlar'
      },
      icon: '📱'
    },
    {
      name: {
        en: 'Laptops',
        he: 'מחשבים ניידים',
        ru: 'Ноутбуки',
        az: 'Noutbuklar'
      },
      description: {
        en: 'High-performance laptops',
        he: 'מחשבים ניידים בעלי ביצועים גבוהים',
        ru: 'Высокопроизводительные ноутбуки',
        az: 'Yüksək performanslı noutbuklar'
      },
      icon: '💻'
    },
    // Add more categories...
  ],
  
  // Custom color scheme
  colors: {
    primary: '#2196F3',           // Main action color
    primaryHover: '#1976D2',      // Hover state for primary
    secondary: '#FF9800',         // Secondary accent color
    text: '#212121',              // Main text color
    footerBg: '#263238',          // Footer background
    footerBorder: '#37474f'       // Footer border color
  },
  
  // Supported currencies
  currencies: ['USD', 'EUR', 'GBP'],
  defaultCurrency: 'USD'
};
```

### Step 2: Register the Store Type

Update the `getStoreConfig()` function in the same file:

```typescript
export function getStoreConfig(): StoreConfig {
  const storeType = process.env.NEXT_PUBLIC_STORE_TYPE || 'judaica';
  
  switch (storeType) {
    case 'electronics':
      return electronicsStoreConfig;
    case 'car-parts':
      return carPartsStoreConfig;
    case 'judaica':
    default:
      return judaicaStoreConfig;
  }
}
```

### Step 3: Use Your New Store

Set the environment variable:
```bash
NEXT_PUBLIC_STORE_TYPE=electronics
```

Rebuild and run your application!

## Configuration Options Explained

### Store Colors

Colors are applied dynamically using CSS variables:

- **primary**: Main buttons, CTAs, active states
- **primaryHover**: Hover state for primary elements
- **secondary**: Footer background, hero gradients
- **text**: Main body text color
- **footerBg**: Footer background color
- **footerBorder**: Footer border color

### Categories

Each store type can define default categories that will be suggested to administrators. Categories include:

- Multilingual names (en, he, ru, az)
- Multilingual descriptions
- Icon/emoji for visual representation

### Currencies

Define which currencies your store supports. The first currency in the array is the base currency for products.

## Advanced Customization

### Custom CSS Overrides

You can override styles per store type by checking the store type in your components:

```typescript
import { activeStoreConfig } from '@/config/storeConfig';

// In your component
const customStyles = {
  backgroundColor: activeStoreConfig.storeType === 'electronics' 
    ? '#f0f0f0' 
    : '#ffffff'
};
```

### Dynamic Images/Logos

You can define logo URLs in the store config:

```typescript
export const electronicsStoreConfig: StoreConfig = {
  // ... other config
  logoUrl: '/logos/electronics-logo.png',
  faviconUrl: '/favicons/electronics-favicon.ico',
};
```

Then update the configuration interface:

```typescript
export interface StoreConfig {
  // ... existing fields
  logoUrl?: string;
  faviconUrl?: string;
}
```

## Environment Variables

### Required Variables

```bash
# Store type selection (required)
NEXT_PUBLIC_STORE_TYPE=judaica

# API endpoint (required)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Optional Variables

```bash
# App URL for metadata
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database configuration (backend)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# JWT configuration (backend)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

## Docker Deployment

### Quick Deploy

```bash
# Set store type in docker-compose.yml
# Then run:
docker-compose up --build -d
```

### Production Deployment

```bash
# Use production docker-compose file
docker-compose -f docker-compose.prod.yml up --build -d
```

## Project Structure

```
frontend/
├── src/
│   ├── config/
│   │   └── storeConfig.ts          # Store configurations
│   ├── lib/
│   │   └── storeUtils.ts           # Helper functions
│   ├── components/
│   │   └── common/
│   │       └── DynamicStyles.tsx   # Dynamic CSS injection
│   └── app/
│       └── [locale]/
│           ├── layout.tsx          # Uses store config for metadata
│           └── storefront/
│               └── page.tsx        # Uses dynamic store text
```

## Best Practices

1. **Always provide all language translations** - Ensure every text field has en, he, ru, and az translations
2. **Use meaningful color names** - Document what each color is used for
3. **Test all languages** - Switch between languages to verify translations display correctly
4. **Maintain consistency** - Keep similar store types (e.g., all retail) with similar category structures
5. **Document custom stores** - Add comments explaining unique configuration choices

## Troubleshooting

### Store type not changing
1. Check environment variable is set correctly
2. Rebuild Docker containers: `docker-compose up --build`
3. Clear Next.js cache: `rm -rf .next`

### Colors not updating
1. Verify color format is hex (e.g., `#FF0000`)
2. Check browser cache - do a hard refresh (Ctrl+Shift+R)
3. Inspect CSS variables in browser DevTools

### Translations missing
1. Ensure all language keys (en, he, ru, az) are present in config
2. Check locale is set correctly in URL (e.g., `/en/storefront`)
3. Verify the useStoreText hook is imported and used

## Examples

### Fashion Store
```typescript
export const fashionStoreConfig: StoreConfig = {
  storeType: 'fashion',
  storeName: 'Donde Fashion',
  colors: {
    primary: '#E91E63',
    primaryHover: '#C2185B',
    secondary: '#9C27B0',
    text: '#212121',
    footerBg: '#424242',
    footerBorder: '#616161'
  },
  // ... rest of config
};
```

### Sports Equipment Store
```typescript
export const sportsStoreConfig: StoreConfig = {
  storeType: 'sports',
  storeName: 'Donde Sports',
  colors: {
    primary: '#4CAF50',
    primaryHover: '#388E3C',
    secondary: '#FF5722',
    text: '#212121',
    footerBg: '#2E7D32',
    footerBorder: '#1B5E20'
  },
  // ... rest of config
};
```

## Support

For questions or issues:
1. Check this documentation
2. Review existing store configurations for examples
3. Test in development before deploying to production

---

**Built with flexibility in mind. Happy store building! 🚀**
