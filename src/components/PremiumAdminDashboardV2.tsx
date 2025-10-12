'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  FileText
} from 'lucide-react'
import { type AdminTheme } from '../styles/adminTheme'

import { Card } from '@/components/ui/PremiumCard'
import AdminLayout from '@/components/admin/AdminLayout'
import OverviewModule from '@/components/admin/modules/OverviewModule'
import AnalyticsModule from '@/components/admin/modules/AnalyticsModule'
import RestaurantModule from '@/components/admin/modules/RestaurantModule'

interface PremiumAdminDashboardProps {
  activeTab?: 'overview' | 'analytics' | 'restaurant' | 'orders' | 'contacts'
  onTabChange?: (tab: string) => void
}

export default function PremiumAdminDashboardV2({
  activeTab: externalActiveTab
}: PremiumAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'restaurant' | 'orders' | 'contacts'>(
    externalActiveTab || 'overview'
  )
  const [currentTheme, setCurrentTheme] = useState<AdminTheme>('light')

  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab)
    }
  }, [externalActiveTab])

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme') as AdminTheme
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewModule 
            theme={currentTheme}
          />
        )
      
      case 'analytics':
        return (
          <AnalyticsModule 
            theme={currentTheme}
          />
        )

      case 'restaurant':
        return (
          <RestaurantModule theme={currentTheme} />
        )

      case 'orders':
        return (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Заказы</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Управление заказами и уведомления
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  🚧 Модуль в разработке
                </p>
              </div>
            </div>
          </Card>
        )

      case 'contacts':
        return (
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Контакты</h2>
              <p className="text-gray-600 dark:text-gray-400">
                База контактов и SMS рассылка
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚙️ Модуль в разработке
                </p>
              </div>
            </div>
          </Card>
        )

      default:
        return null
    }
  }

  const handleTabChange = (tab: string) => {
    console.log('PremiumAdminDashboard: Изменение вкладки на:', tab)
    console.log('PremiumAdminDashboard: Текущая активная вкладка:', activeTab)
    console.log('PremiumAdminDashboard: Новая вкладка валидна?', ['overview', 'analytics', 'restaurant', 'orders', 'contacts'].includes(tab))
    setActiveTab(tab as 'overview' | 'analytics' | 'restaurant' | 'orders' | 'contacts')
  }

  return (
    <AdminLayout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
    >
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}