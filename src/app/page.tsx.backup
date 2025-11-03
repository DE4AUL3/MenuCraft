'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Settings, ArrowRight, Sparkles, Users, Clock } from 'lucide-react'
import { getAppThemeClasses } from '@/styles/appTheme'
import Preloader from '@/components/Loading/Preloader';

export default function Home() {
  const router = useRouter()
  const [showPreloader, setShowPreloader] = useState(true)
  const [autoRedirect, setAutoRedirect] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
  if (!autoRedirect && mounted) {
    return (
  <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Animated Background Elements */}
         <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-linear-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-2xl mx-auto">
            {/* Hero Icon */}
            <div className="mb-8 relative">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300">
                <QrCode className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-linear-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
              MenuCraft
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-4 font-medium">
              Современная система управления меню ресторанов
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm text-slate-500">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>QR-коды</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Мульти-ресторан</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-200">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>24/7 доступ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto">
              <button
                onClick={() => router.push('/select-restaurant')}
                className="group relative w-full px-8 py-4 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <QrCode className="w-5 h-5" />
                  <span>Выбрать ресторан</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              
              <button
                onClick={() => router.push('/admin')}
                className="group relative w-full px-8 py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 hover:text-slate-900 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-slate-200 hover:border-slate-300"
              >
                <div className="relative flex items-center justify-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>Админ-панель</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-12 text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Система готова к работе</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-20 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-500"></div>
      </div>
    )
  }

  // Если автопереход включен, показываем прелоадер и переходим
  return null
}
