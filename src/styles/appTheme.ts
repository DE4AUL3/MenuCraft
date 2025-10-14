/**
 * Универсальная система тем для всего приложения
 * Включает админ-панель, основные страницы и компоненты
 * Основана на правиле 60-30-10 дизайна
 */

export type AppTheme = 'light' | 'dark'

export interface AppThemeColors {
  // 60% - Основные цвета (фоны, поверхности)
  primary: {
    background: string
    surface: string
    text: string
  }
  
  // 30% - Вторичные цвета (карточки, панели, навигация)
  secondary: {
    background: string
    surface: string
    text: string
    border: string
  }
  
  // 10% - Акцентные цвета (кнопки, активные элементы)
  accent: {
    primary: string      // Основной акцент (синий градиент)
    secondary: string    // Вторичный акцент (фиолетовый градиент)
    success: string      // Успех (зеленый)
    warning: string      // Предупреждение (желтый)
    error: string        // Ошибка (красный)
  }
}

export interface AppThemeClasses {
  // Основные фоны (60%)
  background: string
  surface: string
  card: string
  
  // Дополнительные фоны для совместимости
  bg: string
  bgSecondary: string
  cardBg: string
  
  // Текст (30%)
  text: string
  textSecondary: string
  textMuted: string
  
  // Интерактивные элементы (10%)
  hover: string
  accent: string
  accentSecondary: string
  
  // Состояния (10%)
  success: string
  warning: string
  error: string
  
  // Границы
  border: string
  borderLight: string
  
  // Градиенты для разных целей
  gradients: {
    main: string        // Основной градиент страниц
    accent: string      // Акцентный градиент кнопок
    card: string        // Градиент карточек
    hero: string        // Градиент для главных элементов
  }
}

// Цвета для светлой темы
const lightThemeColors: AppThemeColors = {
  primary: {
    background: '#ffffff',    // 60% - белый фон
    surface: '#f8f9fa',      // 60% - светло-серый
    text: '#1a202c'          // 30% - темно-серый текст
  },
  secondary: {
    background: '#f1f3f4',   // 30% - серый фон панелей
    surface: '#e2e8f0',      // 30% - серый для карточек
    text: '#4a5568',         // 30% - средне-серый текст
    border: '#e2e8f0'        // 30% - границы
  },
  accent: {
    primary: 'from-blue-500 to-indigo-600',     // 10% - основной акцент
    secondary: 'from-purple-500 to-pink-600',   // 10% - вторичный акцент
    success: 'from-emerald-500 to-green-600',   // 10% - успех
    warning: 'from-amber-500 to-orange-600',    // 10% - предупреждение
    error: 'from-red-500 to-rose-600'           // 10% - ошибка
  }
}

// Цвета для темной темы
const darkThemeColors: AppThemeColors = {
  primary: {
    background: '#0f172a',    // 60% - темно-синий фон
    surface: '#1e293b',      // 60% - синевато-серый
    text: '#f1f5f9'          // 30% - светло-серый текст
  },
  secondary: {
    background: '#334155',   // 30% - средне-серый фон панелей
    surface: '#475569',      // 30% - серый для карточек
    text: '#cbd5e1',         // 30% - светло-серый текст
    border: '#475569'        // 30% - границы
  },
  accent: {
    primary: 'from-blue-400 to-indigo-500',     // 10% - основной акцент
    secondary: 'from-purple-400 to-pink-500',   // 10% - вторичный акцент
    success: 'from-emerald-400 to-green-500',   // 10% - успех
    warning: 'from-amber-400 to-orange-500',    // 10% - предупреждение
    error: 'from-red-400 to-rose-500'           // 10% - ошибка
  }
}

// CSS классы для светлой темы
const lightThemeClasses: AppThemeClasses = {
  // Основные фоны (60%)
  background: 'bg-white',
  surface: 'bg-gray-50',
  card: 'bg-white/80 border border-gray-200/50',
  
  // Дополнительные фоны
  bg: 'bg-white',
  bgSecondary: 'bg-gray-50',
  cardBg: 'bg-white/80 border border-gray-200/50',
  
  // Текст (30%)
  text: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',
  
  // Интерактивные элементы (10%)
  hover: 'hover:bg-gray-100',
  accent: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  accentSecondary: 'bg-gradient-to-r from-purple-500 to-pink-600',
  
  // Состояния (10%)
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
  
  // Границы
  border: 'border-gray-200',
  borderLight: 'border-gray-100',
  
  // Градиенты
  gradients: {
    main: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    accent: 'from-blue-500 to-indigo-600',
    card: 'from-white via-blue-50 to-purple-50',
    hero: 'from-blue-600 via-purple-600 to-indigo-700'
  }
}

// CSS классы для темной темы
const darkThemeClasses: AppThemeClasses = {
  // Основные фоны (60%)
  background: 'bg-slate-900',
  surface: 'bg-slate-800',
  card: 'bg-slate-800/50 border border-slate-700/50',
  
  // Дополнительные фоны
  bg: 'bg-slate-800',
  bgSecondary: 'bg-slate-700',
  cardBg: 'bg-slate-800/50 border border-slate-700/50',
  
  // Текст (30%)
  text: 'text-slate-100',
  textSecondary: 'text-slate-300',
  textMuted: 'text-slate-400',
  
  // Интерактивные элементы (10%)
  hover: 'hover:bg-slate-700/50',
  accent: 'bg-gradient-to-r from-blue-400 to-indigo-500',
  accentSecondary: 'bg-gradient-to-r from-purple-400 to-pink-500',
  
  // Состояния (10%)
  success: 'text-emerald-400 bg-emerald-900/20',
  warning: 'text-amber-400 bg-amber-900/20',
  error: 'text-red-400 bg-red-900/20',
  
  // Границы
  border: 'border-slate-700',
  borderLight: 'border-slate-600',
  
  // Градиенты
  gradients: {
    main: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
    accent: 'from-blue-400 to-indigo-500',
    card: 'from-slate-800 via-blue-900/20 to-purple-900/20',
    hero: 'from-blue-400 via-purple-400 to-indigo-500'
  }
}

// Хранилище всех тем
const appThemes: Record<AppTheme, { colors: AppThemeColors; classes: AppThemeClasses }> = {
  light: {
    colors: lightThemeColors,
    classes: lightThemeClasses
  },
  dark: {
    colors: darkThemeColors,
    classes: darkThemeClasses
  }
}

/**
 * Получить CSS классы для указанной темы
 */
export function getAppThemeClasses(theme: AppTheme = 'dark'): AppThemeClasses {
  return appThemes[theme].classes
}

/**
 * Получить цвета для указанной темы
 */
export function getAppThemeColors(theme: AppTheme = 'dark'): AppThemeColors {
  return appThemes[theme].colors
}

/**
 * Получить полную тему
 */
export function getAppTheme(theme: AppTheme = 'dark') {
  return appThemes[theme]
}

// Обратная совместимость с админской системой тем
export type AdminTheme = AppTheme
export const getThemeClasses = getAppThemeClasses
export const getThemeColors = getAppThemeColors