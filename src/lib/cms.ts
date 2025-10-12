// Универсальный CMS: работает и на сервере (API), и в клиенте

export interface Category {
  id: string;
  name: string;
  nameTk: string;
  image: string;
  gradient: string;
  description?: string;
  descriptionTk?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameTk: string;
  description: string;
  descriptionTk: string;
  price: number;
  image: string;
  ingredients: string[];
  ingredientsTk: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  sortOrder: number;
  calories?: number;
  cookingTime?: number; // в минутах
  allergens: string[];
  createdAt: string;
  updatedAt: string;
}

class CMSService {
  private readonly CATEGORIES_KEY = 'cms_categories';
  private readonly MENU_ITEMS_KEY = 'cms_menu_items';

  // === КАТЕГОРИИ ===
  
  getCategories(): Category[] {
    // На сервере возвращаем дефолтные данные, в браузере — localStorage или дефолт
    if (typeof window === 'undefined') {
      return this.getDefaultCategories();
    }
    const stored = localStorage.getItem(this.CATEGORIES_KEY);
    if (!stored) {
      const defaultCategories = this.getDefaultCategories();
      this.saveCategories(defaultCategories);
      return defaultCategories;
    }
    return JSON.parse(stored);
  }

  saveCategories(categories: Category[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
  }

  getCategoryById(id: string): Category | null {
    const categories = this.getCategories();
    return categories.find(cat => cat.id === id) || null;
  }

  addCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const categories = this.getCategories();
    const newCategory: Category = {
      ...categoryData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    categories.sort((a, b) => a.sortOrder - b.sortOrder);
    this.saveCategories(categories);
    
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Category | null {
    const categories = this.getCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) return null;
    
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    categories.sort((a, b) => a.sortOrder - b.sortOrder);
    this.saveCategories(categories);
    
    return categories[index];
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const items = this.getMenuItems();
    
    // Проверяем, есть ли товары в этой категории
    const hasItems = items.some(item => item.categoryId === id);
    if (hasItems) {
      throw new Error('Нельзя удалить категорию, содержащую товары. Сначала удалите все товары из категории.');
    }
    
    const filteredCategories = categories.filter(cat => cat.id !== id);
    this.saveCategories(filteredCategories);
    
    return true;
  }

  // === ТОВАРЫ ===
  
  getMenuItems(): MenuItem[] {
    // На сервере возвращаем дефолтные данные, в браузере — localStorage или дефолт
    if (typeof window === 'undefined') {
      return this.getDefaultMenuItems();
    }
    const stored = localStorage.getItem(this.MENU_ITEMS_KEY);
    if (!stored) {
      const defaultItems = this.getDefaultMenuItems();
      this.saveMenuItems(defaultItems);
      return defaultItems;
    }
    return JSON.parse(stored);
  }

  saveMenuItems(items: MenuItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.MENU_ITEMS_KEY, JSON.stringify(items));
  }

