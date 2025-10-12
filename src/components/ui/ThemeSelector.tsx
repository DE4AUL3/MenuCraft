'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/PremiumCard'

interface ThemeSelectorProps {
  className?: string
}

export default function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'panda' | 'han' | 'sweet'>('light')

  const themes = [
    {
      id: 'light',
      name: 'Светлая',
      description: 'Классическая светлая тема',
      colors: ['#ffffff', '#f8fafc', '#3b82f6', '#10b981'],
      preview: 'bg-white border-gray-200'
    },
    {
      id: 'dark',
      name: 'Темная',
      description: 'Современная темная тема',
      colors: ['#0f172a', '#1e293b', '#3b82f6', '#8b5cf6'],
      preview: 'bg-gray-900 border-gray-700'
    },
    {
      id: 'panda',
      name: 'Panda Express',
      description: 'Фирменная тема ресторана',
      colors: ['#0f0f0f', '#1a1a1a', '#3b82f6', '#ffffff'],
      preview: 'bg-black border-gray-800'
    },
    {
      id: 'han',
      name: 'Han Tagam',
      description: 'Элегантная восточная тема',
      colors: ['#fefefe', '#ffffff', '#10b981', '#1f2937'],
      preview: 'bg-white border-green-200'
    },
    {
      id: 'sweet',
      name: 'Sweet',
      description: 'Нежная розовая тема',
      colors: ['#fdf2f8', '#ffffff', '#ec4899', '#831843'],
      preview: 'bg-pink-50 border-pink-200'
    }
  ]

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as any
    if (savedTheme && themes.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (themeId: string) => {
    const root = document.documentElement
    
    // Удаляем все существующие классы тем
    root.classList.remove('dark', 'theme-panda', 'theme-han', 'theme-sweet')
    document.body.classList.remove('theme-panda', 'theme-han', 'theme-sweet')
    
    switch (themeId) {
      case 'dark':
        root.classList.add('dark')
        break
      case 'panda':
        root.classList.add('dark')
        document.body.classList.add('theme-panda')
        break
      case 'han':
        document.body.classList.add('theme-han')
        break
      case 'sweet':
        document.body.classList.add('theme-sweet')
        break
      default:
        // light theme - no additional classes needed
        break
    }
    
    localStorage.setItem('theme', themeId)
    setCurrentTheme(themeId as any)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Palette size={18} />}
        className="relative"
      >
        <span className="hidden md:inline">Тема</span>
        {currentTheme !== 'light' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-white" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Оверлей */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Панель выбора тем */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <Card variant="glass" className="p-6 w-80 max-w-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Выбор темы
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {themes.map((theme) => (
                    <motion.button
                      key={theme.id}
                      onClick={() => {
                        applyTheme(theme.id)
                        setIsOpen(false)
                      }}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        currentTheme === theme.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {theme.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {theme.description}
                          </div>
                          
                          {/* Превью цветов */}
                          <div className="flex gap-1">
                            {theme.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {currentTheme === theme.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Тема сохраняется автоматически
                  </p>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}