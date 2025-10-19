'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Globe } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import { useCart } from '@/hooks/useCart'
import { Category } from '@/types/menu'
import { imageService } from '@/lib/imageService'
import FloatingCallButton from '@/components/FloatingCallButton'
import { themes } from '@/styles/simpleTheme'

export default function MenuPage() {
  const router = useRouter()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { currentRestaurant, setRestaurant } = useTheme()
  const { state: cartState } = useCart()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Получаем ID ресторана из URL и устанавливаем тему
    const restaurantId = window.location.pathname.split('/')[2]
    if (restaurantId) {
      setRestaurant(restaurantId === '1' ? 'panda-burger' : 'han-tagam')
    }

    // Загружаем категории из API
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/category')
        if (response.ok) {
          const data = await response.json()
          // Трансформируем данные из БД в формат Category
          const transformedCategories = data.map((cat: any) => ({
            id: cat.id,
            name: cat.nameRu,
            nameTk: cat.nameTk,
            image: cat.imageCard,
            gradient: 'from-slate-500 to-slate-700',
            description: cat.descriptionRu || '',
            descriptionTk: cat.descriptionTk || '',
            isActive: cat.status,
            sortOrder: cat.order
          }))
          setCategories(transformedCategories)
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
      }
    }

    loadCategories()
  }, [])

  // Импортируем тему
  const { light: theme } = themes;

  // Вычисляем отображаемое имя ресторана по сегменту URL (поддерживаем числовые legacy id)
  let restaurantDisplayName = 'Han Tagam';
  if (typeof window !== 'undefined') {
    const pathId = window.location.pathname.split('/')[2] || '';
    if (pathId === 'panda-burger' || pathId === '2') restaurantDisplayName = 'Panda Burger';
    if (pathId === 'han-tagam' || pathId === '1') restaurantDisplayName = 'Han Tagam';
    // fallback to theme/currentRestaurant
    if (!pathId) restaurantDisplayName = currentRestaurant === 'panda-burger' ? 'Panda Burger' : 'Han Tagam';
  } else {
    restaurantDisplayName = currentRestaurant === 'panda-burger' ? 'Panda Burger' : 'Han Tagam';
  }
  const pageVariants: any = {
    hidden: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className={`min-h-screen transition-all duration-500 smooth-scroll mobile-app-feel safe-area-padding`}
      style={{ background: theme.colors.background.secondary }}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-lg border-b`}
        style={{ background: theme.colors.background.primary, borderColor: theme.colors.border.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Back Button */}
            <div className="flex items-center space-x-4">
              {/* Кнопка назад убрана */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/images/han-tagam-logo.png"
                    alt="Han Tagam"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" style={{color: theme.colors.text.primary}}>
                    {restaurantDisplayName}
                  </h1>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
              >
                <Globe className="w-5 h-5 text-slate-900" />
                <span className="text-sm font-medium" style={{color: theme.colors.text.primary}}>
                  {currentLanguage === 'ru' ? 'TM' : 'RU'}
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative p-2 text-white rounded-xl transition-colors duration-200"
                style={{ background: theme.colors.accent.call }}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/menu/${currentRestaurant}/category/${category.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/menu/${currentRestaurant}/category/${category.id}`) }}
                onPointerEnter={() => {
                  try {
                    // prefetch route
                    (router as any).prefetch && (router as any).prefetch(`/menu/${currentRestaurant}/category/${category.id}`)
                    // warm up meals API once and cache in window and sessionStorage
                    if (typeof window !== 'undefined') {
                      (window as any).__mealCache = (window as any).__mealCache || {}
                      if (!(window as any).__mealCache[category.id]) {
                        fetch(`/api/meal?categoryId=${category.id}`)
                          .then(r => r.ok ? r.json() : null)
                          .then(data => {
                            if (data) {
                              (window as any).__mealCache[category.id] = data
                              try { sessionStorage.setItem('mealCache:' + category.id, JSON.stringify(data)) } catch (e) {}
                            }
                          }).catch(() => {})
                      }
                    }
                  } catch (e) {}
                }}
                onFocus={() => {
                  try {
                    (router as any).prefetch && (router as any).prefetch(`/menu/${currentRestaurant}/category/${category.id}`)
                    if (typeof window !== 'undefined') {
                      (window as any).__mealCache = (window as any).__mealCache || {}
                      if (!(window as any).__mealCache[category.id]) {
                        const cached = sessionStorage.getItem('mealCache:' + category.id)
                        if (cached) {
                          try { (window as any).__mealCache[category.id] = JSON.parse(cached) } catch (e) {}
                        }
                      }
                    }
                  } catch (e) {}
                }}
                className="group backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
                style={{ background: theme.colors.background.primary, borderColor: theme.colors.border.primary }}
              >
                {/* Category Image */}
                <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${category.gradient || 'from-slate-500 to-slate-700'} overflow-hidden`}>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : null}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full sm:w-full sm:h-full backdrop-blur-md border flex items-center justify-center z-10 transform group-hover:scale-125 transition-transform duration-300" style={{background: theme.colors.background.secondary, borderColor: theme.colors.border.primary}}>
                      {category.image ? (
                        <Image
                          src={imageService.getImageUrl(category.image)}
                          alt={category.name}
                          width={200}
                          height={200}
                          className="w-full h-full sm:w-full sm:h-full object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                
                {/* Category Info */}
                <div className="p-4 text-center bg-white/10 backdrop-blur-md border-t border-white/20">
                  <h3 className="font-bold text-sm sm:text-base mb-1 transition-colors duration-300" style={{color: theme.colors.text.primary}}>
                    {currentLanguage === 'tk' ? (category.nameTk || category.name) : category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Phone Button */}
      <FloatingCallButton />
    </motion.div>
  )
}