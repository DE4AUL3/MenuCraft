'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import OrdersModule from './modules/OrdersModule'
import AdminOrderNotifier from './AdminOrderNotifier'
import { COLORS } from '@/config/colors'
import {
  BarChart3,
  TrendingUp,
  Store,
  Phone,
  ShoppingBag,
  Eye,
  Users,
  FileText,
  MessageSquare
} from 'lucide-react'
import { AdminTheme } from './AdminHeader'
import AdminThemeEffects from './AdminThemeEffects'

import type { Language } from '@/i18n/translations';
import { useLanguage } from '@/hooks/useLanguage';
interface AdminLayoutProps {
  children: React.ReactNode
  activeTab?: string
  onTabChange?: (tab: string) => void
}

// Навигационная панель встроена прямо в компонент
const navigationTabs = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: <Eye className="w-4 h-4" />,
    description: 'Общая статистика и аналитика',
    submenu: [
      { id: 'basic', label: 'Базовый', icon: <BarChart3 className="w-3 h-3" /> },
      { id: 'analytics', label: 'Аналитика', icon: <TrendingUp className="w-3 h-3" /> }
    ]
  },
  {
    id: 'restaurant',
    label: 'Ресторан',
    icon: <Store className="w-4 h-4" />,
    description: 'Управление меню и категориями',
    submenu: [
      { id: 'general', label: 'Общее', icon: <Store className="w-3 h-3" /> },
      { id: 'categories', label: 'Категории', icon: <TrendingUp className="w-3 h-3" /> },
      { id: 'dishes', label: 'Блюда', icon: <ShoppingBag className="w-3 h-3" /> },
      { id: 'cart', label: 'Корзина', icon: <ShoppingBag className="w-3 h-3" /> }
    ]
  },
  {
    id: 'orders',
    label: 'Заказы',
    icon: <FileText className="w-4 h-4" />,
    description: 'Управление заказами и уведомления',
    submenu: [
      { id: 'active', label: 'Активные', icon: <Users className="w-3 h-3" /> },
      { id: 'history', label: 'История', icon: <FileText className="w-3 h-3" /> },
      { id: 'notifications', label: 'Уведомления', icon: <MessageSquare className="w-3 h-3" /> }
    ]
  },
  {
    id: 'contacts',
    label: 'Контакты',
    icon: <Phone className="w-4 h-4" />,
    description: 'База контактов и SMS рассылка',
    submenu: [
      { id: 'database', label: 'База номеров', icon: <Users className="w-3 h-3" /> },
      { id: 'sms-export', label: 'SMS экспорт', icon: <MessageSquare className="w-3 h-3" /> }
    ]
  }
]

const themeStyles = {
  light: {
    bg: 'bg-white/90 backdrop-blur-sm',
    border: 'border-gray-200',
    text: 'text-gray-700',
    textActive: 'text-blue-600',
    textHover: 'text-gray-900',
    bgActive: 'bg-blue-50',
    bgHover: 'hover:bg-gray-50',
    borderActive: 'border-blue-200',
    accent: 'from-blue-500 to-purple-600'
  },
  dark: {
    bg: 'bg-gray-950/95 backdrop-blur-sm border-t border-gray-800/50',
    border: 'border-gray-800',
    text: 'text-gray-300',
    textActive: 'text-gray-50',
    textHover: 'text-gray-100',
    bgActive: 'bg-gray-800/60',
    bgHover: 'hover:bg-gray-900/60',
    borderActive: 'border-gray-600',
    accent: 'from-gray-700 to-gray-900'
  }
}

