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
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-white/5 to-gray-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-400/5 to-gray-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
            className="text-3xl lg:text-5xl font-black mb-4"
            style={{ color: 'var(--text-primary)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {getText('selectRestaurant', currentLanguage)}
          </motion.h1>
          
          <motion.p 
            className="text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
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
                className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:bg-white dark:hover:bg-slate-800 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRestaurantSelect(restaurant.id)}
                style={{
                  background: selectedId === restaurant.id
                    ? (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)')
                    : ''
                }}
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
                    
                    {/* Enhanced overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </div>

                  {/* Content */}
                    <div className="relative p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {restaurant.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed">
                          {currentLanguage === 'tk' ? restaurant.descriptionTk : restaurant.description}
                        </p>
                      </div>
                      <div className="ml-4 p-3 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>

                    {/* Enhanced Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {restaurant.features?.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Enhanced Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <ChefHat className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{restaurant.cuisine}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span className="font-medium">{currentLanguage === 'tk' ? restaurant.deliveryTimeTk : restaurant.deliveryTime}</span>
                      </div>
                    </div>

                    {/* Enhanced CTA Button */}
                    <motion.button
                      className="w-full py-4 rounded-2xl font-bold text-white text-base sm:text-lg relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Enhanced shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {getText('viewMenu', currentLanguage)}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
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