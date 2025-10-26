"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

import type { Dish } from '@/types';
import { useTranslation } from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';
import { useCart } from '@/hooks/useCart';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { t } = useTranslation();
  const { currentRestaurant } = useTheme();
  const { addItem } = useCart();

  const [orderMode, setOrderMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1';

  const handleAdd = () => {
    addItem({
      id: dish.id,
      name: dish.name,
      description: dish.description || '',
      price: dish.price,
      image: dish.image || '',
      quantity,
      category: '',
      ingredients: []
    });
    setQuantity(1);
    setOrderMode(false);
  };

  return (
    <div className={`rounded-2xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 border ${
      isDark ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-100'
    }`}
    >
      {/* Image */}
      <div className="relative h-64 md:h-72 w-full bg-gray-100">
        <Image
          src={dish.image || '/images/menu/placeholder.jpg'}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`px-3 py-1 rounded-full backdrop-blur-sm ${isDark ? 'bg-black/60' : 'bg-white/80'}`}>
            <span className="text-lg font-bold text-emerald-600">{dish.price} сом</span>
          </div>
        </div>
      </div>

      {/* Lower content: swapped in-place when orderMode toggles */}
      <div className="p-4 h-[180px] md:h-[160px] flex flex-col justify-between transition-all duration-200">
        {!orderMode ? (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{dish.name}</h3>
              {dish.description ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3">{dish.description}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{t('order')}</span>
              </div>

              <button
                className="ml-auto w-36 md:w-40 py-2 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                onClick={() => setOrderMode(true)}
                aria-label={t('order')}
                data-testid="order-btn"
              >
                {t('order')}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Счетчик и сумма */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <button
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="decrease"
                >
                  –
                </button>
                <div className="w-12 text-center font-semibold">{quantity}</div>
                <button
                  className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold"
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="increase"
                >
                  +
                </button>
              </div>
              <div className="text-sm font-semibold text-emerald-700">{dish.price * quantity} сом</div>
            </div>
            {/* Кнопки назад и добавить в корзину */}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => setOrderMode(false)}
                aria-label={t('back')}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                data-testid="back-btn"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                onClick={handleAdd}
                aria-label="add-to-cart"
                data-testid="add-to-cart-btn"
                className="flex-1 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-semibold"
              >
                <ShoppingCart className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

