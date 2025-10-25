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
    // Подписка на глобальное событие смены языка
    const handleLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<Language>).detail;
      if (detail && (detail === 'ru' || detail === 'tk')) {
        setCurrentLanguage(detail);
      }
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, [])

  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === 'ru' ? 'tk' : 'ru'
    setCurrentLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }))
  }

  return {
    currentLanguage,
    setCurrentLanguage,
    toggleLanguage
  }
}