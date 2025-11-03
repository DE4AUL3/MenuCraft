'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import CallModal from './CallModal';

import { getAppThemeClasses } from '@/styles/appTheme';

export default function FloatingCallButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const theme = getAppThemeClasses('panda-dark');

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 group z-40 animate-float ${theme.accent} text-white p-5 rounded-full shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95`}
        aria-label="Позвонить"
        style={{ boxShadow: '0 25px 50px -12px #d4af37aa' }}
      >
        {/* Иконка */}
        <Phone className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        {/* Подсказка */}
        <div className="absolute bottom-full right-0 mb-3 bg-[#1e1e1e]/95 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 shadow-xl">
          Позвонить нам
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1e1e1e]/95"></div>
        </div>
      </button>
      <CallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}