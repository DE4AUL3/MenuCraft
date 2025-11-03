"use client";


import DishCard from '@/components/DishCard';
import type { Dish as CommonDish } from '@/types/common';
import { useTheme } from '@/hooks/useTheme';

interface MenuDishCardProps {
  dish: CommonDish;
  language?: 'ru' | 'tk';
}

export default function MenuDishCard({ dish, language = 'ru' }: MenuDishCardProps) {
  const { currentTheme } = useTheme();
  const simpleDish = {
    id: dish.id,
    name: language === 'tk' ? dish.name.tk : dish.name.ru,
    description: language === 'tk' ? (dish.description?.tk || '') : (dish.description?.ru || ''),
    price: dish.price,
    image: dish.image || '/images/placeholder.svg'
  };

  return (
    <div
      className="group relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl"
      style={{
        background: currentTheme.colors.primary.background,
        border: `1.5px solid ${currentTheme.colors.secondary.border}`,
        color: currentTheme.colors.primary.text
      }}
    >
      <DishCard dish={simpleDish} />
    </div>
  );
}
