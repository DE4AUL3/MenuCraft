import { PrismaClient } from '@prisma/client';
import {
  DatabaseCategory,
  DatabaseMeal,
  DatabaseOrder,
  DatabaseOrderItem,
  DatabaseClient,
  CreateCategory,
  CreateMeal,
  CreateOrder,
  CreateClient,
  UpdateCategory,
  UpdateMeal,
  UpdateOrder,
  LocalizedCategory,
  LocalizedMeal,
  LocalizedOrder,
  Language,
  getLocalizedName,
  getLocalizedDescription
} from '../types/database';

// Создаем единственный экземпляр Prisma Client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // В продакшене пишем только ошибки, в dev расширенный лог
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Сервис для работы с базой данных
export class DatabaseService {
  // === КЛИЕНТЫ ===
  
  async createClient(data: CreateClient): Promise<DatabaseClient> {
    return await prisma.client.create({
      data
    });
  }

  async getClientByPhone(phoneNumber: string): Promise<DatabaseClient | null> {
    return await prisma.client.findUnique({
      where: { phoneNumber }
    });
  }

  async getOrCreateClient(phoneNumber: string): Promise<DatabaseClient> {
    let client = await this.getClientByPhone(phoneNumber);
    
    if (!client) {
      client = await this.createClient({ phoneNumber });
    }
    
    return client;
  }

  // === КАТЕГОРИИ ===
  
  async createCategory(data: CreateCategory): Promise<DatabaseCategory> {
    if (!data.restaurantId) {
      throw new Error('restaurantId is required to create a category');
    }
    return await prisma.category.create({
      data: {
        nameRu: data.nameRu,
        nameTk: data.nameTk,
        descriptionRu: data.descriptionRu,
        descriptionTk: data.descriptionTk,
        imageCard: data.imageCard,
        imageBackground: data.imageBackground,
        order: data.order,
        status: data.status ?? true,
        restaurantId: parseInt(data.restaurantId),
      }
    });
  }

