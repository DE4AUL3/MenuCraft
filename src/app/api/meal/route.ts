import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (categoryId) {
      // Получить блюда по категории
      const meals = await prisma.meal.findMany({
        where: { categoryId },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(meals);
    } else {
      // Получить все блюда
      const meals = await prisma.meal.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(meals);
    }
  } catch (error) {
    console.error('Ошибка получения блюд:', error);
    return NextResponse.json({ error: 'Ошибка получения блюд' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameRu, nameTk, categoryId, price, descriptionRu, descriptionTk, image } = body;

    const meal = await prisma.meal.create({
      data: {
        nameRu,
        nameTk,
        categoryId,
        price,
        descriptionRu,
        descriptionTk,
        image,
      },
    });

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания блюда:', error);
    return NextResponse.json({ error: 'Ошибка создания блюда' }, { status: 500 });
  }
}
