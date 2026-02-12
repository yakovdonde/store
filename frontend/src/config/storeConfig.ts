export interface StoreConfig {
  storeType: string;
  storeName: string;
  tagline: {
    en: string;
    he: string;
    ru: string;
    az: string;
  };
  description: {
    en: string;
    he: string;
    ru: string;
    az: string;
  };
  heroTitle: {
    en: string;
    he: string;
    ru: string;
    az: string;
  };
  heroSubtitle: {
    en: string;
    he: string;
    ru: string;
    az: string;
  };
  defaultCategories: Array<{
    name: {
      en: string;
      he: string;
      ru: string;
      az: string;
    };
    description: {
      en: string;
      he: string;
      ru: string;
      az: string;
    };
    icon: string;
  }>;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    text: string;
    footerBg: string;
    footerBorder: string;
  };
  currencies: string[];
  defaultCurrency: string;
}

// Judaica Store Configuration
export const judaicaStoreConfig: StoreConfig = {
  storeType: 'judaica',
  storeName: 'Donde Judaica Store',
  tagline: {
    en: 'Authentic Judaica & Religious Items',
    he: 'פריטי יודאיקה ודת אותנטיים',
    ru: 'Аутентичная иудаика и религиозные предметы',
    az: 'Orijinal Yəhudi və Dini Əşyalar'
  },
  description: {
    en: 'Discover our collection of authentic Judaica items, religious books, and ceremonial objects',
    he: 'גלו את אוסף פריטי היודאיקה האותנטיים, ספרי קודש וחפצי טקס שלנו',
    ru: 'Откройте для себя нашу коллекцию аутентичной иудаики, религиозных книг и церемониальных предметов',
    az: 'Orijinal yəhudi əşyaları, dini kitablar və mərasim əşyalarımızı kəşf edin'
  },
  heroTitle: {
    en: 'Welcome to Donde Judaica Store',
    he: 'ברוכים הבאים לחנות היודאיקה דונדה',
    ru: 'Добро пожаловать в магазин иудаики Donde',
    az: 'Donde Yəhudi Mağazasına Xoş Gəlmisiniz'
  },
  heroSubtitle: {
    en: 'Discover our collection of authentic Judaica items and religious books',
    he: 'גלו את אוסף פריטי היודאיקה האותנטיים וספרי הקודש שלנו',
    ru: 'Откройте для себя нашу коллекцию аутентичной иудаики и религиозных книг',
    az: 'Orijinal yəhudi əşyaları və dini kitablar kolleksiyamızı kəşf edin'
  },
  defaultCategories: [
    {
      name: {
        en: 'Books',
        he: 'ספרים',
        ru: 'Книги',
        az: 'Kitablar'
      },
      description: {
        en: 'Religious books and texts',
        he: 'ספרי קודש וטקסטים',
        ru: 'Религиозные книги и тексты',
        az: 'Dini kitablar və mətnlər'
      },
      icon: '📚'
    },
    {
      name: {
        en: 'Ritual Items',
        he: 'פריטי טקס',
        ru: 'Ритуальные предметы',
        az: 'Mərasim əşyaları'
      },
      description: {
        en: 'Shabbat and holiday items',
        he: 'פריטי שבת וחג',
        ru: 'Предметы для Шаббата и праздников',
        az: 'Şənbə və bayram əşyaları'
      },
      icon: '🕎'
    },
    {
      name: {
        en: 'Mezuzahs',
        he: 'מזוזות',
        ru: 'Мезузы',
        az: 'Mezuzalar'
      },
      description: {
        en: 'Handcrafted mezuzah cases',
        he: 'נרתיקי מזוזה בעבודת יד',
        ru: 'Ручной работы корпуса для мезуз',
        az: 'Əl işi mezuza qabları'
      },
      icon: '📜'
    },
    {
      name: {
        en: 'Jewelry',
        he: 'תכשיטים',
        ru: 'Украшения',
        az: 'Zinət əşyaları'
      },
      description: {
        en: 'Religious jewelry and accessories',
        he: 'תכשיטים דתיים ואביזרים',
        ru: 'Религиозные украшения и аксессуары',
        az: 'Dini zinət əşyaları və aksesuarlar'
      },
      icon: '✡️'
    }
  ],
  colors: {
    primary: '#8b2635',
    primaryHover: '#6b2d1f',
    secondary: '#1a2847',
    text: '#2c1810',
    footerBg: '#1a2847',
    footerBorder: '#2a3f5f'
  },
  currencies: ['USD', 'ILS', 'EUR', 'AZN'],
  defaultCurrency: 'USD'
};

