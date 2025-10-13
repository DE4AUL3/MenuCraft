'use client';

import { Category } from '@/types';
import { useTranslation } from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import SmartImage from '@/components/ui/SmartImage';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700 hover:border-orange-500/50'
            : 'bg-white border-gray-200 hover:border-orange-400/50'
        }`}
        style={{
          '--hover-border-color': 'var(--color-primary)',
        } as React.CSSProperties}
      >
        {/* Градиентная рамка при ховере */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"
          style={{
            background: `linear-gradient(135deg, var(--gradient-from), var(--gradient-via), var(--gradient-to))`
          }}
        />
        <div className={`absolute inset-[3px] rounded-2xl transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`} />
        
        {/* Изображение */}
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <SmartImage
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Оверлей градиент */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Иконка стрелки */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Контент */}
        <div className={`relative p-5 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 
            className={`text-lg font-bold mb-4 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={{
              color: isDarkMode 
                ? undefined 
                : 'var(--text-primary)'
            }}
          >
            {category.name}
          </h3>
          
          {/* Количество блюд */}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-3 py-1 rounded-full transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300 group-hover:bg-orange-900/30 group-hover:text-orange-300'
                : 'bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700'
            }`}>
              {category.dishes?.length || 0} {t('dishes')}
            </span>
            
            <motion.div
              className={`p-1 rounded-full transition-colors duration-300 ${
                isDarkMode
                  ? 'text-gray-400 group-hover:text-orange-400'
                  : 'text-gray-500 group-hover:text-orange-600'
              }`}
              whileHover={{ x: 2 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}