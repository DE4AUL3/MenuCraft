"use client";

import DishCard from '@/components/DishCard';
import type { Dish as CommonDish } from '@/types/common';

interface MenuDishCardProps {
  dish: CommonDish;
  language?: 'ru' | 'tk';
}

export default function MenuDishCard({ dish, language = 'ru' }: MenuDishCardProps) {
  // Map common dish (with localized name/description) to simple Dish shape used by DishCard
  const simpleDish = {
    id: dish.id,
    name: language === 'tk' ? dish.name.tk : dish.name.ru,
    description: language === 'tk' ? (dish.description?.tk || '') : (dish.description?.ru || ''),
    price: dish.price,
    image: dish.image || '/images/placeholder.svg'
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <DishCard dish={simpleDish} />
    </div>
  );
}
