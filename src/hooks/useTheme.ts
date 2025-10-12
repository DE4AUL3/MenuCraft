'use client'

import { useState, useEffect } from 'react'
import { ThemeMode, themes, getCSSVariables } from '@/styles/simpleTheme'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [mounted, setMounted] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<string>('han-tagam')

  useEffect(() => {
    setMounted(true)
    
    // Загружаем выбранный ресторан
    const savedRestaurant = localStorage.getItem('selectedRestaurant') || 'han-tagam'
    setCurrentRestaurant(savedRestaurant)
    
    // Получаем сохраненную тему или системную
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemTheme
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: ThemeMode) => {
    const themeConfig = themes[newTheme]
    const cssVars = getCSSVariables(themeConfig)
    
    // Применяем CSS переменные к root
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    
    // Добавляем/убираем класс dark
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const setRestaurant = (restaurant: string) => {
    setCurrentRestaurant(restaurant)
    localStorage.setItem('selectedRestaurant', restaurant)
  }

  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const setSpecificTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const getThemeClasses = () => {
    const currentTheme = themes[theme]
    return {
      background: `bg-[${currentTheme.colors.background.primary}]`,
      cardBackground: `bg-[${currentTheme.colors.background.secondary}]`,
      headerBackground: `bg-[${currentTheme.colors.background.secondary}]`,
      text: `text-[${currentTheme.colors.text.primary}]`,
      border: `border-[${currentTheme.colors.border.primary}]`
    }
  }

  return {
    theme,
    currentTheme: themes[theme],
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isDarkMode: theme === 'dark', // для обратной совместимости
    mounted,
    currentRestaurant,
    setRestaurant,
    getThemeClasses
  }
}