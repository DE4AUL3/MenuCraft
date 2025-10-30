export type ThemeMode = 'light' | 'dark'

export interface SimpleTheme {
  mode: ThemeMode
  colors: {
    background: {
      primary: string
      secondary: string
      tertiary: string
      language: string
      activeCategory: string
      dishImageOverlay: string
      priceBadge: string
      quantityBtn: string
    }
    text: {
      primary: string
      secondary: string
      tertiary: string
      language: string
      activeCategory: string
      priceBadge: string
      quantity: string
      total: string
      dishDescription: string
      cartBadge: string
    }
    border: {
      primary: string
      secondary: string
      tertiary: string
      language: string
      activeCategory: string
      priceBadge: string
      quantityBtn: string
      cart: string
    }
    accent: {
      call: string
      admin: string
      warning: string
      danger: string
      success: string
    }
    shadow: {
      cart: string
      cartBadge: string
      activeCategory: string
      dishCard: string
      dishCardActive: string
      priceBadge: string
      dishActionBtn: string
    }
  }
}


import { COLORS } from '@/config/colors';

export const lightTheme: SimpleTheme = {
  mode: 'light',
  colors: {
    background: {
      primary: '#FAF9F6',
      secondary: '#FFFFFF',
      tertiary: '#FAF3E0',
      language: '#111',
      activeCategory: '#fff',
      dishImageOverlay: 'linear-gradient(to top, rgba(0,0,0,0.20), transparent 80%)',
      priceBadge: '#fff',
      quantityBtn: '#fff',
    },
    text: {
      primary: '#1E1E1E',
      secondary: '#6B6B6B',
      tertiary: '#B0AFAF',
      language: '#fff',
      activeCategory: '#111',
      priceBadge: '#111',
      quantity: '#1E1E1E',
      total: '#1E1E1E',
      dishDescription: '#C5A572',
      cartBadge: '#fff',
    },
    border: {
      primary: '#E8E4DC',
      secondary: '#F3EAD9',
      tertiary: '#FAF9F6',
      language: '#111',
      activeCategory: '#fff',
      priceBadge: 'transparent',
      quantityBtn: '#E8E4DC',
      cart: '#C5A572',
    },
    accent: {
      call: '#10b981',
      admin: '#C5A572',
      warning: '#D4AF37',
      danger: '#C94E38',
      success: '#B9965C',
    },
    shadow: {
      cart: '0 4px 16px 0 rgba(197,165,114,0.18)',
      cartBadge: '0 2px 8px 0 rgba(16,185,129,0.18)',
      activeCategory: '0 2px 8px 0 rgba(0,0,0,0.10)',
      dishCard: '0 2px 8px 0 rgba(197,165,114,0.08)',
      dishCardActive: '0 4px 16px 0 rgba(197,165,114,0.18)',
      priceBadge: '0 2px 8px 0 rgba(197,165,114,0.10)',
      dishActionBtn: '0 2px 8px 0 rgba(197,165,114,0.10)',
    },
  }
}

export const themes = {
  light: lightTheme,
  dark: lightTheme // временно используем ту же схему, чтобы не ломать потребителей
} as const

// CSS переменные для простого использования
export const getCSSVariables = (theme?: SimpleTheme) => {
  // Прямая ссылка на локальный объект themes, без require()
  const defaultTheme = themes.light;
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