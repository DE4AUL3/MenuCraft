'use client'

import { useRef, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from 'chart.js'
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/PremiumCard'

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
)

interface AnalyticsChartsProps {
  className?: string
}

export default function AnalyticsCharts({ className = '' }: AnalyticsChartsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [selectedChart, setSelectedChart] = useState<'orders' | 'revenue' | 'popular' | 'ratings'>('orders')
  const [isAnimating, setIsAnimating] = useState(false)
  const [hiddenDatasets, setHiddenDatasets] = useState<Set<string>>(new Set())
  
  const chartRefs = {
    orders: useRef<any>(null),
    revenue: useRef<any>(null),
    popular: useRef<any>(null),
    ratings: useRef<any>(null)
  }

  // Данные для графиков (имитация реальных данных)
  const generateData = () => {
    const periods = {
      week: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      month: ['1 нед', '2 нед', '3 нед', '4 нед'],
      year: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    }

    const multiplier = selectedPeriod === 'week' ? 1 : selectedPeriod === 'month' ? 4 : 12
    
    return {
      labels: periods[selectedPeriod],
      orders: periods[selectedPeriod].map(() => Math.floor(Math.random() * 50 * multiplier) + 10),
      revenue: periods[selectedPeriod].map(() => Math.floor(Math.random() * 50000 * multiplier) + 5000),
      pandaExpress: periods[selectedPeriod].map(() => Math.floor(Math.random() * 30 * multiplier) + 5),
      hanTagam: periods[selectedPeriod].map(() => Math.floor(Math.random() * 25 * multiplier) + 3),
      sweet: periods[selectedPeriod].map(() => Math.floor(Math.random() * 20 * multiplier) + 2)
    }
  }

  const data = generateData()

  const toggleDataset = (datasetLabel: string) => {
    const newHidden = new Set(hiddenDatasets)
    if (newHidden.has(datasetLabel)) {
      newHidden.delete(datasetLabel)
    } else {
      newHidden.add(datasetLabel)
    }
    setHiddenDatasets(newHidden)
  }

  const refreshData = () => {
    setIsAnimating(true)
    // Эмуляция загрузки данных
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  const exportChart = (chartType: string) => {
    const chart = chartRefs[chartType as keyof typeof chartRefs]?.current
    if (chart) {
      const url = chart.toBase64Image()
      const link = document.createElement('a')
      link.download = `analytics-${chartType}-${Date.now()}.png`
      link.href = url
      link.click()
    }
  }

  // Конфигурация графиков
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Используем кастомную легенду
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ''
            const value = context.parsed.y || context.parsed
            return `${label}: ${value.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderColor: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          borderColor: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: '#666',
          callback: (value: any) => value.toLocaleString()
        }
      }
    },
    animation: {
      duration: isAnimating ? 0 : 1000,
      easing: 'easeInOutQuart' as const
    }
  }

  // Данные для графика заказов
  const ordersData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Заказы',
        data: data.orders,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        hidden: hiddenDatasets.has('Заказы')
      }
    ]
  }

  // Данные для графика выручки
  const revenueData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Выручка (₽)',
        data: data.revenue,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(249, 115, 22)',
          'rgb(236, 72, 153)',
          'rgb(14, 165, 233)',
          'rgb(99, 102, 241)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        hidden: hiddenDatasets.has('Выручка (₽)')
      }
    ]
  }

  // Данные для популярных ресторанов (Doughnut)
  const popularData = {
    labels: ['Panda Express', 'Han Tagam', 'Sweet'],
    datasets: [
      {
        data: [
          data.pandaExpress.reduce((a, b) => a + b, 0),
          data.hanTagam.reduce((a, b) => a + b, 0),
          data.sweet.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(249, 115, 22)'
        ],
        borderWidth: 3,
        hoverBorderWidth: 5,
        cutout: '60%'
      }
    ]
  }

  // Данные для рейтингов (Radar)
  const ratingsData = {
    labels: ['Качество', 'Скорость', 'Сервис', 'Цена', 'Атмосфера'],
    datasets: [
      {
        label: 'Panda Express',
        data: [4.8, 4.5, 4.7, 4.2, 4.6],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)',
        hidden: hiddenDatasets.has('Panda Express')
      },
      {
        label: 'Han Tagam',
        data: [4.6, 4.3, 4.8, 4.4, 4.5],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(34, 197, 94)',
        hidden: hiddenDatasets.has('Han Tagam')
      },
      {
        label: 'Sweet',
        data: [4.4, 4.1, 4.5, 4.6, 4.7],
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.2)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(249, 115, 22)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(249, 115, 22)',
        hidden: hiddenDatasets.has('Sweet')
      }
    ]
  }

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          color: '#666',
          font: {
            size: 12
          }
        },
        ticks: {
          color: '#666',
          backdropColor: 'transparent',
          min: 0,
          max: 5,
          stepSize: 1
        }
      }
    }
  }

  const chartConfigs = {
    orders: {
      title: 'Динамика заказов',
      icon: <Activity size={20} />,
      component: <Line ref={chartRefs.orders} data={ordersData} options={chartOptions} />,
      datasets: ['Заказы']
    },
    revenue: {
      title: 'Выручка по периодам',
      icon: <BarChart3 size={20} />,
      component: <Bar ref={chartRefs.revenue} data={revenueData} options={chartOptions} />,
      datasets: ['Выручка (₽)']
    },
    popular: {
      title: 'Популярные рестораны',
      icon: <PieChart size={20} />,
      component: <Doughnut ref={chartRefs.popular} data={popularData} options={{
        ...chartOptions,
        scales: undefined
      }} />,
      datasets: ['Panda Express', 'Han Tagam', 'Sweet']
    },
    ratings: {
      title: 'Рейтинги ресторанов',
      icon: <TrendingUp size={20} />,
      component: <Radar ref={chartRefs.ratings} data={ratingsData} options={radarOptions} />,
      datasets: ['Panda Express', 'Han Tagam', 'Sweet']
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок и фильтры */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Аналитика и статистика
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Интерактивные графики показателей ресторанов
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Период */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Год'}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={refreshData}
            leftIcon={<RefreshCw size={16} className={isAnimating ? 'animate-spin' : ''} />}
            disabled={isAnimating}
          >
            Обновить
          </Button>
        </div>
      </div>

      {/* Навигация по графикам */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(chartConfigs) as Array<keyof typeof chartConfigs>).map((key) => {
          const config = chartConfigs[key]
          return (
            <button
              key={key}
              onClick={() => setSelectedChart(key)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedChart === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedChart === key
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {config.icon}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm text-gray-900 dark:text-white">
                    {config.title}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Основной график */}
      <Card variant="default" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {chartConfigs[selectedChart].icon}
            {chartConfigs[selectedChart].title}
          </h3>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => exportChart(selectedChart)}
              leftIcon={<Download size={16} />}
            >
              Экспорт
            </Button>
          </div>
        </div>

        {/* Кастомная легенда */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {chartConfigs[selectedChart].datasets.map((dataset) => (
            <button
              key={dataset}
              onClick={() => toggleDataset(dataset)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                hiddenDatasets.has(dataset)
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 line-through'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}
            >
              {hiddenDatasets.has(dataset) ? <EyeOff size={14} /> : <Eye size={14} />}
              {dataset}
            </button>
          ))}
        </div>

        {/* График */}
        <motion.div
          key={selectedChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-96"
        >
          {chartConfigs[selectedChart].component}
        </motion.div>
      </Card>
    </div>
  )
}