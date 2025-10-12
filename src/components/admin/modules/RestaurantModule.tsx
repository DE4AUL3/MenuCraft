"use client";

import { useState } from 'react';
import { Store, TrendingUp, ShoppingBag, FileText } from 'lucide-react';
import { AdminTheme } from '@/components/admin/AdminHeader';
import RestaurantGeneralSettings from './RestaurantGeneralSettings';
import CategoryManager from '@/components/CategoryManager';
import DishManager from './DishManager';
import CartSettings from './CartSettings';

interface RestaurantModuleProps {
  className?: string;
  theme?: AdminTheme;
}

type SubTab = 'general' | 'categories' | 'dishes' | 'cart';

export default function RestaurantModule({ className = '', theme = 'light' }: RestaurantModuleProps) {
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>('general');

  const subTabs = [
    {
      id: 'general' as SubTab,
      label: 'Общее',
      icon: <Store className="w-4 h-4" />,
      description: 'Основные настройки ресторана'
    },
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
      case 'general':
        return <RestaurantGeneralSettings />;
      
      case 'categories':
        return <CategoryManager />;
      
      case 'dishes':
        return <DishManager theme={theme} />;
      
      case 'cart':
        return <CartSettings restaurantId="main_restaurant" />;
      
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex space-x-8 overflow-x-auto">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentSubTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                currentSubTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
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
