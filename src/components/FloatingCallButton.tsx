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
        className="fixed bottom-6 right-6 group z-50 animate-float"
        aria-label="Позвонить"
      >
        {/* Внешнее свечение */}
        <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-pulse-ring" />
        <div className="absolute inset-1 bg-green-400 rounded-full opacity-50 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        
        {/* Основная кнопка */}
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95 animate-glow">
          {/* Внутреннее свечение */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-shimmer" />
          
          {/* Иконка */}
          <Phone className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Пульсирующие кольца */}
          <div className="absolute inset-0 rounded-full border-2 border-green-300 opacity-0 group-hover:opacity-100 animate-pulse" />
          <div className="absolute -inset-2 rounded-full border border-green-200 opacity-0 group-hover:opacity-60 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute -inset-4 rounded-full border border-green-100 opacity-0 group-hover:opacity-40 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        
        {/* Подсказка */}
        <div className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
          Позвонить нам
        </div>
      </button>
      
      <CallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}