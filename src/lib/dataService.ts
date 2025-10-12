'use client';

import { storageSync } from './storageSync';
import { 
  Category,
  RestaurantSettings, 
  Dish, 
  Order, 
  CartSettings, 
  Contact, 
  DataServiceEvent, 
  EventCallback 
} from '@/types/common';

class DataService {
  private eventListeners: Map<string, EventCallback[]> = new Map();

  // ========================
  // СИСТЕМА СОБЫТИЙ
  // ========================

  addEventListener(eventType: string, callback: EventCallback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
  }

  removeEventListener(eventType: string, callback: EventCallback) {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEventInternal(type: DataServiceEvent['type'], data: any) {
    const event: DataServiceEvent = {
      type,
      data,
      timestamp: new Date().toISOString()
    };

    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }

    // Также эмитим общее событие 'any'
    const anyListeners = this.eventListeners.get('any');
    if (anyListeners) {
      anyListeners.forEach(callback => callback(event));
    }
  }

  // Публичный метод для эмиссии событий
  emitEvent(event: Omit<DataServiceEvent, 'timestamp'>) {
    this.emitEventInternal(event.type, event.data);
  }

  // ========================
  // НАСТРОЙКИ РЕСТОРАНА
  // ========================

  getRestaurantSettings(): RestaurantSettings {
    const data = storageSync.getItem('restaurant_settings', null);
    if (data && typeof data === 'object') {
      return data as RestaurantSettings;
    }

    // Дефолтные настройки
    const defaultSettings: RestaurantSettings = {
      id: 'main_restaurant',
      name: {
        ru: 'Panda Burger',
        tk: 'Panda Burger'
      },
      logo: '',
      phones: ['+993 12 34 56 78'],
      workingHours: {
        from: '09:00',
        to: '23:00'
      },
      address: {
        ru: 'Ашхабад, ул. Туркменбаши, 123',
        tk: 'Aşgabat, Türkmenbaşy köçesi, 123'
      },
      currency: 'TMT',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохраняем напрямую без вызова updateRestaurantSettings, чтобы избежать рекурсии
    storageSync.setItem('restaurant_settings', defaultSettings);
    return defaultSettings;
  }

  updateRestaurantSettings(settings: Partial<RestaurantSettings>): RestaurantSettings {
    const current = this.getRestaurantSettings();
    const updated = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString()
    };

    storageSync.setItem('restaurant_settings', updated);
    this.emitEventInternal('restaurant_updated', updated);
    return updated;
  }

  // ========================
  // КАТЕГОРИИ (расширяем существующий функционал)
  // ========================

  getCategories(): Category[] {
    return this.getCategoriesFromStorage();
  }

  private getCategoriesFromStorage(): Category[] {
    const data = storageSync.getItem('categories', []);
    if (data && Array.isArray(data)) {
      return data as Category[];
    }

    // Дефолтные категории (без emoji)
    const defaultCategories: Category[] = [
      {
        id: 'breakfast',
        name: 'Завтраки',
        nameTk: 'Ertirlik',
        image: '/images/categories/pancakes.jpg',
        gradient: 'from-yellow-600 to-orange-600',
        description: 'Сытные завтраки для отличного начала дня',
        descriptionTk: 'Ertirlik üçin tagamlar',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pasta',
        name: 'Паста',
        nameTk: 'Makaron',
        image: '/images/categories/pasta.jpg',
        gradient: 'from-orange-600 to-red-600',
        description: 'Итальянская паста с изысканными соусами',
        descriptionTk: 'Italiýa makarony',
        sortOrder: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'burgers',
        name: 'Бургеры',
        nameTk: 'Burgerler',
        image: '/images/categories/chicken-teriyaki.jpg',
        gradient: 'from-red-600 to-amber-600',
        description: 'Сочные бургеры с мясными котлетами',
        descriptionTk: 'Lezzetli burgerler',
        sortOrder: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sushi',
        name: 'Суши',
        nameTk: 'Suşi',
        image: '/images/categories/sushi.jpg',
        gradient: 'from-green-600 to-teal-600',
        description: 'Свежие суши от мастера',
        descriptionTk: 'Täze suşi',
        sortOrder: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'desserts',
        name: 'Десерты',
        nameTk: 'Süýji tagamlar',
        image: '/images/categories/desserts-fruit-plate.jpg',
        gradient: 'from-pink-600 to-purple-600',
        description: 'Сладкие десерты и фрукты',
        descriptionTk: 'Süýji tagamlar we miweler',
        sortOrder: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'drinks',
        name: 'Напитки',
        nameTk: 'Içgiler',
        image: '/images/categories/drinks-mojito.jpg',
        gradient: 'from-blue-600 to-purple-600',
        description: 'Освежающие напитки и коктейли',
        descriptionTk: 'Serinletji içgiler we kokteýller',
        sortOrder: 6,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    storageSync.setItem('categories', defaultCategories);
    return defaultCategories;
  }

  addCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...categoryData,
      id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    categories.push(newCategory);
    storageSync.setItem('categories', categories);
    this.emitEventInternal('category_updated', { action: 'created', category: newCategory });
    return newCategory;
  }

  updateCategory(id: string, categoryData: Partial<Category>): Category {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      throw new Error('Категория не найдена');
    }

    const updatedCategory = {
      ...categories[index],
      ...categoryData,
      id, // Не позволяем изменить ID
      updatedAt: new Date().toISOString(),
    };

    categories[index] = updatedCategory;
    storageSync.setItem('categories', categories);
    this.emitEventInternal('category_updated', { action: 'updated', category: updatedCategory });
    return updatedCategory;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) {
      return false;
    }