// Car Parts Store Configuration
export const carPartsStoreConfig: StoreConfig = {
  storeType: 'car-parts',
  storeName: 'Donde Auto Parts',
  tagline: {
    en: 'Quality Auto Parts & Accessories',
    he: 'חלקי חילוף ואביזרים לרכב',
    ru: 'Качественные автозапчасти и аксессуары',
    az: 'Keyfiyyətli Avtomobil Hissələri və Aksesuarlar'
  },
  description: {
    en: 'Find genuine and aftermarket parts for all vehicle makes and models',
    he: 'מצא חלקים מקוריים ושוק משני לכל סוגי הרכב',
    ru: 'Найдите оригинальные и неоригинальные детали для всех марок и моделей',
    az: 'Bütün avtomobil markaları və modelləri üçün orijinal və qeyri-orijinal hissələr'
  },
  heroTitle: {
    en: 'Welcome to Donde Auto Parts',
    he: 'ברוכים הבאים לחלקי רכב דונדה',
    ru: 'Добро пожаловать в Donde Auto Parts',
    az: 'Donde Avtomobil Hissələrinə Xoş Gəlmisiniz'
  },
  heroSubtitle: {
    en: 'Your trusted source for quality automotive parts and accessories',
    he: 'המקור המהימן שלך לחלקי רכב ואביזרים איכוtiים',
    ru: 'Ваш надежный источник качественных автомобильных запчастей и аксессуаров',
    az: 'Keyfiyyətli avtomobil hissələri və aksesuarları üçün etibarlı mənbəyiniz'
  },
  defaultCategories: [
    {
      name: {
        en: 'Engine Parts',
        he: 'חלקי מנוע',
        ru: 'Детали двигателя',
        az: 'Mühərrik hissələri'
      },
      description: {
        en: 'Filters, belts, and engine components',
        he: 'מסננים, רצועות ורכיבי מנוע',
        ru: 'Фильтры, ремни и компоненты двигателя',
        az: 'Filtrlər, kəmərlər və mühərrik komponentləri'
      },
      icon: '⚙️'
    },
    {
      name: {
        en: 'Brakes',
        he: 'מעצורים',
        ru: 'Тормоза',
        az: 'Əyləclər'
      },
      description: {
        en: 'Brake pads, discs, and systems',
        he: 'רפידות בלם, דיסקים ומערכות',
        ru: 'Тормозные колодки, диски и системы',
        az: 'Əyləc yastıqları, disklər və sistemlər'
      },
      icon: '🛞'
    },
    {
      name: {
        en: 'Suspension',
        he: 'מתלים',
        ru: 'Подвеска',
        az: 'Asma sistem'
      },
      description: {
        en: 'Shocks, struts, and suspension parts',
        he: 'בולמים, תמוכות וחלקי מתלים',
        ru: 'Амортизаторы, стойки и детали подвески',
        az: 'Amortizatorlar və asma hissələri'
      },
      icon: '🔧'
    },
    {
      name: {
        en: 'Lighting',
        he: 'תאורה',
        ru: 'Освещение',
        az: 'İşıqlandırma'
      },
      description: {
        en: 'Headlights, bulbs, and lighting accessories',
        he: 'פנסים, נורות ואביזרי תאורה',
        ru: 'Фары, лампы и осветительные аксессуары',
        az: 'Faralar, lampalar və işıqlandırma aksesuarları'
      },
      icon: '💡'
    },
    {
      name: {
        en: 'Body Parts',
        he: 'חלקי מרכב',
        ru: 'Кузовные детали',
        az: 'Gövdə hissələri'
      },
      description: {
        en: 'Bumpers, fenders, and body panels',
        he: 'פגושים, כנפיים ופאנלים',
        ru: 'Бамперы, крылья и панели кузова',
        az: 'Bamper, qanadlar və kuzov panelləri'
      },
      icon: '🚗'
    },
    {
      name: {
        en: 'Interior',
        he: 'אביזרי פנים',
        ru: 'Салон',
        az: 'Daxili aksesuarlar'
      },
      description: {
        en: 'Seats, floor mats, and interior accessories',
        he: 'מושבים, שטיחים ואביזרי פנים',
        ru: 'Сиденья, коврики и аксессуары салона',
        az: 'Oturacaqlar, döşəmə örtükləri və daxili aksesuarlar'
      },
      icon: '🪑'
    }
  ],
  colors: {
    primary: '#d32f2f',
    primaryHover: '#b71c1c',
    secondary: '#1565c0',
    text: '#212121',
    footerBg: '#263238',
    footerBorder: '#37474f'
  },
  currencies: ['USD', 'EUR', 'AZN'],
  defaultCurrency: 'USD'
};

// Get active store configuration based on environment variable
export function getStoreConfig(): StoreConfig {
  const storeType = process.env.NEXT_PUBLIC_STORE_TYPE || 'judaica';
  
  switch (storeType) {
    case 'car-parts':
      return carPartsStoreConfig;
    case 'judaica':
    default:
      return judaicaStoreConfig;
  }
}

export const activeStoreConfig = getStoreConfig();
