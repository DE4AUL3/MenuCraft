'use client';

import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import SmartImage from '@/components/ui/SmartImage';
import { imageService } from '@/lib/imageServiceDb';
import { XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  imageUrl: string | null;
  onImageChange: (url: string | null) => void;
  category: 'logos' | 'categories' | 'products' | 'other';
  className?: string;
  aspect?: 'square' | 'wide' | 'tall';
  placeholder?: string;
  imageManagerTitle?: string;
}

export default function ImageUpload({
  imageUrl,
  onImageChange,
  category,
  className = '',
  aspect = 'square',
  placeholder = 'Загрузите изображение',
  imageManagerTitle = 'Выберите изображение'
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Определяем соотношение сторон
  const aspectRatioClass = 
    aspect === 'square' ? 'aspect-square' : 
    aspect === 'wide' ? 'aspect-[16/9]' : 
    'aspect-[3/4]';
  
  // Обработчик клика по компоненту
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Обработчик выбора файла
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Проверяем, это ли изображение
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение');
      return;
    }
    
    try {
      // Показываем уведомление о загрузке
      const loadingToast = toast.loading('Загрузка изображения...');
      
      // Загружаем изображение через сервис
      const result = await imageService.uploadImage(file, category);
      
      // Закрываем уведомление о загрузке
      toast.dismiss(loadingToast);
      
      if (result.success) {
        // Обновляем URL изображения
        onImageChange(result.url || null);
        toast.success('Изображение загружено');
      } else {
        toast.error(`Ошибка при загрузке изображения: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      toast.error('Не удалось загрузить изображение');
    }
    
    // Сбрасываем input для возможности загрузки того же файла снова
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Обработчик открытия менеджера изображений
  const handleOpenImageManager = () => {
    // Динамически загружаем модуль менеджера изображений
    import('./ImageManagerModal').then(({ default: ImageManagerModal }) => {
      // Создаем экземпляр модального окна
      const modalContainer = document.createElement('div');
      document.body.appendChild(modalContainer);
      
      // Функция для выбора изображения
      const handleSelectImage = (url: string) => {
        onImageChange(url);
        // Удаляем контейнер модального окна после выбора
        document.body.removeChild(modalContainer);
      };
      
      // Функция для закрытия модального окна
      const handleClose = () => {
        document.body.removeChild(modalContainer);
      };
      
      // Рендерим модальное окно в контейнере (React 18 createRoot)
      const root = createRoot(modalContainer);
      root.render(
        <ImageManagerModal
          title={imageManagerTitle}
          onSelect={handleSelectImage}
          onClose={handleClose}
          category={category}
        />
      );
    });
  };

  // Обработчик удаления изображения
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    toast.success('Изображение удалено');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={handleClick}
        className={`
          ${aspectRatioClass}
          relative
          border-2
          border-dashed
          rounded-lg
          overflow-hidden
          cursor-pointer
          transition-all
          duration-300
          flex
          items-center
          justify-center
          ${imageUrl ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'}
        `}
      >
        {imageUrl ? (
          // Отображаем загруженное изображение
          <>
            <SmartImage
              src={imageUrl}
              alt="Загруженное изображение"
              fill
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-3 py-1.5 rounded-lg transform translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                Изменить
              </div>
            </div>
          </>
        ) : (
          // Отображаем плейсхолдер
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium">{placeholder}</p>
          </div>
        )}
      </div>

      {/* Кнопка удаления изображения */}
      {imageUrl && (
        <button
          type="button"
          onClick={handleRemoveImage}
          className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full text-red-500 hover:text-red-700 shadow-sm"
        >
          <XCircle className="w-6 h-6" />
        </button>
      )}

      {/* Скрытый input для загрузки файла */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Кнопка для открытия менеджера изображений */}
      <div className="mt-2 text-center">
        <button
          type="button"
          onClick={handleOpenImageManager}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
        >
          Выбрать из галереи
        </button>
      </div>
    </div>
  );
}