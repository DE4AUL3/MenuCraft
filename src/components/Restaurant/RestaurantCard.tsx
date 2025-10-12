'use client'

import { Star, Clock, MapPin, ArrowRight, Phone } from 'lucide-react'
import Image from 'next/image'
import { RestaurantCardProps } from '@/types/restaurant'
import { getText } from '@/i18n/translations'

export default function RestaurantCard({
  restaurant,
  isSelected,
  isHovered,
  currentLanguage,
  onSelect,
  onHover
}: RestaurantCardProps) {
  return (
    <div
      className={`group relative ${
        isSelected 
          ? 'scale-[0.98] opacity-60' 
          : 'hover:scale-[1.02] active:scale-[0.98]'
      } transition-all duration-300 ease-out cursor-pointer touch-manipulation`}
      onClick={() => onSelect(restaurant.id)}
      onMouseEnter={() => onHover(restaurant.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Main Card */}
      <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200/60 overflow-hidden transition-all duration-500 group-hover:border-blue-300/60 group-active:shadow-xl">
        
        {/* Status Badge - компактнее на мобильных */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-20">
          <div className={`flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-full shadow-lg backdrop-blur-sm text-[10px] sm:text-xs md:text-sm ${
            restaurant.isOpen 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-red-500/90 text-white'
          }`}>
            <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full ${
              restaurant.isOpen ? 'bg-white animate-pulse' : 'bg-white/80'
            }`}></div>
            <span className="font-semibold">
              {restaurant.isOpen ? getText('open', currentLanguage) : getText('closed', currentLanguage)}
            </span>
          </div>
        </div>

        {/* Hero Image - компактнее на мобильных */}
        <div className="relative h-32 sm:h-44 md:h-52 lg:h-56 overflow-hidden">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 288px, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
            priority
          />
          
          {/* Gradient Overlay for mobile readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Cuisine Badge - меньше на мобильных */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-20">
            <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {restaurant.cuisine}
              </span>
            </div>
          </div>

          {/* Rating Badge - компактнее */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 z-20">
            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-amber-400 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-slate-900">
                {restaurant.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Content - компактнее на мобильных */}
        <div className="p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
              {restaurant.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
              {currentLanguage === 'tk' ? (restaurant.descriptionTk || restaurant.description) : restaurant.description}
            </p>
          </div>

          {/* Info Grid - вертикально на мобильных, горизонтально на больших */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
            {/* Delivery Time */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-blue-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-900">
                  {currentLanguage === 'tk' ? (restaurant.deliveryTimeTk || restaurant.deliveryTime) : restaurant.deliveryTime}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{getText('delivery', currentLanguage)}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-purple-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-300">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                  {currentLanguage === 'tk' 
                    ? (restaurant.addressTk || restaurant.address).split(',')[0]
                    : restaurant.address.split(',')[0]
                  }
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500">{getText('address', currentLanguage)}</div>
              </div>
            </div>
          </div>

          {/* Contact - компактнее на мобильных */}
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 lg:mb-6 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-md sm:rounded-lg flex items-center justify-center">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-semibold text-slate-900">
                {restaurant.phone}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500">Для заказов</div>
            </div>
          </div>

          {/* Action Button - адаптивный размер */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 text-white py-2.5 sm:py-3 lg:py-3.5 xl:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl group-hover:shadow-blue-500/25 text-sm sm:text-base touch-manipulation">
            <span>{getText('viewMenu', currentLanguage)}</span>
            <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              isHovered ? 'translate-x-1' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Subtle Hover Effects */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 transition-opacity duration-300 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>
    </div>
  )
}