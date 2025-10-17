import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SmartImage from '@/components/ui/SmartImage';
import { imageService } from '@/lib/imageServiceDb'; 
import ImageUpload from '@/components/ui/ImageUpload';
import { Upload, RefreshCcw } from 'lucide-react';

interface ImagePickerProps {
  onSelect: (imageUrl: string) => void;
  value?: string;
  category?: string;
}

export function ImagePicker({ onSelect, value, category = 'other' }: ImagePickerProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    loadImages();
  }, []);
  
  async function loadImages() {
    setLoading(true);
    try {
      const allImages = await imageService.getAllImages();
      setImages(allImages);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      toast.error('Не удалось загрузить изображения');
    } finally {
      setLoading(false);
    }
  }
  
  function handleImageSelect(imageUrl: string) {
    onSelect(imageUrl);
    toast.success('Изображение выбрано!');
  }

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.category === filter);
    
  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setShowUploader(false)}
            className={`px-4 py-2 border-b-2 ${
              !showUploader 
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500'
            }`}
          >
            Галерея
          </button>
          <button
            onClick={() => setShowUploader(true)}
            className={`px-4 py-2 border-b-2 ${
              showUploader 
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500'
            }`}
          >
            Загрузить
          </button>
        </div>
      </div>
      
      {!showUploader ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setFilter('all')}
              >
                Все
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'categories' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setFilter('categories')}
              >
                Категории
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-md ${
                  filter === 'products' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setFilter('products')}
              >
                Блюда
              </button>
            </div>
            
            <button 
              className={`p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={loadImages} 
              disabled={loading}
            >
              <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
            
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-[400px] overflow-y-auto p-2">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 cursor-pointer hover:opacity-90 transition-all ${
                    value === image.url ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleImageSelect(image.url)}
                >
                  <SmartImage
                    src={image.url}
                    alt={image.alt || image.filename}
                    fill={true}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <Upload className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">Нет изображений</h3>
              <p className="mt-1 text-sm text-gray-500">
                Загрузите изображения через вкладку "Загрузить"
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-2">
          <ImageUpload
            imageUrl={value}
            onImageChange={(url) => {
              if (url) handleImageSelect(url);
              setShowUploader(false);
            }}
            category={'products' as any}
            placeholder="Загрузить новое изображение"
          />
        </div>
      )}
    </div>
  );
}