'use client';

import React, { useEffect, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Filter, Check, X } from 'lucide-react';
import SmartImage from '@/components/ui/SmartImage';
import { imageService, ImageInfo } from '@/lib/imageServiceDb';
import { imageCache } from '@/lib/imageCache';
import toast from 'react-hot-toast';

interface ImageManagerV2Props {
  title?: string;
  onSelect?: (imageUrl: string) => void;
  onDelete?: (imageUrl: string) => void;
  category?: 'logos' | 'categories' | 'products' | 'other';
  allowUpload?: boolean;
  className?: string;
  optimizeImages?: boolean;
}

export default function ImageManagerV2({
  title = 'Управление изображениями',
  onSelect,
  onDelete,
  category,
  allowUpload = true,
  className = '',
  optimizeImages = true
}: ImageManagerV2Props) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>(category || 'all');
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [selectedImages, setSelectedImages] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [cacheSize, setCacheSize] = useState<number>(0);

  // Загрузка изображений при монтировании компонента
  useEffect(() => {
    loadImages();
    
    // Обновляем размер кэша
    setCacheSize(imageCache.getSize());
    
    // Периодически обновляем размер кэша
    const interval = setInterval(() => {
      setCacheSize(imageCache.getSize());
    }, 30000); // Каждые 30 секунд
    
    return () => clearInterval(interval);
  }, []);

  // Загрузка изображений из API
  async function loadImages() {
    setLoading(true);
    try {
      const allImages = filter === 'all'
        ? await imageService.getAllImages()
        : await imageService.getImagesByCategory(filter as any);
      
      setImages(allImages);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      toast.error('Не удалось загрузить изображения');
    } finally {
      setLoading(false);
    }
  }

  // Обработчик выбора файлов
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Добавляем файлы в очередь загрузки
    const filesArray = Array.from(files);
    setUploadingFiles([...uploadingFiles, ...filesArray]);
    
    // Загружаем каждый файл
    for (const file of filesArray) {
      try {
        // Устанавливаем начальный прогресс
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Постепенно увеличиваем прогресс (имитация)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[file.name] || 0;
            // Имитируем прогресс до 90%
            if (currentProgress < 90) {
              return { ...prev, [file.name]: currentProgress + 10 };
            }
            return prev;
          });
        }, 300);
        
        // Оптимизируем изображение при необходимости
        let fileToUpload = file;
        if (optimizeImages) {
          fileToUpload = await optimizeImage(file);
        }
        
        // Загружаем файл
        const uploadCategory = filter === 'all' ? 'other' : filter as any;
        const result = await imageService.uploadImage(fileToUpload, uploadCategory);
        
        // Останавливаем интервал
        clearInterval(progressInterval);
        
        if (result.success) {
          setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
          
          // Обновляем список изображений
          setTimeout(() => {
            setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
            setUploadProgress(prev => {
              const { [file.name]: removed, ...rest } = prev;
              return rest;
            });
          }, 1000);
          
          await loadImages();
        } else {
          console.error('Ошибка загрузки файла:', result.error);
          toast.error(`Ошибка загрузки файла ${file.name}: ${result.error}`);
          setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
        }
      } catch (error) {
        console.error('Ошибка загрузки файла:', error);
        toast.error(`Ошибка загрузки файла ${file.name}`);
        setUploadingFiles(prev => prev.filter(f => f.name !== file.name));
      }
    }
  };

  // Оптимизация изображения (сжатие)
  const optimizeImage = async (file: File): Promise<File> => {
    // Проверяем, поддерживается ли оптимизация
    if (!optimizeImages || !file.type.startsWith('image/')) {
      return file;
    }
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Создаем холст для сжатия изображения
          const canvas = document.createElement('canvas');
          
          // Максимальные размеры (настройте по вашим требованиям)
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          
          let width = img.width;
          let height = img.height;
          
          // Уменьшаем размер, если изображение слишком большое
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const aspectRatio = width / height;
            
            if (width > height) {
              width = MAX_WIDTH;
              height = Math.floor(width / aspectRatio);
            } else {
              height = MAX_HEIGHT;
              width = Math.floor(height * aspectRatio);
            }
          }
          
          // Устанавливаем размеры холста
          canvas.width = width;
          canvas.height = height;
          
          // Рисуем изображение на холсте
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Конвертируем в blob с нужным качеством
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Если что-то пошло не так, возвращаем оригинальный файл
                return;
              }
              
              // Создаем новый File из Blob
              const optimizedFile = new File(
                [blob],
                file.name,
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              
              // Возвращаем оптимизированный файл
              resolve(optimizedFile);
            },
            'image/jpeg',
            0.8 // Качество JPEG (0.8 = 80%)
          );
        };
      };
    });
  };

  // Обработчик выбора изображения
  const handleSelectImage = (image: ImageInfo) => {
    if (!onSelect) return;
    
    // Вызываем колбэк выбора изображения
    onSelect(image.url);
    toast.success('Изображение выбрано');
    
    // Отмечаем изображение как выбранное
    setSelectedImages({
      ...selectedImages,
      [image.id]: !selectedImages[image.id]
    });
  };

  // Обработчик удаления изображения
  const handleDeleteImage = async (image: ImageInfo) => {
    // Спрашиваем подтверждение
    if (!confirm('Вы уверены, что хотите удалить это изображение? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      // Удаляем изображение
      const success = await imageService.deleteImage(image.url);
      
      if (success) {
        toast.success('Изображение удалено');
        
        // Вызываем колбэк удаления, если он предоставлен
        if (onDelete) {
          onDelete(image.url);
        }
        
        // Обновляем список изображений
        await loadImages();
      } else {
        toast.error('Не удалось удалить изображение');
      }
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      toast.error('Ошибка при удалении изображения');
    }
  };

  // Очистка кэша изображений
  const handleClearCache = () => {
    imageCache.clearCache();
    setCacheSize(0);
    toast.success('Кэш изображений очищен');
  };

  // Фильтруем изображения по выбранной категории
  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.category === filter);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок и статистика */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {title}
          </h2>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
            <span>Всего: {images.length}</span>
            {cacheSize > 0 && (
              <button 
                onClick={handleClearCache} 
                className="text-blue-600 hover:underline flex items-center"
              >
                <span>Кэш: {cacheSize} KB</span>
                <X className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>
        
        {/* Кнопка загрузки */}
        {allowUpload && (
          <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <UploadCloud className="w-4 h-4 mr-2" />
            Загрузить
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Фильтры по категориям */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
        {[
          { key: 'all', label: 'Все' },
          { key: 'logos', label: 'Логотипы' },
          { key: 'categories', label: 'Категории' },
          { key: 'products', label: 'Блюда' },
          { key: 'other', label: 'Другое' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {filter === key && <Check className="w-3 h-3" />}
            {label}
          </button>
        ))}
      </div>

      {/* Список загружаемых файлов */}
      {uploadingFiles.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Загрузка файлов...</h3>
          
          <div className="space-y-2">
            {uploadingFiles.map(file => (
              <div key={file.name} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {uploadProgress[file.name] || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[file.name] || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Сетка изображений */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              className={`relative group bg-white dark:bg-[#282828] rounded-lg overflow-hidden border shadow-sm
                ${selectedImages[image.id] ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
                ${onSelect ? 'cursor-pointer' : ''}
              `}
              onClick={() => onSelect && handleSelectImage(image)}
            >
              {/* Изображение */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                <SmartImage
                  src={image.url}
                  alt={image.alt || image.filename}
                  fill
                  className="object-contain p-1"
                />
                
                {/* Выбрано */}
                {selectedImages[image.id] && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                {/* Наложение с действиями */}
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image);
                      }}
                      className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700"
                      title="Удалить изображение"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Информация */}
              <div className="p-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {image.filename.length > 15 
                      ? image.filename.substring(0, 12) + '...' 
                      : image.filename}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {Math.round(image.size / 1024)} KB
                  </span>
                </div>
                <div className="mt-1">
                  <span className={`px-1.5 py-0.5 text-[10px] rounded ${
                    image.category === 'logos' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                    image.category === 'categories' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                    image.category === 'products' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
          <ImageIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Нет изображений
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filter !== 'all'
              ? `В категории "${filter}" еще нет изображений`
              : 'Загрузите изображения через кнопку "Загрузить"'}
          </p>
          
          {allowUpload && (
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <UploadCloud className="w-4 h-4 mr-2" />
              Загрузить изображения
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}