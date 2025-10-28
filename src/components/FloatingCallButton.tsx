'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import CallModal from './CallModal';

export default function FloatingCallButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 group z-40 animate-float"
        aria-label="Позвонить"
      >
        {/* Внешние пульсирующие кольца */}
        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent-call)', opacity: 0.3 }} />
        <div className="absolute inset-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--accent-call)', opacity: 0.4, animationDelay: '0.3s' }} />
        
        {/* Основная кнопка */}
        <div className="relative text-white p-5 rounded-full shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95" style={{ 
          background: `linear-gradient(135deg, var(--accent-call), var(--accent-call))`,
          boxShadow: `0 25px 50px -12px var(--accent-call)50`
        }}>
          {/* Внутреннее свечение */}
          <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Иконка */}
          <Phone className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Анимированный border */}
          <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Подсказка с улучшенным дизайном */}
        <div className="absolute bottom-full right-0 mb-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 shadow-xl">
          Позвонить нам
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
        </div>
      </button>
      
      <CallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}