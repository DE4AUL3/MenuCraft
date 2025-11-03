export interface RestaurantConfig {
  // Основная информация о ресторане
  restaurant: {
    id: string
    name: string
    nameEn?: string
    nameTk?: string
    description: string
    descriptionEn?: string
    descriptionTk?: string
    logo: string
    favicon: string
    
    // Контактная информация
    contact: {
      phone: string
      email: string
      website?: string
      address: string
      addressEn?: string
      addressTk?: string
      coordinates?: {
        lat: number
        lng: number
      }
    }
    
    // Время работы
    workingHours: {
      [key: string]: {
        open: string
        close: string
        isOpen: boolean
      }
    }
    
    // Настройки доставки
    delivery: {
      enabled: boolean
      fee: number
      freeDeliveryFrom: number
      radius: number // в км
      estimatedTime: string
      estimatedTimeTk?: string
    }
    
    // Социальные сети
    social: {
      instagram?: string
      facebook?: string
      telegram?: string
      whatsapp?: string
    }
  }
  
  // Настройки брендинга
  branding: {
    // Цветовая схема
    colors: {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      textSecondary: string
      border: string
      success: string
      warning: string
      error: string
      info: string
    }
    
    // Темная тема
    darkColors: {
      primary: string
      secondary: string
      accent: string
      background: string
      surface: string
      text: string
      textSecondary: string
      border: string
      success: string
      warning: string
      error: string
      info: string
    }
    
    // Типографика
    fonts: {
      primary: string
      secondary: string
      mono: string
    }
    
    // Радиусы скругления
    borderRadius: {
      sm: string
      md: string
      lg: string
      xl: string
      full: string
    }
    
    // Тени
    shadows: {
      sm: string
      md: string
      lg: string
      xl: string
    }
  }
  
  // Настройки функций
  features: {
    // Основные функции
    multiLanguage: boolean
    darkMode: boolean
    pwa: boolean
    qrMenu: boolean
    
    // Функции заказов
    cart: boolean
    favorites: boolean
    reviews: boolean
    ratings: boolean
    
    // Платежи
    payments: {
      cash: boolean
      card: boolean
      online: boolean
      transfer: boolean
    }
    
    // Доставка
    deliveryTypes: {
      pickup: boolean
      delivery: boolean
      dineIn: boolean
    }
    
    // Уведомления
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    
    // Аналитика
    analytics: {
      googleAnalytics?: string
      yandexMetrica?: string
      facebookPixel?: string
    }
  }
  
  // Настройки меню
  menu: {
    // Отображение
    showPrices: boolean
    showImages: boolean
    showDescriptions: boolean
    showNutrition: boolean
    showAllergens: boolean
    showPreparationTime: boolean
    
    // Категории
    categoriesLayout: 'grid' | 'list' | 'carousel'
    dishesLayout: 'grid' | 'list' | 'cards'
    
    // Валюта
    currency: {
      symbol: string
      code: string
      position: 'before' | 'after'
    }
    
    // Размеры порций
    portionSizes: boolean
    
    // Модификаторы
    modifiers: boolean
  }
  
  // Настройки админ-панели
  admin: {
    // Доступ
    requireAuth: boolean
    allowRegistration: boolean
    
    // Модули
    modules: {
      dashboard: boolean
      menu: boolean
      orders: boolean
      customers: boolean
      analytics: boolean
      settings: boolean
      reports: boolean
    }
    
    // Уведомления
    notifications: {
      newOrders: boolean
      lowStock: boolean
      reviews: boolean
    }
  }
  
  // SEO настройки
  seo: {
    title: string
    titleTk?: string
    description: string
    descriptionTk?: string
    keywords: string[]
    ogImage: string
    canonical?: string
  }
  
  // Настройки PWA
  pwa: {
    name: string
    shortName: string
    description: string
    themeColor: string
    backgroundColor: string
    startUrl: string
    display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
    orientation: 'portrait' | 'landscape' | 'any'
  }
}

// Конфигурация по умолчанию
export const defaultConfig: RestaurantConfig = {
  restaurant: {
    id: 'template-restaurant',
  name: 'Panda Burger',
  description: 'Panda Burger — стильный бургер-бар с авторским меню',
  logo: '/panda_logo.png',
    favicon: '/favicon.ico',
    
    contact: {
      phone: '+7 (XXX) XXX-XX-XX',
      email: 'info@restaurant.com',
      address: 'Адрес ресторана'
    },
    
    workingHours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '22:00', isOpen: true }
    },
    
    delivery: {
      enabled: true,
      fee: 50,
      freeDeliveryFrom: 500,
      radius: 10,
      estimatedTime: '30-45 минут'
    },
    
    social: {}
  },
  
  branding: {
    colors: {
      primary: '#f97316',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    
    darkColors: {
      primary: '#fb923c',
      secondary: '#94a3b8',
      accent: '#22d3ee',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    },
    
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px'
    },
    
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    }
  },
  
  features: {
    multiLanguage: true,
    darkMode: true,
    pwa: true,
    qrMenu: true,
    cart: true,
    favorites: true,
    reviews: true,
    ratings: true,
    
    payments: {
      cash: true,
      card: true,
      online: true,
      transfer: true
    },
    
    deliveryTypes: {
      pickup: true,
      delivery: true,
      dineIn: true
    },
    
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    
    analytics: {}
  },
  
  menu: {
    showPrices: true,
    showImages: true,
    showDescriptions: true,
    showNutrition: false,
    showAllergens: false,
    showPreparationTime: true,
    
    categoriesLayout: 'grid',
    dishesLayout: 'cards',
    
    currency: {
      symbol: '₽',
      code: 'RUB',
      position: 'after'
    },
    
    portionSizes: false,
    modifiers: false
  },
  
  admin: {
    requireAuth: true,
    allowRegistration: false,
    
    modules: {
      dashboard: true,
      menu: true,
      orders: true,
      customers: true,
      analytics: true,
      settings: true,
      reports: true
    },
    
    notifications: {
      newOrders: true,
      lowStock: true,
      reviews: true
    }
  },
  
  seo: {
    title: 'Panda Burger',
    description: 'Panda Burger — стильный бургер-бар с авторским меню и QR-меню',
    keywords: ['бургер', 'burger', 'panda', 'меню', 'fast food', 'street food'],
    ogImage: '/panda_logo.png'
  },
  
  pwa: {
    name: 'Panda Burger',
    shortName: 'Panda',
    description: 'Panda Burger — стильный бургер-бар с QR-меню',
    themeColor: '#18181b',
    backgroundColor: '#18181b',
    startUrl: '/',
    display: 'standalone',
    orientation: 'portrait'
  }
}