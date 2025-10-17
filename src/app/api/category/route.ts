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

    const category = await prisma.category.create({
      data: {
        nameRu,
        nameTk,
        descriptionRu,
        descriptionTk,
        imageCard,
        imageBackground,
        order,
        status: status ?? true,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка создания категории' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения категорий' }, { status: 500 });
  }
}