    // Проверяем, есть ли блюда в этой категории
    const dishes = this.getDishes();
    const categoryDishes = dishes.filter(dish => dish.categoryId === id);
    
    if (categoryDishes.length > 0) {
      throw new Error('Нельзя удалить категорию, в которой есть блюда');
    }

    const deletedCategory = categories[index];
    categories.splice(index, 1);
    storageSync.setItem('categories', categories);
    this.emitEventInternal('category_updated', { action: 'deleted', category: deletedCategory });
    return true;
  }

  // Alias метод для DishManager
  getAllCategories(): Category[] {
    return this.getCategories();
  }

  // ========================
  // БЛЮДА
  // ========================

  getDishes(): Dish[] {
    const data = storageSync.getItem('dishes', []);
    if (data && Array.isArray(data)) {
      return data as Dish[];
    }

    // Дефолтные блюда
    const defaultDishes: Dish[] = [
      {
        id: 'dish_panda_classic',
        name: {
          ru: 'Панда Классик',
          tk: 'Panda Klassik'
        },
        description: {
          ru: 'Сочная говяжья котлета, сыр, салат, помидор, фирменный соус',
          tk: 'Syzgyn et, peýnir, salat, pomidor, özboluşly sous'
        },
        price: 45.00,
        image: '/images/menu/panda-classic.svg',
        categoryId: 'burgers',
        isActive: true,
        isAvailable: true,
        isPopular: true,
        preparationTime: 15,
        calories: 650,
        weight: 350,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'dish_margherita',
        name: {
          ru: 'Маргарита Роял',
          tk: 'Margherita Roýal'
        },
        description: {
          ru: 'Моцарелла, томатный соус, базилик',
          tk: 'Motsarella, pomidor sousy, bazil'
        },
        price: 38.00,
        image: '/images/menu/margherita-royal.svg',
        categoryId: 'pasta',
        isActive: true,
        isAvailable: true,
        preparationTime: 20,
        calories: 520,
        weight: 400,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    storageSync.setItem('dishes', defaultDishes);
    return defaultDishes;
  }

  getDishById(id: string): Dish | null {
    const dishes = this.getDishes();
    return dishes.find(dish => dish.id === id) || null;
  }

  getDishesByCategory(categoryId: string): Dish[] {
    const dishes = this.getDishes();
    return dishes.filter(dish => dish.categoryId === categoryId && dish.isActive);
  }

  addDish(dishData: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>): Dish {
    const dishes = this.getDishes();
    const newDish: Dish = {
      ...dishData,
      id: `dish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dishes.push(newDish);
    storageSync.setItem('dishes', dishes);
    this.emitEventInternal('dish_created', newDish);
    return newDish;
  }

  updateDish(id: string, dishData: Partial<Dish>): Dish {
    const dishes = this.getDishes();
    const index = dishes.findIndex(dish => dish.id === id);
    
    if (index === -1) {
      throw new Error('Блюдо не найдено');
    }

    const updatedDish = {
      ...dishes[index],
      ...dishData,
      id, // Не позволяем изменить ID
      updatedAt: new Date().toISOString(),
    };

    dishes[index] = updatedDish;
    storageSync.setItem('dishes', dishes);
    this.emitEventInternal('dish_updated', updatedDish);
    return updatedDish;
  }

  deleteDish(id: string): boolean {
    const dishes = this.getDishes();
    const index = dishes.findIndex(dish => dish.id === id);
    
    if (index === -1) {
      return false;
    }

    dishes.splice(index, 1);
    storageSync.setItem('dishes', dishes);
    this.emitEventInternal('dish_deleted', { id });
    return true;
  }

  // Alias методы для DishManager
  getAllDishes(): Dish[] {
    return this.getDishes();
  }

  createDish(dishData: Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>): Dish {
    return this.addDish(dishData);
  }

  // ========================
  // ЗАКАЗЫ
  // ========================

  getOrders(): Order[] {
    const data = storageSync.getItem('orders', []);
    if (data && Array.isArray(data)) {
      return data as Order[];
    }
    return [];
  }

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === id) || null;
  }

  getActiveOrders(): Order[] {
    const orders = this.getOrders();
    return orders.filter(order => 
      ['new', 'confirmed', 'preparing', 'delivering'].includes(order.status)
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder); // Добавляем в начало (новые заказы сверху)
    storageSync.setItem('orders', orders);
    this.emitEventInternal('order_created', newOrder);
    return newOrder;
  }

  updateOrderStatus(id: string, status: Order['status']): Order {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      throw new Error('Заказ не найден');
    }

    const updatedOrder = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
    };

    orders[index] = updatedOrder;
    storageSync.setItem('orders', orders);
    this.emitEventInternal('order_updated', updatedOrder);
    return updatedOrder;
  }

  // ========================
  // НАСТРОЙКИ КОРЗИНЫ И ДОСТАВКИ
  // ========================

  getCartSettings(restaurantId: string): CartSettings | null {
    const settings = storageSync.getItem(`cart_settings_${restaurantId}`, null);
    return settings as CartSettings | null;
  }

  saveCartSettings(settings: CartSettings): CartSettings {
    storageSync.setItem(`cart_settings_${settings.restaurantId}`, settings);
    this.emitEventInternal('cart_settings_updated', settings);
    return settings;
  }

  updateCartSettings(restaurantId: string, updates: Partial<CartSettings>): CartSettings {
    const existing = this.getCartSettings(restaurantId);
    if (!existing) {
      throw new Error('Настройки корзины не найдены');
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.saveCartSettings(updated);
  }

  // ========================
  // КОНТАКТЫ
  // ========================

  getContacts(): Contact[] {
    // Автоматически генерируем контакты из заказов
    const orders = this.getOrders();
    const contactsMap = new Map<string, Contact>();

    orders.forEach(order => {
      const phone = order.customerPhone;
      if (contactsMap.has(phone)) {
        const contact = contactsMap.get(phone)!;
        contact.totalOrders++;
        contact.totalAmount += order.totalAmount;
        contact.lastOrderDate = order.createdAt > contact.lastOrderDate ? order.createdAt : contact.lastOrderDate;
      } else {
        contactsMap.set(phone, {
          id: `contact_${phone.replace(/\D/g, '')}`,
          name: order.customerName,
          phone: phone,
          totalOrders: 1,
          totalAmount: order.totalAmount,
          lastOrderDate: order.createdAt,
          firstOrderDate: order.createdAt,
          isActive: true
        });
      }
    });

    return Array.from(contactsMap.values()).sort((a, b) => 
      new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );
  }

  // ========================
  // СТАТИСТИКА
  // ========================

  getStatistics() {
    const orders = this.getOrders();
    const dishes = this.getDishes();
    const contacts = this.getContacts();

    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Статистика по дням (последние 30 дней)
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last30Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.createdAt.split('T')[0] === date && order.status === 'completed'
      );
      return {
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      };
    });

    return {
      totalOrders,
      completedOrders: completedOrders.length,
      totalRevenue,
      averageOrderValue,
      totalDishes: dishes.length,
      activeDishes: dishes.filter(dish => dish.isActive).length,
      totalCustomers: contacts.length,
      dailyStats
    };
  }
}

export const dataService = new DataService();
