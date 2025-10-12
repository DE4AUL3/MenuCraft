'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  duration?: number
  once?: boolean
}

export default function AnimatedContainer({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true
}: AnimatedContainerProps) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: once
  })

  const variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: 30 }),
      ...(direction === 'down' && { y: -30 }),
      ...(direction === 'left' && { x: 30 }),
      ...(direction === 'right' && { x: -30 }),
      ...(direction === 'scale' && { scale: 0.8 }),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}