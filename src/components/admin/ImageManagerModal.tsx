'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageManagerV2 from './ImageManagerV2';

interface ImageManagerModalProps {
  title?: string;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
  category?: 'logos' | 'categories' | 'products' | 'other';
}

export default function ImageManagerModal({
  title = 'Выберите изображение',
  onSelect,
  onClose,
  category
}: ImageManagerModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Закрыть модальное окно с анимацией
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300); // Время соответствует продолжительности анимации
  };

  // Обработчик нажатия клавиши Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Функция выбора изображения
  const handleSelectImage = (url: string) => {
    onSelect(url);
    handleClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden transition-transform duration-300 ${
          isOpen ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 4.5rem)' }}>
          <ImageManagerV2
            title="Библиотека изображений"
            onSelect={handleSelectImage}
            category={category}
            allowUpload={true}
          />
        </div>
      </div>
    </div>
  );
}