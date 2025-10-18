import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (clientId) {
      const orders = await prisma.order.findMany({
        where: { clientId },
        include: { orderItems: { include: { meal: true } } },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(orders);
    }

    const orders = await prisma.order.findMany({
      include: { orderItems: { include: { meal: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Ошибка получения заказов:', error);
    return NextResponse.json({ error: 'Ошибка получения заказов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, clientId, status, orderItems } = body;

    // Вычисляем сумму из orderItems
    const totalAmount = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        phoneNumber,
        clientId,
        status,
        totalAmount,
        orderItems: {
          create: orderItems.map((item: any) => ({
            mealId: item.mealId,
            amount: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { orderItems: { include: { meal: true } } },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return NextResponse.json({ error: 'Ошибка создания заказа' }, { status: 500 });
  }
}
