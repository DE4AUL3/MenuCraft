'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { ReactNode } from 'react'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastNotificationProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const toastStyles = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-700',
    icon: 'text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-900 dark:text-emerald-100'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-200 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    border: 'border-yellow-200 dark:border-yellow-700',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100'
  }
}

export default function ToastNotification({ toast, onDismiss }: ToastNotificationProps) {
  const Icon = toastIcons[toast.type]
  const styles = toastStyles[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-md shadow-lg max-w-md w-full
        ${styles.bg} ${styles.border}
      `}
    >
      {/* Progress bar */}
      {toast.duration && (
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <Icon className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${styles.text}`}>
              {toast.title}
            </h4>
            {toast.message && (
              <p className={`mt-1 text-sm opacity-90 ${styles.text}`}>
                {toast.message}
              </p>
            )}
            
            {/* Action button */}
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className={`mt-2 text-sm font-medium underline ${styles.icon} hover:no-underline`}
              >
                {toast.action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => onDismiss(toast.id)}
            className={`flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${styles.text}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <div className={`w-full h-full rounded-full ${styles.icon.replace('text-', 'bg-')} blur-xl`} />
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}