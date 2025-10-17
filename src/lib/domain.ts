// Мультитенантная конфигурация ресторанов
export interface RestaurantConfig {
  id: string;
  name: string;
  domain: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  logo: string;
  phone: string;
  address: string;
  adminPrefix: string;
}

export const RESTAURANTS: Record<string, RestaurantConfig> = {
  'panda-burger': {
    id: '1',
    name: 'Panda Burger',
    domain: 'panda-burger.local',
    theme: 'dark',
    primaryColor: 'orange', // Используем id темы из colors.ts
    logo: '/panda-burger-logo.svg',
    phone: '+993 XX XXX XXX',
    address: 'Ашхабад, ул. Пример, 123',
    adminPrefix: '/panda-admin'
  },
  'han-tagam': {
    id: '2', 
    name: 'Han Tagam',
    domain: 'han-tagam.local',
    theme: 'light',
    primaryColor: 'blue', // Используем id темы из colors.ts
    logo: '/khan-tagam-logo.svg',
    phone: '+993 YY YYY YYY',
    address: 'Ашхабад, ул. Образец, 456',
    adminPrefix: '/han-admin'
  }
};

// Определение ресторана по домену
export function getRestaurantByDomain(hostname?: string): RestaurantConfig {
  if (!hostname) {
    return RESTAURANTS['panda-burger']; // По умолчанию
  }

  // Поиск по домену
  const restaurant = Object.values(RESTAURANTS).find(r => 
    hostname.includes(r.domain.replace('.local', ''))
  );

  return restaurant || RESTAURANTS['panda-burger'];
}

// Проверка доступа к админке
export function checkAdminAccess(pathname: string, restaurant: RestaurantConfig): boolean {
  return pathname.startsWith(restaurant.adminPrefix);
}