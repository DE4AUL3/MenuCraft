'use client';



import { useEffect } from 'react';
import { getSavedColorTheme, applyColorTheme, setDefaultColors } from '@/lib/themeService';



export default function ColorThemeInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const root = document.documentElement;
    const theme = getSavedColorTheme();
    if (theme) {
      applyColorTheme(theme, root);
    } else {
      setDefaultColors(root);
    }
  }, []);
  return null; // Этот компонент ничего не рендерит
}