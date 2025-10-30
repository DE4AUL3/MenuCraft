// Типы и утилиты для аналитики популярных блюд
// ...existing code...
// Моковые данные для аналитики (восстановлено)
export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface DishData {
  name: string;
  orders: number;
  revenue: number;
  image?: string;
  category: string;
  rating: number;
}

export interface CustomerData {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
}

export interface PerformanceData {
  metric: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const salesData: SalesData[] = [
  { date: '2025-10-01', sales: 21700, orders: 70, customers: 61 },
  { date: '2025-10-02', sales: 24300, orders: 77, customers: 68 },
  { date: '2025-10-03', sales: 26800, orders: 84, customers: 74 },
];

export const popularDishes: DishData[] = [
  {
    name: 'Лагман',
    orders: 126,
    revenue: 35280,
    image: '/images/lagman.jpg',
    category: 'Супы',
    rating: 4.8
  },
  {
    name: 'Маргарита',
    orders: 98,
    revenue: 44100,
    image: '/images/menu/margherita-royal.svg',
    category: 'Пицца',
    rating: 4.7
  }
];

export const customerData: CustomerData[] = [
  { date: '2025-10-01', newCustomers: 23, returningCustomers: 38, totalCustomers: 61 },
  { date: '2025-10-02', newCustomers: 27, returningCustomers: 41, totalCustomers: 68 },
];

export const performanceMetrics: PerformanceData[] = [
  {
    metric: 'Средний чек',
    value: 680,
    target: 650,
    trend: 'up',
    change: 4.6
  },
  {
    metric: 'Время приготовления',
    value: 18,
    target: 20,
    trend: 'up',
    change: -10.0
  }
];

export function formatCurrency(value: number): string {
  return value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 })
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  });
};

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
