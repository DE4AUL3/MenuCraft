import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

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

    // Простая валидация входных данных
    if (!nameRu || !nameTk || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Обязательные поля: nameRu, nameTk, categoryId, price' }, { status: 400 });
    }

    // Проверяем, что категория существует
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 400 });
    }

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
    const message = error instanceof Error ? error.message : 'Ошибка создания блюда';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
