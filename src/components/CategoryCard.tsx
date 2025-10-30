'use client';

import { Category } from '@/types';
import { useTranslation } from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <Link 
      href={`/category/${category.id}`}
      className="group block"
    >
      <div 
        className={`relative rounded-2xl overflow-hidden shadow-lg ${
          isDarkMode
            ? 'bg-gray-800'
            : 'bg-white'
        }`}
      >
  {/* Изображение - чистое фото без эффектов */}
  <div className="h-64 overflow-hidden rounded-t-2xl">
          <SmartImage
            src={category.image || '/images/categories/placeholder.jpg'}
            alt={category.name}
            className="w-full h-full object-cover object-center"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        
        {/* Контент */}
        <div className={`relative p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}> 
          <h3 
            className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {category.name}
          </h3>
          
          {/* Количество блюд */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-3 py-1 rounded-full ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {category.dishes?.length || 0} {t('dishes')}
            </span>
            
            <div
              className={`p-1 rounded-full ${
                isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}