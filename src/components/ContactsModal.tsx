import React from 'react';

interface Contact {
  label: string;
  phone: string;
}

const contacts: Contact[] = [
  { label: '', phone: '8 64 530011' },
  { label: '', phone: '8 62 530011' },
  { label: '', phone: '8 63 891818' },
  { label: '', phone: '8 65 530011' },
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
      <div className="p-4 grid grid-cols-2 gap-3">
        {contacts.map((c) => (
          <button
            key={c.phone}
            type="button"
            onClick={() => handleCall(c.phone)}
            className="flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-green-400/60 dark:hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 p-6 text-lg font-bold text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400"
            aria-label={`Позвонить ${c.phone}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone mb-2"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
            {c.phone}
          </button>
        ))}
      </div>
    </div>
  );
}
