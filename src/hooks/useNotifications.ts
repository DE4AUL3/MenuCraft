'use client'

import { useState, useCallback } from 'react'
import { generateId } from '@/lib/utils'
import { Notification, NotificationType } from '@/components/ui/NotificationContainer'

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = generateId()
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration
    }

    setNotifications(prev => [...prev, notification])
    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Convenience methods
  const showSuccess = useCallback((title: string, message?: string) => {
    return addNotification('success', title, message)
  }, [addNotification])

  const showError = useCallback((title: string, message?: string) => {
    return addNotification('error', title, message)
  }, [addNotification])

  const showWarning = useCallback((title: string, message?: string) => {
    return addNotification('warning', title, message)
  }, [addNotification])

  const showInfo = useCallback((title: string, message?: string) => {
    return addNotification('info', title, message)
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}