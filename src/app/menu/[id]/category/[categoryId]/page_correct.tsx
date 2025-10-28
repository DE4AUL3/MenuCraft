'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ShoppingCart, Globe, ArrowLeft, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/hooks/useCart'
import { dataService } from '@/lib/dataService'
import { imageService } from '@/lib/imageService'
import FloatingCallButton from '@/components/FloatingCallButton'
import type { Category, Dish } from '@/types/common'

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { state: cartState, dispatch } = useCart()
  
  const [isLoading, setIsLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [category, setCategory] = useState<Category | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])

  const categoryId = params?.categoryId as string
  const restaurantId = params?.id as string

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем категорию
        const categories = dataService.getCategories()
        const foundCategory = categories.find(cat => cat.id === categoryId)
        setCategory(foundCategory || null)

        // Загружаем блюда для этой категории
        const allDishes = dataService.getDishes()
        const categoryDishes = allDishes.filter(dish => dish.categoryId === categoryId && dish.isActive)
        setDishes(categoryDishes)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [categoryId])

  const handleOrderClick = (dishId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [dishId]: !prev[dishId]
    }))
  }

  const increaseQuantity = (dishId: string) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: (prev[dishId] || 1) + 1
    }))
  }

  const decreaseQuantity = (dishId: string) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(1, (prev[dishId] || 1) - 1)
    }))
  }

  const addToCart = (dish: Dish) => {
    const quantity = quantities[dish.id] || 1
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: dish.id,
        name: dish.name.ru,
        nameTk: dish.name.tk,
        description: dish.description?.ru || '',
        descriptionTk: dish.description?.tk || '',
        price: dish.price,
        image: dish.image || '',
        category: categoryId,
        ingredients: [],
        ingredientsTk: [],
        quantity
      }
    })
    
    setExpandedItems(prev => ({
      ...prev,
      [dish.id]: false
    }))
    
    setQuantities(prev => ({
      ...prev,
      [dish.id]: 1
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загружаем меню...</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Категория не найдена</h1>
          <button
            onClick={() => router.push(`/menu/${restaurantId}`)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к меню
          </button>
        </div>
      </div>
    )
  }

  // Получаем изображение для заголовка категории
  const getCategoryHeaderImage = () => {
    if (category.dishPageImage) {
      return imageService.getImageUrl(category.dishPageImage)
    }
    return imageService.getImageUrl(category.image)
  }

  return (
    <div className="min-h-screen bg-gradient-to-min-w-8 from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back Button and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/menu/${restaurantId}`)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentLanguage === 'tk' ? category.nameTk : category.name}
                </h1>
                <p className="text-sm text-slate-600">
                  {dishes.length} блюд{dishes.length !== 1 && dishes.length < 5 ? 'а' : ''}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="relative p-3 bg-gradient-to-min-w-8 from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                    {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Category Banner */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
        <Image
          src={getCategoryHeaderImage()}
          alt={currentLanguage === 'tk' ? category.nameTk : category.name}
          fill
          className="object-cover"
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-lg">
              {currentLanguage === 'tk' ? category.nameTk : category.name}
            </h1>
            
            {category.description && (
              <p className="text-lg sm:text-xl text-white/90 font-medium drop-shadow mb-4">
                {currentLanguage === 'tk' ? category.descriptionTk : category.description}
              </p>
            )}
            
            {/* Items Count Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <span className="text-white font-semibold">
                {dishes.length} {dishes.length === 1 ? 'блюдо' : dishes.length < 5 ? 'блюда' : 'блюд'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dishes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">В этой категории пока нет блюд</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {dishes.map((dish) => {
              const isExpanded = expandedItems[dish.id]
              const quantity = quantities[dish.id] || 1
              
              return (
                <div
                  key={dish.id}
                  className={`group relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isExpanded ? 'ring-2 ring-emerald-400 z-20' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                    <Image
                      src={dish.image ? imageService.getImageUrl(dish.image) : '/images/placeholder.svg'}
                      alt={currentLanguage === 'tk' ? dish.name.tk : dish.name.ru}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-min-w-8 from-black/20 via-transparent to-transparent"></div>
                    
                    {/* Price floating badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
                      <span className="text-sm font-bold text-slate-900">{dish.price} ТМТ</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2 leading-tight line-clamp-2">
                      {currentLanguage === 'tk' ? dish.name.tk : dish.name.ru}
                    </h3>
                    
                    {dish.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {currentLanguage === 'tk' ? dish.description.tk : dish.description.ru}
                      </p>
                    )}

                    {/* Order Button */}
                    <button
                      onClick={() => handleOrderClick(dish.id)}
                      className="w-full bg-gradient-to-min-w-8 from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Заказать
                    </button>

                    {/* Expanded Order Controls */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3 animate-in slide-in-from-top duration-300">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center space-x-4 bg-slate-50 rounded-2xl p-3">
                          <button
                            onClick={() => decreaseQuantity(dish.id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="font-bold text-slate-900 min-w-8 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(dish.id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>

                        {/* Total and Add to Cart */}
                        <div className="space-y-2">
                          <div className="text-center">
                            <span className="text-lg font-bold text-slate-900">
                              Итого: {dish.price * quantity} ТМТ
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(dish)}
                            className="w-full bg-gradient-to-min-w-8 from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Добавить в корзину
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <FloatingCallButton />
    </div>
  )
}