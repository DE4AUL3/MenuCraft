import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const phoneNumber = searchParams.get('phoneNumber');
    const category = searchParams.get('category');
    
    // Поиск конкретного клиента по номеру телефона
    if (phoneNumber) {
      const client = await prisma.client.findFirst({
        where: { phoneNumber },
        include: { 
          orders: {
            orderBy: { createdAt: 'desc' },
            take: 5, // Последние 5 заказов
          }
        },
      });

      if (!client) {
        return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 });
      }

      return NextResponse.json(client);
    }

    // Построение запроса для поиска
    const whereCondition: any = {};
    
    if (search) {
      whereCondition.OR = [
        { phoneNumber: { contains: search } }
      ];
    }
    
    // Получаем всех клиентов с их заказами
    const clients = await prisma.client.findMany({
      where: whereCondition,
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Только последний заказ
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Форматируем данные для фронтенда
    const formattedClients = await Promise.all(clients.map(async (client) => {
      // Получаем количество заказов
      const orderCount = await prisma.order.count({
        where: { clientId: client.id }
      });
      
      // Получаем общую сумму заказов
      const totalAmount = await prisma.order.aggregate({
        where: { clientId: client.id },
        _sum: { totalAmount: true }
      });
      
      // Получаем дату первого заказа
      const firstOrder = await prisma.order.findFirst({
        where: { clientId: client.id },
        orderBy: { createdAt: 'asc' }
      });

      // Форматируем дату последнего заказа
      let lastOrderDate = null;
      if (client.orders[0]?.createdAt) {
        lastOrderDate = client.orders[0].createdAt.toISOString();
      }

      return {
        id: client.id,
        name: client.name || client.phoneNumber, // Используем имя, если есть, иначе телефон
        phone: client.phoneNumber,
        email: client.email,
        notes: client.notes,
        category: client.category,
        totalOrders: orderCount,
        totalAmount: totalAmount._sum?.totalAmount || 0,
        lastOrderDate,
        firstOrderDate: firstOrder?.createdAt.toISOString(),
        createdAt: client.createdAt.toISOString(),
        updatedAt: client.updatedAt.toISOString(),
        isActive: true
      };
    }));

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error('Ошибка получения контактов:', error);
    return NextResponse.json({ error: 'Ошибка получения контактов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, name, email, notes, category } = body;

    // Проверяем, есть ли уже такой клиент
    const existingClient = await prisma.client.findUnique({
      where: { phoneNumber },
    });

    if (existingClient) {
      // Если клиент уже существует, обновляем его данные
      const updatedClient = await prisma.client.update({
        where: { id: existingClient.id },
        data: {
          name: name || existingClient.name,
          email: email || existingClient.email,
          notes: notes || existingClient.notes,
          category: category || existingClient.category
        },
      });

      // Получаем статистику по заказам
      const orderCount = await prisma.order.count({
        where: { clientId: updatedClient.id }
      });

      const totalAmount = await prisma.order.aggregate({
        where: { clientId: updatedClient.id },
        _sum: { totalAmount: true }
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
        createdAt: updatedClient.createdAt.toISOString(),
        updatedAt: updatedClient.updatedAt.toISOString(),
        isActive: true
      }, { status: 200 });
    }

    // Создаем нового клиента
    const newClient = await prisma.client.create({
      data: { 
        phoneNumber, 
        name, 
        email, 
        notes, 
        category: category || 'customer' 
      },
    });

    return NextResponse.json({
      id: newClient.id,
      name: newClient.name || newClient.phoneNumber,
      phone: newClient.phoneNumber,
      email: newClient.email,
      notes: newClient.notes,
      category: newClient.category,
      totalOrders: 0,
      totalAmount: 0,
      createdAt: newClient.createdAt.toISOString(),
      updatedAt: newClient.updatedAt.toISOString(),
      isActive: true
    }, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания/обновления контакта:', error);
    return NextResponse.json({ error: 'Ошибка создания/обновления контакта' }, { status: 500 });
  }
}
