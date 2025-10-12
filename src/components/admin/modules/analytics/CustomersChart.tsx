'use client'

import { Users, UserPlus, RotateCcw } from 'lucide-react'
import { CustomerData, formatDate } from './mockData'

interface CustomersChartProps {
  data: CustomerData[]
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export default function CustomersChart({ data, theme = 'light' }: CustomersChartProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          chartBg: 'bg-gray-900/30'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          chartBg: 'bg-black/30'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          chartBg: 'bg-orange-50/30'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          chartBg: 'bg-gray-50/30'
        }
    }
  }

  const maxCustomers = Math.max(...data.map(item => item.totalCustomers))
  const themeClasses = getThemeClasses()

  const totals = {
    newCustomers: data.reduce((sum, item) => sum + item.newCustomers, 0),
    returningCustomers: data.reduce((sum, item) => sum + item.returningCustomers, 0),
    totalCustomers: data.reduce((sum, item) => sum + item.totalCustomers, 0)
  }

  const retentionRate = ((totals.returningCustomers / totals.totalCustomers) * 100).toFixed(1)

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${themeClasses.bg}`}>
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${themeClasses.text}`}>
              <Users className="w-5 h-5 text-blue-500" />
              Динамика клиентов
            </h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Новые и возвращающиеся клиенты
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${themeClasses.text}`}>
              {totals.totalCustomers}
            </div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              Всего клиентов
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="p-4 border-b border-gray-200/20">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 mx-auto mb-2`}>
              <UserPlus className="w-4 h-4 text-green-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {totals.newCustomers}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Новых
            </div>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/20 mx-auto mb-2`}>
              <RotateCcw className="w-4 h-4 text-blue-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {totals.returningCustomers}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Возвратных
            </div>
          </div>
          <div className="text-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/20 mx-auto mb-2`}>
              <Users className="w-4 h-4 text-purple-500" />
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text}`}>
              {retentionRate}%
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Удержание
            </div>
          </div>
        </div>
      </div>

      {/* График */}
      <div className={`p-6 ${themeClasses.chartBg}`}>
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            <defs>
              <linearGradient id={`newCustomersGradient-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" className="text-green-500" stopColor="currentColor" stopOpacity="0.3"/>
                <stop offset="100%" className="text-green-500" stopColor="currentColor" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id={`returningCustomersGradient-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
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

            {/* Область новых клиентов */}
            <path
              d={[
                'M 0 160',
                ...data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 800
                  const y = 160 - (item.newCustomers / (maxCustomers * 0.6)) * 120
                  return `L ${x} ${y}`
                }),
                'L 800 160 Z'
              ].join(' ')}
              fill={`url(#newCustomersGradient-${theme})`}
            />

            {/* Область возвращающихся клиентов */}
            <path
              d={[
                'M 0 160',
                ...data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 800
                  const y = 160 - ((item.newCustomers + item.returningCustomers) / (maxCustomers * 0.8)) * 120
                  return `L ${x} ${y}`
                }),
                'L 800 160 Z'
              ].join(' ')}
              fill={`url(#returningCustomersGradient-${theme})`}
            />

            {/* Линия новых клиентов */}
            <path
              d={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 800
                const y = 160 - (item.newCustomers / (maxCustomers * 0.6)) * 120
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            />

            {/* Линия возвращающихся клиентов */}
            <path
              d={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 800
                const y = 160 - (item.returningCustomers / (maxCustomers * 0.6)) * 120
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            />

            {/* Точки новых клиентов */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 800
              const y = 160 - (item.newCustomers / (maxCustomers * 0.6)) * 120
              return (
                <circle
                  key={`new-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="currentColor"
                  className="text-green-500"
                />
              )
            })}

            {/* Точки возвращающихся клиентов */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 800
              const y = 160 - (item.returningCustomers / (maxCustomers * 0.6)) * 120
              return (
                <circle
                  key={`returning-${index}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="currentColor"
                  className="text-blue-500"
                />
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

      {/* Легенда */}
      <div className="p-4 border-t border-gray-200/20">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={`text-sm ${themeClasses.textSecondary}`}>
              Новые клиенты
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className={`text-sm ${themeClasses.textSecondary}`}>
              Возвращающиеся
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}