  async getCategories(): Promise<DatabaseCategory[]> {
    return await prisma.category.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
      include: {
        meals: true
      }
    });
  }

  async getCategoriesLocalized(language: Language): Promise<LocalizedCategory[]> {
    const categories = await this.getCategories();
    
    return categories.map((category: any) => ({
      id: category.id,
      name: getLocalizedName(category, language),
      description: getLocalizedDescription(category, language),
      imageCard: category.imageCard,
      imageBackground: category.imageBackground,
      order: category.order,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      restaurantId: category.restaurantId
    }));
  }

  async getCategoryById(id: string): Promise<DatabaseCategory | null> {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        meals: true
      }
    });
  }

  async updateCategory(id: string, data: UpdateCategory): Promise<DatabaseCategory> {
    return await prisma.category.update({
      where: { id },
      data
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id }
    });
  }

  // === БЛЮДА ===
  
  async createMeal(data: CreateMeal): Promise<DatabaseMeal> {
    return await prisma.meal.create({
      data
    });
  }

  async getMeals(): Promise<DatabaseMeal[]> {
    return await prisma.meal.findMany({
      include: {
        category: true
      }
    });
  }

  async getMealsByCategory(categoryId: string): Promise<DatabaseMeal[]> {
    return await prisma.meal.findMany({
      where: { categoryId },
      include: {
        category: true
      }
    });
  }

  async getMealsByCategoryLocalized(categoryId: string, language: Language): Promise<LocalizedMeal[]> {
    const meals = await this.getMealsByCategory(categoryId);
    
    return meals.map(meal => ({
      id: meal.id,
      name: getLocalizedName(meal, language),
      categoryId: meal.categoryId,
      price: meal.price,
      description: getLocalizedDescription(meal, language),
      image: meal.image,
      createdAt: meal.createdAt,
      updatedAt: meal.updatedAt
    }));
  }

  async getMealById(id: string): Promise<DatabaseMeal | null> {
    return await prisma.meal.findUnique({
      where: { id },
      include: {
        category: true
      }
    });
  }

  async updateMeal(id: string, data: UpdateMeal): Promise<DatabaseMeal> {
    return await prisma.meal.update({
      where: { id },
      data
    });
  }

  async deleteMeal(id: string): Promise<void> {
    await prisma.meal.delete({
      where: { id }
    });
  }

  // === ЗАКАЗЫ ===
  
  async createOrder(data: CreateOrder): Promise<DatabaseOrder> {
    // Получаем или создаем клиента
    const client = await this.getOrCreateClient(data.phoneNumber);
    
    // Вычисляем общую стоимость заказа
    let totalAmount = 0;
    const orderItems: Array<{
      mealId: string;
      amount: number;
      price: number;
    }> = [];
    
    for (const product of data.products) {
      const meal = await this.getMealById(product.id);
      if (!meal) {
        throw new Error(`Meal with id ${product.id} not found`);
      }
      
      const itemTotal = meal.price * product.amount;
      totalAmount += itemTotal;
      
      orderItems.push({
        mealId: product.id,
        amount: product.amount,
        price: meal.price
      });
    }
    
    // Создаем заказ с элементами в транзакции
  const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          phoneNumber: data.phoneNumber,
          clientId: data.clientId || client.id,
          totalAmount,
          status: 'PENDING'
        }
      });
      
      // Создаем элементы заказа
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: newOrder.id,
          ...item
        }))
      });
      
      return newOrder as DatabaseOrder;
    });
    
    return order;
  }

  async getOrders(): Promise<DatabaseOrder[]> {
    const orders = await prisma.order.findMany({
      include: {
        client: true,
        orderItems: {
          include: {
            meal: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return orders as DatabaseOrder[];
  }

  async getOrderById(id: string): Promise<DatabaseOrder | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        orderItems: {
          include: {
            meal: true
          }
        }
      }
    });
    
    return order as DatabaseOrder | null;
  }

  async getOrdersByPhone(phoneNumber: string): Promise<DatabaseOrder[]> {
    const orders = await prisma.order.findMany({
      where: { phoneNumber },
      include: {
        client: true,
        orderItems: {
          include: {
            meal: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return orders as DatabaseOrder[];
  }

  async updateOrderStatus(id: string, status: string): Promise<DatabaseOrder> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any }
    });
    
    return order as DatabaseOrder;
  }

  async deleteOrder(id: string): Promise<void> {
  await prisma.$transaction(async (tx: any) => {
      // Сначала удаляем элементы заказа
      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });
      
      // Затем удаляем сам заказ
      await tx.order.delete({
        where: { id }
      });
    });
  }

  // === СТАТИСТИКА ===
  
  async getOrdersCount(): Promise<number> {
    return await prisma.order.count();
  }

  async getOrdersCountByStatus(status: string): Promise<number> {
    return await prisma.order.count({
      where: { status: status as any }
    });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await prisma.order.aggregate({
      where: {
        status: {
          in: ['DELIVERED', 'READY']
        }
      },
      _sum: {
        totalAmount: true
      }
    });
    
    return result._sum.totalAmount || 0;
  }

  async getPopularMeals(limit: number = 10): Promise<Array<{ meal: DatabaseMeal; orderCount: number }>> {
    const popularMeals = await prisma.orderItem.groupBy({
      by: ['mealId'],
      _count: {
        mealId: true
      },
      _sum: {
        amount: true
      },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      },
      take: limit
    });

    const mealsWithDetails = await Promise.all(
      popularMeals.map(async (item: any) => {
        const meal = await this.getMealById(item.mealId);
        return {
          meal: meal!,
          orderCount: item._sum.amount || 0
        };
      })
    );

    return mealsWithDetails;
  }
}

// Экспортируем единственный экземпляр сервиса
export const databaseService = new DatabaseService();