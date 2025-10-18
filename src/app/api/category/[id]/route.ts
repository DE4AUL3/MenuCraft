import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';
import { UpdateCategory } from '@/types/database';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Ошибка получения категории:', error);
    return NextResponse.json({ error: 'Ошибка получения категории' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateCategory = await request.json();
    const {
      nameRu,
      nameTk,
      descriptionRu,
      descriptionTk,
      imageCard,
      imageBackground,
      order,
      status,
      restaurantId
    } = body;

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      nameRu,
      nameTk,
      descriptionRu: descriptionRu || '',
      descriptionTk: descriptionTk || '',
      imageCard: imageCard || '',
      imageBackground: imageBackground || '',
      order,
      status,
    };
    
    // Добавляем restaurantId только если он передан
    if (restaurantId) {
      updateData.restaurantId = restaurantId;
    }
    
    // Обновляем категорию
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Ошибка обновления категории:', error);
    return NextResponse.json({ error: 'Ошибка обновления категории' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Проверяем существование категории
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Категория не найдена' }, { status: 404 });
    }

    // Удаляем категорию
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Категория успешно удалена' });
  } catch (error) {
    console.error('Ошибка удаления категории:', error);
    return NextResponse.json({ error: 'Ошибка удаления категории' }, { status: 500 });
  }
}