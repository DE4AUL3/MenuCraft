import React from 'react';

interface Contact {
  label: string;
  phone: string;
}

const contacts: Contact[] = [
  { label: 'Доставка', phone: '+996 555 123 456' },
  { label: 'Бронь столиков', phone: '+996 555 987 654' },
];

type Props = {
  onClose?: () => void;
};

export default function ContactsModal({ onClose }: Props) {
  // click-to-call
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl max-w-sm w-full shadow-2xl border border-white/20 dark:border-gray-700/30 animate-zoom-in-95">
      <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Контакты</h2>
        <button
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
      <div className="p-4 space-y-3">
        {contacts.map((c) => (
          <div
            key={c.phone}
            className="group relative overflow-hidden bg-white/60 dark:bg-gray-750/60 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-green-400/60 dark:hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
          >
            <div className="absolute inset-0 bg-linear-to-r from-green-50/30 to-emerald-50/30 dark:from-green-900/10 dark:to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{c.label}</p>
                <p className="text-gray-600 dark:text-gray-300 font-medium text-sm mt-0.5">{c.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCall(c.phone)}
                className="relative bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 transform hover:scale-110 active:scale-95 group/btn"
                aria-label="Позвонить"
              >
                <div className="absolute inset-0 bg-green-400 rounded-xl opacity-0 group-hover/btn:opacity-30 animate-pulse"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-4 h-4 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                  Позвонить
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-black/90"></div>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
