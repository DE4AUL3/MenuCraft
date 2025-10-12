'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, ChefHat } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { getText } from '@/i18n/translations';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
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
    logo: '/panda-burger-logo.svg',
    description: 'Сочные бургеры и американская кухня премиум-класса',
    descriptionTk: 'Damsly burgerler we ýokary derejeli amerikan aşhanasy',
    cuisine: 'Американская кухня',
    rating: 4.8,
    phone: '+993 (12) 123-45-67',
    address: 'г. Ашхабад, ул. Нейтральности, 15',
    image: '/panda_logo.jpg',
  gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
    features: ['Быстрая доставка', 'WiFi', 'QR заказ', 'Премиум качество'],
    isOpen: true,
    deliveryTime: '20-30 мин',
    deliveryTimeTk: '20-30 min'
  },
  {
    id: 'han-tagam',
    name: 'Han Tagam',
    logo: '/khan-tagam-logo.svg',
    description: 'Традиционная туркменская кухня с современной подачей',
    descriptionTk: 'Häzirki zaman usulynda hödürlenýän adaty türkmen aşhanasy',
    cuisine: 'Туркменская кухня',
    rating: 4.9,
    phone: '+993 (65) 987-65-43',
    address: 'г. Ашхабад, ул. Туркменбаши, 28',
    image: '/han_tagam.jpg',
  gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
    features: ['Национальная кухня', 'WiFi', 'QR заказ', 'Авторские блюда'],
    isOpen: false,
    deliveryTime: '35-45 мин',
    deliveryTimeTk: '35-45 min'
  }
];

export default function PremiumRestaurantSelector() {
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const { isDarkMode } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }
    // Загружаем избранные рестораны из localStorage
    try {
      const raw = localStorage.getItem('featuredRestaurants');
      if (raw) {
        const parsed = JSON.parse(raw) as Restaurant[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRestaurants(parsed);
        }
      } else {
        // Инициализируем дефолтным списком
        localStorage.setItem('featuredRestaurants', JSON.stringify(defaultRestaurants));
      }
    } catch {}
  }, []);

  const handleRestaurantSelect = (restaurantId: string) => {
    setSelectedId(restaurantId);
    setTimeout(() => {
      router.push(`/menu/${restaurantId}`);
    }, 300);
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

  return (
  <div className="min-h-screen bg-white dark:bg-black relative">

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
            className="text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {getText('selectRestaurant', currentLanguage)}
          </motion.h1>
          
          <motion.p 
            className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {'Выберите ресторан и окунитесь в мир изысканных вкусов'}
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
                className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-transparent hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                onClick={() => handleRestaurantSelect(restaurant.id)}
                style={{
                  background: selectedId === restaurant.id
                    ? (isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')
                    : 'transparent'
                }}
              >
                  
                  {/* Status Badge */}
                  <div className={`absolute top-6 right-6 z-20 px-3 py-2 rounded-full text-xs font-semibold border bg-black/5 text-gray-800 border-black/10 dark:bg-white/10 dark:text-white dark:border-white/20`}>
                    {restaurant.isOpen ? (getText('open', currentLanguage) || 'Открыт') : (getText('closed', currentLanguage) || 'Закрыт')}
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-6 left-6 z-20 px-3 py-2 rounded-full bg-black/30 backdrop-blur-md text-white">
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
                    
                    {/* Neutral overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    {/* No particles */}
                  </div>

                  {/* Content */}
                    <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          {restaurant.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base line-clamp-2 sm:line-clamp-3">
                          {currentLanguage === 'tk' ? restaurant.descriptionTk : restaurant.description}
                        </p>
                      </div>
                      <div className="ml-4 p-3 rounded-full bg-white/10 dark:bg-white/10">
                        <ArrowRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>

                    {/* Features removed for simplicity */}

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <ChefHat className="w-4 h-4 text-gray-500" />
                        {restaurant.cuisine}
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {currentLanguage === 'tk' ? restaurant.deliveryTimeTk : restaurant.deliveryTime}
                      </div>
                      {/* phone and address removed for clean card */}
                    </div>

                    {/* CTA Button */}
                    <motion.button
                      className={`w-full mt-6 py-3 sm:py-4 rounded-2xl font-semibold text-white dark:text-black text-base sm:text-lg relative overflow-hidden bg-black dark:bg-white shadow hover:shadow-lg transition-all duration-200`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                      
                      <span className="relative z-10">
                        {getText('viewMenu', currentLanguage)}
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