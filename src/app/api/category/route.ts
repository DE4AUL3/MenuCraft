export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nameRu,
      nameTk,
      descriptionRu,
      descriptionTk,
      imageCard,
      imageBackground,
      order,
      status
    } = body;

    // Валидация обязательных полей
    if (!nameRu || !nameTk || order === undefined) {
      return NextResponse.json({ error: 'Заполните все обязательные поля: название, перевод, порядок' }, { status: 400 });
    }

    // Создаем категорию с обязательными полями
    const category = await prisma.category.create({
      data: {
        nameRu,
        nameTk,
        descriptionRu: descriptionRu || '',
        descriptionTk: descriptionTk || '',
        imageCard: imageCard || '',
        imageBackground: imageBackground || '',
        order,
        status: status ?? true,
        restaurantId: 'han-tagam'
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Ошибка создания категории:', error);
    return NextResponse.json({ error: 'Ошибка создания категории' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CreateCategory, DatabaseCategory } from '@/types/database';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Получаем все категории, сортируем по полю order
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return NextResponse.json({ error: 'Ошибка получения категорий' }, { status: 500 });
  }
}
