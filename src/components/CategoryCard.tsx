'use client';

import { Category } from '@/types';
import { useTranslation } from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import { imageService } from '@/lib/imageService';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();
  const { currentRestaurant } = useTheme();

  return (
    <Link 
      href={`/category/${category.id}`}
      className="group block"
    >
      <div className={`relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border group-hover:-translate-y-2 group-hover:scale-105 ${
        currentRestaurant === 'panda-burger' || currentRestaurant === '1'
          ? 'bg-[#282828] border-gray-600 hover:border-transparent'
          : 'bg-white border-gray-100 hover:border-transparent'
      }`}>
        {/* Градиентная рамка при ховере */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        <div className={`absolute inset-[2px] rounded-3xl ${
          currentRestaurant === 'panda-burger' || currentRestaurant === '1'
            ? 'bg-[#282828]'
            : 'bg-white'
        }`} />
        
        {/* Изображение */}
        <div className="relative h-48 sm:h-40 md:h-52 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
          <Image
            src={imageService.getImageUrl(category.image)}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Плавающий счетчик блюд */}
          <div className="absolute top-4 right-4 z-20">
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                {category.dishes.length} {t('dishes')}
              </span>
            </div>
          </div>

          {/* Эффект свечения при ховере */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        </div>
        
        {/* Контент */}
        <div className={`relative p-6 ${
          currentRestaurant === 'panda-burger' || currentRestaurant === '1'
            ? 'bg-[#282828]'
            : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 transition-colors ${
                currentRestaurant === 'panda-burger' || currentRestaurant === '1'
                  ? 'text-white group-hover:text-emerald-400'
                  : 'text-gray-900 group-hover:text-emerald-600'
              }`}>
                {category.name}
              </h3>
              <p className={`text-sm font-medium ${
                currentRestaurant === 'panda-burger' || currentRestaurant === '1'
                  ? 'text-gray-300'
                  : 'text-gray-600'
              }`}>
                {category.dishes.length} {t('dishes')}
              </p>
            </div>
            
            {/* Анимированная стрелка */}
            <div className="ml-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Декоративные элементы */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </Link>
  );
}