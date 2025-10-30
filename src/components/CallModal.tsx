
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
  { label: 'Доставка', phone: '+996 555 123 456' },
  { label: 'Бронь столика', phone: '+996 555 987 654' },
  { label: 'Администратор', phone: '+996 555 222 333' },
  { label: 'Бар', phone: '+996 555 444 555' },
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
          {contacts.map((c, i) => (
            <div
              key={c.phone}
              className="group flex items-center justify-between bg-white rounded-2xl border border-gray-100 hover:border-emerald-400 transition-all duration-200 shadow-sm hover:shadow-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {/* Иконки для разных контактов */}
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 text-lg shadow-sm">
                  {i === 0 && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15.46A16.88 16.88 0 0 1 8.54 3 6 6 0 0 0 3 9v3a6 6 0 0 0 6 6h3a6 6 0 0 0 6-6v-1.54z"></path><path d="M8.54 3a16.88 16.88 0 0 0 12.42 12.42"></path></svg>
                  )}
                  {i === 1 && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4"/><path d="M8 3v4"/></svg>
                  )}
                  {i === 2 && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  )}
                  {i === 3 && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>
                  )}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{c.label}</p>
                  <p className="text-gray-500 font-medium text-sm mt-0.5">{c.phone}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCall(c.phone)}
                className="relative bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
                aria-label="Позвонить"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-5 h-5" aria-hidden="true"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}