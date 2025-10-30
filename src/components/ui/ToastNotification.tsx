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
    bg: 'bg-success/10',
    border: 'border-success',
    icon: 'text-success',
    text: 'text-success'
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    icon: 'text-red-600',
    text: 'text-red-900'
  },
  warning: {
    bg: 'bg-accent/10',
    border: 'border-accent',
    icon: 'text-accent',
    text: 'text-accent'
  },
  info: {
    bg: 'bg-primary/10',
    border: 'border-primary',
    icon: 'text-primary',
    text: 'text-primary'
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
          className="absolute top-0 left-0 h-1 bg-linear-to-r from-blue-500 to-purple-500"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`shrink-0 ${styles.icon}`}>
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
            className={`shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${styles.text}`}
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