# Internationalization (i18n) Feature Documentation

## Overview

The Judaica Store Platform now supports multiple languages, allowing administrators to customize category names for different language audiences and users to browse the storefront in their preferred language.

**Last Updated:** February 11, 2026

## Supported Languages

1. 🇬🇧 **English (EN)** - Primary language
2. 🇷🇺 **Russian (RU)** - Русский
3. 🇮🇱 **Hebrew (HE)** - עברית
4. 🇦🇿 **Azerbaijani (AZ)** - Azərbaycan *(hidden from public UI)*

## Features

### Multi-Language Category Names

Administrators can set unique names for each category in all supported languages. This allows the same category to display different text depending on the user's selected language.

**Example:**
- English: "Ritual Objects"
- Russian: "Ритуальные предметы"
- Hebrew: "חפצי טקס"
- Azerbaijani: "Ritual Əsərləri"

### Language Switcher

A language switcher dropdown is available in the header, allowing users to change their preferred language on the fly. The selected language is stored and all category names automatically update to display in the chosen language.

**Note:** Azerbaijani is currently hidden from the language switcher but remains functional for direct URL access.

## Technical Implementation

### Database Schema

The `categories` table includes multi-language columns:

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,  -- Internal identifier
  name_en VARCHAR(255),                -- English name
  name_ru VARCHAR(255),                -- Russian name
  name_he VARCHAR(255),                -- Hebrew name
  name_az VARCHAR(255),                -- Azerbaijani name
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Backend API

#### Category Creation/Update

When creating or updating a category, you can now include language-specific names:

**POST/PUT** `/api/categories`

```json
{
  "name": "ritual_objects",
  "name_en": "Ritual Objects",
  "name_ru": "Ритуальные предметы",
  "name_he": "חפצי טקס",
  "name_az": "Ritual Əsərləri",
  "description": "Essential ritual items",
  "order_index": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "ritual_objects",
    "name_en": "Ritual Objects",
    "name_ru": "Ритуальные предметы",
    "name_he": "חפצי טקס",
    "name_az": "Ritual Əsərləri",
    "description": "Essential ritual items",
    "parent_id": null,
    "order_index": 1,
    "created_at": "2026-02-11T...",
    "updated_at": "2026-02-11T..."
  }
}
```

All language fields are **optional**. If not provided, they will be `null`.

### Frontend Implementation

#### Admin Panel - Category Form

The category form in the admin panel (`/admin/categories`) now includes separate input fields for each language:

- **Internal Name** - System identifier (required)
- **English Name** - 🇬🇧 English display name
- **Russian Name** - 🇷🇺 Русский display name
- **Hebrew Name** - 🇮🇱 עברית display name
- **Azerbaijani Name** - 🇦🇿 Azərbaycan display name

These fields are grouped in a visually distinct section called "Category Names by Language" for better UX.

#### Storefront Display

The storefront automatically displays category names in the user's selected language:

**Component:** `CategoryGrid`, `SearchBar`, Category filters

**Logic:**
```typescript
import { getLocalizedCategoryName } from '@/lib/categoryUtils'
import { useLocale } from 'next-intl'

const locale = useLocale() // 'en', 'ru', 'he', or 'az'
const displayName = getLocalizedCategoryName(category, locale)
```

**Fallback Chain:**
1. Localized name (e.g., `name_ru` for Russian)
2. English name (`name_en`)
3. Internal name (`name`)

This ensures categories always display properly even if not all translations are provided.

#### Language Switcher

**Component:** `LanguageSwitcher`
**Location:** Header

The language switcher is a dropdown that shows available languages. When changed, it updates the URL locale segment and all localized content refreshes automatically.

**Current Configuration:**
- Shows: English, Russian, Hebrew
- Hidden: Azerbaijani (still accessible via `/az/...` URLs)

To unhide Azerbaijani, modify `LanguageSwitcher.tsx`:

```typescript
// Current (hidden):
{locales.filter((loc) => loc !== 'az').map((loc) => (

// To show all:
{locales.map((loc) => (
```

## Utility Functions

### `getLocalizedCategoryName()`

