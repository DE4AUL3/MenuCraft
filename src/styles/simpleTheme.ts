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
      primary: '#ffffff',    /* Как в админ панели */
      secondary: '#f8fafc',  /* Светло-серый белый */
      tertiary: '#f1f5f9'    /* Более серый белый */
    },
    text: {
      primary: '#0f172a',    /* Почти черный */
      secondary: '#475569',  /* Серый */
      tertiary: '#94a3b8'    /* Светло-серый */
    },
    border: {
      primary: '#e2e8f0',    /* Видимая граница */
      secondary: '#f1f5f9',  /* Слабая граница */
      tertiary: '#f8fafc'    /* Едва заметная граница */
    },
    accent: {
      call: '#10b981',       /* Изумрудный для звонка и корзины */
      admin: '#3b82f6',      /* Синий для админки */
      warning: '#f59e0b',    /* Оранжевый */
      danger: '#ef4444',     /* Красный */
      success: '#10b981'     /* Зеленый успех */
    }
  }
}

export const darkTheme: SimpleTheme = {
  mode: 'dark',
  colors: {
    background: {
      primary: '#121212',    /* Фоновый цвет */
      secondary: '#1E1E1E',  /* Фон всех карточек */
      tertiary: '#2A2A2A'    /* Границы/разделители как третичный фон */
    },
    text: {
      primary: '#F5F5F5',    /* Основной цвет */
      secondary: '#B3B3B3',  /* Подзаголовки/второстепенный текст */
      tertiary: '#808080'    /* Еще более слабый текст */
    },
    border: {
      primary: '#2A2A2A',    /* Границы/разделители */
      secondary: '#1E1E1E',  /* Слабые границы */
      tertiary: '#121212'    /* Едва заметные границы */
    },
    accent: {
      call: '#10b981',       /* Изумрудный для звонка и корзины */
      admin: '#3b82f6',      /* Синий для админки */
      warning: '#f59e0b',    /* Оранжевый */
      danger: '#ef4444',     /* Красный */
      success: '#10b981'     /* Зеленый успех */
    }
  }
}

export const themes = {
  dark: darkTheme
} as const

// CSS переменные для простого использования
export const getCSSVariables = (theme: SimpleTheme) => ({
  '--bg-primary': theme.colors.background.primary,
  '--bg-secondary': theme.colors.background.secondary,
  '--bg-tertiary': theme.colors.background.tertiary,
  
  '--text-primary': theme.colors.text.primary,
  '--text-secondary': theme.colors.text.secondary,
  '--text-tertiary': theme.colors.text.tertiary,
  
  '--border-primary': theme.colors.border.primary,
  '--border-secondary': theme.colors.border.secondary,
  '--border-tertiary': theme.colors.border.tertiary,
  
  '--accent-call': theme.colors.accent.call,
  '--accent-admin': theme.colors.accent.admin,
  '--accent-warning': theme.colors.accent.warning,
  '--accent-danger': theme.colors.accent.danger,
  '--accent-success': theme.colors.accent.success,
})

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