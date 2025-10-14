// Моковые данные для аналитики
export interface SalesData {
  date: string
  sales: number
  orders: number
  customers: number
}

export interface DishData {
  name: string
  orders: number
  revenue: number
  image: string
  category: string
  rating: number
}

export interface CustomerData {
  date: string
  newCustomers: number
  returningCustomers: number
  totalCustomers: number
}

export interface PerformanceData {
  metric: string
  value: number
  target: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

// Данные продаж за последние 30 дней
export const salesData: SalesData[] = [
  { date: '2025-09-11', sales: 12500, orders: 45, customers: 38 },
  { date: '2025-09-12', sales: 15300, orders: 52, customers: 44 },
  { date: '2025-09-13', sales: 11800, orders: 41, customers: 35 },
  { date: '2025-09-14', sales: 18700, orders: 63, customers: 56 },
  { date: '2025-09-15', sales: 22100, orders: 71, customers: 62 },
  { date: '2025-09-16', sales: 19800, orders: 65, customers: 58 },
  { date: '2025-09-17', sales: 16200, orders: 54, customers: 47 },
  { date: '2025-09-18', sales: 14900, orders: 48, customers: 41 },
  { date: '2025-09-19', sales: 17600, orders: 58, customers: 49 },
  { date: '2025-09-20', sales: 21300, orders: 69, customers: 61 },
  { date: '2025-09-21', sales: 24500, orders: 78, customers: 67 },
  { date: '2025-09-22', sales: 20900, orders: 67, customers: 59 },
  { date: '2025-09-23', sales: 18400, orders: 61, customers: 52 },
  { date: '2025-09-24', sales: 16700, orders: 55, customers: 46 },
  { date: '2025-09-25', sales: 19200, orders: 63, customers: 55 },
  { date: '2025-09-26', sales: 22800, orders: 72, customers: 64 },
  { date: '2025-09-27', sales: 25600, orders: 81, customers: 71 },
  { date: '2025-09-28', sales: 23100, orders: 74, customers: 66 },
  { date: '2025-09-29', sales: 20500, orders: 66, customers: 58 },
  { date: '2025-09-30', sales: 18900, orders: 62, customers: 53 },
  { date: '2025-10-01', sales: 21700, orders: 70, customers: 61 },
  { date: '2025-10-02', sales: 24300, orders: 77, customers: 68 },
  { date: '2025-10-03', sales: 26800, orders: 84, customers: 74 },
  { date: '2025-10-04', sales: 23900, orders: 76, customers: 67 },
  { date: '2025-10-05', sales: 21200, orders: 68, customers: 59 },
  { date: '2025-10-06', sales: 19600, orders: 63, customers: 55 },
  { date: '2025-10-07', sales: 22400, orders: 72, customers: 63 },
  { date: '2025-10-08', sales: 25100, orders: 79, customers: 69 },
  { date: '2025-10-09', sales: 27300, orders: 86, customers: 76 },
  { date: '2025-10-10', sales: 24700, orders: 78, customers: 68 }
]

// Популярные блюда (из реальных данных ресторанов)
export const popularDishes: DishData[] = [
  {
    name: 'Лагман',
    orders: 126,
    revenue: 35280, // 280 * 126
    image: '/images/lagman.jpg',
    category: 'Супы',
    rating: 4.8
  },
  {
    name: 'Маргарита',
    orders: 98,
    revenue: 44100, // 450 * 98
    image: '/images/menu/margherita-royal.svg',
    category: 'Пицца',
    rating: 4.7
  },
  {
    name: 'Манты с говядиной',
    orders: 87,
    revenue: 15660, // 180 * 87
    image: '/images/beef-manty.jpg',
    category: 'Манты',
    rating: 4.9
  },
  {
    name: 'Стейк из говядины',
    orders: 76,
    revenue: 64600, // 850 * 76
    image: '/images/beef-steak.svg',
    category: 'Горячие блюда',
    rating: 4.6
  },
  {
    name: 'Пепперони',
    orders: 65,
    revenue: 33800, // 520 * 65
    image: '/images/menu/pepperoni-supreme.svg',
    category: 'Пицца',
    rating: 4.5
  },
  {
    name: 'Зеленый чай',
    orders: 234,
    revenue: 18720, // 80 * 234
    image: '/images/green-tea.jpg',
    category: 'Напитки',
    rating: 4.3
  },
  {
    name: 'Тирамису',
    orders: 54,
    revenue: 13500, // 250 * 54
    image: '/images/tiramisu.jpg',
    category: 'Десерты',
    rating: 4.7
  }
]

// Данные клиентов
export const customerData: CustomerData[] = [
  { date: '2025-09-11', newCustomers: 15, returningCustomers: 23, totalCustomers: 38 },
  { date: '2025-09-12', newCustomers: 18, returningCustomers: 26, totalCustomers: 44 },
  { date: '2025-09-13', newCustomers: 12, returningCustomers: 23, totalCustomers: 35 },
  { date: '2025-09-14', newCustomers: 22, returningCustomers: 34, totalCustomers: 56 },
  { date: '2025-09-15', newCustomers: 25, returningCustomers: 37, totalCustomers: 62 },
  { date: '2025-09-16', newCustomers: 21, returningCustomers: 37, totalCustomers: 58 },
  { date: '2025-09-17', newCustomers: 17, returningCustomers: 30, totalCustomers: 47 },
  { date: '2025-09-18', newCustomers: 14, returningCustomers: 27, totalCustomers: 41 },
  { date: '2025-09-19', newCustomers: 19, returningCustomers: 30, totalCustomers: 49 },
  { date: '2025-09-20', newCustomers: 24, returningCustomers: 37, totalCustomers: 61 },
  { date: '2025-09-21', newCustomers: 28, returningCustomers: 39, totalCustomers: 67 },
  { date: '2025-09-22', newCustomers: 23, returningCustomers: 36, totalCustomers: 59 },
  { date: '2025-09-23', newCustomers: 20, returningCustomers: 32, totalCustomers: 52 },
  { date: '2025-09-24', newCustomers: 16, returningCustomers: 30, totalCustomers: 46 },
  { date: '2025-09-25', newCustomers: 21, returningCustomers: 34, totalCustomers: 55 },
  { date: '2025-09-26', newCustomers: 26, returningCustomers: 38, totalCustomers: 64 },
  { date: '2025-09-27', newCustomers: 29, returningCustomers: 42, totalCustomers: 71 },
  { date: '2025-09-28', newCustomers: 25, returningCustomers: 41, totalCustomers: 66 },
  { date: '2025-09-29', newCustomers: 22, returningCustomers: 36, totalCustomers: 58 },
  { date: '2025-09-30', newCustomers: 19, returningCustomers: 34, totalCustomers: 53 },
  { date: '2025-10-01', newCustomers: 23, returningCustomers: 38, totalCustomers: 61 },
  { date: '2025-10-02', newCustomers: 27, returningCustomers: 41, totalCustomers: 68 },
  { date: '2025-10-03', newCustomers: 30, returningCustomers: 44, totalCustomers: 74 },
  { date: '2025-10-04', newCustomers: 26, returningCustomers: 41, totalCustomers: 67 },
  { date: '2025-10-05', newCustomers: 22, returningCustomers: 37, totalCustomers: 59 },
  { date: '2025-10-06', newCustomers: 20, returningCustomers: 35, totalCustomers: 55 },
  { date: '2025-10-07', newCustomers: 24, returningCustomers: 39, totalCustomers: 63 },
  { date: '2025-10-08', newCustomers: 28, returningCustomers: 41, totalCustomers: 69 },
  { date: '2025-10-09', newCustomers: 31, returningCustomers: 45, totalCustomers: 76 },
  { date: '2025-10-10', newCustomers: 27, returningCustomers: 41, totalCustomers: 68 }
]

// Метрики производительности
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
  },
  {
    metric: 'Конверсия',
    value: 23.4,
    target: 25.0,
    trend: 'down',
    change: -6.4
  },
  {
    metric: 'Повторные заказы',
    value: 67.8,
    target: 60.0,
    trend: 'up',
    change: 13.0
  },
  {
    metric: 'Рейтинг сервиса',
    value: 4.8,
    target: 4.5,
    trend: 'up',
    change: 6.7
  },
  {
    metric: 'Отмены заказов',
    value: 2.1,
    target: 5.0,
    trend: 'up',
    change: -58.0
  }
]

// Утилитные функции
export const formatCurrency = (amount: number): string => {
  // Конвертируем рубли в туркменские манаты (примерный курс 1 рубль = 0.15 ТМТ)
  const tmtAmount = Math.round(amount * 0.15)
  return `${tmtAmount.toLocaleString('ru-RU')} ТМТ`
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const getDateRange = (days: number): { start: string; end: string } => {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - days)
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}