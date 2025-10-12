import { Category, Dish } from '@/types/common'

// Mock данные для категорий
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Пицца',
    nameTk: 'Pitsa',
    description: 'Итальянская пицца на тонком и пышном тесте',
    descriptionTk: 'Inçe we galyň hamyrda italýan pitsasy',
    image: '/images/categories/pizza.svg',
    gradient: 'from-orange-500 to-red-500',
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-03-10T10:00:00.000Z'
  },
  {
    id: '2', 
    name: 'Бургеры',
    nameTk: 'Burgerler',
    description: 'Сочные бургеры с мясными и вегетарианскими котлетами',
    descriptionTk: 'Etli we wegetarian kotletli damsly burgerler',
    image: '/images/categories/burgers.svg',
    gradient: 'from-yellow-500 to-orange-500',
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-20T10:00:00.000Z',
    updatedAt: '2024-03-05T10:00:00.000Z'
  }
]

// Mock данные для блюд
export const mockDishes: Dish[] = [
  {
    id: '1',
    name: {
      ru: 'Пицца Маргарита Роял',
      tk: 'Pitsa Margarita Roýal'
    },
    description: {
      ru: 'Классическая пицца с томатным соусом, моцареллой и свежим базиликом на тонком тесте',
      tk: 'Inçe hamyrda pomidor sousy, mosarellla we täze basilik bilen klassiki pitsa'
    },
    price: 45,
    image: '/images/menu/margherita-royal.svg',
    categoryId: '1',
    isActive: true,
    isAvailable: true,
    isPopular: true,
    preparationTime: 15,
    calories: 720,
    weight: 450,
    sortOrder: 1,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-03-10T10:00:00.000Z'
  },
  {
    id: '2',
    name: {
      ru: 'Панда Классик Бургер',
      tk: 'Panda Klassik Burger'
    },
    description: {
      ru: 'Сочная говяжья котлета с сыром чеддер, салатом, томатами и фирменным соусом',
      tk: 'Çedder peýniri, salat, pomidor we firma sousy bilen damsly sygyr kotleti'
    },
    price: 38,
    image: '/images/menu/panda-classic.svg',
    categoryId: '2',
    isActive: true,
    isAvailable: true,
    isPopular: true,
    preparationTime: 12,
    calories: 650,
    weight: 380,
    sortOrder: 1,
    createdAt: '2024-01-25T10:00:00.000Z',
    updatedAt: '2024-03-12T10:00:00.000Z'
  }
]

// Функция поиска блюд
export function searchDishes(query: string): Dish[] {
  const lowercaseQuery = query.toLowerCase()
  
  return mockDishes.filter(dish =>
    dish.name.ru.toLowerCase().includes(lowercaseQuery) ||
    dish.name.tk.toLowerCase().includes(lowercaseQuery) ||
    dish.description?.ru.toLowerCase().includes(lowercaseQuery) ||
    dish.description?.tk.toLowerCase().includes(lowercaseQuery)
  )
}