import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Получаем данные заказа
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

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }
    
    // Преобразуем статус из ENUM в нижний регистр для соответствия интерфейсу
    let status = order.status.toLowerCase() as any;
      
    // Соответствие между статусами Prisma и фронтенда
    if (status === 'pending') status = 'pending';
    else if (status === 'confirmed') status = 'confirmed';
    else if (status === 'preparing') status = 'preparing';
    else if (status === 'ready') status = 'ready';
    else if (status === 'delivered') status = 'delivered';
    else if (status === 'cancelled') status = 'cancelled';
    
    // Форматируем данные для фронтенда
    return NextResponse.json({
      id: order.id,
      customerName: order.client?.name || order.phoneNumber,
      customerPhone: order.phoneNumber,
      totalAmount: order.totalAmount,
      status: status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
  items: order.orderItems.map((item: any) => ({
        id: item.id,
        dishId: item.mealId,
        mealId: item.mealId, // Для совместимости
        dishName: item.meal.nameRu,
        dishNameTk: item.meal.nameTk,
        price: item.price,
        quantity: item.amount,
        amount: item.amount, // Для совместимости
        total: item.price * item.amount
      })),
  subtotal: order.orderItems.reduce((sum: number, item: any) => sum + item.price * item.amount, 0),
      deliveryFee: 0 // Можно добавить поле доставки в будущем
    });
  } catch (error) {
    console.error('Ошибка получения данных заказа:', error);
    return NextResponse.json({ error: 'Ошибка получения данных заказа' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Проверяем существование заказа
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    // Преобразуем статус из нижнего регистра в формат Prisma enum OrderStatus
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
        orderStatus = 'PENDING';
        break;
      case 'confirmed':
        orderStatus = 'CONFIRMED';
        break;
      case 'preparing':
        orderStatus = 'PREPARING';
        break;
      case 'ready':
        orderStatus = 'READY';
        break;
      case 'delivering':
      case 'delivered':
        orderStatus = 'DELIVERED';
        break;
      case 'cancelled':
        orderStatus = 'CANCELLED';
        break;
      default:
        return NextResponse.json({ error: 'Недопустимый статус' }, { status: 400 });
    }

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: orderStatus,
      },
    });

    // Преобразуем статус для ответа
    let responseStatus = updatedOrder.status.toLowerCase();
    if (responseStatus === 'pending') responseStatus = 'pending';
    else if (responseStatus === 'confirmed') responseStatus = 'confirmed';
    else if (responseStatus === 'preparing') responseStatus = 'preparing';
    else if (responseStatus === 'ready') responseStatus = 'ready';
    else if (responseStatus === 'delivered') responseStatus = 'delivered';
    else if (responseStatus === 'cancelled') responseStatus = 'cancelled';
    
    return NextResponse.json({
      id: updatedOrder.id,
      status: responseStatus,
      updatedAt: updatedOrder.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    return NextResponse.json({ error: 'Ошибка обновления заказа' }, { status: 500 });
  }
}