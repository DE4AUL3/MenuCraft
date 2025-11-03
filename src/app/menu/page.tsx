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
import FloatingRestaurantButton from '@/components/FloatingRestaurantButton'
import { getImageUrl } from "@/lib/imageUtils"
import { getAppThemeColors, getAppThemeClasses } from '@/styles/appTheme'

export default function MenuPage() {
  const router = useRouter()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { currentRestaurant, setRestaurant } = useTheme()
  const { state: cartState } = useCart()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Устанавливаем тему для Panda Burger
    setRestaurant('panda-burger')

    // Загружаем категории из API
    const loadCategories = async () => {
      try {
        // Проверяем кэш в sessionStorage
        const cachedData = sessionStorage.getItem('categories')
        const cacheTime = sessionStorage.getItem('categories_time')
        const now = Date.now()
        
        // Если кэш свежий (< 5 минут), используем его
        if (cachedData && cacheTime && (now - parseInt(cacheTime) < 5 * 60 * 1000)) {
          const data = JSON.parse(cachedData)
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
          return
        }
        
        const response = await fetch('/api/category')
        if (response.ok) {
          const data = await response.json()
          
          // Сохраняем в кэш
          sessionStorage.setItem('categories', JSON.stringify(data))
          sessionStorage.setItem('categories_time', now.toString())
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
  }, [setRestaurant])

  // Используем panda-dark тему
  const themeColors = getAppThemeColors('panda-dark');
  const themeClasses = getAppThemeClasses('panda-dark');

  // Устанавливаем имя ресторана для Panda Burger
  const restaurantDisplayName = 'Panda Burger';
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
  className={`min-h-screen transition-all duration-500 smooth-scroll mobile-app-feel safe-area-padding ${themeClasses.bg}`}
  style={{ background: themeColors.primary.background }}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-lg border-b ${themeClasses.background} ${themeClasses.border}`}
        style={{ background: themeColors.primary.background, borderColor: themeColors.secondary.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Back Button */}
            <div className="flex items-center space-x-4">
              {/* Кнопка назад убрана */}
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/panda_logo.png"
                    alt="Panda Burger"
                    fill
                    className="object-contain"
                  
                          loading="lazy"
                          quality={75}
                          
                          />
                </div>
                <div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}> 
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
                className="p-2 rounded-full transition-colors duration-200 border-0 bg-transparent hover:bg-transparent focus:outline-none"
                style={{ boxShadow: 'none' }}
                aria-label="Сменить язык"
              >
                <Globe className="w-6 h-6 text-white" />
              </button>

              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative p-2 rounded-xl transition-colors duration-200 bg-red-600 hover:bg-red-700 text-white"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
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
                onClick={() => router.push(`/menu/category/${category.id}?restaurantId=panda-burger`)}
                onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/menu/category/${category.id}?restaurantId=panda-burger`) }}
                className={`group backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${themeClasses.card}`}
                style={{}}
              >
                {/* Category Image */}
                <div className={`relative h-32 sm:h-36 bg-linear-to-br ${themeClasses.gradients.card} overflow-hidden`}>
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      priority
                    
                          loading="lazy"
                          quality={75}
                          
                          />
                  ) : null}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full sm:w-full sm:h-full backdrop-blur-md flex items-center justify-center z-10 transform group-hover:scale-125 transition-transform duration-300 bg-white">
                      {category.image ? (
                        <Image
                          src={getImageUrl(category.image)}
                          alt={category.name}
                          width={200}
                          height={200}
                          className="w-full h-full sm:w-full sm:h-full object-cover"
                        
                          loading="lazy"
                          quality={75}
                          
                          />
                      ) : null}
                    </div>
                  </div>
                </div>
                
                {/* Category Info (compact for mobile) */}
                <div className={`px-2 py-2 sm:px-4 sm:py-4 text-center ${themeClasses.bgSecondary} backdrop-blur-md border-t ${themeClasses.border}`}>
                  <h3 className={`font-semibold text-xs sm:text-base mb-0.5 sm:mb-1 leading-tight sm:leading-normal transition-colors duration-300 ${themeClasses.text}`}>
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
      <FloatingRestaurantButton />
      <FloatingRestaurantButton />
    </motion.div>
  )
}