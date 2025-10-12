export interface MenuItem {
  id: string
  name: string
  nameTk?: string
  description: string
  descriptionTk?: string
  price: number
  image: string
  category: string
  ingredients: string[]
  ingredientsTk?: string[]
}

export interface Category {
  id: string
  name: string
  nameTk?: string
  image: string
  gradient?: string
  description?: string
  descriptionTk?: string
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface OrderData {
  phone: string
  address?: string
  items: CartItem[]
  totalAmount: number
  deliveryFee: number
}