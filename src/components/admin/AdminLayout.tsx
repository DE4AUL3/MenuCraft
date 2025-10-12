'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
import AdminHeader, { AdminTheme } from './AdminHeader'
import AdminThemeEffects from './AdminThemeEffects'

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
  const [currentTheme, setCurrentTheme] = useState<AdminTheme>('light')
  const [activeTab, setActiveTab] = useState(externalActiveTab || 'overview')

  // Синхронизируем с внешним activeTab
  useEffect(() => {
    if (externalActiveTab && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab)
    }
  }, [externalActiveTab, activeTab])

  // Загружаем сохраненную тему при инициализации
  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme') as AdminTheme
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  // Применяем тему к body элементу
  useEffect(() => {
    const body = document.body
    
    // Удаляем предыдущие классы тем
    body.classList.remove('admin-light', 'admin-dark')
    
    // Добавляем новый класс темы
    body.classList.add(`admin-${currentTheme}`)
    
    // Устанавливаем CSS переменные для темы
    const root = document.documentElement
    
    switch (currentTheme) {
      case 'light':
        root.style.setProperty('--admin-bg-primary', '#ffffff')
        root.style.setProperty('--admin-bg-secondary', '#f8fafc')
        root.style.setProperty('--admin-text-primary', '#1f2937')
        root.style.setProperty('--admin-text-secondary', '#6b7280')
        root.style.setProperty('--admin-border', '#e5e7eb')
        root.style.setProperty('--admin-accent', '#3b82f6')
        break
      case 'dark':
        root.style.setProperty('--admin-bg-primary', '#030712')
        root.style.setProperty('--admin-bg-secondary', '#111827')
        root.style.setProperty('--admin-text-primary', '#f9fafb')
        root.style.setProperty('--admin-text-secondary', '#9ca3af')
        root.style.setProperty('--admin-border', '#1f2937')
        root.style.setProperty('--admin-accent', '#4b5563')
        break
    }
  }, [currentTheme])

  const getThemeClasses = () => {
    switch (currentTheme) {
      case 'light':
        return 'bg-gray-50 text-gray-900'
      case 'dark':
        return 'bg-gradient-to-br from-gray-950 to-gray-900 text-gray-50'
      default:
        return 'bg-gray-50 text-gray-900'
    }
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

  return (
    <div className={`min-h-screen transition-all duration-300 ${getThemeClasses()} relative`}>
      <AdminThemeEffects theme={currentTheme} />
      <AdminHeader 
        currentTheme={currentTheme}
        onThemeChange={setCurrentTheme}
        restaurantName="Panda Burger"
      />
      {/* Встроенная навигационная панель */}
      <nav className={`border-b transition-all duration-300 ${themeStyles[currentTheme].bg} ${themeStyles[currentTheme].border} relative overflow-hidden`}>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {navigationTabs.map((tab) => {
              const isActive = activeTab === tab.id || activeTab.startsWith(`${tab.id}.`)
              const theme = themeStyles[currentTheme]
              
              return (
                <div key={tab.id} className="relative flex-shrink-0">
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap relative group cursor-pointer
                      ${isActive 
                        ? `${theme.textActive} ${theme.borderActive}` 
                        : `${theme.text} border-transparent ${theme.textHover}`
                      }
                      ${theme.bgHover}
                    `}
                    title={tab.description}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>

                  {/* Индикатор активной вкладки */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${theme.accent}`}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </nav>
      <main className="transition-all duration-300 relative z-10">
        {children}
      </main>
    </div>
  )
}