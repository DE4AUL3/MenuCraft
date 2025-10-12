import { notFound } from 'next/navigation';
import RestaurantMenu from '../../../components/Restaurant/RestaurantMenu';

const restaurants = {
  'kemine-bistro': {
    id: 'kemine-bistro',
    name: 'Kemine Bistro',
    description: 'Европейская кухня с восточными нотками',
    image: '/images/kemine-bistro.jpg',
    rating: 4.8,
    isOpen: true,
    workingHours: '09:00 - 23:00',
    location: 'Бишкек, ул. Чуй 1',
    phone: '+996 555 123 456',
    whatsapp: '+996555123456'
  },
  'sultan-palace': {
    id: 'sultan-palace',
    name: 'Sultan Palace',
    description: 'Традиционная восточная кухня',
    image: '/images/sultan-palace.jpg',
    rating: 4.6,
    isOpen: true,
    workingHours: '10:00 - 22:00',
    location: 'Бишкек, пр. Манас 15',
    phone: '+996 555 654 321',
    whatsapp: '+996555654321'
  }
};

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = restaurants[id as keyof typeof restaurants];

  if (!restaurant) {
    notFound();
  }

  return <RestaurantMenu restaurant={restaurant} />;
}

export function generateStaticParams() {
  return Object.keys(restaurants).map((id) => ({
    id,
  }));
}