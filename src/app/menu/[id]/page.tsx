'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Globe, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import { useCart } from '@/hooks/useCart'
import { Category } from '@/types/menu'
import { dataService } from '@/lib/dataService'
import { imageService } from '@/lib/imageService'
import FloatingCallButton from '@/components/FloatingCallButton'

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

    // Загружаем категории из dataService
    const loadCategories = () => {
      const categoriesData = dataService.getCategories()
      setCategories(categoriesData.filter(cat => cat.isActive))
    }

    loadCategories()
  }, [])

  return (
    <div className={`min-h-screen transition-all duration-500 smooth-scroll mobile-app-feel safe-area-padding ${
      currentRestaurant === 'panda-burger' || currentRestaurant === '1' 
        ? 'bg-[#212121]' 
        : 'bg-white'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${
        currentRestaurant === 'panda-burger' || currentRestaurant === '1'
          ? 'bg-[#282828]/95 border-gray-600/30'
          : 'bg-white/95 border-gray-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/panda-burger-logo.svg"
                    alt="Panda Burger"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Panda Burger
                  </h1>
                  <p className="text-sm text-slate-300 hidden sm:block">
                    Лучшие бургеры в городе
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 p-2 text-slate-300 hover:text-white transition-colors duration-200"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">
                  {currentLanguage === 'ru' ? 'TK' : 'RU'}
                </span>
              </button>

              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative p-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl transition-colors duration-200"
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
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Категории блюд
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/menu/1/category/${category.id}`)}
                className="group bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 hover:border-orange-400/50 overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
              >
                {/* Category Image */}
                <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${category.gradient || 'from-slate-500 to-slate-700'} overflow-hidden`}>
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center z-10 transform group-hover:scale-125 transition-transform duration-300">
                      <Image
                        src={imageService.getImageUrl(category.image)}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Category Info */}
                <div className="p-4 text-center bg-white/10 backdrop-blur-md border-t border-white/20">
                  <h3 className="font-bold text-white text-sm sm:text-base mb-1 group-hover:text-orange-400 transition-colors duration-300">
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
    </div>
  )
}