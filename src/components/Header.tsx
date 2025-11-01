'use client';'use client';'use client';'use client';



import { useState, useEffect } from 'react';

import { MapPin, Clock, Star, ShoppingCart } from 'lucide-react';

import Link from 'next/link';import { useState, useEffect } from 'react';

import LanguageToggle from './LanguageToggle';

import { useTheme } from '@/hooks/useTheme';import { MapPin, Clock, Star, ShoppingCart } from 'lucide-react';

import { useCart } from '@/hooks/useCart';

import Link from 'next/link';import { useState, useEffect } from 'react';import { useState, useEffect } from 'react';

interface HeaderProps {

  restaurantName: string;import LanguageToggle from './LanguageToggle';

}

import { useTheme } from '@/hooks/useTheme';import { MapPin, Clock, Star, ShoppingCart } from 'lucide-react';import { MapPin, Clock, Star } from 'lucide-react';

export default function Header({ restaurantName }: HeaderProps) {

  const [scrolled, setScrolled] = useState(false);import { useCart } from '@/hooks/useCart';

  const { currentRestaurant } = useTheme();

  const { totalItems } = useCart();import Link from 'next/link';import LanguageToggle from './LanguageToggle';



  useEffect(() => {interface HeaderProps {

    const handleScroll = () => {

      setScrolled(window.scrollY > 20);  restaurantName: string;import LanguageToggle from './LanguageToggle';import { useTheme } from '@/hooks/useTheme';

    };

}

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);import { useTheme } from '@/hooks/useTheme';

  }, []);

