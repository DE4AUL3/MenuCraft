import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');

    if (phoneNumber) {
      // Получить конкретного клиента по номеру телефона
      const client = await prisma.client.findUnique({
        where: { phoneNumber },
        include: { orders: true },
      });

      if (!client) {
        return NextResponse.json({ error: 'Клиент не найден' }, { status: 404 });
      }

      return NextResponse.json(client);
    }

    // Получить всех клиентов с их заказами
    const clients = await prisma.client.findMany({
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Последние 5 заказов
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Ошибка получения контактов:', error);
    return NextResponse.json({ error: 'Ошибка получения контактов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    // Проверяем, есть ли уже такой клиент
    const existingClient = await prisma.client.findUnique({
      where: { phoneNumber },
    });

    if (existingClient) {
      return NextResponse.json(existingClient, { status: 200 });
    }

    // Создаем нового клиента
    const newClient = await prisma.client.create({
      data: { phoneNumber },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания контакта:', error);
    return NextResponse.json({ error: 'Ошибка создания контакта' }, { status: 500 });
  }
}
