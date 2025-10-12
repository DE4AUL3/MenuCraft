'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ShoppingCart, Globe, ArrowLeft, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useCart } from '@/hooks/useCart'
import { MenuItem } from '@/types/menu'
import FloatingCallButton from '@/components/FloatingCallButton'

// Данные для блюд
const menuItems: Record<string, MenuItem[]> = {
  'burgers': [ // Завтраки
    {
      id: 'pancakes-classic',
      name: 'Классические блинчики',
      nameTk: 'Klassik krep',
      description: 'Пышные блинчики с медом и ягодами',
      descriptionTk: 'Bal we miwe bilen ýumşak krep',
      price: 28,
      image: '/images/categories/desserts.svg',
      category: 'burgers',
      ingredients: ['Мука', 'Молоко', 'Яйца', 'Мед', 'Ягоды'],
      ingredientsTk: ['Un', 'Süýt', 'Ýumurtga', 'Bal', 'Miweler']
    },
    {
      id: 'fruit-bowl',
      name: 'Фруктовая тарелка',
      nameTk: 'Miweli tabak',
      description: 'Свежие сезонные фрукты с медом',
      descriptionTk: 'Bal bilen täze möwsüm miweleri',
      price: 22,
      image: '/images/categories/desserts.svg',
      category: 'burgers',
      ingredients: ['Клубника', 'Черника', 'Апельсин', 'Мед'],
      ingredientsTk: ['Zemlýanika', 'Gök miwe', 'Apelsin', 'Bal']
    }
  ],
  'pizza': [ // Паста
    {
      id: 'pasta-carbonara',
      name: 'Паста Карбонара',
      nameTk: 'Karbonara makarony',
      description: 'Классическая итальянская паста с беконом',
      descriptionTk: 'Bekony bilen klassik italiýan makarony',
      price: 35,
      image: '/images/categories/chicken.svg',
      category: 'pizza',
      ingredients: ['Спагетти', 'Бекон', 'Пармезан', 'Яйца', 'Сливки'],
      ingredientsTk: ['Spagetti', 'Bekony', 'Parmezan', 'Ýumurtga', 'Gaýmak']
    }
  ],
  'chicken': [ // Азиатская кухня
    {
      id: 'chicken-teriyaki',
      name: 'Курица Терияки',
      nameTk: 'Teriýaki towugy',
      description: 'Нежная курица в соусе терияки',
      descriptionTk: 'Teriýaki sousunda ýumşak towuk',
      price: 42,
      image: '/images/categories/chicken.svg',
      category: 'chicken',
      ingredients: ['Куриное филе', 'Соус терияки', 'Рис', 'Овощи'],
      ingredientsTk: ['Towuk eti', 'Teriýaki sousy', 'Tüwi', 'Gök önümler']
    }
  ],
  'sides': [ // Суши
    {
      id: 'sushi-set',
      name: 'Суши сет',
      nameTk: 'Suşi toplumy',
      description: 'Разнообразный набор свежих суши',
      descriptionTk: 'Täze suşiniň dürli toplumy',
      price: 58,
      image: '/images/categories/drinks.svg',
      category: 'sides',
      ingredients: ['Лосось', 'Тунец', 'Рис', 'Нори', 'Васаби'],
      ingredientsTk: ['Lossos', 'Tuna', 'Tüwi', 'Nori', 'Wasabi']
    }
  ],
  'desserts': [ // Десерты
    {
      id: 'berry-dessert',
      name: 'Ягодный десерт',
      nameTk: 'Miweli süýji',
      description: 'Свежие ягоды с медом и мятой',
      descriptionTk: 'Bal we ýalpyldym bilen täze miweler',
      price: 25,
      image: '/images/categories/desserts.svg',
      category: 'desserts',
      ingredients: ['Клубника', 'Малина', 'Мед', 'Мята'],
      ingredientsTk: ['Zemlýanika', 'Gyzyl miwe', 'Bal', 'Ýalpyldym']
    }
  ],
  'drinks': [ // Напитки
    {
      id: 'mojito-fresh',
      name: 'Мохито освежающий',
      nameTk: 'Serinletgiji mohito',
      description: 'Классический мохито с мятой и лаймом',
      descriptionTk: 'Ýalpyldym we laým bilen klassik mohito',
      price: 18,
      image: '/images/categories/drinks.svg',
      category: 'drinks',
      ingredients: ['Лайм', 'Мята', 'Содовая', 'Лед'],
      ingredientsTk: ['Laým', 'Ýalpyldym', 'Soda', 'Buz']
    }
  ]
}

