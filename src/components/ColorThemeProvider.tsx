'use client';

import { useEffect } from 'react';
import { applyColorTheme, getSavedColorTheme } from '@/config/colors';

export default function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Инициализация цветовой темы при загрузке
    const savedTheme = getSavedColorTheme();
    applyColorTheme(savedTheme);
  }, []);

  return <>{children}</>;
}