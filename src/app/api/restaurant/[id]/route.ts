import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    
    // Для тестирования возвращаем заглушечные данные
    // В реальном приложении здесь должен быть запрос к БД
    const restaurant = {
      id: restaurantId,
      name: restaurantId === 'han-tagam' ? 'Han Tagam' : 'Panda Burger',
      logo: restaurantId === 'han-tagam' ? '/khan-tagam-logo.svg' : '/panda-burger-logo.svg',
      description: restaurantId === 'han-tagam' 
        ? 'Традиционная туркменская кухня с современной подачей'
        : 'Сочные бургеры и американская кухня премиум-класса',
      descriptionTk: restaurantId === 'han-tagam'
        ? 'Häzirki zaman usulynda hödürlenýän adaty türkmen aşhanasy'
        : 'Damsly burgerler we ýokary derejeli amerikan aşhanasy',
      cuisine: restaurantId === 'han-tagam' ? 'Туркменская кухня' : 'Американская кухня',
      rating: restaurantId === 'han-tagam' ? 4.9 : 4.8,
      phone: restaurantId === 'han-tagam' ? '+993 (65) 987-65-43' : '+993 (12) 123-45-67',
      address: restaurantId === 'han-tagam' 
        ? 'г. Ашхабад, ул. Туркменбаши, 28'
        : 'г. Ашхабад, ул. Нейтральности, 15',
      image: restaurantId === 'han-tagam' ? '/han_tagam.jpg' : '/panda_logo.jpg',
      gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
      features: restaurantId === 'han-tagam'
        ? ['Национальная кухня', 'WiFi', 'QR заказ', 'Авторские блюда']
        : ['Быстрая доставка', 'WiFi', 'QR заказ', 'Премиум качество'],
      isOpen: restaurantId === 'han-tagam' ? false : true,
      deliveryTime: restaurantId === 'han-tagam' ? '35-45 мин' : '20-30 мин',
      deliveryTimeTk: restaurantId === 'han-tagam' ? '35-45 min' : '20-30 min'
    };

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Ошибка при получении данных ресторана:', error);
    return NextResponse.json({ error: 'Ошибка при получении данных ресторана' }, { status: 500 });
  }
}