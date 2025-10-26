"use client"

import { useState, useEffect, useRef } from 'react'
// framer-motion removed from server component to avoid SSR/runtime issues
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ShoppingCart, Globe, ArrowLeft, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/hooks/useCart'
import { imageService } from '@/lib/imageService'
import FloatingCallButton from '@/components/FloatingCallButton'
import { themes } from '@/styles/simpleTheme'
import type { Category, Dish } from '@/types/common'



export default function CategoryPage() {
  // Хуки должны быть только внутри компонента!
  const [fade, setFade] = useState<'in' | 'out'>('in')
  const prevCategoryId = useRef<string | null>(null)
  const params = useParams()
  const categoryId = params?.categoryId as string
  const restaurantId = params?.id as string

  const [categories, setCategories] = useState<Category[]>([])

  // Загружаем все категории для навигации
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/category')
        if (response.ok) {
          const data = await response.json()
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
        // eslint-disable-next-line no-console
        console.error('Ошибка загрузки категорий:', error)
      }
    }
    loadCategories()
  }, [restaurantId])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage, setCurrentLanguage, toggleLanguage } = useLanguage()
  const { state: cartState, dispatch } = useCart()
  const { light: theme } = themes

  const [isLoading, setIsLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [category, setCategory] = useState<Category | null>(null)
  const [dishes, setDishes] = useState<Dish[]>([])


  // Синхронизируем язык с query-параметром lang
  useEffect(() => {
    const langParam = searchParams?.get('lang');
    if (langParam && (langParam === 'ru' || langParam === 'tk')) {
      setCurrentLanguage(langParam);
    }
  }, [searchParams, setCurrentLanguage]);

  useEffect(() => {
    // Если категория изменилась, запускаем анимацию исчезновения
    if (prevCategoryId.current && prevCategoryId.current !== categoryId) {
      setFade('out')
      // После анимации исчезновения загружаем данные и показываем fade-in
      setTimeout(() => {
        loadCategoryData()
      }, 200)
    } else {
      loadCategoryData()
    }
    prevCategoryId.current = categoryId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId])

  const loadCategoryData = async () => {
    try {
      // Загружаем категорию
      const categoryResponse = await fetch('/api/category')
      const categories = await categoryResponse.json()
      const foundCategory = categories.find((cat: any) => cat.id === categoryId)
      const transformedCategory: Category = {
        id: foundCategory.id,
        name: foundCategory.nameRu,
        nameTk: foundCategory.nameTk,
        image: foundCategory.imageCard,
        gradient: 'from-slate-500 to-slate-700',
        description: foundCategory.descriptionRu || '',
        descriptionTk: foundCategory.descriptionTk || '',
        isActive: foundCategory.status,
        sortOrder: foundCategory.order,
        createdAt: foundCategory.createdAt,
        updatedAt: foundCategory.updatedAt
      }
      setCategory(transformedCategory)

      // Попытка использовать предзагруженные данные из window/session cache для мгновенного отображения
      let meals: any[] | null = null
      try {
        if (typeof window !== 'undefined' && (window as any).__mealCache && (window as any).__mealCache[categoryId]) {
          meals = (window as any).__mealCache[categoryId]
        } else if (typeof window !== 'undefined') {
          const cached = sessionStorage.getItem('mealCache:' + categoryId)
          if (cached) meals = JSON.parse(cached)
        }
      } catch (e) {
        meals = null
      }

      if (!meals) {
        const mealsResponse = await fetch(`/api/meal?categoryId=${categoryId}`)
        meals = await mealsResponse.json()
      }

      const transformedDishes: Dish[] = (meals || []).map((meal: any) => ({
        id: meal.id,
        name: { ru: meal.nameRu, tk: meal.nameTk },
        description: { ru: meal.descriptionRu || '', tk: meal.descriptionTk || '' },
        categoryId: meal.categoryId,
        price: meal.price,
        image: meal.image,
        isActive: true,
        createdAt: meal.createdAt || null,
        updatedAt: meal.updatedAt || null
      }))
      setDishes(transformedDishes)
      setTimeout(() => setFade('in'), 10)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 transition-opacity duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back Button + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/menu/${restaurantId}`)}
                className="p-2 text-slate-300 hover:text-white transition-colors duration-200"
                aria-label="Назад к категориям"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {currentLanguage === 'tk' ? category.nameTk : category.name}
                </h1>
                <p className="text-sm text-slate-600">
                  {(dishes?.length ?? 0)} блюд{(dishes?.length ?? 0) !== 1 && (dishes?.length ?? 0) < 5 ? 'а' : ''}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 p-2 rounded-lg transition-colors duration-200"
              >
                <Globe className="w-5 h-5 text-slate-900" />
                <span className="text-sm font-medium" style={{color: theme.colors.text.primary}}>
                  {currentLanguage === 'ru' ? 'TM' : 'RU'}
                </span>
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="relative p-3 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                style={{ background: theme.colors.accent.call }}
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


      {/* Горизонтальная навигация по категориям */}
  <div className="sticky top-[72px] z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x">
            {/* Получаем все категории из API и отображаем */}
            {/* Для этого потребуется состояние categories и useEffect, как на странице меню */}
            {/* Здесь пример с моком, ниже будет реальный код */}
            {/* categories.map((cat) => ( */}
            {/*   <button */}
            {/*     key={cat.id} */}
            {/*     onClick={() => router.push(`/menu/${restaurantId}/category/${cat.id}`)} */}
            {/*     className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium snap-center ${cat.id === categoryId ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} */}
            {/*   > */}
            {/*     {currentLanguage === 'tk' ? cat.nameTk : cat.name} */}
            {/*   </button> */}
            {/* )) */}
            {categories && categories.length > 0 && categories.map((cat: Category) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/menu/${restaurantId}/category/${cat.id}`)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium snap-center ${cat.id === categoryId ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {currentLanguage === 'tk' ? cat.nameTk : cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
  <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-200 ${fade === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
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
                    isExpanded ? 'z-20' : ''
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
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>
                    
                    {/* Price floating badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
                      <span className="text-sm font-bold text-slate-900">{dish.price} ТМТ</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    {/* Вместо отображения расширенной панели ниже — заменяем содержимое карточки целиком */}
                    {isExpanded ? (
                      <div className="flex flex-col justify-between h-30 md:h-32">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <button
                            onClick={() => decreaseQuantity(dish.id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="font-bold text-slate-900 min-w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => increaseQuantity(dish.id)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 transition-colors"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>

                        {/* Total, Add to Cart and Back */}
                        <div className="pt-1.5">
                          <div className="text-center mb-1.5">
                            <span className="text-sm sm:text-base font-bold text-slate-900">Итого: {dish.price * quantity} ТМТ</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOrderClick(dish.id)}
                              className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-slate-700 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                              aria-label="Назад к карточке блюда"
                            >
                              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <button
                              onClick={() => addToCart(dish)}
                              className="flex-1 flex items-center justify-center bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                              aria-label="Добавить в корзину"
                            >
                              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
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
                          className="w-full bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Заказать
                        </button>
                      </>
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
