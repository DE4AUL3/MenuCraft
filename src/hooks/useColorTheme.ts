'use client';

import { useState, useEffect } from 'react';
import { ColorTheme, defaultThemes, applyColorTheme, getSavedColorTheme } from '@/config/colors';

export const useColorTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(defaultThemes[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = getSavedColorTheme();
    setCurrentTheme(savedTheme);
    applyColorTheme(savedTheme);
    setIsLoading(false);
  }, []);

  const changeTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    applyColorTheme(theme);
  };

  const resetToDefault = () => {
    const defaultTheme = defaultThemes[0];
    setCurrentTheme(defaultTheme);
    applyColorTheme(defaultTheme);
  };

  return {
    currentTheme,
    changeTheme,
    resetToDefault,
    isLoading,
    availableThemes: defaultThemes
  };
};