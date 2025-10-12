'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/hooks/useTheme';

export default function FloatingCartButton() {
  const { state } = useCart();
  const { isDarkMode } = useTheme();
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Не показываем кнопку если корзина пуста
  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 right-6 group z-50 animate-float"
      aria-label="Перейти в корзину"
    >
      {/* Внешнее свечение */}
      <div className={`absolute inset-0 rounded-full opacity-75 animate-pulse-ring ${
        isDarkMode ? 'bg-emerald-400' : 'bg-emerald-500'
      }`} />
      <div className={`absolute inset-1 rounded-full opacity-50 animate-pulse-ring ${
        isDarkMode ? 'bg-emerald-300' : 'bg-emerald-400'
      }`} style={{ animationDelay: '0.5s' }} />
      
      {/* Основная кнопка */}
      <div className={`relative text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95 animate-glow ${
        isDarkMode 
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
          : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
      }`}>
        {/* Внутреннее свечение */}
        <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-shimmer ${
          isDarkMode 
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
            : 'bg-gradient-to-r from-emerald-400 to-teal-500'
        }`} />
        
        {/* Иконка корзины */}
        <ShoppingCart className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Счетчик товаров */}
        <div className={`absolute -top-2 -right-2 min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isDarkMode 
            ? 'bg-white text-emerald-600' 
            : 'bg-white text-emerald-600'
        }`}>
          {totalItems > 99 ? '99+' : totalItems}
        </div>
        
        {/* Пульсирующие кольца */}
        <div className={`absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 animate-pulse ${
          isDarkMode ? 'border-emerald-300' : 'border-emerald-300'
        }`} />
        <div className={`absolute -inset-2 rounded-full border opacity-0 group-hover:opacity-60 animate-pulse ${
          isDarkMode ? 'border-emerald-200' : 'border-emerald-200'
        }`} style={{ animationDelay: '0.2s' }} />
        <div className={`absolute -inset-4 rounded-full border opacity-0 group-hover:opacity-40 animate-pulse ${
          isDarkMode ? 'border-emerald-100' : 'border-emerald-100'
        }`} style={{ animationDelay: '0.4s' }} />
      </div>
      
      {/* Подсказка с суммой */}
      <div className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
        <div className="font-semibold">{totalItems} товаров</div>
        <div className="text-emerald-300">{state.totalAmount} ТМТ</div>
      </div>
    </Link>
  );
}