'use client';

import { useState } from 'react';
import { Star, Clock, Plus, Minus, ShoppingCart } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  isOpen: boolean;
  workingHours: string;
  location: string;
  phone: string;
  whatsapp: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  // Kemine Bistro
  {
    id: 'kb-pasta-carbonara',
    name: 'Паста Карбонара',
    description: 'Классическая итальянская паста с беконом, яйцом и пармезаном',
    price: 450,
    image: '/images/pasta-carbonara.jpg',
    category: 'Основные блюда',
    isPopular: true
  },
  {
    id: 'kb-salmon-teriyaki',
    name: 'Лосось Терияки',
    description: 'Филе лосося в соусе терияки с овощами гриль',
    price: 850,
    image: '/images/salmon-teriyaki.jpg',
    category: 'Основные блюда',
    isPopular: true
  },
  {
    id: 'kb-caesar-salad',
    name: 'Цезарь с курицей',
    description: 'Свежий салат с куриной грудкой, сухариками и соусом цезарь',
    price: 320,
    image: '/images/caesar-salad.jpg',
    category: 'Салаты'
  },
  {
    id: 'kb-tiramisu',
    name: 'Тирамису',
    description: 'Классический итальянский десерт с кофе и маскарпоне',
    price: 280,
    image: '/images/tiramisu.jpg',
    category: 'Десерты'
  },

  // Sultan Palace  
  {
    id: 'sp-plov',
    name: 'Плов "Султан"',
    description: 'Традиционный узбекский плов с бараниной и специями',
    price: 380,
    image: '/images/plov.jpg',
    category: 'Основные блюда',
    isPopular: true,
    isSpicy: true
  },
  {
    id: 'sp-kebab',
    name: 'Шашлык из баранины',
    description: 'Сочный шашлык из отборной баранины с луком',
    price: 520,
    image: '/images/kebab.jpg',
    category: 'Основные блюда',
    isPopular: true
  },
  {
    id: 'sp-manti',
    name: 'Манты',
    description: 'Традиционные манты с мясом и луком, подаются с сметаной',
    price: 350,
    image: '/images/manti.jpg',
    category: 'Основные блюда'
  },
  {
    id: 'sp-baklava',
    name: 'Пахлава',
    description: 'Восточная сладость с орехами и медом',
    price: 180,
    image: '/images/baklava.jpg',
    category: 'Десерты'
  }
];

interface RestaurantMenuProps {
  restaurant: Restaurant;
}

export default function RestaurantMenu({ restaurant }: RestaurantMenuProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  // Фильтруем меню по ресторану
  const restaurantMenuItems = menuItems.filter(item => {
    if (restaurant.id === 'kemine-bistro') {
      return item.id.startsWith('kb-');
    } else if (restaurant.id === 'sultan-palace') {
      return item.id.startsWith('sp-');
    }
    return false;
  });

  // Получаем уникальные категории
  const categories = ['Все', ...Array.from(new Set(restaurantMenuItems.map(item => item.category)))];

  // Фильтруем по выбранной категории
  const filteredItems = selectedCategory === 'Все' 
    ? restaurantMenuItems 
    : restaurantMenuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(cartItem =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
      return prev.filter(cartItem => cartItem.id !== itemId);
    });
  };

  const getItemQuantity = (itemId: string) => {
    return cart.find(item => item.id === itemId)?.quantity || 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrder = () => {
    if (cart.length === 0) return;

    const orderText = `🛒 *Заказ из ${restaurant.name}*\n\n` +
      cart.map(item => `${item.name} x${item.quantity} - ${item.price * item.quantity} сом`).join('\n') +
      `\n\n💰 *Итого: ${getTotalPrice()} сом*\n\n📍 Адрес доставки: _укажите адрес_`;

    const whatsappUrl = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
  <div className="min-h-screen bg-white">
      
      {/* Хедер ресторана */}
  <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* Информация о ресторане */}
            <div className="flex-1 text-center">
              <h1 className="text-xl font-light text-gray-900">{restaurant.name}</h1>
              <div className="flex items-center justify-center gap-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Корзина */}
            {cart.length > 0 && (
              <button
                onClick={handleOrder}
                className="relative text-white px-4 py-2 rounded-full transition-colors font-medium"
                style={{ background: 'var(--accent-call)' }}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">{getTotalPrice()} сом</span>
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium" style={{ color: 'var(--accent-call)' }}>
                  {getTotalItems()}
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Меню */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-4 md:gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                
                {/* Изображение */}
                <div className="w-full sm:w-32 h-32 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl opacity-60">
                    {item.category === 'Основные блюда' ? '🍽️' : 
                     item.category === 'Салаты' ? '🥗' : 
                     item.category === 'Десерты' ? '🍰' : '🍴'}
                  </div>
                  
                  {/* Бейджи */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.isPopular && (
                      <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Хит
                      </span>
                    )}
                    {item.isSpicy && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        🌶️
                      </span>
                    )}
                    {item.isVegetarian && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        🌱
                      </span>
                    )}
                  </div>
                </div>

                {/* Контент */}
                <div className="flex-1 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between h-full gap-4">
                    
                    {/* Информация о блюде */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">
                        {item.description}
                      </p>
                      <div className="text-xl font-semibold text-gray-900">
                        {item.price} сом
                      </div>
                    </div>

                    {/* Кнопки добавления */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {getItemQuantity(item.id) > 0 ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold text-gray-900 min-w-6 text-center">
                            {getItemQuantity(item.id)}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-colors font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Добавить</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пустое состояние */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Блюда не найдены
            </h3>
            <p className="text-gray-600">
              В выбранной категории пока нет блюд
            </p>
          </div>
        )}
      </div>

      {/* Плавающая кнопка заказа */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50 md:left-1/2 md:transform md:-translate-x-1/2 md:w-auto">
          <button
            onClick={handleOrder}
            className="w-full md:w-auto text-white px-8 py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 font-medium"
            style={{ background: 'var(--accent-call)' }}
          >
            <ShoppingCart className="w-6 h-6" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Заказать через WhatsApp</span>
              <span className="text-sm opacity-75">{getTotalItems()} блюд • {getTotalPrice()} сом</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}