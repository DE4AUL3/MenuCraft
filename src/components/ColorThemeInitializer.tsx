'use client';

import { useEffect } from 'react';

export default function ColorThemeInitializer() {
  useEffect(() => {
    // Простая инициализация цветовых переменных
    const root = document.documentElement;
    
    // Проверяем, есть ли сохраненная тема в localStorage
    const savedTheme = localStorage.getItem('selectedColorTheme');
    
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        // Применяем сохраненную тему
        root.style.setProperty('--color-primary', theme.primary || '#f97316');
        root.style.setProperty('--color-primary-hover', theme.primaryHover || '#ea580c');
        root.style.setProperty('--color-primary-light', theme.primaryLight || '#fed7aa');
        root.style.setProperty('--color-primary-dark', theme.primaryDark || '#c2410c');
        root.style.setProperty('--color-secondary', theme.secondary || '#fb923c');
        root.style.setProperty('--color-accent', theme.accent || '#ffedd5');
        root.style.setProperty('--gradient-from', theme.gradient?.from || '#fb923c');
        root.style.setProperty('--gradient-via', theme.gradient?.via || '#f97316');
        root.style.setProperty('--gradient-to', theme.gradient?.to || '#ea580c');
      } catch {
        // Если ошибка парсинга, используем дефолтные значения
        setDefaultColors(root);
      }
    } else {
      // Если нет сохраненной темы, используем дефолтные значения
      setDefaultColors(root);
    }
  }, []);

  const setDefaultColors = (root: HTMLElement) => {
    // Han Tagam light defaults
    root.style.setProperty('--color-primary', '#10b981'); // emerald
    root.style.setProperty('--color-primary-hover', '#059669');
    root.style.setProperty('--color-primary-light', '#ecfdf5');
    root.style.setProperty('--color-primary-dark', '#065f46');
    root.style.setProperty('--color-secondary', '#fef3c7'); // amber light
    root.style.setProperty('--color-accent', '#fffaf5'); // warm cream
    root.style.setProperty('--gradient-from', '#10b981');
    root.style.setProperty('--gradient-via', '#f59e0b');
    root.style.setProperty('--gradient-to', '#ef4444');

    // Han Tagam specific variables
    root.style.setProperty('--han-bg', '#fffaf5');
    root.style.setProperty('--han-surface', '#ffffff');
    root.style.setProperty('--han-border', '#eef2f3');
    root.style.setProperty('--han-text', '#0f1724');
  };

  return null; // Этот компонент ничего не рендерит
}