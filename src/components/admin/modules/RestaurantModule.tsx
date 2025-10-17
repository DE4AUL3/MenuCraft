"use client";

import { useState } from 'react';
import { TrendingUp, ShoppingBag, FileText } from 'lucide-react';
import { AdminTheme } from '@/components/admin/AdminHeader';
import CategoryManager from '@/components/CategoryManager';
import DishManager from './DishManager';
import CartSettings from './CartSettings';

interface RestaurantModuleProps {
  className?: string;
  theme?: 'dark';
}

type SubTab = 'categories' | 'dishes' | 'cart';

export default function RestaurantModule({ className = '', theme = 'dark' }: RestaurantModuleProps) {
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>('categories');

  const subTabs = [
    {
      id: 'categories' as SubTab,
      label: 'Категории',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Управление категориями меню'
    },
    {
      id: 'dishes' as SubTab,
      label: 'Блюда',
      icon: <ShoppingBag className="w-4 h-4" />,
      description: 'Управление блюдами и ценами'
    },
    {
      id: 'cart' as SubTab,
      label: 'Корзина',
      icon: <FileText className="w-4 h-4" />,
      description: 'Настройки корзины и доставки'
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
    <div className={`${className}`}>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        {/* Подвкладки */}
        <div className="flex flex-wrap gap-3">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                currentSubTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md'
              }`}
              title={tab.description}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>
    </div>
  );
}
