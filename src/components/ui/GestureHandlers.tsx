'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, PanInfo } from 'framer-motion'

// Long Press Hook
export function useLongPress(
  onLongPress: () => void,
  onShortPress?: () => void,
  duration = 500
) {
  const [isPressed, setIsPressed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    setIsPressed(true)
    timerRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, duration)
  }, [onLongPress, duration])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (isPressed && onShortPress) {
      onShortPress()
    }
    setIsPressed(false)
  }, [isPressed, onShortPress])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    isPressed
  }
}

// Pinch to Zoom Component
interface PinchZoomProps {
  children: React.ReactNode
  maxZoom?: number
  minZoom?: number
  className?: string
}

export function PinchZoom({ 
  children, 
  maxZoom = 3, 
  minZoom = 1, 
  className = '' 
}: PinchZoomProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newScale = Math.min(maxZoom, Math.max(minZoom, scale * delta))
    setScale(newScale)
  }, [scale, maxZoom, minZoom])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (scale > 1) {
      setPosition(prev => ({
        x: prev.x + info.offset.x,
        y: prev.y + info.offset.y
      }))
    }
  }, [scale])

  const resetZoom = useCallback(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full origin-center cursor-grab active:cursor-grabbing"
        style={{ scale, x: position.x, y: position.y }}
        onWheel={handleWheel}
        drag={scale > 1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        dragElastic={0.1}
        whileTap={{ scale: scale * 1.02 }}
        animate={{
          scale,
          x: position.x,
          y: position.y
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>

      {/* Reset button */}
      {scale > 1 && (
        <motion.button
          onClick={resetZoom}
          className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Сбросить
        </motion.button>
      )}

      {/* Zoom indicator */}
      {scale > 1 && (
        <motion.div
          className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(scale * 100)}%
        </motion.div>
      )}
    </div>
  )
}

// Pull to Refresh Component
interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  className?: string
  threshold?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  className = '',
  threshold = 100
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(info.offset.y, threshold * 1.5))
    }
  }, [threshold])

  const handleDragEnd = useCallback(async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh])

  const pullProgress = Math.min(pullDistance / threshold, 1)

  return (
    <div className={`relative ${className}`}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-b from-blue-500 to-purple-500 text-white z-10"
        style={{ height: pullDistance }}
        animate={{ opacity: pullDistance > 0 ? 1 : 0 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2"
          animate={{ 
            opacity: pullDistance > 20 ? 1 : 0,
            y: pullDistance > 20 ? 0 : -20
          }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-white rounded-full border-t-transparent"
            animate={{ 
              rotate: isRefreshing ? 360 : pullProgress * 360 
            }}
            transition={{ 
              duration: isRefreshing ? 1 : 0,
              repeat: isRefreshing ? Infinity : 0,
              ease: "linear"
            }}
          />
          <span className="text-sm font-medium">
            {isRefreshing 
              ? 'Обновляем...' 
              : pullDistance > threshold 
                ? 'Отпустите для обновления'
                : 'Потяните для обновления'
            }
          </span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y: isRefreshing ? threshold : pullDistance }}
        animate={{ y: isRefreshing ? threshold : pullDistance }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Drag and Drop Component
interface DragDropProps {
  children: React.ReactNode
  onDrop?: (item: any) => void
  dragData?: any
  className?: string
  isDraggable?: boolean
  isDropZone?: boolean
}

export function DragDrop({
  children,
  onDrop,
  dragData,
  className = '',
  isDraggable = false,
  isDropZone = false
}: DragDropProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isOver, setIsOver] = useState(false)

  const handleDragStart = useCallback(() => {
    if (isDraggable) {
      setIsDragging(true)
    }
  }, [isDraggable])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    
    if (isDropZone && Math.abs(info.offset.x) > 50) {
      onDrop?.(dragData)
    }
  }, [isDropZone, onDrop, dragData])

  return (
    <motion.div
      className={`${className} ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      drag={isDraggable}
      dragConstraints={{ left: -200, right: 200, top: -50, bottom: 50 }}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ 
        scale: 1.05, 
        rotate: 5,
        zIndex: 1000,
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
      }}
      animate={{
        scale: isDragging ? 1.05 : 1,
        opacity: isDragging ? 0.9 : 1
      }}
      onHoverStart={() => isDropZone && setIsOver(true)}
      onHoverEnd={() => isDropZone && setIsOver(false)}
    >
      {/* Drop zone indicator */}
      {isDropZone && (
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-lg pointer-events-none"
          animate={{ 
            opacity: isOver ? 1 : 0,
            scale: isOver ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {children}
      
      {/* Drag indicator */}
      {isDraggable && (
        <motion.div
          className="absolute top-2 right-2 text-gray-400 pointer-events-none"
          animate={{ opacity: isDragging ? 0 : 1 }}
        >
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="w-1 h-1 bg-current rounded-full" />
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Context Menu Component
interface ContextMenuProps {
  children: React.ReactNode
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    destructive?: boolean
  }>
  className?: string
}

export function ContextMenu({ children, items, className = '' }: ContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const longPressProps = useLongPress(
    () => {
      // Show context menu
    },
    () => {
      // Regular click
    }
  )

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }, [])

  const handleItemClick = useCallback((onClick: () => void) => {
    onClick()
    setShowMenu(false)
  }, [])

  return (
    <>
      <div
        className={className}
        onContextMenu={handleContextMenu}
        {...longPressProps}
      >
        {children}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowMenu(false)}
          />
          <motion.div
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-48"
            style={{ left: menuPosition.x, top: menuPosition.y }}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {items.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  item.destructive ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </>
  )
}