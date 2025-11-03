'use client'

import { useState, useEffect } from 'react'
import { getAppTheme, getAppThemeClasses, getAppThemeColors } from '@/styles/appTheme'

export function useTheme() {
  const [theme, setTheme] = useState<string>('panda-dark')
  const [mounted, setMounted] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<string>('panda-burger')

  useEffect(() => {
    setMounted(true)
    
    // Принудительно устанавливаем panda-burger для этого проекта
    setCurrentRestaurant('panda-burger')
    localStorage.setItem('selectedRestaurant', 'panda-burger')
    
    // Применяем тему panda-dark
    setTheme('panda-dark')
    applyTheme('panda-dark')
  }, [])

  const applyTheme = (newTheme: string) => {
    // Применяем тему panda-dark
    const themeConfig = getAppTheme('panda-dark')
    const colors = themeConfig.colors
    
    // Применяем CSS переменные к root
    const root = document.documentElement;
    
    // Основные цвета
    root.style.setProperty('--color-bg', colors.primary.background);
    root.style.setProperty('--color-bg-secondary', colors.secondary.background);
    root.style.setProperty('--color-bg-card', colors.secondary.surface);
    root.style.setProperty('--color-text', colors.primary.text);
    root.style.setProperty('--color-text-secondary', colors.secondary.text);
    root.style.setProperty('--color-border', colors.secondary.border);
    
    // Совместимость со старыми переменными
    root.style.setProperty('--bg-primary', colors.primary.background);
    root.style.setProperty('--bg-secondary', colors.secondary.background);
    root.style.setProperty('--text-primary', colors.primary.text);
    root.style.setProperty('--text-secondary', colors.secondary.text);
    root.style.setProperty('--border-color', colors.secondary.border);
    
    // Устанавливаем data-theme
    document.body.setAttribute('data-theme', 'panda-dark');
    document.body.setAttribute('data-restaurant', 'panda-burger');
    
    // Применяем фон к body
    document.body.style.backgroundColor = colors.primary.background;
    document.body.style.color = colors.primary.text;
    
    // Добавляем класс dark для совместимости
    document.documentElement.classList.add('dark')
  }

  const setRestaurant = (restaurant: string) => {
    // Принудительно оставляем panda-burger для этого проекта
    setCurrentRestaurant('panda-burger')
    localStorage.setItem('selectedRestaurant', 'panda-burger')
    
    // Всегда применяем panda-dark тему
    applyTheme('panda-dark')
  }

  const getThemeClasses = () => {
    const themeClasses = getAppThemeClasses('panda-dark')
    return {
      background: themeClasses.background,
      cardBackground: themeClasses.cardBg,
      headerBackground: themeClasses.bgSecondary,
      text: themeClasses.text,
      border: themeClasses.border
    }
  }

  return {
    theme,
    currentTheme: getAppTheme('panda-dark'),
    isDark: true,
    isLight: false,
    isDarkMode: true, // для обратной совместимости
    mounted,
    currentRestaurant,
    setRestaurant,
    getThemeClasses
  }
}