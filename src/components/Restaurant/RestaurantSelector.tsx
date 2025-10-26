'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Phone, Star } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { getRestaurantByDomain } from '../../lib/domain';
import SmartImage from '../ui/SmartImage';

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
}

export default function RestaurantSelector() {
  const router = useRouter();
  const { setRestaurant } = useTheme();
  const { currentLanguage } = useLanguage();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Проверяем автоматическое определение по домену
    const domainRestaurant = getRestaurantByDomain();
    if (domainRestaurant) {
      setIsLoading(true);
      setRestaurant(domainRestaurant.id);
      router.push(`/menu/${domainRestaurant.id}?lang=${currentLanguage}`);
    }

    // Загружаем рестораны из API
    async function fetchRestaurants() {
      try {
        const response = await fetch('/api/restaurant');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setRestaurants(data);
          }
        }
      } catch (e) {
        console.error('Ошибка загрузки ресторанов', e);
      }
    }
    fetchRestaurants();
  }, [router, setRestaurant]);

  const handleRestaurantSelect = (restaurantId: string) => {
    if (isLoading) return;
    setSelectedRestaurant(restaurantId);
    setIsLoading(true);
    setRestaurant(restaurantId);
    // Плавный переход
    setTimeout(() => {
      router.push(`/menu/${restaurantId}?lang=${currentLanguage}`);
    }, 200);
  };

  if (!mounted) {
    return null;
  }

  return (
  <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Hero */}
  <div className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-rose-50">
        <div className="absolute inset-0 opacity-40" />
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur text-slate-600 text-sm mb-6 border border-slate-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Онлайн заказ активен</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900">QR Меню</h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-2">Выберите ресторан</p>
          <p className="text-lg text-slate-500">Сделайте заказ в один клик</p>
        </div>
      </div>

      {/* Restaurant Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {restaurants.map((restaurant) => {
            const isSelected = selectedRestaurant === restaurant.id;
            const isCurrentLoading = isLoading && isSelected;
            
            return (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantSelect(restaurant.id)}
                className={`
                  group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-xl
                  hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                  ${isSelected ? 'ring-2 ring-blue-500 scale-[1.02] -translate-y-1' : ''}
                  ${isCurrentLoading ? 'pointer-events-none opacity-75' : ''}
                  border border-white/20 backdrop-blur-sm
                `}
              >
                {/* Restaurant Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className={`absolute inset-0 bg-linear-to-br ${restaurant.gradient} opacity-80`} />
                  <SmartImage
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Logo */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                    <SmartImage
                      src={restaurant.logo}
                      alt={`${restaurant.name} Logo`}
                      className="w-10 h-10 object-contain"
                    />
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-sm">{restaurant.rating}</span>
                  </div>

                  {/* Loading overlay */}
                  {isCurrentLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </h3>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed">
                    {restaurant.description}
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.cuisine}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {restaurant.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Перейти к меню
                    </span>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      bg-linear-to-br ${restaurant.gradient}
                      group-hover:scale-110 transition-transform duration-300
                      shadow-lg
                    `}>
                      {isCurrentLoading ? (
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-slate-500 text-sm">Scan QR для быстрого доступа</span>
        </div>
      </div>
    </div>
  );
}