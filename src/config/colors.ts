export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
}

export const defaultThemes: ColorTheme[] = [
  {
    id: 'light',
    name: 'Светлая',
    primary: '#ffffff',
    primaryHover: '#f3f4f6',
    primaryLight: '#f9fafb',
    primaryDark: '#e5e7eb',
    secondary: '#f3f4f6',
    accent: '#e0e7ff',
    gradient: {
      from: '#e0e7ff',
      via: '#f3f4f6',
      to: '#ffffff'
    }
  },
  {
    id: 'dark',
    name: 'Тёмная',
    primary: '#18181b',
    primaryHover: '#27272a',
    primaryLight: '#27272a',
    primaryDark: '#09090b',
    secondary: '#27272a',
    accent: '#1e293b',
    gradient: {
      from: '#18181b',
      via: '#27272a',
      to: '#09090b'
    }
  }
];

// Функция для применения темы
export const applyColorTheme = (theme: ColorTheme) => {
  const root = document.documentElement;
  
  // CSS Custom Properties
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-hover', theme.primaryHover);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--gradient-from', theme.gradient.from);
  root.style.setProperty('--gradient-via', theme.gradient.via);
  root.style.setProperty('--gradient-to', theme.gradient.to);
  
  // Сохраняем в localStorage
  localStorage.setItem('selectedColorTheme', JSON.stringify(theme));
};

// Функция для получения сохраненной темы
export const getSavedColorTheme = (): ColorTheme => {
  if (typeof window === 'undefined') return defaultThemes[0];
  
  const saved = localStorage.getItem('selectedColorTheme');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultThemes[0];
    }
  }
  return defaultThemes[0];
};

// Функция для получения CSS переменных
export const getCSSVariableColor = (variableName: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};

// Объект цветов для simpleTheme.ts
export const COLORS = {
  // Светлая тема
  background: '#fcf9f9',
  surface: '#f3f4f6',
  border: '#e5e7eb',
  text: '#18181b',
  textSecondary: '#27272a',
  textMuted: '#6b7280',
  accent: '#22c55e',      // call (зелёный)
  admin: '#2563eb',       // admin (синий)
  warning: '#f59e42',     // warning (оранжевый)
  danger: '#ef4444',      // danger (красный)
  success: '#22c55e',     // success (зелёный)
};