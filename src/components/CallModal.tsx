import React from 'react';
import { Phone, X, Utensils, Coffee, ChefHat, Pizza } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getText } from '@/i18n/translations';

interface Contact {
  phone: string;
  icon: React.ReactNode;
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contacts: Contact[] = [
  { 
    phone: '130011', 
    icon: <ChefHat className="w-5 h-5" />
  },
  { 
    phone: '160011', 
    icon: <Pizza className="w-5 h-5" />
  },
  { 
    phone: '190011', 
    icon: <Coffee className="w-5 h-5" />
  },
];

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const { currentLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#1f1f22] rounded-3xl max-w-md w-full shadow-2xl border border-[#b8252b]/30 animate-zoom-in-95 overflow-hidden">
        {/* Заголовок с темой panda-dark */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-[#b8252b] to-[#e0343a]">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{getText('contactUs', currentLanguage)}</h2>
                <p className="text-white/90 text-sm">{getText('selectPhone', currentLanguage)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              aria-label={getText('close', currentLanguage)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Список контактов */}
        <div className="p-6 space-y-3">
          {contacts.map((contact, index) => (
            <button
              key={contact.phone}
              type="button"
              onClick={() => handleCall(contact.phone)}
              className="w-full flex items-center bg-[#27272a] hover:bg-[#1a1a1d] rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg px-5 py-4 group border border-[#b8252b]/20 hover:border-[#b8252b]/40"
              aria-label={`${getText('call', currentLanguage)}: ${contact.phone}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Иконка */}
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[#b8252b] to-[#e0343a] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                <div className="text-white">
                  {contact.icon}
                </div>
              </div>
              
              {/* Номер телефона */}
              <div className="flex-1 ml-4 text-center">
                <div className="font-mono text-xl font-bold text-[#f5f5f4] group-hover:text-[#e0343a] transition-colors tracking-wider">
                  {contact.phone}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 bg-[#1a1a1d] border-t border-[#b8252b]/20">
          <div className="flex items-center justify-center space-x-2 text-sm text-[#a1a1aa]">
            <div className="w-2 h-2 bg-[#e0343a] rounded-full animate-pulse"></div>
            <span>{getText('workingHours', currentLanguage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
