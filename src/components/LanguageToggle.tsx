'use client';

import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

type Language = 'ru' | 'tm';

interface Translations {
  [key: string]: {
    ru: string;
    tm: string;
  };
}

const translations: Translations = {
  selectCategory: {
    ru: 'Выберите категорию блюд',
    tm: 'Tagam kategoriýasyny saýlaň'
  },
  dishes: {
    ru: 'блюд',
    tm: 'tagam'
  },
  order: {
    ru: 'Заказать',
    tm: 'Sargyt etmek'
  },
  contacts: {
    ru: 'Контакты',
    tm: 'Habarlaşmak'
  },
  call: {
    ru: 'Позвонить',
    tm: 'Jaň etmek'
  },
  saveContact: {
    ru: 'Сохранить контакт',
    tm: 'Kontakty ýatda saklamak'
  },
  back: {
    ru: 'Назад',
    tm: 'Yza'
  },
  inCategory: {
    ru: 'в категории',
    tm: 'kategoriýada'
  },
  cart: {
    ru: 'Корзина',
    tm: 'Sebet'
  },
  addToCart: {
    ru: 'Добавить в корзину',
    tm: 'Sebede goşmak'
  }
};

export default function LanguageToggle() {
  const [language, setLanguage] = useState<Language>('ru');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['ru', 'tm'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    setIsOpen(false);
    
    // Диспатчим кастомное событие для обновления других компонентов
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
  };

  const languages = [
    { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
    { code: 'tm' as Language, name: 'Türkmençe', flag: '🇹🇲' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      {/* Panda Burger specific button styling */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full transition-colors duration-200 border-0 bg-transparent hover:bg-transparent focus:outline-none text-white"
        style={{ boxShadow: 'none' }}
        aria-label="Сменить язык"
      >
        <Globe className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-[#282828] border border-gray-600 rounded-xl shadow-lg z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-700 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                language === lang.code ? 'bg-orange-900/20 text-orange-400' : 'text-gray-300'
              }`}
            >
              <span>{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Хук для использования переводов
export function useTranslation() {
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && ['ru', 'tm'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = (event: CustomEvent<Language>) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return { t, language };
}