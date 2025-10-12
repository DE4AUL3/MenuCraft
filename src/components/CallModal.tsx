'use client';

import { Contact } from '@/types';
import { useTranslation } from './LanguageToggle';
import { X, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    // Загружаем контакты из localStorage или используем данные по умолчанию
    const savedContacts = localStorage.getItem('restaurant_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      // Контакты по умолчанию для Kemine Bistro
      const defaultContacts: Contact[] = [
        {
          id: "delivery",
          name: "Доставка",
          phone: "+996 555 123 456"
        },
        {
          id: "booking",
          name: "Бронь столиков",
          phone: "+996 555 987 654"
        }
      ];
      setContacts(defaultContacts);
    }
  }, []);

  const handleCall = (phone: string) => {
    // Сначала пытаемся открыть в приложении телефона
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      // Для iOS
      window.location.href = `tel:${phone}`;
    } else if (navigator.userAgent.match(/Android/i)) {
      // Для Android
      window.location.href = `tel:${phone}`;
    } else {
      // Для десктопа - просто открываем телефонный звонок
      window.location.href = `tel:${phone}`;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-white/10 backdrop-blur-lg flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl max-w-sm w-full shadow-2xl border border-white/20 dark:border-gray-700/30 animate-zoom-in-95">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('contacts')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Контакты */}
        <div className="p-4 space-y-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="group relative overflow-hidden bg-white/60 dark:bg-gray-750/60 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-green-400/60 dark:hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              {/* Анимированный фон при ховере */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {contact.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 font-medium text-sm mt-0.5">
                    {contact.phone}
                  </p>
                </div>
                
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-110 active:scale-95 group/btn"
                >
                  {/* Пульсирующий эффект */}
                  <div className="absolute inset-0 bg-green-400 rounded-xl opacity-0 group-hover/btn:opacity-30 animate-pulse" />
                  <Phone className="w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  
                  {/* Подсказка */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                    {t('call')}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-black/90"></div>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}