import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

export async function GET() {
  try {
    // Получаем все категории из БД с сортировкой по полю order
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // Преобразуем категории из БД в формат, ожидаемый фронтендом
  const formattedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.nameRu,
      nameTk: cat.nameTk,
      description: cat.descriptionRu || '',
      descriptionTk: cat.descriptionTk || '',
      image: cat.imageCard || '',
      dishPageImage: cat.imageBackground || '',
      gradient: 'from-emerald-500 via-teal-500 to-emerald-700', // Дефолтный градиент
      isActive: cat.status,
      sortOrder: cat.order,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Ошибка получения категорий из БД:', error);
    return NextResponse.json({ error: 'Ошибка получения категорий из БД' }, { status: 500 });
  }
}