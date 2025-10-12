'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { Heart, Share2, MoreHorizontal, ExternalLink } from 'lucide-react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'hover' | 'glass' | 'gradient' | 'neon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  onClick?: () => void
  className?: string
  animate?: boolean
  hoverable?: boolean
}

export function Card({
  children,
  variant = 'default',
  size = 'md',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  onClick,
  className = '',
  animate = true,
  hoverable = true
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const baseClasses = `
    relative overflow-hidden transition-all duration-300
    ${onClick ? 'cursor-pointer' : ''}
  `

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  }

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
    '2xl': 'shadow-2xl hover:shadow-3xl'
  }

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    hover: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600',
    glass: 'glass-card border border-white/20',
    gradient: 'bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 border border-gray-200 dark:border-gray-700',
    neon: 'bg-gray-900 border-2 border-cyan-400 neon-glow'
  }

  const motionProps = animate ? {
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    whileHover: hoverable ? { 
      y: -4,
      scale: 1.02
    } : {},
    whileTap: onClick ? { scale: 0.98 } : {},
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  } : {}

  return (
    <motion.div
      onClick={onClick}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${variantClasses[variant]}
        ${className}
      `}
      {...motionProps}
    >
      {/* Background effects */}
      {variant === 'gradient' && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Shimmer effect */}
      {variant === 'neon' && (
        <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-20 transition-opacity duration-300" />
      )}
    </motion.div>
  )
}

// Product Card Component
interface ProductCardProps {
  image: string
  title: string
  price: string
  originalPrice?: string
  discount?: string
  rating?: number
  reviews?: number
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onShare?: () => void
  onClick?: () => void
  badge?: string
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
}

export function ProductCard({
  image,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviews,
  isFavorite = false,
  onFavoriteToggle,
  onShare,
  onClick,
  badge,
  badgeColor = 'red'
}: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const badgeColors = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    purple: 'bg-purple-500 text-white'
  }

  return (
    <Card 
      variant="hover" 
      padding="none" 
      onClick={onClick}
      className="max-w-sm group"
    >
      {/* Image container */}
      <div className="relative overflow-hidden rounded-t-xl">
        {/* Badge */}
        {badge && (
          <motion.div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold z-20 ${badgeColors[badgeColor]}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {badge}
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          {onFavoriteToggle && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onFavoriteToggle()
              }}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.button>
          )}

          {onShare && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation()
                onShare()
              }}
              className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-all duration-200 backdrop-blur-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 size={16} />
            </motion.button>
          )}
        </div>

        {/* Image */}
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-full" />
            </div>
          )}
          
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <motion.h3
          className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h3>

        {/* Rating */}
        {rating && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            {reviews && (
              <span className="text-xs text-gray-500">({reviews})</span>
            )}
          </motion.div>
        )}

        {/* Price */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
          
          {discount && (
            <span className="text-sm font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
              -{discount}
            </span>
          )}
        </motion.div>
      </div>
    </Card>
  )
}

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'blue'
}: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600'
  }

  const changeColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-gray-600 bg-gray-100'
  }

  return (
    <Card variant="default" className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-xl`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          
          <motion.p
            className="text-2xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {value}
          </motion.p>
          
          {change && (
            <motion.span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {change}
            </motion.span>
          )}
        </div>

        {icon && (
          <motion.div
            className={`p-3 bg-gradient-to-br ${colorClasses[color]} text-white rounded-lg`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
          >
            {icon}
          </motion.div>
        )}
      </div>
    </Card>
  )
}