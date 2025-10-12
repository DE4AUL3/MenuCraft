'use client'

import { Gauge, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { PerformanceData } from './mockData'

interface PerformanceChartProps {
  data: PerformanceData[]
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export default function PerformanceChart({ data, theme = 'light' }: PerformanceChartProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          itemBg: 'bg-gray-700/50',
          progressBg: 'bg-gray-600/30'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          itemBg: 'bg-red-900/30',
          progressBg: 'bg-red-800/30'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          itemBg: 'bg-orange-200/30',
          progressBg: 'bg-orange-300/30'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          itemBg: 'bg-gray-100/50',
          progressBg: 'bg-gray-200/50'
        }
    }
  }

  const themeClasses = getThemeClasses()

  const getMetricIcon = (metric: string) => {
    const icons = {
      'Средний чек': '₽',
      'Время приготовления': '⏱',
      'Конверсия': '%',
      'Повторные заказы': '🔄',
      'Рейтинг сервиса': '⭐',
      'Отмены заказов': '❌'
    }
    return icons[metric as keyof typeof icons] || '📊'
  }

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return 'from-green-400 to-green-600'
    if (percentage >= 80) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-red-600'
  }

  const formatValue = (metric: string, value: number) => {
    switch (metric) {
      case 'Средний чек':
        return `₽${value}`
      case 'Время приготовления':
        return `${value} мин`
      case 'Конверсия':
      case 'Повторные заказы':
      case 'Отмены заказов':
        return `${value}%`
      case 'Рейтинг сервиса':
        return value.toFixed(1)
      default:
        return value.toString()
    }
  }

  const overallScore = data.reduce((acc, item) => {
    const score = Math.min((item.value / item.target) * 100, 100)
    return acc + score
  }, 0) / data.length

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${themeClasses.bg}`}>
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold flex items-center gap-2 ${themeClasses.text}`}>
              <Gauge className="w-5 h-5 text-purple-500" />
              Производительность
            </h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Ключевые метрики эффективности
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${themeClasses.text}`}>
              {overallScore.toFixed(1)}%
            </div>
            <div className={`text-sm ${themeClasses.textSecondary}`}>
              Общий балл
            </div>
          </div>
        </div>
      </div>

      {/* Общий индикатор */}
      <div className="p-6 border-b border-gray-200/20">
        <div className="relative">
          <div className={`h-3 rounded-full overflow-hidden ${themeClasses.progressBg}`}>
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor(overallScore, 100)} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(overallScore, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={themeClasses.textSecondary}>0%</span>
            <span className={themeClasses.textSecondary}>50%</span>
            <span className={themeClasses.textSecondary}>100%</span>
          </div>
        </div>
      </div>

      {/* Метрики */}
      <div className="p-6 space-y-4">
        {data.map((metric, index) => {
          const progress = Math.min((metric.value / metric.target) * 100, 100)
          const isPositive = metric.trend === 'up' && metric.change > 0
          const isNegative = metric.trend === 'down' || metric.change < 0
          
          return (
            <div key={index} className={`p-4 rounded-lg ${themeClasses.itemBg}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getMetricIcon(metric.metric)}
                  </div>
                  <div>
                    <h4 className={`font-semibold ${themeClasses.text}`}>
                      {metric.metric}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${themeClasses.textSecondary}`}>
                        Цель: {formatValue(metric.metric, metric.target)}
                      </span>
                      <Target className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-xl font-bold ${themeClasses.text}`}>
                    {formatValue(metric.metric, metric.value)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    isPositive ? 'text-green-500' : 
                    isNegative ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {metric.trend === 'up' ? 
                      <TrendingUp className="w-4 h-4" /> : 
                      metric.trend === 'down' ?
                      <TrendingDown className="w-4 h-4" /> :
                      null
                    }
                    {Math.abs(metric.change).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Прогресс-бар */}
              <div className="space-y-2">
                <div className={`h-2 rounded-full overflow-hidden ${themeClasses.progressBg}`}>
                  <div 
                    className={`h-full bg-gradient-to-r ${getProgressColor(metric.value, metric.target)} transition-all duration-700 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className={themeClasses.textSecondary}>
                    {progress.toFixed(1)}% от цели
                  </span>
                  <span className={`font-medium ${
                    progress >= 100 ? 'text-green-500' :
                    progress >= 80 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {progress >= 100 ? 'Цель достигнута' :
                     progress >= 80 ? 'Близко к цели' : 'Требует внимания'}
                  </span>
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
            <div className={`text-lg font-bold text-green-500`}>
              {data.filter(m => (m.value / m.target) >= 1).length}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Цели достигнуты
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold text-yellow-500`}>
              {data.filter(m => (m.value / m.target) >= 0.8 && (m.value / m.target) < 1).length}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Близко к цели
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold text-red-500`}>
              {data.filter(m => (m.value / m.target) < 0.8).length}
            </div>
            <div className={`text-xs ${themeClasses.textSecondary}`}>
              Требуют внимания
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}