
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'sales', 'dishes', 'customers', 'performance'
    const days = parseInt(searchParams.get('days') || '30');


    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (type === 'sales') {
      // Получить статистику продаж по дням
      const orders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: { orderItems: true },
      });

      // Группируем по дням
      const salesByDate: Record<string, { sales: number; orders: number; customers: Set<string> }> = {};
      
  orders.forEach((order: any) => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!salesByDate[date]) {
          salesByDate[date] = { sales: 0, orders: 0, customers: new Set() };
        }
        salesByDate[date].sales += order.totalAmount;
        salesByDate[date].orders += 1;
        if (order.clientId) {
          salesByDate[date].customers.add(order.clientId);
        }
      });

      const salesData = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        sales: data.sales,
        orders: data.orders,
        customers: data.customers.size,
      }));

      return NextResponse.json(salesData);
    }

    if (type === 'dishes') {
      // Получить популярные блюда
      const orderItems = await prisma.orderItem.findMany({
        where: {
          order: {
            createdAt: {
              gte: startDate,
            },
          },
        },
        include: { meal: true },
      });

      const dishStats: Record<string, { name: string; orders: number; revenue: number }> = {};

  orderItems.forEach((item: any) => {
        const mealId = item.mealId;
        if (!dishStats[mealId]) {
          dishStats[mealId] = {
            name: item.meal.nameRu,
            orders: 0,
            revenue: 0,
          };
        }
        dishStats[mealId].orders += item.amount;
        dishStats[mealId].revenue += item.price * item.amount;
      });

      const dishes = Object.values(dishStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      return NextResponse.json(dishes);
    }

    if (type === 'overview') {
      // Общая статистика для OverviewModule (без ресторанов)
      const totalCategories = await prisma.category.count();
      const totalDishes = await prisma.meal.count();
      const avgPriceAgg = await prisma.meal.aggregate({ _avg: { price: true } });
      const averagePrice = Math.round(avgPriceAgg._avg.price || 0);
      const totalPriceAgg = await prisma.meal.aggregate({ _sum: { price: true } });
      const totalPrice = totalPriceAgg._sum.price || 0;
      const estimatedRevenue = Math.round(totalPrice * 2.5);
      return NextResponse.json({
        totalRestaurants: 0,
        totalCategories,
        totalDishes,
        averagePrice,
        estimatedRevenue,
        totalPrice
      });
    }
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Ошибка получения аналитики:', error);
    return NextResponse.json({ error: 'Ошибка получения аналитики' }, { status: 500 });
  }
}
