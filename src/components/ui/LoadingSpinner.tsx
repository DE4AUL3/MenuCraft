'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'accent' | 'rainbow'
  text?: string
  children?: ReactNode
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const variants = {
  primary: 'border-blue-200 border-t-blue-600',
  secondary: 'border-gray-200 border-t-gray-600',
  accent: 'border-purple-200 border-t-purple-600',
  rainbow: 'border-transparent'
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary', 
  text,
  children 
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {variant === 'rainbow' ? (
          // Rainbow gradient spinner
          <motion.div
            className={`${sizes[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full" />
          </motion.div>
        ) : (
          // Standard spinner
          <motion.div
            className={`${sizes[size]} border-2 ${variants[variant]} rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Pulse effect */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} border-2 border-blue-400 rounded-full opacity-30`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Loading text */}
      {text && (
        <motion.p
          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}

      {/* Children content */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

// Skeleton loader component
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  animation?: 'pulse' | 'wave'
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse' 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'shimmer-effect'
  }

  return (
    <div 
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${animationClasses[animation]} 
        ${className}
      `} 
    />
  )
}

// Page loading component with full screen overlay
interface PageLoadingProps {
  text?: string
  onCancel?: () => void
}

export function PageLoading({ text = "Загрузка...", onCancel }: PageLoadingProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm w-full mx-4"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <LoadingSpinner size="lg" variant="rainbow" text={text} />
        
        {onCancel && (
          <motion.button
            onClick={onCancel}
            className="mt-6 w-full py-2 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Отменить
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}

// Loading dots animation
export function LoadingDots({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSizes[size]} bg-current rounded-full`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}