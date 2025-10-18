import { notFound } from 'next/navigation';
import RestaurantMenu from '../../../components/Restaurant/RestaurantMenu';

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  // Загружаем данные ресторана с API (который обращается к БД)
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/restaurant/${id}`, {
    // Кэш можно регулировать для ISR/SSR
    cache: 'no-store'
  });

  if (!res.ok) {
    notFound();
  }

  const restaurant = await res.json();

  return <RestaurantMenu restaurant={restaurant} />;
}