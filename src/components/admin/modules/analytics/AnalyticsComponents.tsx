'use client'

import { Calendar, Download } from 'lucide-react'
import { useState } from 'react'

interface DateFilterProps {
  onDateChange: (startDate: string, endDate: string) => void
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export function DateFilter({ onDateChange, theme = 'light' }: DateFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d')

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          buttonBg: 'bg-gray-700/50 hover:bg-gray-700/70',
          buttonActive: 'bg-blue-600/80'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          buttonBg: 'bg-red-900/30 hover:bg-red-900/50',
          buttonActive: 'bg-red-600/80'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          buttonBg: 'bg-orange-200/30 hover:bg-orange-200/50',
          buttonActive: 'bg-orange-500/80'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          buttonBg: 'bg-gray-100/50 hover:bg-gray-100/70',
          buttonActive: 'bg-blue-500/80'
        }
    }
  }

  const themeClasses = getThemeClasses()

  const periods = [
    { id: '7d', label: '7 дней', days: 7 },
    { id: '30d', label: '30 дней', days: 30 },
    { id: '90d', label: '3 месяца', days: 90 },
    { id: '1y', label: '1 год', days: 365 }
  ]

  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriod(periodId)
    const period = periods.find(p => p.id === periodId)
    if (period) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - period.days)
      
      onDateChange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${themeClasses.bg}`}>
      <div className="flex items-center gap-2">
        <Calendar className={`w-4 h-4 ${themeClasses.textSecondary}`} />
        <span className={`text-sm font-medium ${themeClasses.text}`}>
          Период:
        </span>
      </div>
      
      <div className="flex gap-1">
        {periods.map((period) => (
          <button
            key={period.id}
            onClick={() => handlePeriodChange(period.id)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
              selectedPeriod === period.id
                ? `${themeClasses.buttonActive} text-white`
                : `${themeClasses.buttonBg} ${themeClasses.textSecondary}`
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
    </div>
  )
}

interface ExportButtonProps {
  onExport: (format: 'csv' | 'excel' | 'pdf') => void
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export function ExportButton({ onExport, theme = 'light' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          buttonBg: 'bg-blue-600/80 hover:bg-blue-600/90',
          dropdownBg: 'bg-gray-800/90 border border-gray-700/50'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300',
          buttonBg: 'bg-red-600/80 hover:bg-red-600/90',
          dropdownBg: 'bg-red-950/90 border border-red-900/50'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700',
          buttonBg: 'bg-orange-500/80 hover:bg-orange-500/90',
          dropdownBg: 'bg-orange-100/90 border border-orange-200/50'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          buttonBg: 'bg-blue-500/80 hover:bg-blue-500/90',
          dropdownBg: 'bg-white/90 border border-gray-200/50'
        }
    }
  }

  const themeClasses = getThemeClasses()

  const exportFormats = [
    { id: 'csv', label: 'CSV файл', description: 'Экспорт в формате CSV' },
    { id: 'excel', label: 'Excel файл', description: 'Экспорт в формате XLSX' },
    { id: 'pdf', label: 'PDF отчет', description: 'Экспорт в формате PDF' }
  ]

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    onExport(format)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-white ${themeClasses.buttonBg}`}
      >
        <Download className="w-4 h-4" />
        Экспорт
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl z-50 ${themeClasses.dropdownBg} backdrop-blur-sm`}>
          <div className="p-2">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleExport(format.id as 'csv' | 'excel' | 'pdf')}
                className={`w-full text-left p-3 rounded-md transition-all duration-200 hover:bg-white/10 ${themeClasses.text}`}
              >
                <div className="font-medium">{format.label}</div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  description?: string
  theme?: 'light' | 'dark' | 'mafia' | 'chill'
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description,
  theme = 'light' 
}: MetricCardProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return {
          bg: 'bg-gray-800/50 border border-gray-700/50',
          text: 'text-white',
          textSecondary: 'text-gray-300'
        }
      case 'mafia':
        return {
          bg: 'bg-red-950/50 border border-red-900/50',
          text: 'text-red-100',
          textSecondary: 'text-red-300'
        }
      case 'chill':
        return {
          bg: 'bg-orange-100/30 border border-orange-200/50',
          text: 'text-orange-900',
          textSecondary: 'text-orange-700'
        }
      default:
        return {
          bg: 'bg-white/60 border border-gray-200/50',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600'
        }
    }
  }

  const themeClasses = getThemeClasses()

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-500'
      case 'negative':
        return 'text-red-500'
      default:
        return themeClasses.textSecondary
    }
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 ${themeClasses.bg}`}>
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
            {icon}
          </div>
        )}
        {change !== undefined && (
          <div className={`text-sm font-medium ${getChangeColor()}`}>
            {changeType === 'positive' ? '+' : changeType === 'negative' ? '' : ''}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className={`text-2xl font-bold mb-1 ${themeClasses.text}`}>
        {value}
      </div>
      
      <div className={`text-sm font-medium ${themeClasses.text} mb-1`}>
        {title}
      </div>
      
      {description && (
        <div className={`text-xs ${themeClasses.textSecondary}`}>
          {description}
        </div>
      )}
    </div>
  )
}