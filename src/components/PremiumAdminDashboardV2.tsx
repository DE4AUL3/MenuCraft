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
import AdminOrderNotifier from '@/components/admin/AdminOrderNotifier'
import OverviewModule from '@/components/admin/modules/OverviewModule'
import AnalyticsModule from '@/components/admin/modules/AnalyticsModule'
import RestaurantModule from '@/components/admin/modules/RestaurantModule'
import OrdersModule from '@/components/admin/modules/OrdersModule'
import ContactsModule from '@/components/admin/modules/ContactsModule'

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
  const [currentTheme] = useState<'dark'>('dark')

  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab)
    }
  }, [externalActiveTab])

  // Язык берём из AdminLayout через пропсы (будет реализовано ниже)
  // Для простоты пока храним локально, потом можно пробросить из AdminLayout
  const [language, setLanguage] = useState<'ru' | 'tk'>('ru');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewModule 
            theme={currentTheme}
            language={language}
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
          <OrdersModule />
        )
      case 'contacts':
        return (
          <ContactsModule />
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

  // setOrdersCount пробрасывается в AdminOrderNotifier и OrdersModule через AdminLayout
  return (
    <AdminLayout 
      activeTab={activeTab} 
      onTabChange={handleTabChange}
      // children — OrdersModule получит setOrdersCount через AdminLayout
    >
      {/* Уведомления и звук для новых заказов */}
      {/* setOrdersCount будет проброшен через AdminLayout */}
      {/** @ts-ignore */}
      <AdminOrderNotifier />
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