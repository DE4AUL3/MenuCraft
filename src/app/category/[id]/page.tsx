'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DishCard from '@/components/DishCard';
import FloatingCallButton from '@/components/FloatingCallButton';
import Header from '@/components/Header';
import { useTranslation } from '@/components/LanguageToggle';
import { Category, Dish } from '@/types';
import { ArrowLeft } from 'lucide-react';
import restaurantData from '../../../../data/restaurants.json';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const categoryId = params.id as string;
    
    // Ищем категорию в первом ресторане (Kemine Bistro)
    const restaurant = restaurantData.restaurants[0];
    const foundCategory = restaurant.categories.find(cat => cat.id === categoryId);
    
    if (foundCategory) {
      setCategory(foundCategory);
      setDishes(foundCategory.dishes);
    }
  }, [params.id]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Загрузка блюд...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Header restaurantName="Kemine Bistro" />
      
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Навигация */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>
        </div>

        {/* Заголовок категории */}
        <div className="text-center mb-12">
          <div className="relative h-32 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-emerald-100">
                  {dishes.length} {t('dishes')} {t('inCategory')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Сетка блюд */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>

        {/* Пустое состояние */}
        {dishes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Пока нет блюд
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              В этой категории скоро появятся новые блюда
            </p>
          </div>
        )}
      </main>

      <FloatingCallButton />
    </div>
  );
}