export default function Header({ restaurantName }: HeaderProps) {

  const isHantagam = restaurantName.toLowerCase().includes('hantagam');

  const logoText = isHantagam ? 'Хан Тагам' : 'Panda Burger';  const [scrolled, setScrolled] = useState(false);import { useCart } from '@/hooks/useCart';interface HeaderProps {

  const logoUrl = isHantagam ? '/hantagam-logo.png' : '/panda-logo.png';

  const { currentRestaurant } = useTheme();

  return (

    <header   const { totalItems } = useCart();  restaurantName: string;

      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${

        scrolled 

          ? 'bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg' 

          : 'bg-transparent'  useEffect(() => {interface HeaderProps {}

      }`}

    >    const handleScroll = () => {

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">      setScrolled(window.scrollY > 20);  restaurantName: string;

          

          {/* Лого и название */}    };

          <Link href="/" className="flex items-center space-x-3">

            <img }export default function Header({ restaurantName }: HeaderProps) {

              src={logoUrl} 

              alt={logoText}    window.addEventListener('scroll', handleScroll);

              className="h-10 w-10 rounded-full object-cover"

              onError={(e) => {    return () => window.removeEventListener('scroll', handleScroll);  const [scrolled, setScrolled] = useState(false);

                // Fallback если нет лого

                e.currentTarget.style.display = 'none';  }, []);

              }}

            />export default function Header({ restaurantName }: HeaderProps) {  const { currentRestaurant } = useTheme();

            <div className="flex flex-col">

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">  const isHantagam = restaurantName.toLowerCase().includes('hantagam');

                {logoText}

              </h1>  const logoText = isHantagam ? 'Хан Тагам' : 'Panda Burger';  const [scrolled, setScrolled] = useState(false);

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">

                <MapPin className="w-3 h-3 mr-1" />  const logoUrl = isHantagam ? '/hantagam-logo.png' : '/panda-logo.png';

                <span>Бишкек</span>

                <Clock className="w-3 h-3 ml-2 mr-1" />  const { currentRestaurant } = useTheme();  useEffect(() => {

                <span>09:00-23:00</span>

              </div>  return (

            </div>

          </Link>    <header   const { state } = useCart();    const handleScroll = () => {



          {/* Правая часть - язык и корзина */}      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${

          <div className="flex items-center space-x-4">

                    scrolled       setScrolled(window.scrollY > 20);

            {/* Переключатель языка */}

            <LanguageToggle />          ? 'bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg' 

            

            {/* Рейтинг */}          : 'bg-transparent'  useEffect(() => {    };

            <div className="hidden sm:flex items-center space-x-1 text-yellow-500">

              <Star className="w-4 h-4 fill-current" />      }`}

              <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>

            </div>    >    const handleScroll = () => {



            {/* Корзина */}      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <Link 

              href="/cart"         <div className="flex items-center justify-between h-16">      setScrolled(window.scrollY > 20);    window.addEventListener('scroll', handleScroll);

              className="relative flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-200"

            >          

              <ShoppingCart className="w-5 h-5" />

              <span className="hidden sm:inline font-medium">Корзина</span>          {/* Лого и название */}    };    return () => window.removeEventListener('scroll', handleScroll);

              {totalItems > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">          <Link href="/" className="flex items-center space-x-3">

                  {totalItems}

                </span>            <img   }, []);

              )}

            </Link>              src={logoUrl} 

          </div>

        </div>              alt={logoText}    window.addEventListener('scroll', handleScroll);

      </div>

    </header>              className="h-10 w-10 rounded-full object-cover"

  );

}              onError={(e) => {    return () => window.removeEventListener('scroll', handleScroll);  const restaurantInfo = {

                // Fallback если нет лого

                e.currentTarget.style.display = 'none';  }, []);    rating: 4.8,

              }}

            />    status: 'Открыт',

            <div className="flex flex-col">

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);    hours: '09:00 - 23:00',

                {logoText}

              </h1>    location: 'Бишкек, ул. Чуй 1'

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">

                <MapPin className="w-3 h-3 mr-1" />  // Определяем логотип и цвета для каждого ресторана  };

                <span>Бишкек</span>

                <Clock className="w-3 h-3 ml-2 mr-1" />  const getRestaurantTheme = () => {

                <span>09:00-23:00</span>

              </div>    if (currentRestaurant === 'panda-burger' || currentRestaurant === '1') {  return (

            </div>

          </Link>      return {    <>



          {/* Правая часть - язык и корзина */}        logo: '🐼',  <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${

          <div className="flex items-center space-x-4">

                    name: 'Panda Burger',        scrolled 

            {/* Переключатель языка */}

            <LanguageToggle />        headerBg: scrolled ? 'bg-[#282828]/95 backdrop-blur-xl' : 'bg-[#282828]/90 backdrop-blur-md',          ? currentRestaurant === 'panda-burger' || currentRestaurant === '1'

            

            {/* Рейтинг */}        textColor: 'text-white',            ? 'bg-[#282828]/95 backdrop-blur-xl shadow-lg border-b border-gray-600/50' 

            <div className="hidden sm:flex items-center space-x-1 text-yellow-500">

              <Star className="w-4 h-4 fill-current" />        border: 'border-gray-600/50'            : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'

              <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>

            </div>      };          : currentRestaurant === 'panda-burger' || currentRestaurant === '1'



            {/* Корзина */}    } else {            ? 'bg-[#282828]/90 backdrop-blur-md'

            <Link 

              href="/cart"       return {            : 'bg-white/90 backdrop-blur-md'

              className="relative flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-200"

            >        logo: '🏷️',      }`}>

              <ShoppingCart className="w-5 h-5" />

              <span className="hidden sm:inline font-medium">Корзина</span>        name: 'Han Tagam',        <div className="container mx-auto px-3 sm:px-4">

              {totalItems > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">        headerBg: scrolled ? 'bg-white/95 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-md',          <div className="flex items-center justify-between h-14 sm:h-16">

                  {totalItems}

                </span>        textColor: 'text-gray-900',            

              )}

            </Link>        border: 'border-gray-200/50'            {/* Левая часть - Логотип и информация */}

          </div>

        </div>      };            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">

      </div>

    </header>    }              {/* Компактный логотип */}

  );

}  };              <div className="flex-shrink-0">

                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">

  const theme = getRestaurantTheme();                  <span className="text-white font-bold text-sm sm:text-lg">

                    {restaurantName.charAt(0)}

  return (                  </span>

    <>                </div>

      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${theme.headerBg} ${scrolled ? `shadow-lg border-b ${theme.border}` : ''}`}>              </div>

        <div className="container mx-auto px-4">

          <div className="flex items-center justify-between h-16">              {/* Адаптивная информация */}

                          <div className="min-w-0 flex-1">

            {/* Левая часть - Логотип и название */}                {/* Мобильная версия (до 640px) */}

            <div className="flex items-center gap-3">                <div className="block sm:hidden">

              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">                  <div className="flex items-center gap-2">

                <span className="text-2xl">{theme.logo}</span>                    <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">

              </div>                      {restaurantName}

              <div>                    </h1>

                <h1 className={`text-xl font-bold ${theme.textColor}`}>                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full flex-shrink-0">

                  {theme.name}                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>

                </h1>                      <span className="text-xs font-medium text-green-700 dark:text-green-400">

                <div className="flex items-center gap-2 text-sm opacity-75">                        {restaurantInfo.status}

                  <div className="flex items-center gap-1">                      </span>

                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>                    </div>

                    <span className={`text-xs ${theme.textColor}`}>Открыт</span>                  </div>

                  </div>                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-0.5">

                  <span className={`${theme.textColor}`}>09:00 - 23:00</span>                    <div className="flex items-center gap-1">

                </div>                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />

              </div>                      <span>{restaurantInfo.rating}</span>

            </div>                    </div>

                    <div className="flex items-center gap-1">

            {/* Правая часть - Язык и корзина */}                      <Clock className="w-3 h-3" />

            <div className="flex items-center gap-3">                      <span className="truncate">{restaurantInfo.hours}</span>

              <LanguageToggle />                    </div>

                                </div>

              {/* Корзина */}                </div>

              <Link

                href="/cart"                {/* Планшетная версия (640px - 1024px) */}

                className={`relative p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${theme.textColor}`}                <div className="hidden sm:block lg:hidden">

                aria-label="Корзина"                  <div className="flex items-center gap-2 mb-1">

              >                    <h1 className="text-base font-bold text-gray-900 dark:text-white">

                <ShoppingCart className="w-6 h-6" />                      {restaurantName}

                {totalItems > 0 && (                    </h1>

                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">

                    {totalItems > 9 ? '9+' : totalItems}                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

                  </span>                      <span className="text-xs font-medium text-green-700 dark:text-green-400">

                )}                        {restaurantInfo.status}

              </Link>                      </span>

            </div>                    </div>

          </div>                  </div>

        </div>                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">

      </header>                    <div className="flex items-center gap-1">

                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />

      {/* Отступ для контента */}                      <span>{restaurantInfo.rating}</span>

      <div className="h-16"></div>                    </div>

    </>                    <div className="flex items-center gap-1">

  );                      <Clock className="w-3 h-3" />

}                      <span>{restaurantInfo.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Десктопная версия (1024px+) */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {restaurantName}
                    </h1>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        {restaurantInfo.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{restaurantInfo.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurantInfo.hours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurantInfo.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая часть - Компактные кнопки */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <LanguageToggle />
              {/* Theme toggle removed */}
            </div>
          </div>
        </div>
      </header>

      {/* Отступ для контента */}
      <div className="h-14 sm:h-16"></div>
    </>
  );
}