'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Smartphone } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PWAInstallBannerProps {
  className?: string
}

export default function PWAInstallBanner({ className = '' }: PWAInstallBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Проверяем, не установлено ли уже приложение
    const checkInstalled = () => {
      // Проверяем display-mode: standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      // Проверяем iOS PWA
      const isIOSPWA = (window.navigator as any).standalone === true
      
      return isStandalone || isIOSPWA
    }

    if (checkInstalled()) {
      setIsInstalled(true)
      return
    }

    // Обработчик beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Показываем баннер через небольшую задержку
      setTimeout(() => {
        setShowBanner(true)
      }, 3000)
    }

    // Обработчик установки
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowBanner(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      // Показываем диалог установки
      deferredPrompt.prompt()
      
      // Ждем выбор пользователя
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA установка принята')
      } else {
        console.log('PWA установка отклонена')
      }
    } catch (error) {
      console.error('Ошибка установки PWA:', error)
    } finally {
      setDeferredPrompt(null)
      setShowBanner(false)
    }
  }

  const handleDismiss = () => {
    setShowBanner(false)
    // Сохраняем в localStorage, что пользователь отклонил установку
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Не показываем баннер если:
  // 1. Приложение уже установлено
  // 2. Нет возможности установки
  // 3. Пользователь недавно отклонил установку
  if (isInstalled || !deferredPrompt) {
    return null
  }

  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) { // Не показываем 7 дней после отклонения
      return null
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mx-auto max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Установить приложение
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Добавьте Catalog Cafe на главный экран для быстрого доступа
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleInstall}
                    leftIcon={<Download size={14} />}
                    className="text-xs px-3 py-1.5"
                  >
                    Установить
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-xs px-3 py-1.5"
                  >
                    Позже
                  </Button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}