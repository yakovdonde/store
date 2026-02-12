# Store Setup & Configuration Guide

## For Vendors: Launch Your Own Store

This guide walks you through setting up and launching your own branded online store using the Donde Store Constructor platform.

## Quick Start: Two Setup Methods

### Method 1: Web-Based Setup Wizard (Easiest)

Perfect for vendors who prefer a visual interface.

1. **Start your application:**
   ```bash
   docker-compose up -d
   ```

2. **Open the setup wizard:**
   Visit `http://localhost:3000/setup` in your browser

3. **Follow the 6-step wizard:**
   - Step 1: Store Information (name, contact, address)
   - Step 2: Color Scheme (customize your brand colors)
   - Step 3: Currencies & Languages
   - Step 4: Product Categories
   - Step 5: Store Features
   - Step 6: Review & Complete

4. **Your store is ready!**
   All settings are automatically saved and applied.

### Method 2: CLI Setup Wizard (For Developers)

Use the command-line setup tool for scripted installations.

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run the setup wizard:**
   ```bash
   node ../scripts/setup-wizard.js
   ```
   Or add to package.json:
   ```bash
   npm run setup
   ```

3. **Answer the interactive prompts:**
   - Store name and description
   - Contact information
   - Color customization
   - Currency selection
   - Product categories
   - Feature preferences

4. **Configuration saved!**
   Your config is stored in `frontend/src/config/stores/` as JSON

## Configuration Overview

### What Gets Configured

#### 1. Store Information
- Store name and description
- Email, phone, WhatsApp, address
- All customer-facing contact details

#### 2. Branding
- Primary color (buttons, CTAs)
- Primary hover color (interaction states)
- Secondary color (accents, footer)
- Text color (readability)
- Footer background color

#### 3. Currencies
- Supported currencies (USD, EUR, ILS, AZN, etc.)
- Default currency for pricing
- Automatic conversion on storefront

#### 4. Languages
- English (default)
- Hebrew
- Russian
- Azerbaijani
- Full multi-language support out of the box

#### 5. Product Categories
- Custom category names
- Category descriptions
- Icon/emoji per category
- Unlimited categories supported

#### 6. Features
- Online payment acceptance
- Shipping options
- All other features always included

## Configuration Storage

### Web-Based Setup
Configuration is stored in your database and can be edited:
1. Log in to admin dashboard
2. Go to Settings → Store Configuration
3. Make changes and save

### CLI Setup
Configuration is saved as JSON files:
```
frontend/src/config/stores/
├── your-store-name.json
├── judaica-store.json
├── car-parts-store.json
└── ...
```

## Customization Examples

### Judaica Store
```json
{
  "storeName": "Donde Judaica Store",
  "storeDescription": "Authentic Judaica items and religious gifts",
  "colors": {
    "primary": "#8b2635",      // Burgundy
    "secondary": "#1a2847",    // Navy
    "text": "#2c1810"          // Deep brown
  },
  "categories": [
    { "name": "Books", "icon": "📚" },
    { "name": "Ritual Items", "icon": "🕎" },
    { "name": "Jewelry", "icon": "✡️" }
  ]
}
```

### Car Parts Store
```json
{
  "storeName": "Donde Auto Parts",
  "storeDescription": "Quality automotive parts and accessories",
  "colors": {
    "primary": "#d32f2f",      // Red
    "secondary": "#1565c0",    // Blue
    "text": "#212121"          // Dark gray
  },
  "categories": [
    { "name": "Engine Parts", "icon": "⚙️" },
    { "name": "Brakes", "icon": "🛞" },
    { "name": "Suspension", "icon": "🔧" }
  ]
}
```

### Electronics Store
```json
{
  "storeName": "Donde Electronics",
  "storeDescription": "Latest tech and gadgets",
  "colors": {
    "primary": "#2196F3",      // Blue
    "secondary": "#FF9800",    // Orange
    "text": "#212121"          // Dark gray
  },
  "categories": [
    { "name": "Smartphones", "icon": "📱" },
    { "name": "Laptops", "icon": "💻" },
    { "name": "Accessories", "icon": "🎧" }
  ]
}
```

## After Setup: Next Steps

