'use client'

import { useState, useEffect } from 'react'

export type Language = 'ru' | 'tk'

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === 'ru' ? 'tk' : 'ru'
    setCurrentLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return {
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage
  }
}