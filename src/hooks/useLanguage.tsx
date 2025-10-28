import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { JSX } from 'react';

export type Language = 'ru' | 'tk';

interface LanguageContextType {
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


export function LanguageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'ru' || savedLanguage === 'tk') {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'ru' ? 'tk' : 'ru');
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage: setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
