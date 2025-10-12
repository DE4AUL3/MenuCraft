'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Lottie будет загружаться динамически
interface LottieAnimationProps {
  animationData?: any
  width?: number
  height?: number
  loop?: boolean
  autoplay?: boolean
  onComplete?: () => void
  className?: string
}

export function LottieAnimation({
  animationData,
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  onComplete,
  className = ''
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lottie, setLottie] = useState<any>(null)

  useEffect(() => {
    // Динамическая загрузка Lottie
    import('lottie-react').then(({ default: Lottie }) => {
      setLottie(Lottie)
    })
  }, [])

  if (!lottie || !animationData) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const LottieComponent = lottie

  return (
    <div ref={containerRef} className={className} style={{ width, height }}>
      <LottieComponent
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

// Empty State Component with CSS Animation fallback
interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  animation?: 'cart' | 'search' | 'favorites' | 'orders' | 'loading'
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  animation = 'cart',
  className = ''
}: EmptyStateProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  const animationVariants = {
    cart: {
      icon: "🛒",
      gradient: "from-blue-400 to-purple-500",
      animation: "bounce"
    },
    search: {
      icon: "🔍",
      gradient: "from-green-400 to-blue-500",
      animation: "pulse"
    },
    favorites: {
      icon: "💖",
      gradient: "from-pink-400 to-red-500",
      animation: "heartbeat"
    },
    orders: {
      icon: "📋",
      gradient: "from-yellow-400 to-orange-500",
      animation: "shake"
    },
    loading: {
      icon: "⌛",
      gradient: "from-gray-400 to-gray-600",
      animation: "spin"
    }
  }

  const config = animationVariants[animation]

  const handleActionClick = () => {
    setShowConfetti(true)
    action?.onClick()
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'][i % 6],
                  left: '50%',
                  top: '50%'
                }}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Animation */}
      <motion.div
        className={`text-8xl mb-6 bg-gradient-to-br ${config.gradient} bg-clip-text text-transparent`}
        animate={{
          ...(config.animation === 'bounce' && {
            y: [0, -20, 0],
            transition: { duration: 2, repeat: Infinity }
          }),
          ...(config.animation === 'pulse' && {
            scale: [1, 1.1, 1],
            transition: { duration: 2, repeat: Infinity }
          }),
          ...(config.animation === 'heartbeat' && {
            scale: [1, 1.2, 1, 1.2, 1],
            transition: { duration: 1.5, repeat: Infinity }
          }),
          ...(config.animation === 'shake' && {
            x: [0, -5, 5, -5, 5, 0],
            transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
          }),
          ...(config.animation === 'spin' && {
            rotate: 360,
            transition: { duration: 2, repeat: Infinity, ease: "linear" }
          })
        }}
      >
        {config.icon}
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.h2
        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h2>

      <motion.p
        className="text-gray-600 dark:text-gray-400 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {action && (
        <motion.button
          onClick={handleActionClick}
          className={`px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-yellow-500/20 rounded-full blur-xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </motion.div>
  )
}

// Success Celebration Component
interface SuccessAnimationProps {
  show: boolean
  onComplete?: () => void
  type?: 'success' | 'achievement' | 'levelup' | 'order'
  message?: string
}

export function SuccessAnimation({ 
  show, 
  onComplete, 
  type = 'success',
  message = 'Успешно!'
}: SuccessAnimationProps) {
  const [confettiActive, setConfettiActive] = useState(false)

  useEffect(() => {
    if (show) {
      setConfettiActive(true)
      const timer = setTimeout(() => {
        setConfettiActive(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  const typeConfig = {
    success: { icon: "✅", color: "from-green-400 to-emerald-500", particles: 30 },
    achievement: { icon: "🏆", color: "from-yellow-400 to-orange-500", particles: 50 },
    levelup: { icon: "⭐", color: "from-purple-400 to-pink-500", particles: 40 },
    order: { icon: "🎉", color: "from-blue-400 to-cyan-500", particles: 35 }
  }

  const config = typeConfig[type]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Main celebration */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
          >
            {/* Icon */}
            <motion.div
              className="text-8xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 2
              }}
            >
              {config.icon}
            </motion.div>

            {/* Message */}
            <motion.h2
              className={`text-3xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent mb-2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.h2>

            {/* Pulse rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white rounded-full`}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 2, 4],
                  opacity: [1, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>

          {/* Confetti */}
          {confettiActive && (
            <div className="absolute inset-0">
              {[...Array(config.particles)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#A8E6CF'][i % 7],
                    left: '50%',
                    top: '50%'
                  }}
                  initial={{ 
                    scale: 0,
                    x: 0,
                    y: 0,
                    rotate: 0
                  }}
                  animate={{ 
                    scale: [0, 1, 0.5, 0],
                    x: (Math.random() - 0.5) * 800,
                    y: (Math.random() - 0.5) * 600,
                    rotate: Math.random() * 720
                  }}
                  transition={{ 
                    duration: 3,
                    ease: "easeOut",
                    delay: Math.random() * 0.5
                  }}
                />
              ))}
            </div>
          )}

          {/* Fireworks */}
          {type === 'achievement' && (
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: `${20 + (i % 2) * 60}%`
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: 2
                  }}
                >
                  <div className="text-4xl">💥</div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Loading States with Micro-interactions
export function MicroLoadingStates() {
  const [activeState, setActiveState] = useState<string | null>(null)

  const loadingStates = [
    {
      id: 'dots',
      name: 'Bouncing Dots',
      component: (
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      )
    },
    {
      id: 'pulse',
      name: 'Pulse Wave',
      component: (
        <div className="relative w-16 h-16">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border-2 border-purple-500 rounded-full"
              animate={{
                scale: [0, 2],
                opacity: [1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6
              }}
            />
          ))}
        </div>
      )
    },
    {
      id: 'morphing',
      name: 'Morphing Shape',
      component: (
        <motion.div
          className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500"
          animate={{
            borderRadius: ['0%', '50%', '0%'],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {loadingStates.map((state) => (
        <motion.div
          key={state.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          onClick={() => setActiveState(activeState === state.id ? null : state.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h3 className="font-semibold mb-4">{state.name}</h3>
          <div className="flex justify-center items-center h-20">
            {activeState === state.id ? state.component : (
              <div className="text-gray-400">Клик для анимации</div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}