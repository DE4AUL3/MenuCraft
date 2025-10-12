'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<string>('han-tagam')

  useEffect(() => {
    setMounted(true)

    // Грузим выбранный ресторан (для контента), но тема от ресторана НЕ зависит
    const savedRestaurant = localStorage.getItem('selectedRestaurant') || 'han-tagam'
    setCurrentRestaurant(savedRestaurant)

    // Единая тема приложения: читаем из localStorage 'theme' (fallback: light)
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | null) || 'light'
    const dark = savedTheme === 'dark'
    setIsDarkMode(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  const setRestaurant = (restaurant: string) => {
    setCurrentRestaurant(restaurant)
    localStorage.setItem('selectedRestaurant', restaurant)
    // Тему больше не переключаем от ресторана — единая цветовая гамма
  }

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    document.documentElement.classList.toggle('dark', newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }

  const getThemeClasses = () => {
    // Унифицированные классы для обеих тем
    if (isDarkMode) {
      return {
        background: 'bg-gray-900',
        cardBackground: 'bg-gray-800',
        headerBackground: 'bg-gray-800',
        text: 'text-white',
        border: 'border-gray-700'
      }
    }
    return {
      background: 'bg-white',
      cardBackground: 'bg-white',
      headerBackground: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200'
    }
  }

  return {
    isDarkMode,
    toggleTheme,
    mounted,
    currentRestaurant,
    setRestaurant,
    getThemeClasses
  }
}