
import React from 'react';

interface Contact {
  label: string;
  phone: string;
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contacts: Contact[] = [
  { label: '', phone: '8 64 530011' },
  { label: '', phone: '8 62 530011' },
  { label: '', phone: '8 63 891818' },
  { label: '', phone: '8 65 530011' },
];

export default function CallModal({ isOpen, onClose }: CallModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px] animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 animate-zoom-in-95 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Связаться с нами</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            aria-label="Закрыть"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x w-5 h-5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          {contacts.map((c) => (
            <button
              key={c.phone}
              type="button"
              onClick={() => handleCall(c.phone)}
              className="w-full flex items-center justify-center bg-white rounded-2xl border border-[#e8e4dc]/50 hover:border-[#d4af37] transition-all duration-200 shadow-sm hover:shadow-lg px-6 py-5 mb-2 group"
              aria-label={`Позвонить: ${c.phone}`}
            >
              <span className="text-[#1e1e1e] group-hover:text-[#d4af37] text-lg font-mono tracking-widest text-center w-full">
                {c.phone}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}