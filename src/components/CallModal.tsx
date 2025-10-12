'use client';

import { Contact } from '@/types';
import { useTranslation } from './LanguageToggle';
import { X, Phone, Download } from 'lucide-react';
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
      // Для десктопа - пытаемся открыть контакты или скачать VCard
      const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Kemine Bistro - ${contacts.find(c => c.phone === phone)?.name || 'Контакт'}
ORG:Kemine Bistro
TEL:${phone}
EMAIL:info@kemine-bistro.kg
URL:https://kemine-bistro.kg
ADR:;;Бишкек, Кыргызстан;;;;
END:VCARD`;

      const blob = new Blob([vCardContent], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kemine-bistro-${phone.replace(/[^0-9]/g, '')}.vcf`;
      link.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const handleDownloadVCard = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:Kemine Bistro
ORG:Kemine Bistro
TEL:+996 555 123 456
TEL:+996 555 987 654
EMAIL:info@kemine-bistro.kg
URL:https://kemine-bistro.kg
ADR:;;Бишкек, Кыргызстан;;;;
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kemine-bistro.vcf';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('contacts')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Контакты */}
        <div className="p-6 space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="group relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg">
              {/* Анимированный фон при ховере */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                    {contact.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {contact.phone}
                  </p>
                </div>
                
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-110 active:scale-95 group/btn"
                >
                  {/* Пульсирующий эффект */}
                  <div className="absolute inset-0 bg-green-400 rounded-xl opacity-0 group-hover/btn:opacity-50 animate-pulse" />
                  <Phone className="w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  
                  {/* Подсказка */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {t('call')}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Кнопка сохранения */}
        <div className="p-6 pt-0">
          <button
            onClick={handleDownloadVCard}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            {t('saveContact')}
          </button>
        </div>
      </div>
    </div>
  );
}