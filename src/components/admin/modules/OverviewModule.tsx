'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Users,
  ShoppingBag,
  DollarSign,
  Star,
  Package,
  FileText,
  Activity
} from 'lucide-react'
import { getThemeClasses } from '../../../styles/adminTheme'
import SalesChart from './analytics/SalesChart'
import { salesData } from './analytics/mockData'

interface OverviewModuleProps {
  activeSubTab?: string
  onSubTabChange?: (subTab: string) => void
  theme?: 'dark'
}

// Функция для получения реальных данных из restaurants.json
const getRealStatsData = async () => {
  try {
    const response = await fetch('/data/restaurants.json')
    const data = await response.json()
    
    const totalRestaurants = data.restaurants.length
    const totalCategories = data.restaurants.reduce((sum: number, r: any) => sum + r.categories.length, 0)
    const totalDishes = data.restaurants.reduce((sum: number, r: any) => 
      sum + r.categories.reduce((catSum: number, c: any) => catSum + c.dishes.length, 0), 0)
    
    // Подсчитываем среднюю цену и общую стоимость меню
    let totalPrice = 0
    let dishCount = 0
    
    data.restaurants.forEach((restaurant: any) => {
      restaurant.categories.forEach((category: any) => {
        category.dishes.forEach((dish: any) => {
          totalPrice += dish.price
          dishCount++
        })
      })
    })
    
    const averagePrice = dishCount > 0 ? Math.round(totalPrice / dishCount) : 0
    const estimatedRevenue = Math.round(totalPrice * 2.5) // Примерная выручка
    
    return {
      totalRestaurants,
      totalCategories,
      totalDishes,
      averagePrice,
      estimatedRevenue,
      totalPrice
    }
  } catch (error) {
    console.error('Ошибка загрузки данных:', error)
    return {
      totalRestaurants: 2,
      totalCategories: 7,
      totalDishes: 18,
      averagePrice: 350,
      estimatedRevenue: 45000,
      totalPrice: 9500
    }
  }
}

export default function OverviewModule({ 
  activeSubTab = 'basic', 
  onSubTabChange,
  theme = 'dark' 
}: OverviewModuleProps) {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab)
  const [realStats, setRealStats] = useState({
    totalRestaurants: 2,
    totalCategories: 7,
    totalDishes: 18,
    averagePrice: 350,
    estimatedRevenue: 45000,
    totalPrice: 9500
  })
  const themeClasses = getThemeClasses(theme)

  useEffect(() => {
    setCurrentSubTab(activeSubTab)
  }, [activeSubTab])

  useEffect(() => {
    // Загружаем реальные данные при монтировании компонента
    getRealStatsData().then(setRealStats)
  }, [])

  const handleSubTabClick = (subTab: string) => {
    console.log('OverviewModule: Переключение на подвкладку:', subTab)
    setCurrentSubTab(subTab)
    onSubTabChange?.(subTab)
  }

  const subTabs = [
    { id: 'basic', label: 'Базовый', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'reports', label: 'Отчеты', icon: <FileText className="w-4 h-4" /> }
  ]

  const basicStats = [
    {
      title: 'Заказы сегодня',
      value: '47',
      change: '+12%',
      changeType: 'positive' as const,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Выручка за день',
      value: `${Math.round(2847)} ТМТ`, // Примерная дневная выручка
      change: '+8%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Всего блюд',
      value: realStats.totalDishes.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: <Package className="w-5 h-5" />,
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: 'Категории',
      value: realStats.totalCategories.toString(),
      change: 'стабильно',
      changeType: 'positive' as const,
      icon: <Star className="w-5 h-5" />,
      color: 'from-yellow-400 to-orange-500'
    }
  ]

  const renderContent = () => {
    
    switch (currentSubTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {basicStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-105 ${themeClasses.cardBg} shadow-lg`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                        {stat.icon}
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full shadow-md ${
                        stat.changeType === 'positive' 
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${themeClasses.text}`}>
                      {stat.value}
                    </h3>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>
                      {stat.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* График продаж перенесен сюда из вкладки "Аналитика" */}
            <SalesChart data={salesData} theme={theme} />

            <div className={`p-6 rounded-xl ${themeClasses.cardBg} shadow-lg`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${themeClasses.text}`}>
                <Activity className="w-5 h-5 text-blue-500" />
                Последняя активность
              </h3>
              <div className="space-y-3">
                {[
                  { action: `Новый заказ #2847 - Лагман (42 ТМТ)`, time: '2 мин назад', type: 'order' },
                  { action: `Заказ #2846 - Пицца Маргарита (68 ТМТ)`, time: '15 мин назад', type: 'order' },
                  { action: `Выручка за час: 524 ТМТ (8 заказов)`, time: '1 час назад', type: 'revenue' },
                  { action: `Популярное блюдо дня: Манты с говядиной`, time: '2 часа назад', type: 'analytics' }
                ].map((activity, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${themeClasses.hover} transition-colors`}>
                    <span className={themeClasses.text}>{activity.action}</span>
                    <span className={`text-sm ${themeClasses.textSecondary}`}>{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      

      case 'reports':
        return (
          <div className="space-y-6">
            <div className={`p-8 text-center ${themeClasses.cardBg} rounded-xl shadow-lg`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${themeClasses.text} opacity-50`} />
              <h2 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>
                Модуль отчетов
              </h2>
              <p className={`mb-6 ${themeClasses.textSecondary}`}>
                Генерация и экспорт различных отчетов
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${themeClasses.accent} text-white shadow-lg`}>
                <Package className="w-4 h-4" />
                Скоро будет доступно
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Подвкладки */}
      <div className="flex flex-wrap gap-3">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleSubTabClick(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
              currentSubTab === tab.id
                ? `bg-gradient-to-r ${themeClasses.accent} text-white shadow-xl`
                : `${themeClasses.cardBg} ${themeClasses.text} ${themeClasses.hover} shadow-md`
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Контент подвкладки */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSubTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}