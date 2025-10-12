'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SwipeCarouselProps {
  children: React.ReactNode[]
  className?: string
  showArrows?: boolean
  showDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  infinite?: boolean
  itemsPerView?: number
  gap?: number
}

export default function SwipeCarousel({
  children,
  className = '',
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  infinite = true,
  itemsPerView = 1,
  gap = 20
}: SwipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  
  const totalItems = children.length
  const maxIndex = infinite ? totalItems : totalItems - itemsPerView

  // Auto play effect
  useState(() => {
    if (!autoPlay) return
    
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex(prev => 
          infinite 
            ? (prev + 1) % totalItems
            : Math.min(prev + 1, maxIndex - 1)
        )
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  })

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex - 1)))
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      infinite 
        ? (prev - 1 + totalItems) % totalItems
        : Math.max(prev - 1, 0)
    )
  }

  const goToNext = () => {
    setCurrentIndex(prev => 
      infinite 
        ? (prev + 1) % totalItems
        : Math.min(prev + 1, maxIndex - 1)
    )
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    const threshold = 50
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (offset > 0 || velocity > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  const itemWidth = 100 / itemsPerView
  const translateX = -currentIndex * (itemWidth + (gap / itemsPerView))

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main carousel container */}
      <div ref={constraintsRef} className="relative w-full h-full overflow-hidden">
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ gap: `${gap}px` }}
          animate={{ 
            x: `${translateX}%`,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          }}
          drag="x"
          dragConstraints={constraintsRef}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          dragElastic={0.1}
          whileTap={{ cursor: "grabbing" }}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 select-none"
              style={{ width: `${itemWidth}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: index * 0.1 }
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <motion.button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </motion.button>

          <motion.button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {Array.from({ length: Math.ceil(totalItems / itemsPerView) }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? 'bg-blue-500 w-6'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </motion.div>
      )}

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ 
          width: `${((currentIndex + 1) / totalItems) * 100}%`,
          transition: { duration: 0.3 }
        }}
      />
    </div>
  )
}

// 3D Carousel Component
interface ThreeDCarouselProps {
  children: React.ReactNode[]
  className?: string
  radius?: number
  perspective?: number
}

export function ThreeDCarousel({
  children,
  className = '',
  radius = 300,
  perspective = 1000
}: ThreeDCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const totalItems = children.length

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
    }
  }

  return (
    <div 
      className={`relative w-full h-96 ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d cursor-grab active:cursor-grabbing"
        style={{ transformStyle: 'preserve-3d' }}
        drag="x"
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
      >
        {children.map((child, index) => {
          const angle = (360 / totalItems) * index
          const rotateY = angle - (360 / totalItems) * currentIndex
          const isActive = index === currentIndex

          return (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2 w-64 h-80 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                transformStyle: 'preserve-3d'
              }}
              animate={{
                rotateY: rotateY,
                z: isActive ? 50 : 0,
                scale: isActive ? 1.1 : 0.9,
                opacity: isActive ? 1 : 0.7
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ 
                scale: isActive ? 1.15 : 1,
                z: isActive ? 70 : 20
              }}
            >
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform-gpu">
                {child}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <motion.button
          onClick={goToPrevious}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <motion.button
          onClick={goToNext}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-3 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Dots */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {children.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </div>
  )
}