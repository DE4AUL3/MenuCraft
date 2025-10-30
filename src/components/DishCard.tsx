"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';

import type { Dish } from '@/types';
import { useTranslation } from './LanguageToggle';
import { getAppThemeColors, getAppThemeClasses } from '@/styles/appTheme';
import { useCart } from '@/hooks/useCart';

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const { t } = useTranslation();
  const themeColors = getAppThemeColors('gold-elegance');
  const themeClasses = getAppThemeClasses('gold-elegance');
  const { addItem } = useCart();

  const [orderMode, setOrderMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
    <div className={`rounded-2xl shadow-md overflow-hidden transition-transform duration-200 hover:-translate-y-1 border ${themeClasses.card}`}
    >
      {/* Image */}
  <div className={`relative h-64 md:h-72 w-full ${themeClasses.bgSecondary}`}> 
        <Image
          src={dish.image || '/images/menu/placeholder.jpg'}
          alt={dish.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 z-10">
          <div className={`px-3 py-1 rounded-full backdrop-blur-sm ${themeClasses.surface} border border-transparent`}>
            <span className={`text-lg font-bold ${themeClasses.text}`}>{dish.price} сом</span>
          </div>
        </div>
      </div>

      {/* Lower content: swapped in-place when orderMode toggles */}
  <div className={`p-4 h-[180px] md:h-40 flex flex-col justify-between transition-all duration-200 ${themeClasses.bg}`}> 
        {!orderMode ? (
          <>
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text}`}>{dish.name}</h3>
              {dish.description ? (
                <p className={`text-sm ${themeClasses.textSecondary} mt-1 line-clamp-3`}>{dish.description}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`text-sm ${themeClasses.textMuted}`}>{t('order')}</span>
              </div>

              <button
                className={`ml-auto w-36 md:w-40 py-2 rounded-2xl font-semibold transition ${themeClasses.accent} text-white`}
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
                  className={`w-9 h-9 rounded-full ${themeClasses.bgSecondary} flex items-center justify-center text-lg font-bold`}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="decrease"
                >
                  –
                </button>
                <div className="w-12 text-center font-semibold">{quantity}</div>
                <button
                  className={`w-9 h-9 rounded-full ${themeClasses.bgSecondary} flex items-center justify-center text-lg font-bold`}
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="increase"
                >
                  +
                </button>
              </div>
              <div className={`text-sm font-semibold ${themeClasses.text}`}>{dish.price * quantity} сом</div>
            </div>
            {/* Кнопки назад и добавить в корзину */}
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                onClick={() => setOrderMode(false)}
                aria-label={t('back')}
                className={`w-10 h-10 rounded-full ${themeClasses.bgSecondary} flex items-center justify-center`}
                data-testid="back-btn"
              >
                <ArrowLeft className={`w-5 h-5 ${themeClasses.textSecondary}`} />
              </button>
              <button
                onClick={handleAdd}
                aria-label="add-to-cart"
                data-testid="add-to-cart-btn"
                className={`flex-1 flex items-center justify-center ${themeClasses.accent} text-white py-3 rounded-2xl font-semibold`}
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