export default function CategoryPage() {
  const router = useRouter()
  const params = useParams()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { state: cartState, dispatch } = useCart()
  
  const [isLoading, setIsLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const categoryId = params?.categoryId as string
  const items = menuItems[categoryId] || []

  const categoryNames: Record<string, { ru: string; tk: string }> = {
    'burgers': { ru: 'Завтраки', tk: 'Ertirlik' }, // Pancakes
    'pizza': { ru: 'Паста', tk: 'Makaron' }, // Pasta
    'chicken': { ru: 'Азиатская кухня', tk: 'Aziýa aşlary' }, // Chicken Teriyaki
    'sides': { ru: 'Суши', tk: 'Suşi' }, // Sushi
    'desserts': { ru: 'Десерты', tk: 'Süýji tagamlar' }, // Fruit Desserts
    'drinks': { ru: 'Напитки', tk: 'Içgiler' } // Mojito
  }

  const categoryBanners: Record<string, { 
    image: string; 
    gradient: string; 
    description: { ru: string; tk: string }
  }> = {
    'burgers': { 
      image: '/images/categories/pancakes.jpg',
      gradient: 'from-yellow-600/80 via-orange-600/60 to-amber-600/40',
      description: { 
        ru: 'Пышные блинчики и свежие начинки', 
        tk: 'Ýumşak krep we täze içlik' 
      }
    },
    'pizza': { 
      image: '/images/categories/pasta.jpg',
      gradient: 'from-orange-600/80 via-red-600/60 to-yellow-600/40',
      description: { 
        ru: 'Итальянская паста и изысканные соусы', 
        tk: 'Italiýa makarony we ajaýyp souslar' 
      }
    },
    'chicken': { 
      image: '/images/categories/chicken-teriyaki.jpg',
      gradient: 'from-red-600/80 via-orange-600/60 to-amber-600/40',
      description: { 
        ru: 'Изысканные блюда азиатской кухни', 
        tk: 'Aziýa aşhanasynyň ajaýyp tagamlary' 
      }
    },
    'sides': { 
      image: '/images/categories/sushi.jpg',
      gradient: 'from-green-600/80 via-teal-600/60 to-blue-600/40',
      description: { 
        ru: 'Свежие суши от мастера', 
        tk: 'Ussat tarapyndan täze suşi' 
      }
    },
    'desserts': { 
      image: '/images/categories/desserts-fruit-plate.jpg',
      gradient: 'from-pink-600/80 via-purple-600/60 to-blue-600/40',
      description: { 
        ru: 'Свежие фрукты и ягодные десерты', 
        tk: 'Täze miweler we miweli süýjiler' 
      }
    },
    'drinks': { 
      image: '/images/categories/drinks-mojito.jpg',
      gradient: 'from-green-600/80 via-cyan-600/60 to-teal-600/40',
      description: { 
        ru: 'Освежающие коктейли и напитки', 
        tk: 'Serinletgiji kokteýller we içgiler' 
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleOrderClick = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
    if (!quantities[itemId]) {
      setQuantities(prev => ({ ...prev, [itemId]: 1 }))
    }
  }

  const updateQuantity = (itemId: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change)
    }))
  }

  const addToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1
    dispatch({
      type: 'ADD_ITEM',
      payload: { ...item, quantity }
    })
    
    // Сброс состояния
    setExpandedItems(prev => ({ ...prev, [item.id]: false }))
    setQuantities(prev => ({ ...prev, [item.id]: 1 }))
    
    // Показать уведомление (можно добавить toast)
    console.log(`Добавлено в корзину: ${item.name} x${quantity}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-black dark:via-slate-900 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-emerald-600 rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Загружаем блюда</h3>
          <p className="text-slate-600 dark:text-slate-300">Готовим меню категории...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 rounded-xl"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {currentLanguage === 'tk' 
                    ? categoryNames[categoryId]?.tk 
                    : categoryNames[categoryId]?.ru}
                </h1>
                <p className="text-sm text-slate-600">
                  {items.length} блюд
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleLanguage}
                className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 rounded-xl"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="relative p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden rounded-b-3xl">
        <Image
          src={categoryBanners[categoryId]?.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=300&fit=crop&auto=format'}
          alt={currentLanguage === 'tk' ? categoryNames[categoryId]?.tk : categoryNames[categoryId]?.ru}
          fill
          className="object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${categoryBanners[categoryId]?.gradient || 'from-emerald-600/70 via-teal-600/50 to-green-600/40'}`}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mx-auto">
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 drop-shadow-lg">
              {currentLanguage === 'tk' 
                ? categoryNames[categoryId]?.tk 
                : categoryNames[categoryId]?.ru}
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 font-medium drop-shadow mb-4">
              {currentLanguage === 'tk' 
                ? categoryBanners[categoryId]?.description.tk
                : categoryBanners[categoryId]?.description.ru}
            </p>
            
            {/* Items Count Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2">
              <span className="text-white font-semibold">
                {items.length} {items.length === 1 ? 'блюдо' : items.length < 5 ? 'блюда' : 'блюд'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-16 left-20 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Menu Items */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {items.map((item) => {
            const isExpanded = expandedItems[item.id]
            const quantity = quantities[item.id] || 1
            
            return (
              <div
                key={item.id}
                className={`group relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  isExpanded ? 'ring-2 ring-emerald-400 z-20' : ''
                }`}
              >
                {/* Floating glass effect */}
                <div className="absolute inset-0 pointer-events-none"></div>
                
                {/* Image */}
                <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  
                  {/* Price floating badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-200">
                    <span className="text-sm font-bold text-slate-900">{item.price} ТМТ</span>
                  </div>

                  {/* Glowing orb effect */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform duration-500"></div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-6 relative z-10">
                  {!isExpanded ? (
                    <>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 line-clamp-2">
                        {currentLanguage === 'tk' ? (item.nameTk || item.name) : item.name}
                      </h3>
                      
                      <button
                        onClick={() => handleOrderClick(item.id)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                      >
                        ✨ Заказать
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Счетчик на месте названия и состава */}
                      <div className="text-center mb-3">
                        <div className="inline-flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1 mb-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-50 text-slate-700 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-lg text-white min-w-[2.5rem] text-center px-2 drop-shadow-lg">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-green-50 text-slate-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-xl font-black text-center mb-4 text-slate-900">
                        {item.price * quantity} ТМТ
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOrderClick(item.id)}
                          className="flex-1 bg-white hover:bg-slate-50 text-slate-900 py-3 px-4 rounded-xl font-semibold transition-colors text-sm border border-slate-200 flex items-center justify-center"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => addToCart(item)}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors text-sm shadow-md hover:shadow-lg flex items-center justify-center"
                        >
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Floating Phone Button */}
      <FloatingCallButton />
    </div>
  )
}