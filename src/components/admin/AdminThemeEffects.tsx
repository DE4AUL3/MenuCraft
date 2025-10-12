'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AdminTheme } from './AdminHeader'

interface AdminThemeEffectsProps {
  theme: AdminTheme
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  color: string
}

export default function AdminThemeEffects({ theme }: AdminThemeEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (theme === 'light') {
      setParticles([])
      return
    }

    const generateParticles = () => {
      const newParticles: Particle[] = []
      const particleCount = theme === 'dark' ? 6 : 0
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.3 + 0.1,
          duration: Math.random() * 10 + 8,
          color: theme === 'dark'
            ? ['#4b5563', '#6b7280', '#9ca3af'][Math.floor(Math.random() * 3)]
            : '#ffffff'
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 15000)

    return () => clearInterval(interval)
  }, [theme])

  if (theme === 'light') return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-sm"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            initial={{ 
              scale: 0,
              x: 0,
              y: 0,
              opacity: 0
            }}
            animate={{
              scale: [0, 1, 0.8, 1, 0],
              x: [0, Math.random() * 200 - 100, Math.random() * 300 - 150],
              y: [0, Math.random() * 200 - 100, Math.random() * 300 - 150],
              opacity: [0, particle.opacity, particle.opacity * 0.7, particle.opacity, 0],
            }}
            transition={{
              duration: particle.duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Специальные эффекты для темной темы */}
      {theme === 'dark' && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/10 via-transparent to-gray-800/5"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-28 h-28 bg-gray-600/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
    </div>
  )
}