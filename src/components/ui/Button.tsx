'use client'

import { motion } from 'framer-motion'
import { ReactNode, forwardRef, useState } from 'react'
import { LoadingDots } from './LoadingSpinner'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'neon' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  animate?: boolean
  glow?: boolean
  pulse?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
  animate = true,
  glow = false,
  pulse = false
}, ref) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-300 ease-in-out overflow-hidden
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl'
  }

  const variantClasses = {
    primary: `
      bg-blue-600 hover:bg-blue-700 text-white
      focus:ring-blue-500 shadow-lg hover:shadow-xl
      ${glow ? 'shadow-blue-500/25 hover:shadow-blue-500/40' : ''}
    `,
    secondary: `
      bg-gray-600 hover:bg-gray-700 text-white
      focus:ring-gray-500 shadow-lg hover:shadow-xl
      ${glow ? 'shadow-gray-500/25 hover:shadow-gray-500/40' : ''}
    `,
    outline: `
      border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white
      focus:ring-blue-500 bg-transparent hover:shadow-lg
      ${glow ? 'hover:shadow-blue-500/25' : ''}
    `,
    ghost: `
      text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20
      focus:ring-blue-500 bg-transparent
    `,
    gradient: `
      bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
      hover:from-blue-700 hover:via-purple-700 hover:to-pink-700
      text-white focus:ring-purple-500 shadow-lg hover:shadow-xl
      ${glow ? 'shadow-purple-500/25 hover:shadow-purple-500/40' : ''}
    `,
    neon: `
      bg-black border-2 border-cyan-400 text-cyan-400 
      hover:bg-cyan-400 hover:text-black hover:shadow-cyan-400/50
      focus:ring-cyan-400 shadow-lg hover:shadow-xl
      neon-glow
    `,
    glass: `
      glass-card text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-white/10
      focus:ring-white/50 backdrop-blur-lg border border-white/20
    `
  }

  const motionProps = animate ? {
    whileHover: { 
      scale: disabled || loading ? 1 : 1.05,
      y: disabled || loading ? 0 : -2
    },
    whileTap: { 
      scale: disabled || loading ? 1 : 0.95,
      y: disabled || loading ? 0 : 0
    }
  } : {}

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${pulse ? 'pulse-ring' : ''}
        ${className}
      `}
      {...motionProps}
    >
      {/* Background animation */}
      {variant === 'gradient' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        />
      )}

      {/* Shimmer effect */}
      {variant === 'neon' && (
        <div className="absolute inset-0 shimmer-effect opacity-0 hover:opacity-100 transition-opacity duration-300" />
      )}

      {/* Ripple effect container */}
      <span className="relative z-10 flex items-center gap-2">
        {/* Left icon */}
        {leftIcon && !loading && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {leftIcon}
          </motion.span>
        )}

        {/* Loading spinner */}
        {loading && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <LoadingDots size="sm" />
          </motion.span>
        )}

        {/* Button text */}
        <motion.span
          className={loading ? 'opacity-0' : 'opacity-100'}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Right icon */}
        {rightIcon && !loading && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {rightIcon}
          </motion.span>
        )}
      </span>

      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-inherit opacity-20 blur-lg"
          style={{
            background: 'inherit',
            filter: 'blur(8px)'
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button

// Floating Action Button
interface FABProps {
  onClick: () => void
  icon: ReactNode
  label?: string
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function FloatingActionButton({
  onClick,
  icon,
  label,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right'
}: FABProps) {
  const [isHovered, setIsHovered] = useState(false)

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  }

  const sizeClasses = {
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  }

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-gray-500/25',
    accent: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25'
  }

  return (
    <div className={positionClasses[position]}>
      <motion.button
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          ${sizeClasses[size]} ${variantClasses[variant]}
          rounded-full shadow-2xl hover:shadow-3xl z-50
          flex items-center justify-center
          focus:outline-none focus:ring-4 focus:ring-opacity-50
          transition-all duration-300
        `}
        whileHover={{ 
          scale: 1.1,
          y: -4,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.5
        }}
      >
        <motion.div
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
      </motion.button>

      {/* Tooltip */}
      {label && (
        <motion.div
          className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, x: 10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </motion.div>
      )}
    </div>
  )
}

// Button Group
interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md' | 'lg'
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal', 
  spacing = 'sm' 
}: ButtonGroupProps) {
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  return (
    <motion.div
      className={`
        flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} 
        ${spacingClasses[spacing]}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        staggerChildren: 0.1 
      }}
    >
      {children}
    </motion.div>
  )
}