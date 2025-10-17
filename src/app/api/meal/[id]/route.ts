import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      return NextResponse.json({ error: 'Блюдо не найдено' }, { status: 404 });
    }

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Ошибка получения блюда:', error);
    return NextResponse.json({ error: 'Ошибка получения блюда' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { nameRu, nameTk, categoryId, price, descriptionRu, descriptionTk, image } = body;

    // Проверяем существование блюда
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: 'Блюдо не найдено' }, { status: 404 });
    }

    // Обновляем блюдо
    const meal = await prisma.meal.update({
      where: { id },
      data: {
        nameRu,
        nameTk,
        categoryId,
        price,
        descriptionRu: descriptionRu || '',
        descriptionTk: descriptionTk || '',
        image: image || '',
      },
    });

    return NextResponse.json(meal);
  } catch (error) {
    console.error('Ошибка обновления блюда:', error);
    return NextResponse.json({ error: 'Ошибка обновления блюда' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Проверяем существование блюда
    const existingMeal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!existingMeal) {
      return NextResponse.json({ error: 'Блюдо не найдено' }, { status: 404 });
    }

    // Удаляем блюдо
    await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Блюдо успешно удалено' });
  } catch (error) {
    console.error('Ошибка удаления блюда:', error);
    return NextResponse.json({ error: 'Ошибка удаления блюда' }, { status: 500 });
  }
}