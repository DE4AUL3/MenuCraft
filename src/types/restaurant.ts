export interface Restaurant {
  id: string
  name: string
  description: string
  descriptionTk?: string
  image: string
  cuisine: string
  rating: number
  deliveryTime: string
  deliveryTimeTk?: string
  priceRange: string
  phone: string
  address: string
  addressTk?: string
  isOpen: boolean
}

export interface RestaurantCardProps {
  restaurant: Restaurant
  isSelected: boolean
  isHovered: boolean
  currentLanguage: 'ru' | 'tk'
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export interface Category {
  id: string
  name: string
  nameTk: string
  description?: string
  descriptionTk?: string
  image?: string
  gradient: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  dishesCount?: number
}

export interface Dish {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  categoryId: string
  categoryName?: string
  image?: string
  images?: string[]
  isActive: boolean
  isAvailable: boolean
  preparationTime: number // в минутах
  allergens?: string[]
  nutritionInfo?: {
    calories: number
    proteins: number
    fats: number
    carbs: number
  }
  tags?: string[]
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  viewsCount?: number
  ordersCount?: number
  rating?: number
  reviews?: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  image?: string
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean
  sortOrder?: number
}

export interface CreateDishRequest {
  name: string
  description: string
  price: number
  originalPrice?: number
  categoryId: string
  image?: string
  images?: string[]
  isAvailable?: boolean
  preparationTime: number
  allergens?: string[]
  nutritionInfo?: {
    calories: number
    proteins: number
    fats: number
    carbs: number
  }
  tags?: string[]
}

export interface UpdateDishRequest extends Partial<CreateDishRequest> {
  isActive?: boolean
  sortOrder?: number
}

export interface RestaurantStats {
  totalCategories: number
  activeCategories: number
  totalDishes: number
  activeDishes: number
  averagePrice: number
  popularCategories: Array<{
    category: Category
    ordersCount: number
  }>
  topDishes: Array<{
    dish: Dish
    ordersCount: number
    revenue: number
  }>
}