### 1. Login to Admin Dashboard
- URL: `http://localhost:3000/[locale]/admin`
- Default credentials: (see backend .env)

### 2. Add Product Categories
1. Go to Admin → Categories
2. Click "Add Category"
3. Fill in name, description, translations
4. Set icon/color

### 3. Upload Products
1. Go to Admin → Products
2. Click "Add Product"
3. Upload image, set price, add translations
4. Assign to category

### 4. Configure Store Settings
1. Go to Admin → Settings
2. Update store info, colors, contact details
3. Configure currencies
4. Set up payment methods

### 5. Deploy to Production
See [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Docker production setup
- SSL/HTTPS configuration
- Database backups
- Monitoring & analytics

## Color Picker Tips

### Professional Color Combinations

**Classic (Judaica-Inspired)**
```
Primary: #8b2635 (Burgundy)
Secondary: #1a2847 (Navy)
Accent: #d4af37 (Gold)
```

**Modern (Tech/Electronics)**
```
Primary: #2196F3 (Blue)
Secondary: #4CAF50 (Green)
Accent: #FF9800 (Orange)
```

**Bold (Fashion/Retail)**
```
Primary: #E91E63 (Pink)
Secondary: #9C27B0 (Purple)
Accent: #FF5722 (Orange-Red)
```

**Professional (B2B)**
```
Primary: #1976D2 (Professional Blue)
Secondary: #424242 (Dark Gray)
Accent: #00796B (Teal)
```

### Color Best Practices
- **Primary:** Use for main CTAs, buttons, links
- **Secondary:** Use for headers, footers, accents
- **Text:** High contrast with backgrounds (WCAG AA minimum)
- **Test:** Verify readability on light and dark backgrounds

## Translations

After setup, translations can be added for:
- Store description
- Hero section text
- Category names and descriptions
- Product content

### Language Support
All stores support 4 languages by default:
- **English** (en)
- **Hebrew** (he) - RTL support
- **Russian** (ru)
- **Azerbaijani** (az)

Add more languages in `frontend/src/i18n.ts`

## Environment Variables

### Essential Variables
```bash
# Store selection
NEXT_PUBLIC_STORE_NAME=your-store-name    # Set by setup
NEXT_PUBLIC_STORE_TYPE=custom             # Set by setup

# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Database (backend)
DATABASE_URL=postgresql://...

# JWT (backend)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Optional Variables
```bash
# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your Store Name

# Payment integration (when ready)
STRIPE_PUBLIC_KEY=...
STRIPE_SECRET_KEY=...

# Email notifications
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

## Troubleshooting

### Setup wizard doesn't load
- Ensure frontend is running: `docker-compose ps`
- Check browser console for errors
- Verify port 3000 is not blocked

### Configuration not saved
- Check admin panel shows your values
- Verify database connection
- Check browser DevTools Network tab

### Colors not applying
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)
- Check hex color format (#RRGGBB)

### Categories missing
- Re-save configuration in admin
- Check categories are in multiple languages
- Verify database migrations ran

## Advanced Customization

### Adding Custom Logo
1. Add logo to `frontend/public/logos/`
2. Update config with logo URL
3. Modify Header component to use custom logo

### Custom Fonts
1. Add fonts to `frontend/public/fonts/`
2. Import in `frontend/src/app/globals.css`
3. Update CSS variables for typography

### Custom Email Templates
1. Create templates in `backend/templates/`
2. Update email service to use custom templates
3. Configure in admin settings

## Support & Resources

- 📚 [Store Constructor Guide](./STORE_CONSTRUCTOR_GUIDE.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 📖 [API Documentation](./docs/API.md)
- 💬 [GitHub Issues](https://github.com/yakovdonde/store/issues)

## Next: Launch Your Store!

Once configured:

1. **Test locally** - Visit http://localhost:3000
2. **Add products** - Use admin panel
3. **Customize further** - Fine-tune colors, text, settings
4. **Deploy** - Follow deployment guide
5. **Go live** - Your store is ready for customers!

---

**Questions?** Check the troubleshooting section or open an issue on GitHub.

**Ready to launch?** Start with Method 1 (Web-Based Setup) - it's the easiest! 🚀
