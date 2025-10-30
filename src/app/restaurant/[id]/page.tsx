import { notFound } from 'next/navigation';
import RestaurantMenu from '../../../components/Restaurant/RestaurantMenu';


interface RestaurantPageProps {
  params: Promise<{ id: string }>;
}


export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;

  // Получаем данные ресторана
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/restaurant/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) notFound();
  const restaurant = await res.json();

  // Получаем категории
  const catRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/restaurant/${id}/categories`, {
    cache: 'no-store'
  });
  const categoriesRaw = catRes.ok ? await catRes.json() : [];
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw.map((c: any) => c.name) : [];

  // TODO: menuItems — реализовать загрузку из БД/API, пока пустой массив
  const menuItems: any[] = [];

  return <RestaurantMenu restaurant={restaurant} menuItems={menuItems} categories={categories} />;
}