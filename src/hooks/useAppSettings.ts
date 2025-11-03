'use client'

import { useState, useEffect } from 'react'

interface AppSetting {
  value: string
  description?: string | null
}

interface AppSettings {
  [key: string]: AppSetting
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }
      const data = await response.json()
      setSettings(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const getSetting = (key: string, defaultValue: string = ''): string => {
    return settings[key]?.value || defaultValue
  }

  const getSettingAsNumber = (key: string, defaultValue: number = 0): number => {
    const value = settings[key]?.value
    if (!value) return defaultValue
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  const updateSetting = async (key: string, value: string, description?: string) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, description }),
      })

      if (!response.ok) {
        throw new Error('Failed to update setting')
      }

      const updatedSetting = await response.json()
      setSettings(prev => ({
        ...prev,
        [key]: {
          value: updatedSetting.value,
          description: updatedSetting.description
        }
      }))

      return true
    } catch (err) {
      console.error('Error updating setting:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  return {
    settings,
    isLoading,
    error,
    getSetting,
    getSettingAsNumber,
    updateSetting,
    refetch: fetchSettings
  }
}