'use client'

import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}

interface NotificationProps extends Notification {
  onClose: (id: string) => void
}

function NotificationItem({ id, type, title, message, duration = 5000, onClose }: NotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }

  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  }

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  const Icon = icons[type]

  return (
    <div className={`
      relative p-4 rounded-xl border shadow-lg backdrop-blur-sm
      ${colors[type]}
      transform transition-all duration-300 ease-out
      animate-slide-in-right
    `}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && (
            <p className="text-sm opacity-90 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors duration-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: Notification[]
  onClose: (id: string) => void
}

export default function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          {...notification}
          onClose={onClose}
        />
      ))}
    </div>
  )
}