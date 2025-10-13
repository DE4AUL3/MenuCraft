'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  Bell,
  Palette,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  LogOut,
  UserCircle,
  HelpCircle,
  Home,
  ExternalLink
} from 'lucide-react'

interface AdminHeaderProps {
  onThemeChange?: (theme: AdminTheme) => void
  currentTheme?: AdminTheme
  restaurantName?: string
}

export type AdminTheme = 'light' | 'dark'

const themes = {
  light: {
    name: 'Светлая',
    icon: <Sun className="w-4 h-4" />,
    colors: {
      bg: 'bg-white/95 backdrop-blur-md',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      accent: 'from-blue-500 to-purple-600',
      hover: 'hover:bg-gray-100'
    }
  },
  dark: {
    name: 'Темная',
    icon: <Moon className="w-4 h-4" />,
    colors: {
      bg: 'bg-gray-950/98 backdrop-blur-md border border-gray-800/50',
      border: 'border-gray-800',
      text: 'text-gray-50',
      textSecondary: 'text-gray-400',
      accent: 'from-gray-700 to-gray-900',
      hover: 'hover:bg-gray-900/80'
    }
  }
}

export default function AdminHeader({ 
  onThemeChange, 
  currentTheme = 'light', 
  restaurantName = 'Название Ресторана' 
}: AdminHeaderProps) {
  const router = useRouter()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notificationCount] = useState(3)

  const theme = themes[currentTheme]

  // Закрываем меню при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setIsProfileMenuOpen(false)
      }
      if (!target.closest('.theme-menu') && !target.closest('.theme-button')) {
        setIsThemeMenuOpen(false)
      }
      if (!target.closest('.notifications-menu') && !target.closest('.notifications-button')) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleThemeChange = (newTheme: AdminTheme) => {
    onThemeChange?.(newTheme)
    setIsThemeMenuOpen(false)
    localStorage.setItem('adminTheme', newTheme)
    toast.success(`Тема изменена на ${themes[newTheme].name.toLowerCase()}`)
  }

  const handleLogout = () => {
    setIsProfileMenuOpen(false)
    toast.success('Вы успешно вышли из системы')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  }

  const handleGoHome = () => {
    window.open('/', '_blank')
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen(false)
    toast('Переход в настройки профиля', { icon: '👤' })
  }

  const handleSettingsClick = () => {
    setIsProfileMenuOpen(false)
    router.push('/admin?tab=settings')
  }

  const handleHelpClick = () => {
    setIsProfileMenuOpen(false)
    toast('Справочная система в разработке', { icon: '❓' })
  }

  return (
    <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${theme.colors.bg} ${theme.colors.border} shadow-sm`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Левая часть - Название ресторана и переход на сайт */}
          <div className="flex items-center gap-4">
            <h1 className={`text-xl font-bold ${theme.colors.text}`}>
              {restaurantName}
            </h1>
            <button
              onClick={handleGoHome}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${theme.colors.hover} text-sm`}
              title="Перейти на сайт ресторана"
            >
              <Home className={`w-4 h-4 ${theme.colors.textSecondary}`} />
              <span className={theme.colors.textSecondary}>Сайт</span>
              <ExternalLink className={`w-3 h-3 ${theme.colors.textSecondary}`} />
            </button>
          </div>

          {/* Правая часть - Управление */}
          <div className="flex items-center gap-4">
            
            {/* Выбор темы */}
            <div className="relative theme-menu">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`theme-button p-2 rounded-lg transition-all duration-200 ${theme.colors.hover} relative`}
                title="Сменить тему"
              >
                <Palette className={`w-5 h-5 ${theme.colors.text}`} />
              </button>

              <AnimatePresence>
                {isThemeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl border overflow-hidden z-50 ${theme.colors.bg} ${theme.colors.border}`}
                  >
                    {Object.entries(themes).map(([key, themeData]) => (
                      <button
                        key={key}
                        onClick={() => handleThemeChange(key as AdminTheme)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          currentTheme === key
                            ? `bg-gradient-to-r ${themeData.colors.accent} text-white`
                            : theme.colors.hover
                        }`}
                      >
                        {themeData.icon}
                        <span className={currentTheme === key ? 'text-white' : theme.colors.text}>
                          {themeData.name}
                        </span>
                        {currentTheme === key && (
                          <motion.div
                            layoutId="activeTheme"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Уведомления */}
            <div className="relative notifications-menu">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`notifications-button p-2 rounded-lg transition-all duration-200 ${theme.colors.hover} relative`}
                title="Уведомления"
              >
                <Bell className={`w-5 h-5 ${theme.colors.text}`} />
                {notificationCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-medium bg-red-500"
                  >
                    {notificationCount}
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl border overflow-hidden z-50 ${theme.colors.bg} ${theme.colors.border}`}
                  >
                    <div className={`p-4 border-b ${theme.colors.border}`}>
                      <h3 className={`font-medium ${theme.colors.text}`}>Уведомления</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { title: 'Новый заказ #1234', message: 'Заказ на сумму 850₽', time: '2 мин назад', type: 'order' },
                        { title: 'Низкий остаток', message: 'Пицца "Маргарита" заканчивается', time: '15 мин назад', type: 'warning' },
                        { title: 'Новый отзыв', message: 'Клиент оставил 5 звезд', time: '1 час назад', type: 'review' }
                      ].map((notification, index) => (
                        <div
                          key={index}
                          className={`p-4 border-b last:border-b-0 ${theme.colors.border} ${theme.colors.hover} cursor-pointer`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`font-medium ${theme.colors.text} text-sm`}>
                                {notification.title}
                              </div>
                              <div className={`text-sm ${theme.colors.textSecondary} mt-1`}>
                                {notification.message}
                              </div>
                            </div>
                            <div className={`text-xs ${theme.colors.textSecondary}`}>
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`p-3 border-t ${theme.colors.border}`}>
                      <button className={`w-full text-center text-sm ${theme.colors.textSecondary} ${theme.colors.hover} py-2 rounded`}>
                        Показать все уведомления
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Профиль */}
            <div className="relative profile-menu">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`profile-button flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${theme.colors.hover}`}
                title="Профиль"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.colors.accent} flex items-center justify-center text-white font-medium text-sm`}>
                  A
                </div>
                <ChevronDown className={`w-4 h-4 ${theme.colors.textSecondary}`} />
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl border overflow-hidden z-50 ${theme.colors.bg} ${theme.colors.border}`}
                  >
                    <div className={`p-4 border-b ${theme.colors.border}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.colors.accent} flex items-center justify-center text-white font-medium`}>
                          A
                        </div>
                        <div>
                          <div className={`font-medium ${theme.colors.text}`}>Администратор</div>
                          <div className={`text-sm ${theme.colors.textSecondary}`}>admin@cafe.com</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={handleProfileClick}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${theme.colors.hover}`}
                      >
                        <span className={theme.colors.textSecondary}><UserCircle className="w-4 h-4" /></span>
                        <span className={theme.colors.text}>Мой профиль</span>
                      </button>
                      
                      <button
                        onClick={handleSettingsClick}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${theme.colors.hover}`}
                      >
                        <span className={theme.colors.textSecondary}><Settings className="w-4 h-4" /></span>
                        <span className={theme.colors.text}>Настройки</span>
                      </button>
                      
                      <button
                        onClick={handleHelpClick}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${theme.colors.hover}`}
                      >
                        <span className={theme.colors.textSecondary}><HelpCircle className="w-4 h-4" /></span>
                        <span className={theme.colors.text}>Помощь</span>
                      </button>
                      
                      <div className={`border-t ${theme.colors.border} mt-2 pt-2`}>
                        <button 
                          onClick={handleLogout}
                          className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600`}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Выйти</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}