**File:** `frontend/src/lib/categoryUtils.ts`

Retrieves the category name in the specified language with automatic fallback.

```typescript
export function getLocalizedCategoryName(
  category: Category, 
  locale: string
): string {
  const localeKey = `name_${locale}` as keyof Category
  const localizedName = category[localeKey] as string | undefined
  
  // Fallback: localized → English → internal name
  return localizedName || category.name_en || category.name
}
```

**Usage:**

```typescript
import { getLocalizedCategoryName } from '@/lib/categoryUtils'

const categoryName = getLocalizedCategoryName(category, 'ru')
// Returns Russian name if available, otherwise English, otherwise internal name
```

## Migration

The multi-language columns were added to existing categories table via direct SQL:

```sql
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_ru VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_he VARCHAR(255),
ADD COLUMN IF NOT EXISTS name_az VARCHAR(255);

-- Migrate existing names to English
UPDATE categories
SET name_en = name
WHERE name_en IS NULL;
```

## Usage Guide

### For Administrators

1. **Navigate to Admin Panel:** `/admin/categories`
2. **Create or Edit a Category**
3. **Fill in Language Fields:**
   - Enter the internal name (required, used as system identifier)
   - Enter translated names for each language you want to support
   - Leave fields blank for languages you don't need
4. **Save the Category**

The category will now display the appropriate name based on each user's language selection.

### For Developers

#### Adding a New Language

1. **Update i18n Configuration**
   ```typescript
   // frontend/src/i18n.ts
   export const locales = ['en', 'ru', 'he', 'az', 'fr'] as const
   export const localeNames = {
     // ... existing
     fr: 'Français'
   }
   ```

2. **Add Database Column**
   ```sql
   ALTER TABLE categories
   ADD COLUMN IF NOT EXISTS name_fr VARCHAR(255);
   ```

3. **Update TypeScript Types**
   ```typescript
   // backend/src/types/index.ts
   export interface Category {
     // ... existing
     name_fr?: string
   }
   ```

4. **Update Backend Model**
   ```typescript
   // backend/src/models/category.ts
   export const createCategory = async (
     // ... existing params
     nameFr?: string
   ): Promise<Category> => {
     // Add name_fr to INSERT statement
   }
   ```

5. **Update Frontend Form**
   ```tsx
   // Add French input field to CategoryForm.tsx
   ```

6. **Add Translation Messages**
   ```json
   // frontend/messages/fr.json
   ```

## Best Practices

1. **Always provide English names** - English serves as the primary fallback
2. **Keep names consistent** - Similar terminology across languages
3. **Test RTL languages** - Hebrew displays right-to-left; ensure UI handles it properly
4. **Consider SEO** - Use language-specific meta tags for better search rankings
5. **Translation quality** - Use native speakers or professional translation services

## Future Enhancements

- **Product translations** - Extend multi-language support to product titles/descriptions
- **Settings translations** - Translate store settings (site title, descriptions)
- **Admin panel language** - Allow admins to choose their admin interface language
- **Auto-translation** - Optional integration with translation APIs
- **Language detection** - Automatically detect user's browser language

## Troubleshooting

### Category names not showing in a specific language

1. Check if the language field is populated in the database
2. Verify the locale is correctly passed to `getLocalizedCategoryName()`
3. Check browser console for errors
4. Ensure the category was saved properly in admin panel

### Language switcher not working

1. Verify routing configuration in Next.js
2. Check middleware configuration for locale detection
3. Ensure `next-intl` is properly configured
4. Check browser console for errors

### RTL issues with Hebrew

1. Use `dir="rtl"` attribute on appropriate elements
2. Test layout in Hebrew mode
3. Consider using logical CSS properties (start/end instead of left/right)

## Resources

- **next-intl Documentation:** https://next-intl-docs.vercel.app/
- **i18n Best Practices:** https://www.w3.org/International/
- **RTL Design Guidelines:** https://material.io/design/usability/bidirectionality.html

---

**Version:** 1.0.0  
**Feature Status:** ✅ Production Ready  
**Last Updated:** February 11, 2026
