import { NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Построение условия поиска
    const whereCondition: any = {};
    
    if (status) {
      if (status === 'active') {
        whereCondition.status = {
          in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'],
        };
      } else if (status === 'history') {
        whereCondition.status = {
          in: ['DELIVERED', 'CANCELLED'],
        };
      } else if (status !== 'all') {
        whereCondition.status = status;
      }
    }

    // Получаем заказы с элементами и связанными блюдами
    const orders = await prisma.order.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        client: true,
        orderItems: {
          include: {
            meal: true,
          },
        },
      },
    });

    // Преобразуем данные в формат, ожидаемый на фронтенде
    const formattedOrders = orders.map(order => {
      // Преобразуем статус из ENUM в нижний регистр для соответствия интерфейсу
      let status = order.status.toLowerCase() as any;
      
      // Соответствие между статусами Prisma и фронтенда
      if (status === 'pending') status = 'pending';
      else if (status === 'confirmed') status = 'confirmed';
      else if (status === 'preparing') status = 'preparing';
      else if (status === 'ready') status = 'ready';
      else if (status === 'delivered') status = 'delivered';
      else if (status === 'cancelled') status = 'cancelled';
      
      return {
        id: order.id,
        customerName: order.client?.phoneNumber || order.phoneNumber,
        customerPhone: order.phoneNumber,
        totalAmount: order.totalAmount,
        status: status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        items: order.orderItems.map(item => ({
          id: item.id,
          dishId: item.mealId,
          mealId: item.mealId, // Для совместимости с разными частями кода
          dishName: item.meal.nameRu,
          dishNameTk: item.meal.nameTk,
          price: item.price,
          quantity: item.amount,
          amount: item.amount, // Для совместимости с разными частями кода
          total: item.price * item.amount
        })),
        subtotal: order.orderItems.reduce((sum, item) => sum + item.price * item.amount, 0),
        deliveryFee: 0 // Пока нет поля доставки, можно добавить позже
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Ошибка получения заказов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, phoneNumber, items, address, notes, totalAmount } = body;
    
    // Создаем заказ
    const newOrder = await prisma.order.create({
      data: {
        clientId,
        phoneNumber,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: items.map((item: any) => ({
            mealId: item.mealId,
            price: item.price,
            amount: item.amount
          }))
        }
      },
      include: {
        orderItems: true
      }
    });
    
    return NextResponse.json({
      id: newOrder.id,
      phoneNumber: newOrder.phoneNumber,
      totalAmount: newOrder.totalAmount,
      status: newOrder.status,
      createdAt: newOrder.createdAt.toISOString(),
      items: newOrder.orderItems.map(item => ({
        id: item.id,
        mealId: item.mealId,
        price: item.price,
        quantity: item.amount
      }))
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Ошибка создания заказа' }, { status: 500 });
  }
}