  getMenuItemsByCategory(categoryId: string): MenuItem[] {
    const items = this.getMenuItems();
    return items.filter(item => item.categoryId === categoryId)
                .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getMenuItemById(id: string): MenuItem | null {
    const items = this.getMenuItems();
    return items.find(item => item.id === id) || null;
  }

  addMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const items = this.getMenuItems();
    const newItem: MenuItem = {
      ...itemData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    items.push(newItem);
    this.saveMenuItems(items);
    
    return newItem;
  }

  updateMenuItem(id: string, updates: Partial<Omit<MenuItem, 'id' | 'createdAt'>>): MenuItem | null {
    const items = this.getMenuItems();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveMenuItems(items);
    
    return items[index];
  }

  deleteMenuItem(id: string): boolean {
    const items = this.getMenuItems();
    const filteredItems = items.filter(item => item.id !== id);
    this.saveMenuItems(filteredItems);
    
    return true;
  }

  // === УТИЛИТЫ ===
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getDefaultCategories(): Category[] {
    return [
      {
        id: 'breakfast',
        name: 'Завтраки',
        nameTk: 'Ertirlik',
        image: '/images/categories/pancakes.jpg',
        gradient: 'from-yellow-600 to-orange-600',
        description: 'Вкусные завтраки для отличного начала дня',
        descriptionTk: 'Günüň gowy başlangyjy üçin tagamly ertirlik',
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
        description: 'Итальянская паста и макароны',
        descriptionTk: 'Italýan makaron we paste',
        sortOrder: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'burgers',
        name: 'Бургеры',
        nameTk: 'Burgerler',
        image: '/images/categories/burgers.svg',
        gradient: 'from-red-600 to-pink-600',
        description: 'Сочные бургеры и сэндвичи',
        descriptionTk: 'Süýji burgerler we sendwiçler',
        sortOrder: 3,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'pizza',
        name: 'Пицца',
        nameTk: 'Pitsa',
        image: '/images/categories/pizza.svg',
        gradient: 'from-pink-600 to-purple-600',
        description: 'Пицца на тонком и толстом тесте',
        descriptionTk: 'Ýuka we galyň testli pitsa',
        sortOrder: 4,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sushi',
        name: 'Суши',
        nameTk: 'Suşi',
        image: '/images/categories/sushi.jpg',
        gradient: 'from-purple-600 to-blue-600',
        description: 'Свежие суши и роллы',
        descriptionTk: 'Täze suşi we rolllar',
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
  }

  private getDefaultMenuItems(): MenuItem[] {
    return [
      {
        id: 'panda-classic',
        categoryId: 'burgers',
        name: 'Панда Классик',
        nameTk: 'Panda Klassik',
        description: 'Сочная говяжья котлета, сыр чеддер, салат, помидор, огурец',
        descriptionTk: 'Süýji sygyr eti, çedder peýniri, salat, pomidor, hyýar',
        price: 35,
        image: '/images/menu/panda-classic.svg',
        ingredients: ['Говяжья котлета', 'Сыр чеддер', 'Салат', 'Помидор', 'Огурец', 'Соус'],
        ingredientsTk: ['Sygyr eti', 'Çedder peýniri', 'Salat', 'Pomidor', 'Hyýar', 'Sous'],
        isVegetarian: false,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        sortOrder: 1,
        calories: 650,
        cookingTime: 15,
        allergens: ['Глютен', 'Молочные продукты'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'cheese-deluxe',
        categoryId: 'burgers',
        name: 'Чиз Делюкс',
        nameTk: 'Çiz Delýuks',
        description: 'Двойная котлета, двойной сыр, бекон, специальный соус',
        descriptionTk: 'Goşa kotleta, goşa peýnir, bekon, ýörite sous',
        price: 45,
        image: '/images/menu/cheese-deluxe.svg',
        ingredients: ['Двойная котлета', 'Двойной сыр', 'Бекон', 'Лук', 'Специальный соус'],
        ingredientsTk: ['Goşa kotleta', 'Goşa peýnir', 'Bekon', 'Sogan', 'Ýörite sous'],
        isVegetarian: false,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        sortOrder: 2,
        calories: 850,
        cookingTime: 18,
        allergens: ['Глютен', 'Молочные продукты'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'margherita-royal',
        categoryId: 'pizza',
        name: 'Маргарита Роял',
        nameTk: 'Margarita Roýal',
        description: 'Томатный соус, моцарелла, свежий базилик, оливковое масло',
        descriptionTk: 'Pomidor sousy, motsarella, täze bazilika, zeýtun ýagy',
        price: 40,
        image: '/images/menu/margherita-royal.svg',
        ingredients: ['Томатный соус', 'Моцарелла', 'Базилик', 'Оливковое масло'],
        ingredientsTk: ['Pomidor sousy', 'Motsarella', 'Bazilika', 'Zeýtun ýagy'],
        isVegetarian: true,
        isSpicy: false,
        isPopular: true,
        isAvailable: true,
        sortOrder: 1,
        calories: 550,
        cookingTime: 20,
        allergens: ['Глютен', 'Молочные продукты'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }

  // === ЭКСПОРТ/ИМПОРТ ===
  
  exportData(): { categories: Category[], menuItems: MenuItem[] } {
    return {
      categories: this.getCategories(),
      menuItems: this.getMenuItems()
    };
  }

  importData(data: { categories?: Category[], menuItems?: MenuItem[] }): void {
    if (data.categories) {
      this.saveCategories(data.categories);
    }
    if (data.menuItems) {
      this.saveMenuItems(data.menuItems);
    }
  }

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.CATEGORIES_KEY);
    localStorage.removeItem(this.MENU_ITEMS_KEY);
  }
}

export const cms = new CMSService();