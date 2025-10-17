import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    return NextResponse.json({ error: 'Ошибка получения клиентов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    const client = await prisma.client.create({
      data: {
        phoneNumber,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    return NextResponse.json({ error: 'Ошибка создания клиента' }, { status: 500 });
  }
}
