// src/lib/themeService.ts

export type ColorTheme = {
  primary?: string;
  primaryHover?: string;
  primaryLight?: string;
  primaryDark?: string;
  secondary?: string;
  accent?: string;
  gradient?: {
    from?: string;
    via?: string;
    to?: string;
  };
};

const THEME_KEY = 'selectedColorTheme';

export function getSavedColorTheme(): ColorTheme | null {
  if (typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(THEME_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

export function applyColorTheme(theme: ColorTheme, root: HTMLElement) {
  root.style.setProperty('--color-primary', theme.primary || '#f97316');
  root.style.setProperty('--color-primary-hover', theme.primaryHover || '#ea580c');
  root.style.setProperty('--color-primary-light', theme.primaryLight || '#fed7aa');
  root.style.setProperty('--color-primary-dark', theme.primaryDark || '#c2410c');
  root.style.setProperty('--color-secondary', theme.secondary || '#fb923c');
  root.style.setProperty('--color-accent', theme.accent || '#ffedd5');
  root.style.setProperty('--gradient-from', theme.gradient?.from || '#fb923c');
  root.style.setProperty('--gradient-via', theme.gradient?.via || '#f97316');
  root.style.setProperty('--gradient-to', theme.gradient?.to || '#ea580c');
}

export function setDefaultColors(root: HTMLElement) {
  root.style.setProperty('--color-primary', '#10b981');
  root.style.setProperty('--color-primary-hover', '#059669');
  root.style.setProperty('--color-primary-light', '#ecfdf5');
  root.style.setProperty('--color-primary-dark', '#065f46');
  root.style.setProperty('--color-secondary', '#fef3c7');
  root.style.setProperty('--color-accent', '#fffaf5');
  root.style.setProperty('--gradient-from', '#10b981');
  root.style.setProperty('--gradient-via', '#f59e0b');
  root.style.setProperty('--gradient-to', '#ef4444');
  root.style.setProperty('--han-bg', '#fffaf5');
  root.style.setProperty('--han-surface', '#ffffff');
  root.style.setProperty('--han-border', '#eef2f3');
  root.style.setProperty('--han-text', '#0f1724');
}
