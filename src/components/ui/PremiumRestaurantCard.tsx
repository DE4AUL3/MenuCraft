'use client'

import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { Star, Clock, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import { Restaurant } from '@/types/restaurant'
import { useLanguage } from '@/hooks/useLanguage'
import { getText } from '@/i18n/translations'

interface PremiumRestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
  index: number
}

export default function PremiumRestaurantCard({ 
  restaurant, 
  onClick, 
  index 
}: PremiumRestaurantCardProps) {
  const { currentLanguage } = useLanguage()

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      rotateX: -15
    },
    visible: { 
      opacity: 1,
      y: 0,
      rotateX: 0
    }
  }

  const imageVariants = {
    rest: { scale: 1, rotateY: 0 },
    hover: { 
      scale: 1.05,
      rotateY: 5,
      transition: { duration: 0.3 }
    }
  }

  const overlayVariants = {
    rest: { opacity: 0 },
    hover: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  const isOpen = restaurant.isOpen

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="w-full max-w-sm mx-auto"
    >
      <Tilt
        className="transform-gpu"
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        perspective={1000}
        scale={1.02}
        transitionSpeed={400}
        gyroscope={true}
      >
        <motion.div
          className="relative group cursor-pointer"
          onClick={onClick}
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          {/* Главная карточка с glass effect */}
          <div className="relative overflow-hidden rounded-3xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl">
            
            {/* Голографический border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />
            
            {/* Изображение с параллакс эффектом */}
            <div className="relative h-48 overflow-hidden">
              <motion.div
                variants={imageVariants}
                className="relative h-full w-full"
              >
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Градиентный overlay */}
                <motion.div
                  variants={overlayVariants}
                  className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                />
              </motion.div>

              {/* Статус badge с анимацией */}
              <motion.div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                  isOpen 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                    : 'bg-red-500/20 text-red-300 border border-red-400/30'
                }`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
                  {isOpen ? getText('open', currentLanguage) : getText('closed', currentLanguage)}
                </div>
              </motion.div>

              {/* Floating rating */}
              <motion.div
                className="absolute top-4 left-4 px-2 py-1 rounded-lg bg-black/30 backdrop-blur-md text-white text-sm font-bold"
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {restaurant.rating}
                </div>
              </motion.div>
            </div>

            {/* Контент карточки */}
            <div className="p-6 space-y-4">
              {/* Название с анимацией */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {currentLanguage === 'tk' ? restaurant.descriptionTk : restaurant.description}
                </p>
              </motion.div>

              {/* Информация */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">🍽️</span>
                  </div>
                  {restaurant.cuisine}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {currentLanguage === 'tk' ? restaurant.deliveryTimeTk : restaurant.deliveryTime}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="truncate">{restaurant.address}</span>
                </div>
              </motion.div>

              {/* CTA Button с hover эффектом */}
              <motion.button
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm relative overflow-hidden group/btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                
                <span className="relative z-10">
                  {getText('viewMenu', currentLanguage)}
                </span>

                {/* Floating particles effect */}
                <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`
                      }}
                      animate={{
                        y: [-10, -20, -10],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.button>
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                filter: 'blur(20px)',
                transform: 'scale(1.1)'
              }}
            />
          </div>
        </motion.div>
      </Tilt>
    </motion.div>
  )
}