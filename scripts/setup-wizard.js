#!/usr/bin/env node

/**
 * Store Setup Wizard
 * Interactive CLI tool for vendors to configure their online store
 * Usage: npm run setup or node scripts/setup-wizard.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function printHeader(text) {
  console.log('\n' + colorize('═'.repeat(70), 'cyan'));
  console.log(colorize(text, 'bright blue'));
  console.log(colorize('═'.repeat(70), 'cyan') + '\n');
}

function printSection(text) {
  console.log('\n' + colorize(text, 'yellow'));
  console.log(colorize('─'.repeat(70), 'yellow') + '\n');
}

async function setupWizard() {
  printHeader('🏪 Store Constructor Setup Wizard');
  console.log(
    colorize(
      'Welcome! This wizard will help you configure your online store.\n',
      'green'
    )
  );

  const config = {};

  // Store Type Selection
  printSection('Step 1: Choose Your Store Type');
  console.log('1. Judaica Store - Religious items and gifts');
  console.log('2. Car Parts Store - Automotive parts and accessories');
  console.log('3. Custom Store - Create your own (advanced)\n');

  let storeTypeChoice = await question(
    colorize('Select store type (1-3): ', 'cyan')
  );
  while (!['1', '2', '3'].includes(storeTypeChoice)) {
    storeTypeChoice = await question(
      colorize('Invalid choice. Please select 1-3: ', 'red')
    );
  }

  const storeTypes = {
    '1': 'judaica',
    '2': 'car-parts',
    '3': 'custom',
  };

  config.storeType = storeTypes[storeTypeChoice];

  // Store Branding
  printSection('Step 2: Store Branding');

  config.storeName = await question(
    colorize('Store Name (e.g., "My Judaica Shop"): ', 'cyan')
  );

  config.storeDescription = await question(
    colorize(
      'Store Description (short tagline for hero section): ',
      'cyan'
    )
  );

  config.storeEmail = await question(colorize('Store Email: ', 'cyan'));
  config.storePhone = await question(colorize('Store Phone Number: ', 'cyan'));
  config.storeWhatsapp = await question(
    colorize('WhatsApp Number (with country code): ', 'cyan')
  );
  config.storeAddress = await question(colorize('Store Address: ', 'cyan'));

  // Colors
  printSection('Step 3: Color Scheme');
  console.log(
    'Customize your store colors. Press Enter to use defaults.\n'
  );

  config.primaryColor = await question(
    colorize('Primary Color (hex code, e.g., #8b2635): ', 'cyan')
  );
  if (!config.primaryColor) config.primaryColor = '#8b2635';

  config.primaryHoverColor = await question(
    colorize('Primary Hover Color (hex code): ', 'cyan')
  );
  if (!config.primaryHoverColor) config.primaryHoverColor = '#6b2d1f';

  config.secondaryColor = await question(
    colorize('Secondary Color (hex code): ', 'cyan')
  );
  if (!config.secondaryColor) config.secondaryColor = '#1a2847';

  config.textColor = await question(colorize('Text Color (hex code): ', 'cyan'));
  if (!config.textColor) config.textColor = '#2c1810';

  config.footerBgColor = await question(
    colorize('Footer Background Color (hex code): ', 'cyan')
  );
  if (!config.footerBgColor) config.footerBgColor = '#1a2847';

  // Currencies
  printSection('Step 4: Currencies');
  console.log('Supported currencies: USD, EUR, GBP, ILS, AZN, AUD, CAD, JPY\n');

  const currenciesStr = await question(
    colorize(
      'Select currencies (comma-separated, e.g., USD,EUR,ILS): ',
      'cyan'
    )
  );
  config.currencies = currenciesStr
    .split(',')
    .map((c) => c.trim().toUpperCase());

  config.defaultCurrency = await question(
    colorize('Default currency: ', 'cyan')
  );

  // Categories (for custom stores)
  let categories = [];
  if (config.storeType === 'custom') {
    printSection('Step 5: Product Categories');

    let addMore = true;
    while (addMore) {
      const categoryName = await question(
        colorize('Category name (or press Enter to skip): ', 'cyan')
      );
      if (!categoryName) break;

      const categoryDesc = await question(
        colorize('Category description: ', 'cyan')
      );
      const categoryIcon = await question(
        colorize('Category icon/emoji (e.g., 📱, 🏠): ', 'cyan')
      );

      categories.push({
        name: categoryName,
        description: categoryDesc,
        icon: categoryIcon || '📦',
      });

      const more = await question(
        colorize('Add another category? (y/n): ', 'cyan')
      );
      addMore = more.toLowerCase() === 'y';
    }
  }

  config.categories = categories;

  // Payment & Shipping
  printSection('Step 6: Payment & Shipping Settings');

  config.acceptPayment = await question(
    colorize('Accept online payments? (y/n): ', 'cyan')
  );

  config.offerShipping = await question(
    colorize('Offer shipping options? (y/n): ', 'cyan')
  );

  // Languages
  printSection('Step 7: Languages');
  console.log(
    'Your store will support: English, Hebrew, Russian, Azerbaijani\n'
  );
  console.log(
    colorize('Note: You can provide translations for your custom content.', 'blue')
  );

  config.primaryLanguage = await question(
    colorize('Primary language (en/he/ru/az): ', 'cyan')
  );

  // Review & Save
  printSection('Configuration Summary');
  console.log(colorize('Store Type:', 'bright') + ' ' + config.storeType);
  console.log(colorize('Store Name:', 'bright') + ' ' + config.storeName);
  console.log(colorize('Email:', 'bright') + ' ' + config.storeEmail);
  console.log(colorize('Phone:', 'bright') + ' ' + config.storePhone);
  console.log(
    colorize('Currencies:', 'bright') + ' ' + config.currencies.join(', ')
  );
  console.log(
    colorize('Primary Language:', 'bright') + ' ' + config.primaryLanguage
  );

  const confirm = await question(
    colorize('\nSave this configuration? (y/n): ', 'cyan')
  );

  if (confirm.toLowerCase() !== 'y') {
    console.log(colorize('\nSetup cancelled.', 'yellow'));
    rl.close();
    return;
  }

  // Save configuration
  saveConfiguration(config);

  rl.close();
}

function saveConfiguration(config) {
  // Create stores directory if it doesn't exist
  const storesDir = path.join(__dirname, '../frontend/src/config/stores');
  if (!fs.existsSync(storesDir)) {
    fs.mkdirSync(storesDir, { recursive: true });
  }

  // Generate filename from store name
  const filename =
    config.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'custom-store';

  const configPath = path.join(storesDir, `${filename}.json`);

  // Create the vendor configuration
  const vendorConfig = {
    storeType: config.storeType,
    storeName: config.storeName,
    tagline: {
      en: config.storeDescription,
      he: '', // Vendor should fill these
      ru: '',
      az: '',
    },
    description: {
      en: config.storeDescription,
      he: '',
      ru: '',
      az: '',
    },
    heroTitle: {
      en: `Welcome to ${config.storeName}`,
      he: '',
      ru: '',
      az: '',
    },
    heroSubtitle: {
      en: config.storeDescription,
      he: '',
      ru: '',
      az: '',
    },
    defaultCategories:
      config.categories.length > 0
        ? config.categories.map((cat) => ({
            name: { en: cat.name, he: '', ru: '', az: '' },
            description: { en: cat.description, he: '', ru: '', az: '' },
            icon: cat.icon,
          }))
        : [],
    colors: {
      primary: config.primaryColor,
      primaryHover: config.primaryHoverColor,
      secondary: config.secondaryColor,
      text: config.textColor,
      footerBg: config.footerBgColor,
      footerBorder: 'rgba(0,0,0,0.1)',
    },
    currencies: config.currencies,
    defaultCurrency: config.defaultCurrency,
    contact: {
      email: config.storeEmail,
      phone: config.storePhone,
      whatsapp: config.storeWhatsapp,
      address: config.storeAddress,
    },
    features: {
      acceptPayment: config.acceptPayment === 'y',
      offerShipping: config.offerShipping === 'y',
    },
    primaryLanguage: config.primaryLanguage,
    createdAt: new Date().toISOString(),
  };

  // Save to file
  fs.writeFileSync(configPath, JSON.stringify(vendorConfig, null, 2));

  // Also update/create environment file
  updateEnvironmentFile(config.storeType, filename);

  // Print success message
  console.log(
    '\n' + colorize('✓ Configuration saved successfully!', 'green')
  );
  console.log(
    colorize(`\nConfiguration file: ${path.relative(process.cwd(), configPath)}`, 'blue')
  );

  console.log(
    colorize(
      `\nNext steps:\n`,
      'bright'
    )
  );
  console.log(
    `  1. Update translations in the configuration file (Hebrew, Russian, Azerbaijani)`
  );
  console.log(
    `  2. Add product categories through the admin panel`
  );
  console.log(
    `  3. Upload products and images`
  );
  console.log(
    `  4. Deploy your store!\n`
  );

  console.log(
    colorize(
      `To activate your store, set the environment variable:\n`,
      'bright'
    )
  );
  console.log(colorize(`NEXT_PUBLIC_STORE_NAME=${filename}\n`, 'cyan'));
}

function updateEnvironmentFile(storeType, storeName) {
  const envPath = path.join(__dirname, '../.env.local');

  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add NEXT_PUBLIC_STORE_NAME
  if (envContent.includes('NEXT_PUBLIC_STORE_NAME=')) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_STORE_NAME=.*/,
      `NEXT_PUBLIC_STORE_NAME=${storeName}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_STORE_NAME=${storeName}`;
  }

  // Ensure NEXT_PUBLIC_STORE_TYPE is set
  if (!envContent.includes('NEXT_PUBLIC_STORE_TYPE=')) {
    envContent += `\nNEXT_PUBLIC_STORE_TYPE=custom`;
  }

  fs.writeFileSync(envPath, envContent);
}

// Run the wizard
setupWizard().catch((error) => {
  console.error(colorize('Setup error:', 'red'), error);
  process.exit(1);
});
