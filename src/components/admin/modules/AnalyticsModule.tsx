'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  Gauge,
  DollarSign,
  ShoppingBag,
  Package,
  Star
} from 'lucide-react'
import { getThemeClasses, type AdminTheme } from '../../../styles/adminTheme'

// Импорт компонентов
import SalesChart from './analytics/SalesChart'
import PopularDishesChart from './analytics/PopularDishesChart'
import CustomersChart from './analytics/CustomersChart'
import PerformanceChart from './analytics/PerformanceChart'
import { DateFilter, ExportButton, MetricCard } from './analytics/AnalyticsComponents'

// Импорт данных
import {
  salesData,
  popularDishes,
  customerData,
  performanceMetrics,
  formatCurrency
} from './analytics/mockData'

interface AnalyticsModuleProps {
  activeSubTab?: string
  onSubTabChange?: (subTab: string) => void
  theme?: 'dark'
}

export default function AnalyticsModule({ 
  activeSubTab = 'sales', 
  onSubTabChange,
  theme = 'dark' 
}: AnalyticsModuleProps) {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab)
  const themeClasses = getThemeClasses(theme)

  useEffect(() => {
    setCurrentSubTab(activeSubTab)
  }, [activeSubTab])

  const handleSubTabClick = (subTab: string) => {
    console.log('AnalyticsModule: Переключение на подвкладку:', subTab)
    setCurrentSubTab(subTab)
    onSubTabChange?.(subTab)
  }

  const handleDateChange = (startDate: string, endDate: string) => {
    console.log('Date range changed:', startDate, endDate)
  }

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    console.log('Exporting analytics data in format:', format)
    // Здесь будет логика экспорта
  }

  const subTabs = [
    { id: 'sales', label: 'Продажи', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'dishes', label: 'Блюда', icon: <Package className="w-4 h-4" /> },
    { id: 'customers', label: 'Клиенты', icon: <Users className="w-4 h-4" /> },
    { id: 'performance', label: 'Производительность', icon: <Gauge className="w-4 h-4" /> }
  ]

  const renderContent = () => {
    switch (currentSubTab) {
      case 'sales':
        return (
          <div className="space-y-6">
            {/* Метрики продаж */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Общая выручка"
                value={formatCurrency(salesData.reduce((sum, item) => sum + item.sales, 0))}
                change={12.5}
                changeType="positive"
                icon={<DollarSign className="w-6 h-6" />}
                description="За выбранный период"
                theme={theme}
              />
              <MetricCard
                title="Количество заказов"
                value={salesData.reduce((sum, item) => sum + item.orders, 0)}
                change={8.2}
                changeType="positive"
                icon={<ShoppingBag className="w-6 h-6" />}
                description="Всего заказов"
                theme={theme}
              />
              <MetricCard
                title="Средний чек"
                value={formatCurrency(
                  salesData.reduce((sum, item) => sum + item.sales, 0) /
                  salesData.reduce((sum, item) => sum + item.orders, 0)
                )}
                change={4.1}
                changeType="positive"
                icon={<TrendingUp className="w-6 h-6" />}
                description="На один заказ"
                theme={theme}
              />
              <MetricCard
                title="Активные клиенты"
                value={salesData.reduce((sum, item) => sum + item.customers, 0)}
                change={15.3}
                changeType="positive"
                icon={<Users className="w-6 h-6" />}
                description="Уникальных клиентов"
                theme={theme}
              />
            </div>

            {/* График продаж */}
            <SalesChart data={salesData} theme={theme} />
          </div>
        )

      case 'dishes':
        return (
          <div className="space-y-6">
            {/* Метрики блюд */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Всего блюд"
                value={popularDishes.length}
                icon={<Package className="w-6 h-6" />}
                description="В ассортименте"
                theme={theme}
              />
              <MetricCard
                title="Общие заказы"
                value={popularDishes.reduce((sum, dish) => sum + dish.orders, 0)}
                change={23.1}
                changeType="positive"
                icon={<ShoppingBag className="w-6 h-6" />}
                description="Количество заказов"
                theme={theme}
              />
              <MetricCard
                title="Выручка с блюд"
                value={formatCurrency(popularDishes.reduce((sum, dish) => sum + dish.revenue, 0))}
                change={18.7}
                changeType="positive"
                icon={<DollarSign className="w-6 h-6" />}
                description="Общая выручка"
                theme={theme}
              />
              <MetricCard
                title="Средний рейтинг"
                value={(popularDishes.reduce((sum, dish) => sum + dish.rating, 0) / popularDishes.length).toFixed(1)}
                change={2.3}
                changeType="positive"
                icon={<Star className="w-6 h-6" />}
                description="По всем блюдам"
                theme={theme}
              />
            </div>

            {/* График популярных блюд */}
            <PopularDishesChart data={popularDishes} theme={theme} />
          </div>
        )

      case 'customers':
        return (
          <div className="space-y-6">
            {/* Метрики клиентов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Всего клиентов"
                value={customerData.reduce((sum, item) => sum + item.totalCustomers, 0)}
                change={15.3}
                changeType="positive"
                icon={<Users className="w-6 h-6" />}
                description="За период"
                theme={theme}
              />
              <MetricCard
                title="Новые клиенты"
                value={customerData.reduce((sum, item) => sum + item.newCustomers, 0)}
                change={28.4}
                changeType="positive"
                icon={<Users className="w-6 h-6" />}
                description="Первый заказ"
                theme={theme}
              />
              <MetricCard
                title="Возвратные клиенты"
                value={customerData.reduce((sum, item) => sum + item.returningCustomers, 0)}
                change={12.1}
                changeType="positive"
                icon={<Users className="w-6 h-6" />}
                description="Повторные заказы"
                theme={theme}
              />
              <MetricCard
                title="Удержание клиентов"
                value={`${((customerData.reduce((sum, item) => sum + item.returningCustomers, 0) /
                  customerData.reduce((sum, item) => sum + item.totalCustomers, 0)) * 100).toFixed(1)}%`}
                change={5.7}
                changeType="positive"
                icon={<TrendingUp className="w-6 h-6" />}
                description="Процент возврата"
                theme={theme}
              />
            </div>

            {/* График клиентов */}
            <CustomersChart data={customerData} theme={theme} />
          </div>
        )

      case 'performance':
        return (
          <div className="space-y-6">
            {/* График производительности */}
            <PerformanceChart data={performanceMetrics} theme={theme} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Шапка с фильтрами */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
            Аналитика
          </h2>
          <p className={`${themeClasses.textSecondary}`}>
            Детальная аналитика продаж и производительности
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <DateFilter onDateChange={handleDateChange} theme={theme} />
          <ExportButton onExport={handleExport} theme={theme} />
        </div>
      </div>

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