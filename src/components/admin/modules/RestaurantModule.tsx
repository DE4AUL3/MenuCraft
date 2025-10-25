"use client";


import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, FileText, UtensilsCrossed } from 'lucide-react';
import CategoryManager from '@/components/CategoryManager';
import DishManager from './DishManager';
import CartSettings from './CartSettings';
import { useLanguage } from '@/hooks/useLanguage';


interface RestaurantModuleProps {
  className?: string;
  theme?: 'light' | 'dark';
}


type SubTab = 'categories' | 'dishes' | 'cart';


export default function RestaurantModule(props: RestaurantModuleProps) {
  const { className = '', theme = 'light' } = props;
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>('categories');
  const [stats, setStats] = useState<{categories: number; dishes: number; zones: number}>({categories: 0, dishes: 0, zones: 0});
  const { currentLanguage: lang } = useLanguage ? useLanguage() : { currentLanguage: 'ru' };

  // Тексты для переводов
  const t = {
    ru: {
      title: 'Модуль ресторана',
      desc: 'Управление категориями, блюдами и доставкой',
      categories: 'Категории',
      dishes: 'Блюда',
      cart: 'Корзина',
      statCategories: 'Категорий',
      statDishes: 'Блюд',
      statZones: 'Зон доставки',
    },
    tk: {
      title: 'Restoran moduly',
      desc: 'Kategoriýalar, tagamlar we eltip bermek dolandyryşy',
      categories: 'Kategoriýalar',
      dishes: 'Tagamlar',
      cart: 'Sebet',
      statCategories: 'Kategoriýa',
      statDishes: 'Tagam',
      statZones: 'Eltip bermek zonasy',
    }
  };
  const L = t[lang as 'ru' | 'tk'] || t.ru;

  // Получение статистики (количество категорий, блюд, зон доставки)
  useEffect(() => {
    async function fetchStats() {
      try {
        const [catRes, dishRes, cartRes] = await Promise.all([
          fetch('/api/category'),
          fetch('/api/meal'),
          fetch('/api/cart-settings?restaurantId=main_restaurant')
        ]);
        const categories = await catRes.json();
        const dishes = await dishRes.json();
        const cart = await cartRes.json();
        setStats({
          categories: Array.isArray(categories) ? categories.length : 0,
          dishes: Array.isArray(dishes) ? dishes.length : 0,
          zones: Array.isArray(cart?.deliveryZones) ? cart.deliveryZones.length : 0
        });
      } catch {
        setStats({ categories: 0, dishes: 0, zones: 0 });
      }
    }
    fetchStats();
  }, [currentSubTab]);

  const subTabs = [
    {
      id: 'categories' as SubTab,
      label: t[lang as 'ru' | 'tk']?.categories || 'Категории',
      icon: <TrendingUp className="w-4 h-4" />,
      description: lang === 'ru' ? 'Управление категориями меню' : 'Menýu kategoriýalary'
    },
    {
      id: 'dishes' as SubTab,
      label: t[lang as 'ru' | 'tk']?.dishes || 'Блюда',
      icon: <ShoppingBag className="w-4 h-4" />,
      description: lang === 'ru' ? 'Управление блюдами и ценами' : 'Tagamlar we bahalar'
    },
    {
      id: 'cart' as SubTab,
      label: t[lang as 'ru' | 'tk']?.cart || 'Корзина',
      icon: <FileText className="w-4 h-4" />,
      description: lang === 'ru' ? 'Настройки корзины и доставки' : 'Sebet we eltip bermek sazlamalary'
    }
  ];

  const renderTabContent = () => {
    switch (currentSubTab) {
      case 'categories':
        return <CategoryManager />;
      case 'dishes':
        return <DishManager theme={theme} />;
      case 'cart':
        return <CartSettings restaurantId="main_restaurant" />;
      default:
        return <CategoryManager />;
    }
  };

  return (
  <div className={`rounded-2xl shadow-xl p-6 md:p-10 ${className}`}>


      {/* Подвкладки — стиль как в Overview (светлый фон, тёмный текст, hover) */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {subTabs.map((tab) => {
            // Цвета для иконок и border активной вкладки
            let iconColor = '';
            let borderColor = '';
            if (tab.id === 'categories') {
              iconColor = 'text-blue-500';
              borderColor = 'border-blue-500';
            } else if (tab.id === 'dishes') {
              iconColor = 'text-purple-500';
              borderColor = 'border-purple-500';
            } else if (tab.id === 'cart') {
              iconColor = 'text-green-500';
              borderColor = 'border-green-500';
            }
            const isActive = currentSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentSubTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105
                  bg-white text-gray-800 hover:bg-gray-50 shadow-md
                  ${isActive ? `border-b-4 ${borderColor}` : 'border-b-4 border-transparent'}
                `}
                title={tab.description}
              >
                {/* Цветная иконка */}
                <span className={iconColor}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
