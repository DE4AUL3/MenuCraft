import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Получаем данные клиента
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Получаем 5 последних заказов
        }
      }
    });

    if (!client) {
      return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 });
    }
    
    // Получаем статистику заказов
    const orderCount = await prisma.order.count({
      where: { clientId: id }
    });
    
    const totalAmount = await prisma.order.aggregate({
      where: { clientId: id },
      _sum: { totalAmount: true }
    });

    return NextResponse.json({
      id: client.id,
      name: client.name || client.phoneNumber,
      phone: client.phoneNumber,
      email: client.email,
      notes: client.notes,
      category: client.category,
      totalOrders: orderCount,
      totalAmount: totalAmount._sum?.totalAmount || 0,
      lastOrderDate: client.orders[0]?.createdAt.toISOString() || null,
      firstOrderDate: client.orders.length > 0 ? 
        client.orders[client.orders.length - 1].createdAt.toISOString() : null,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      recentOrders: client.orders.map(order => ({
        id: order.id,
        date: order.createdAt.toISOString(),
        status: order.status,
        total: order.totalAmount
      }))
    });
  } catch (error) {
    console.error('Ошибка получения данных контакта:', error);
    return NextResponse.json({ error: 'Ошибка получения данных контакта' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Проверяем, что клиент существует
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 });
    }

    // Обновляем данные клиента
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        phoneNumber: data.phone,
        email: data.email || null,
        notes: data.notes || null,
        category: data.category || 'customer',
      },
    });
    
    // Получаем статистику заказов для обновленного клиента
    const orderCount = await prisma.order.count({
      where: { clientId: id }
    });
    
    const totalAmount = await prisma.order.aggregate({
      where: { clientId: id },
      _sum: { totalAmount: true }
    });
    
    const lastOrder = await prisma.order.findFirst({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' }
    });
    
    const firstOrder = await prisma.order.findFirst({
      where: { clientId: id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({
      id: updatedClient.id,
      name: updatedClient.name || updatedClient.phoneNumber,
      phone: updatedClient.phoneNumber,
      email: updatedClient.email,
      notes: updatedClient.notes,
      category: updatedClient.category,
      totalOrders: orderCount,
      totalAmount: totalAmount._sum?.totalAmount || 0,
      lastOrderDate: lastOrder?.createdAt.toISOString() || null,
      firstOrderDate: firstOrder?.createdAt.toISOString() || null,
      success: true
    });
  } catch (error) {
    console.error('Ошибка обновления контакта:', error);
    return NextResponse.json({ error: 'Ошибка обновления контакта' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Проверяем, что клиент существует
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 });
    }

    // Удаляем клиента
    await prisma.client.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления контакта:', error);
    return NextResponse.json({ error: 'Ошибка удаления контакта' }, { status: 500 });
  }
}