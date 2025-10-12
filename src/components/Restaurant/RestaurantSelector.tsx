'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Phone, Star } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { getRestaurantByDomain } from '../../lib/domain';

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
}

const restaurants: Restaurant[] = [
  {
    id: 'panda-burger',
    name: 'Panda Burger',
    logo: '/panda-burger-logo.svg',
    description: 'Сочные бургеры и американская кухня',
    descriptionTk: 'Damsly burgerler we amerikan aşhanasy', 
    cuisine: 'Американская кухня',
    rating: 4.8,
    phone: '+993 (12) 123-45-67',
    address: 'г. Ашхабад',
    image: '/panda_logo.jpg',
    gradient: 'from-orange-500 to-red-600',
    features: ['Быстрая доставка', 'WiFi', 'QR заказ']
  },
  {
    id: 'han-tagam',
    name: 'Han Tagam',
    logo: '/khan-tagam-logo.svg', 
    description: 'Традиционная туркменская кухня',
    descriptionTk: 'Adaty türkmen aşhanasy',
    cuisine: 'Туркменская кухня',
    rating: 4.9,
    phone: '+993 (65) 987-65-43',
    address: 'г. Ашхабад',
    image: '/han_tagam.jpg',
    gradient: 'from-blue-500 to-indigo-600',
    features: ['Национальная кухня', 'WiFi', 'QR заказ']
  }
];

export default function RestaurantSelector() {
  const router = useRouter();
  const { setRestaurant } = useTheme();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Проверяем автоматическое определение по домену
    const domainRestaurant = getRestaurantByDomain();
    if (domainRestaurant) {
      setIsLoading(true);
      setRestaurant(domainRestaurant.id);
      router.push(`/menu/${domainRestaurant.id}`);
    }
  }, [router, setRestaurant]);

  const handleRestaurantSelect = (restaurantId: string) => {
    if (isLoading) return;
    
    setSelectedRestaurant(restaurantId);
    setIsLoading(true);
    setRestaurant(restaurantId);
    
    // Плавный переход
    setTimeout(() => {
      router.push(`/menu/${restaurantId}`);
    }, 200);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="pt-12 pb-8 text-center">
        <div className="max-w-4xl mx-auto px-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-600">Онлайн заказ активен</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            QR Меню
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-2">
            Выберите ресторан
          </p>
          <p className="text-lg text-slate-500">
            Сделайте заказ в один клик
          </p>
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${restaurant.gradient} opacity-80`} />
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Logo */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                    <img
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
                      bg-gradient-to-br ${restaurant.gradient}
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