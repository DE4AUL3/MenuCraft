'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, DollarSign, Settings, Truck } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { getText } from '@/i18n/translations'

interface AppSettings {
  deliveryFee: number
  minimumOrderAmount: number
  isDeliveryEnabled: boolean
  maxDeliveryDistance: number
}

export default function SettingsPage() {
  const { currentLanguage } = useLanguage()
  const [settings, setSettings] = useState<AppSettings>({
    deliveryFee: 25,
    minimumOrderAmount: 0,
    isDeliveryEnabled: true,
    maxDeliveryDistance: 10
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const settingsData = data.reduce((acc: any, setting: any) => {
            acc[setting.key] = setting.value
            return acc
          }, {})
          
          setSettings({
            deliveryFee: parseFloat(settingsData.delivery_fee || 25),
            minimumOrderAmount: parseFloat(settingsData.minimum_order_amount || 0),
            isDeliveryEnabled: settingsData.is_delivery_enabled === 'true',
            maxDeliveryDistance: parseFloat(settingsData.max_delivery_distance || 10)
          })
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const settingsToSave = [
        { key: 'delivery_fee', value: settings.deliveryFee.toString() },
        { key: 'minimum_order_amount', value: settings.minimumOrderAmount.toString() },
        { key: 'is_delivery_enabled', value: settings.isDeliveryEnabled.toString() },
        { key: 'max_delivery_distance', value: settings.maxDeliveryDistance.toString() }
      ]

      const promises = settingsToSave.map(setting =>
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(setting)
        })
      )

      await Promise.all(promises)
      setMessage('Настройки успешно сохранены!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error)
      setMessage('Ошибка при сохранении настроек')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 text-white rounded-lg">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Настройки приложения
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управление настройками доставки и заказов
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="space-y-6">
          {/* Delivery Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Настройки доставки
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Fee */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Стоимость доставки (TMT)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={settings.deliveryFee}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      deliveryFee: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="25"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Max Delivery Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Максимальное расстояние доставки (км)
                </label>
                <input
                  type="number"
                  value={settings.maxDeliveryDistance}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    maxDeliveryDistance: parseFloat(e.target.value) || 0 
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="10"
                  min="0"
                  step="0.1"
                />
              </div>

              {/* Minimum Order Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Минимальная сумма заказа (TMT)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={settings.minimumOrderAmount}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      minimumOrderAmount: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>

              {/* Delivery Enabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Включить доставку
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setSettings(prev => ({ 
                      ...prev, 
                      isDeliveryEnabled: !prev.isDeliveryEnabled 
                    }))}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      settings.isDeliveryEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.isDeliveryEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {settings.isDeliveryEnabled ? 'Включена' : 'Отключена'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-600">
            {message && (
              <div className={`text-sm ${
                message.includes('успешно') 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {message}
              </div>
            )}
            
            <button
              onClick={saveSettings}
              disabled={saving}
              className="ml-auto flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Сохранение...' : 'Сохранить настройки'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}