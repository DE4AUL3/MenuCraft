'use client'

import { Star, TrendingUp, Package } from 'lucide-react'
import { DishData, formatCurrency } from './mockData'
import SmartImage from '@/components/ui/SmartImage'

interface PopularDishesChartProps {
  data: DishData[]
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export default function PopularDishesChart({ data, theme = 'light' }: PopularDishesChartProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          itemBg: 'bg-gray-700/50 hover:bg-gray-700/70',
          progressBg: 'bg-gray-600/30'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          itemBg: 'bg-red-900/30 hover:bg-red-900/50',
          progressBg: 'bg-red-800/30'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          itemBg: 'bg-orange-200/30 hover:bg-orange-200/50',
          progressBg: 'bg-orange-300/30'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          itemBg: 'bg-gray-100/50 hover:bg-gray-100/70',
          progressBg: 'bg-gray-200/50'
        }
    }
  }

  const maxOrders = Math.max(...data.map(dish => dish.orders))
  const themeClasses = getThemeClasses()

  const getCategoryColor = (category: string) => {
    const colors = {
      'Бургеры': 'from-orange-400 to-red-500',
      'Пицца': 'from-yellow-400 to-orange-500',
      'Горячие блюда': 'from-red-400 to-pink-500',
      'Напитки': 'from-blue-400 to-cyan-500',
      'Десерты': 'from-pink-400 to-purple-500',
      'Салаты': 'from-green-400 to-emerald-500'
    }
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${themeClasses.bg}`}>
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${themeClasses.text}`}>
              <Package className="w-5 h-5 text-orange-500" />
              Популярные блюда
            </h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Топ {data.length} блюд по количеству заказов
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${themeClasses.text}`}>
              {data.reduce((sum, dish) => sum + dish.orders, 0)}
            </div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              Всего заказов
            </div>
          </div>
        </div>
      </div>

      {/* Список блюд */}
      <div className="p-6 space-y-4">
        {data.map((dish, index) => {
          const progressWidth = (dish.orders / maxOrders) * 100
          
          return (
            <div 
              key={index}
              className={`relative p-4 rounded-lg transition-all duration-200 ${themeClasses.itemBg}`}
            >
              <div className="flex items-center gap-4">
                {/* Ранг */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r ${getCategoryColor(dish.category)} text-white font-bold text-sm shadow-lg`}>
                  {index + 1}
                </div>

                {/* Изображение блюда */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-200/50 flex items-center justify-center overflow-hidden">
                    {dish.image ? (
                      <SmartImage 
                        src={dish.image} 
                        alt={dish.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Информация о блюде */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold truncate ${themeClasses.text}`}>
                      {dish.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className={`text-sm font-medium ${themeClasses.text}`}>
                        {dish.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(dish.category)} text-white text-xs font-medium`}>
                      {dish.category}
                    </span>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${themeClasses.text}`}>
                        {formatCurrency(dish.revenue)}
                      </div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>
                        {dish.orders} заказов
                      </div>
                    </div>
                  </div>

                  {/* Прогресс-бар */}
                  <div className={`h-2 rounded-full overflow-hidden ${themeClasses.progressBg}`}>
                    <div 
                      className={`h-full bg-gradient-to-r ${getCategoryColor(dish.category)} transition-all duration-500 ease-out`}
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>

                {/* Индикатор роста */}
                <div className="flex-shrink-0">
                  <div className="flex items-center gap-1 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      +{(Math.random() * 15 + 5).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Сводка */}
      <div className="p-4 border-t border-gray-200/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {data.length}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Позиций в топе
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {formatCurrency(data.reduce((sum, dish) => sum + dish.revenue, 0))}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Общая выручка
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${themeClasses.text}`}>
              {(data.reduce((sum, dish) => sum + dish.rating, 0) / data.length).toFixed(1)}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Средний рейтинг
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}