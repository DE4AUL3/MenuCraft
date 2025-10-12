'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAppThemeClasses } from '@/styles/appTheme'
import Preloader from '@/components/Loading/Preloader';

export default function Home() {
  const router = useRouter()
  const [showPreloader, setShowPreloader] = useState(true)
  const [autoRedirect, setAutoRedirect] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const appTheme = getAppThemeClasses(isDarkMode ? 'dark' : 'light')

  useEffect(() => {
    // Проверяем тему
    const theme = localStorage.getItem('theme')
    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)

    // Проверяем настройку автоперехода
    const autoRedirectSetting = localStorage.getItem('autoRedirect')
    if (autoRedirectSetting === 'false') {
      setAutoRedirect(false)
    }
  }, [])

  const handlePreloaderComplete = () => {
    setShowPreloader(false)
    if (autoRedirect) {
      router.push('/select-restaurant')
    }
  }

  // Показываем прелоадер при первой загрузке
  if (showPreloader) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  // Если автопереход отключен, показываем стартовую страницу
  if (!autoRedirect) {
    return (
      <div className={`min-h-screen ${appTheme.gradients.main} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className={`text-4xl font-bold ${appTheme.text} mb-4`}>QR Menu</h1>
          <p className={`${appTheme.textSecondary} mb-8`}>Система управления меню ресторанов</p>
            <div className="space-y-4">
            <button
              onClick={() => router.push('/select-restaurant')}
              className={`block w-full px-6 py-3 ${appTheme.accent} text-white rounded-lg hover:scale-105 transition-all transform shadow-lg`}
            >
              Выбрать ресторан
            </button>
            <button
              onClick={() => router.push('/admin')}
              className={`block w-full px-6 py-3 ${appTheme.surface} ${appTheme.text} rounded-lg hover:scale-105 transition-all transform shadow-lg border ${appTheme.border}`}
            >
              Админ-панель
            </button>
            </div>
        </div>
      </div>
    )
  }

  // Если автопереход включен, показываем прелоадер и переходим
  return null
}
