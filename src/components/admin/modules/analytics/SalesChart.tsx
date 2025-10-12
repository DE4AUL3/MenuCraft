'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users } from 'lucide-react'
import { SalesData, formatCurrency, formatDate, calculateGrowth } from './mockData'

interface SalesChartProps {
  data: SalesData[]
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export default function SalesChart({ data, theme = 'light' }: SalesChartProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          chartBg: 'bg-gray-900/30',
          gradient: 'from-blue-500/20 to-purple-500/20'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          chartBg: 'bg-black/30',
          gradient: 'from-red-500/20 to-black/20'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          chartBg: 'bg-orange-50/30',
          gradient: 'from-orange-400/20 to-amber-400/20'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          chartBg: 'bg-gray-50/30',
          gradient: 'from-blue-400/20 to-purple-400/20'
        }
    }
  }

  const stats = useMemo(() => {
    const totalSales = data.reduce((sum, item) => sum + item.sales, 0)
    const totalOrders = data.reduce((sum, item) => sum + item.orders, 0)
    const totalCustomers = data.reduce((sum, item) => sum + item.customers, 0)
    
    const recentData = data.slice(-7)
    const previousData = data.slice(-14, -7)
    
    const recentSales = recentData.reduce((sum, item) => sum + item.sales, 0)
    const previousSales = previousData.reduce((sum, item) => sum + item.sales, 0)
    
    const recentOrders = recentData.reduce((sum, item) => sum + item.orders, 0)
    const previousOrders = previousData.reduce((sum, item) => sum + item.orders, 0)
    
    const salesGrowth = calculateGrowth(recentSales, previousSales)
    const ordersGrowth = calculateGrowth(recentOrders, previousOrders)
    
    return {
      totalSales,
      totalOrders,
      totalCustomers,
      salesGrowth,
      ordersGrowth,
      avgOrderValue: totalSales / totalOrders
    }
  }, [data])

  const maxSales = Math.max(...data.map(item => item.sales))
  const themeClasses = getThemeClasses()

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${themeClasses.bg}`}>
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${themeClasses.text}`}>
              <TrendingUp className="w-5 h-5 text-green-500" />
              Динамика продаж
            </h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Продажи за последние {data.length} дней
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${themeClasses.text}`}>
              {formatCurrency(stats.totalSales)}
            </div>
            <div className={`flex items-center gap-1 text-sm ${
              stats.salesGrowth > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {stats.salesGrowth > 0 ? 
                <TrendingUp className="w-4 h-4" /> : 
                <TrendingDown className="w-4 h-4" />
              }
              {Math.abs(stats.salesGrowth).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-4 border-b border-gray-200/20">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 mx-auto mb-2`}>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {formatCurrency(stats.avgOrderValue)}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Средний чек
            </div>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 mx-auto mb-2`}>
              <ShoppingBag className="w-4 h-4 text-green-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {stats.totalOrders}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Заказов
            </div>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 mx-auto mb-2`}>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {stats.totalCustomers}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Клиентов
            </div>
          </div>
        </div>
      </div>

      {/* График */}
      <div className={`p-6 ${themeClasses.chartBg}`}>
        <div className="relative h-64">
          {/* SVG График */}
          <svg className="w-full h-full" viewBox="0 0 800 200">
            <defs>
              <linearGradient id={`salesGradient-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="text-blue-500" stopColor="currentColor" stopOpacity="0.3"/>
                <stop offset="100%" className="text-blue-500" stopColor="currentColor" stopOpacity="0"/>
              </linearGradient>
            </defs>
            
            {/* Сетка */}
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="0"
                y1={line * 40}
                x2="800"
                y2={line * 40}
                stroke="currentColor"
                strokeOpacity="0.1"
                className={themeClasses.textSecondary}
              />
            ))}

            {/* Линия графика */}
            <path
              d={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 800
                const y = 160 - (item.sales / maxSales) * 140
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-blue-500"
            />

            {/* Область под графиком */}
            <path
              d={[
                data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 800
                  const y = 160 - (item.sales / maxSales) * 140
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' '),
                `L 800 160 L 0 160 Z`
              ].join(' ')}
              fill={`url(#salesGradient-${theme})`}
            />

            {/* Точки */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 800
              const y = 160 - (item.sales / maxSales) * 140
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="currentColor"
                    className="text-blue-500"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="2"
                    fill="white"
                  />
                </g>
              )
            })}
          </svg>

          {/* Метки дат */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs">
            {data.filter((_, index) => index % 5 === 0).map((item, index) => (
              <span key={index} className={themeClasses.textSecondary}>
                {formatDate(item.date)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}