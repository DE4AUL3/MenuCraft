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
    root.style.setProperty('--color-primary', '#f97316');
    root.style.setProperty('--color-primary-hover', '#ea580c');
    root.style.setProperty('--color-primary-light', '#fed7aa');
    root.style.setProperty('--color-primary-dark', '#c2410c');
    root.style.setProperty('--color-secondary', '#fb923c');
    root.style.setProperty('--color-accent', '#ffedd5');
    root.style.setProperty('--gradient-from', '#fb923c');
    root.style.setProperty('--gradient-via', '#f97316');
    root.style.setProperty('--gradient-to', '#ea580c');
  };

  return null; // Этот компонент ничего не рендерит
}