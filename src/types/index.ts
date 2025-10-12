export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  dishes: Dish[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  theme: string; // Изменено с 'light' | 'dark' на string для совместимости с JSON
  contacts: Contact[];
  categories: Category[];
}

export interface RestaurantData {
  restaurants: Restaurant[];
}