export default function AdminLayout({ children, activeTab: externalActiveTab, onTabChange }: AdminLayoutProps) {
  const [currentTheme, setCurrentTheme] = useState<AdminTheme>('dark')
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'overview')

  // Синхронизируем с внешним activeTab
  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab)
    }
  }, [externalActiveTab, activeTab])

  // Всегда используем темную тему
  useEffect(() => {
    setCurrentTheme('dark')
  }, [])

  // Применяем тему к body элементу
  useEffect(() => {
    const body = document.body
    
    // Удаляем предыдущие классы тем
    body.classList.remove('admin-light', 'admin-dark')
    
    // Добавляем только темную тему
    body.classList.add('admin-dark')
    
    // Устанавливаем CSS переменные для темной темы
    const root = document.documentElement
    
    root.style.setProperty('--admin-bg-primary', '#030712')
    root.style.setProperty('--admin-bg-secondary', '#111827')
    root.style.setProperty('--admin-text-primary', '#f9fafb')
    root.style.setProperty('--admin-text-secondary', '#9ca3af')
    root.style.setProperty('--admin-border', '#1f2937')
    root.style.setProperty('--admin-accent', '#4b5563')
  }, [currentTheme])

  const getThemeClasses = () => {
    return 'bg-gradient-to-br from-gray-950 to-gray-900 text-gray-50'
  }

  const handleTabChange = (tab: string) => {
    console.log('AdminLayout: Переключение на вкладку:', tab)
    console.log('AdminLayout: Текущая активная вкладка:', activeTab)
    console.log('AdminLayout: onTabChange функция:', onTabChange)
    setActiveTab(tab)
    
    // Уведомляем родительский компонент об изменении
    if (onTabChange) {
      onTabChange(tab)
    }
  }

  const handleTabClick = (tabId: string) => {
    console.log('AdminLayout: Клик по вкладке:', tabId)
    handleTabChange(tabId)
  }

  // Динамическое количество заказов
  const [ordersCount, setOrdersCount] = useState(0);
  // Язык админки (глобальный)
  const { currentLanguage: language, setCurrentLanguage } = useLanguage();
  // Пробрасываем setOrdersCount в AdminOrderNotifier и OrdersModule
  const childrenWithOrdersCount = React.Children.map(children, child => {
    if (
      React.isValidElement(child) &&
      (child.type === OrdersModule ||
        (typeof child.type === 'function' && child.type.name === 'OrdersModule'))
    ) {
      return React.cloneElement(child as React.ReactElement<any>, { setOrdersCount });
    }
    if (
      React.isValidElement(child) &&
      (child.type === (AdminOrderNotifier as unknown as React.FunctionComponent<any>) ||
        (typeof child.type === 'function' && child.type.name === 'AdminOrderNotifier'))
    ) {
      return React.cloneElement(child as React.ReactElement<any>, { setOrdersCount });
    }
    return child;
  });
  return (
    <div
      className="min-h-screen flex transition-all duration-300 relative"
      style={{ background: COLORS.background, color: COLORS.text }}
    >
      <AdminThemeEffects theme={currentTheme} />
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        ordersCount={ordersCount}
        language={language}
        setLanguage={setCurrentLanguage}
      />
      <main className="flex-1 transition-all duration-300 relative z-10" style={{ background: COLORS.background, color: COLORS.text }}>
        {React.Children.map(childrenWithOrdersCount, child => {
          if (!React.isValidElement(child)) return child;
          // Пробрасываем язык только в компоненты-модули/менеджеры по displayName/id
          const typeName = (child.type as any)?.displayName || (child.type as any)?.name || '';
          // Только для известных модулей/менеджеров
          // Пробрасываем props только если они уже есть у child.props
          if ([
            'DishManager',
            'CategoryManager',
            'RestaurantModule',
            'MenuItemManager',
            'OrdersModule',
            'OrderManager',
            'ClientManager',
            'ImageManager',
            'PremiumAdminDashboardV2'
          ].includes(typeName)) {
            const newProps: any = {};
            const childProps = child.props as any;
            if (childProps && 'language' in childProps) newProps.language = language;
            if (childProps && 'setLanguage' in childProps) newProps.setLanguage = setCurrentLanguage;
            if (Object.keys(newProps).length > 0) {
              return React.cloneElement(child, newProps);
            }
          }
          return child;
        })}
      </main>
    </div>
  )
}