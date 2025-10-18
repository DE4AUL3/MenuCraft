import { NextResponse } from 'next/server';
import { prisma } from '@/lib/databaseService';

// Получение всех ресторанов
export async function GET() {
  try {
    const items = await prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const restaurants = items.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      logo: r.logo || '',
      description: r.description || '',
      descriptionTk: r.descriptionTk || '',
      cuisine: '', // поле не хранится в БД, опционально можно добавить позже
      rating: r.rating || 0,
      phone: r.phone || '',
      address: r.address || '',
      image: r.image || '',
      gradient: r.gradient,
  features: Array.isArray(r.features) ? (r.features as unknown as string[]) : [],
      isOpen: r.isOpen,
      deliveryTime: r.deliveryTime || '',
      deliveryTimeTk: r.deliveryTime || ''
    }));

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Ошибка при получении ресторанов:', error);
    return NextResponse.json({ error: 'Ошибка при получении ресторанов' }, { status: 500 });
  }
}