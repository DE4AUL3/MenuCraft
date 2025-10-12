'use client';

import { Dish } from '@/types';
import { useTranslation } from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { t } = useTranslation();
  const { currentRestaurant } = useTheme();
  const [isLiked, setIsLiked] = useState(false);

  // Определяем тему на основе ресторана
  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1';

  return (
    <div className={`rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border hover:-translate-y-1 group ${
      isDark
        ? 'bg-[#282828] border-gray-600 hover:border-emerald-400'
        : 'bg-white border-gray-100 hover:border-emerald-200'
    }`}>
      {/* Изображение */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
        <Image
          src={dish.image}
          alt={dish.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Кнопка лайка */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-gray-800/90 hover:bg-gray-800'
              : 'bg-white/90 hover:bg-white'
          }`}
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isLiked 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-400 hover:text-red-400'
            }`} 
          />
        </button>

        {/* Цена поверх изображения */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className={`backdrop-blur-sm px-3 py-1 rounded-full ${
            isDark
              ? 'bg-gray-800/95'
              : 'bg-white/95'
          }`}>
            <span className="text-lg font-bold text-emerald-600">
              {dish.price} сом
            </span>
          </div>
        </div>
      </div>
      
      {/* Контент */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className={`text-lg font-bold transition-colors ${
            isDark
              ? 'text-white group-hover:text-emerald-400'
              : 'text-gray-900 group-hover:text-emerald-600'
          }`}>
            {dish.name}
          </h3>
          <p className={`text-sm mt-1 line-clamp-2 leading-relaxed ${
            isDark
              ? 'text-gray-300'
              : 'text-gray-600'
          }`}>
            {dish.description}
          </p>
        </div>
        
        {/* Кнопка заказа */}
        <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]">
          <ShoppingCart className="w-4 h-4" />
          {t('order')}
        </button>
      </div>
    </div>
  );
}