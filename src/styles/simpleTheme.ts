export type ThemeMode = 'light' | 'dark'

export interface SimpleTheme {
  mode: ThemeMode
  colors: {
    // Базовые цвета (3 оттенка белого/черного)
    background: {
      primary: string    // Основной фон
      secondary: string  // Вторичный фон (карточки)
      tertiary: string   // Третичный фон (поля ввода)
    }
    text: {
      primary: string    // Основной текст
      secondary: string  // Вторичный текст
      tertiary: string   // Слабый текст (placeholder)
    }
    border: {
      primary: string    // Основные границы
      secondary: string  // Слабые границы
      tertiary: string   // Едва заметные границы
    }
    // Акцентные цвета (только для звонка и админки)
    accent: {
      call: string       // Кнопка звонка (зеленый)
      admin: string      // Админ панель (синий)
      warning: string    // Предупреждения (оранжевый)
      danger: string     // Ошибки (красный)
      success: string    // Успех (зеленый)
    }
  }
}


export const lightTheme: SimpleTheme = {
  mode: 'light',
  colors: {
    background: {
      primary: require('../config/colors').COLORS.background,
      secondary: require('../config/colors').COLORS.surface,
      tertiary: require('../config/colors').COLORS.border
    },
    text: {
      primary: '#18181b',
      secondary: '#27272a',
      tertiary: '#6b7280'
    },
    border: {
      primary: require('../config/colors').COLORS.border,
      secondary: require('../config/colors').COLORS.surface,
      tertiary: require('../config/colors').COLORS.background
    },
    accent: {
      call: require('../config/colors').COLORS.accent,
      admin: require('../config/colors').COLORS.admin,
      warning: require('../config/colors').COLORS.warning,
      danger: require('../config/colors').COLORS.danger,
      success: require('../config/colors').COLORS.success
    }
  }
}

export const themes = {
  light: lightTheme
} as const

// CSS переменные для простого использования
export const getCSSVariables = (theme?: SimpleTheme) => {
  const { light: defaultTheme } = require('./simpleTheme').themes;
  const t = theme && theme.colors ? theme : defaultTheme;
  return {
    '--bg-primary': t.colors.background.primary,
    '--bg-secondary': t.colors.background.secondary,
    '--bg-tertiary': t.colors.background.tertiary,
    '--text-primary': t.colors.text.primary,
    '--text-secondary': t.colors.text.secondary,
    '--text-tertiary': t.colors.text.tertiary,
    '--border-primary': t.colors.border.primary,
    '--border-secondary': t.colors.border.secondary,
    '--border-tertiary': t.colors.border.tertiary,
    '--accent-call': t.colors.accent.call,
    '--accent-admin': t.colors.accent.admin,
    '--accent-warning': t.colors.accent.warning,
    '--accent-danger': t.colors.accent.danger,
    '--accent-success': t.colors.accent.success,
  };
}

// Утилитарные классы
export const getThemeClasses = (theme: SimpleTheme) => ({
  // Фоны
  bgPrimary: `bg-[${theme.colors.background.primary}]`,
  bgSecondary: `bg-[${theme.colors.background.secondary}]`,
  bgTertiary: `bg-[${theme.colors.background.tertiary}]`,
  
  // Текст
  textPrimary: `text-[${theme.colors.text.primary}]`,
  textSecondary: `text-[${theme.colors.text.secondary}]`,
  textTertiary: `text-[${theme.colors.text.tertiary}]`,
  
  // Границы
  borderPrimary: `border-[${theme.colors.border.primary}]`,
  borderSecondary: `border-[${theme.colors.border.secondary}]`,
  borderTertiary: `border-[${theme.colors.border.tertiary}]`,
  
  // Акценты
  accentCall: `bg-[${theme.colors.accent.call}]`,
  accentAdmin: `bg-[${theme.colors.accent.admin}]`,
  accentWarning: `bg-[${theme.colors.accent.warning}]`,
  accentDanger: `bg-[${theme.colors.accent.danger}]`,
  accentSuccess: `bg-[${theme.colors.accent.success}]`,
})