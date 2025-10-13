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
    id: 'orange',
    name: 'Orange Classic',
    primary: '#f97316',
    primaryHover: '#ea580c',
    primaryLight: '#fed7aa',
    primaryDark: '#c2410c',
    secondary: '#fb923c',
    accent: '#ffedd5',
    gradient: {
      from: '#fb923c',
      via: '#f97316',
      to: '#ea580c'
    }
  },
  {
    id: 'red',
    name: 'Spicy Red',
    primary: '#dc2626',
    primaryHover: '#b91c1c',
    primaryLight: '#fecaca',
    primaryDark: '#991b1b',
    secondary: '#ef4444',
    accent: '#fee2e2',
    gradient: {
      from: '#ef4444',
      via: '#dc2626',
      to: '#b91c1c'
    }
  },
  {
    id: 'green',
    name: 'Fresh Green',
    primary: '#16a34a',
    primaryHover: '#15803d',
    primaryLight: '#bbf7d0',
    primaryDark: '#166534',
    secondary: '#22c55e',
    accent: '#dcfce7',
    gradient: {
      from: '#22c55e',
      via: '#16a34a',
      to: '#15803d'
    }
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryLight: '#bfdbfe',
    primaryDark: '#1e40af',
    secondary: '#3b82f6',
    accent: '#dbeafe',
    gradient: {
      from: '#3b82f6',
      via: '#2563eb',
      to: '#1d4ed8'
    }
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#9333ea',
    primaryHover: '#7c3aed',
    primaryLight: '#e9d5ff',
    primaryDark: '#6b21a8',
    secondary: '#a855f7',
    accent: '#f3e8ff',
    gradient: {
      from: '#a855f7',
      via: '#9333ea',
      to: '#7c3aed'
    }
  },
  {
    id: 'pink',
    name: 'Sweet Pink',
    primary: '#ec4899',
    primaryHover: '#db2777',
    primaryLight: '#fce7f3',
    primaryDark: '#be185d',
    secondary: '#f472b6',
    accent: '#fdf2f8',
    gradient: {
      from: '#f472b6',
      via: '#ec4899',
      to: '#db2777'
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