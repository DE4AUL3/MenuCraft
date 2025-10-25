import React from 'react';

export default function AdminLanguageToggle({ language, onChange }: { language: 'ru' | 'tk', onChange: (lang: 'ru' | 'tk') => void }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <button
        className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-150 ${language === 'ru' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'}`}
        onClick={() => onChange('ru')}
        aria-pressed={language === 'ru'}
      >
        Русский
      </button>
      <button
        className={`px-2 py-1 rounded text-sm font-medium transition-colors duration-150 ${language === 'tk' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-600'}`}
        onClick={() => onChange('tk')}
        aria-pressed={language === 'tk'}
      >
        Türkmençe
      </button>
    </div>
  );
}
