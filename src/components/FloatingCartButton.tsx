'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function FloatingCartButton() {
  const { state } = useCart();
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Не показываем кнопку если корзина пуста
  if (totalItems === 0) return null;

  return (
    <Link
      href="/cart"
      className="fixed bottom-20 right-6 group z-50 animate-float isolate"
      aria-label="Перейти в корзину"
    >
      {/* Внешние пульсирующие кольца */}
      <div className="absolute inset-0 rounded-full animate-ping mix-blend-normal" style={{ 
        backgroundColor: 'var(--accent-call)', 
        opacity: 0.3 
      }} />
      <div className="absolute inset-2 rounded-full animate-ping mix-blend-normal" style={{ 
        backgroundColor: 'var(--accent-call)', 
        opacity: 0.4, 
        animationDelay: '0.3s' 
      }} />
      
      {/* Основная кнопка */}
      <div className="relative text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95 mix-blend-normal" style={{ 
        backgroundColor: 'var(--accent-call)',
        // небольшой контрастный ободок чтобы отделять кнопку от любого фона
        border: '1px solid rgba(255,255,255,0.12)'
      }}>
        {/* Внутреннее свечение */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Иконка корзины */}
        <ShoppingCart className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        
        {/* Счетчик товаров */}
        <div className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-white text-xs font-bold rounded-full flex items-center justify-center mix-blend-normal" style={{ 
          color: 'var(--accent-call)' 
        }}>
          {totalItems > 99 ? '99+' : totalItems}
        </div>
        
        {/* Анимированные границы */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Подсказка с суммой */}
      <div className="absolute bottom-full right-0 mb-2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 mix-blend-normal">
        <div className="font-semibold">{totalItems} товаров</div>
        <div style={{ color: 'var(--accent-call)' }}>{state.totalAmount} ТМТ</div>
      </div>
    </Link>
  );
}