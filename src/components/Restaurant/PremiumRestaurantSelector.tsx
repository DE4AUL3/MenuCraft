'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, ChefHat } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { getText } from '@/i18n/translations';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { getAppThemeColors } from '@/styles/appTheme';
import Image from 'next/image';

interface Restaurant {
  id: string;
  name: string;
  logo: string;
  description: string;
  descriptionTk: string;
  cuisine: string;
  rating: number;
  phone: string;
  address: string;
  image: string;
  gradient: string;
  features: string[];
  isOpen: boolean;
  deliveryTime: string;
  deliveryTimeTk: string;
  openingHours?: string;
}

const defaultRestaurants: Restaurant[] = [
  {
    id: 'panda-burger',
    name: 'Panda Burger',
    logo: '/panda_logo.png',
    description: 'Сочные бургеры и американская кухня премиум-класса',
    descriptionTk: 'Damsly burgerler we ýokary derejeli amerikan aşhanasy',
    cuisine: 'Американская кухня',
    rating: 4.8,
    phone: '+993 (12) 123-45-67',
    address: 'г. Ашхабад, ул. Нейтральности, 15',
    image: '/panda_logo.png',
    gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
    features: ['Быстрая доставка', 'WiFi', 'QR заказ', 'Премиум качество'],
    isOpen: true,
    openingHours: '08:00 - 22:00',
    deliveryTime: '20-30 мин',
    deliveryTimeTk: '20-30 min'
  },
  {
    id: 'han-tagam',
    name: 'Han Tagam',
    logo: '/images/han-tagam-logo.png',
    description: 'Традиционная туркменская кухня премиум-класса',
    descriptionTk: 'Ýokary derejeli adaty türkmen aşhanasy',
    cuisine: 'Туркменская кухня',
    rating: 4.9,
    phone: '+993 (12) 654-32-10',
    address: 'г. Ашхабад, ул. Турkmенистана, 25',
  image: '/images/han-tagam-logo.png',
    gradient: 'from-amber-500 via-yellow-500 to-amber-700',
    features: ['Национальные блюда', 'Халяль', 'QR заказ', 'Элитное обслуживание'],
    isOpen: true,
    openingHours: '09:00 - 23:00',
    deliveryTime: '25-35 мин',
    deliveryTimeTk: '25-35 min'
  }
];

export default function PremiumRestaurantSelector() {
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const { isDarkMode, setRestaurant } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
    // Статический список — используем готовые карточки
    setRestaurants(defaultRestaurants);

    // Prefetch internal routes to speed up navigation
    try {
      defaultRestaurants.forEach(r => {
        const path = `/menu/${r.id}`;
        if (path.startsWith('/') && typeof (router as any).prefetch === 'function') {
          ;(router as any).prefetch(path)
        }
      })
    } catch (e) {
      // ignore
    }
  }, []);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedId(restaurant.id);
    setRestaurant(restaurant.id);
    
    if (restaurant.id === 'han-tagam') {
      // Переход на другой домен
      window.location.href = 'https://hantagam.com';
    } else {
      // Переход внутри Panda Burger
      router.push('/menu');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  };

  // Используем panda-dark тему
  const themeColors = getAppThemeColors('panda-dark');
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: themeColors.primary.background,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
  <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{background: themeColors.secondary.background, opacity: 0.05}}></div>
  <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000" style={{background: themeColors.secondary.surface, opacity: 0.05}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        
        {/* Header Section */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.8,
            ease: "easeOut"
          }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-2xl lg:text-4xl font-black mb-4"
            style={{ color: themeColors.primary.text }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {getText('selectRestaurant', currentLanguage)}
          </motion.h1>
          
          <motion.p 
            className="text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: themeColors.secondary.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Выберите ресторан и окунитесь в мир изысканных вкусов
          </motion.p>
        </motion.div>

        {/* Restaurants Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
        >
          {restaurants.map((restaurant, index) => (
            <AnimatedContainer
              key={restaurant.id}
              delay={index * 0.2}
              direction="up"
              className="group cursor-pointer"
            >
              <motion.div
                className="relative overflow-hidden rounded-3xl backdrop-blur-sm border hover:shadow-2xl transition-all duration-500"
                style={{
                  background: selectedId === restaurant.id
                    ? themeColors.primary.background
                    : themeColors.primary.background,
                  borderColor: themeColors.secondary.border,
                  boxShadow: selectedId === restaurant.id ? `0 0 0 4px ${"#d4af37"}` : undefined
                }}
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRestaurantSelect(restaurant)}
              >
                  
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 z-20 px-3 py-2 rounded-full text-xs font-bold ${
                    restaurant.isOpen 
                      ? 'bg-green-500/90 text-white' 
                      : 'bg-red-500/90 text-white'
                  } backdrop-blur-sm shadow-lg`}>
                    {restaurant.isOpen ? (getText('open', currentLanguage) || 'Открыт') : (getText('closed', currentLanguage) || 'Закрыт')}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-6 left-6 z-20 px-3 py-2 rounded-full bg-black/70 backdrop-blur-md text-white shadow-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{restaurant.rating}</span>
                    </div>
                  </div>

                  {/* Image with overlay */}
                  <div className="relative h-64 lg:h-80 overflow-hidden">
                    <Image
                      src={restaurant.image}
                      alt={restaurant.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index < 2}
                    />
                    
                    {/* Image overlays removed to show photos without dark or shiny effect */}
                  </div>

                  {/* Content */}
                    <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {restaurant.logo && (
                            <div className="w-10 h-10 rounded-full bg-white p-2 shadow-md">
                              <Image
                                src={restaurant.logo}
                                alt={`${restaurant.name} logo`}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <h3 className="text-xl lg:text-2xl font-bold transition-colors" style={{color: themeColors.primary.text}}>
                            {restaurant.name}
                          </h3>
                        </div>
                        <p className="text-sm lg:text-base line-clamp-1 sm:line-clamp-2 leading-relaxed" style={{color: themeColors.secondary.text}}>
                          {currentLanguage === 'tk' ? restaurant.descriptionTk : restaurant.description}
                        </p>
                      </div>
                      <div className="ml-4 p-3 rounded-full transition-all duration-300" style={{background: "#facc15", color: themeColors.primary.text}}>
                        <ArrowRight className="w-6 h-6 text-inherit" />
                      </div>
                    </div>
                    {/* Features and info removed for a cleaner card */}

                    {/* Enhanced CTA Button */}
                    <motion.button
                      className="w-full py-4 rounded-2xl font-bold text-base sm:text-lg relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      style={{background: "#facc15", color: themeColors.primary.text}}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Enhanced shimmer effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {getText('viewMenu', currentLanguage)}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform text-inherit" />
                      </span>
                    </motion.button>
                  </div>
              </motion.div>
            </AnimatedContainer>
          ))}
        </motion.div>
      </div>
    </div>
  );
}