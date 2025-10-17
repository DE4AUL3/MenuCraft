import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Получение всех ресторанов
export async function GET() {
  try {
    // Здесь должен быть запрос к базе данных для получения ресторанов
    // Пока возвращаем моковые данные, так как у нас нет таблицы restaurants в БД
    const restaurants = [
      {
        id: 'panda-burger',
        name: 'Panda Burger',
        logo: '/panda-burger-logo.svg',
        description: 'Сочные бургеры и американская кухня премиум-класса',
        descriptionTk: 'Damsly burgerler we ýokary derejeli amerikan aşhanasy',
        cuisine: 'Американская кухня',
        rating: 4.8,
        phone: '+993 (12) 123-45-67',
        address: 'г. Ашхабад, ул. Нейтральности, 15',
        image: '/panda_logo.jpg',
        gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
        features: ['Быстрая доставка', 'WiFi', 'QR заказ', 'Премиум качество'],
        isOpen: true,
        deliveryTime: '20-30 мин',
        deliveryTimeTk: '20-30 min'
      },
      {
        id: 'han-tagam',
        name: 'Han Tagam',
        logo: '/khan-tagam-logo.svg',
        description: 'Традиционная туркменская кухня с современной подачей',
        descriptionTk: 'Häzirki zaman usulynda hödürlenýän adaty türkmen aşhanasy',
        cuisine: 'Туркменская кухня',
        rating: 4.9,
        phone: '+993 (65) 987-65-43',
        address: 'г. Ашхабад, ул. Туркменбаши, 28',
        image: '/han_tagam.jpg',
        gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
        features: ['Национальная кухня', 'WiFi', 'QR заказ', 'Авторские блюда'],
        isOpen: false,
        deliveryTime: '35-45 мин',
        deliveryTimeTk: '35-45 min'
      }
    ];
    
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Ошибка при получении ресторанов:', error);
    return NextResponse.json({ error: 'Ошибка при получении ресторанов' }, { status: 500 });
  }
}