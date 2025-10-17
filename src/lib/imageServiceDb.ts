'use client';

import { imageCache } from '@/lib/imageCache';

// Новый сервис для работы с изображениями через API вместо localStorage
export interface ImageInfo {
  id: string;
  filename: string;
  size: number;
  uploadedAt?: string;
  createdAt?: string;
  category: 'logos' | 'categories' | 'products' | 'other';
  url: string;
  alt?: string;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class ImageService {
  
  // Загрузка изображения на сервер
  async uploadImage(
    file: File, 
    category: 'logos' | 'categories' | 'products' | 'other' = 'other',
    alt?: string
  ): Promise<ImageUploadResult> {
    try {
      // Проверяем файл
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (alt) formData.append('alt', alt);
      
      console.log('Отправляем запрос с данными:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category
      });

      // Отправляем запрос на API с правильными заголовками
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
        // Не устанавливаем заголовок Content-Type, 
        // браузер автоматически добавит правильный multipart/form-data с boundary
      });

      console.log('Получен ответ:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка при загрузке изображения:', errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || 'Ошибка загрузки');
        } catch (e) {
          throw new Error('Ошибка загрузки: ' + errorText);
        }
      }

      const result = await response.json();
      
      return {
        success: true,
        url: result.image.url
      };
    } catch (error) {
      console.error('Ошибка при загрузке изображения:', error);
      return {
        success: false,
        error: 'Ошибка загрузки изображения: ' + (error as Error).message
      };
    }
  }

  // Проверка типа файла
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Поддерживаются только форматы: JPG, PNG, WEBP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Размер файла не должен превышать 5MB'
      };
    }

    return { valid: true };
  }

  // Получение URL изображения для отображения
  getImageUrl(imageUrl: string): string {
    // Проверяем наличие URL
    if (!imageUrl) {
      return '/images/placeholder.svg';
    }
    
    // Проверяем кэш
    const cachedUrl = imageCache.get(imageUrl);
    if (cachedUrl) {
      return cachedUrl;
    }
    
    // Если это локальная ссылка старого формата, заменяем на заглушку
    if (imageUrl.startsWith('local:')) {
      return '/images/placeholder.svg';
    }
    
    // Возвращаем URL как есть
    return imageUrl;
  }

  // Получение всех изображений
  async getAllImages(): Promise<ImageInfo[]> {
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Ошибка получения изображений');
      }
      
      const data = await response.json();
      
      // Предварительная загрузка изображений в кэш
      if (data.images && data.images.length > 0) {
        data.images.forEach((img: ImageInfo) => {
          if (img.url) {
            imageCache.preload(img.url);
          }
        });
      }
      
      return data.images;
    } catch (error) {
      console.error('Ошибка при получении изображений:', error);
      return [];
    }
  }

  // Получение изображений по категории
  async getImagesByCategory(category: 'logos' | 'categories' | 'products' | 'other'): Promise<ImageInfo[]> {
    try {
      const response = await fetch(`/api/images?category=${category}`);
      if (!response.ok) {
        throw new Error('Ошибка получения изображений');
      }
      
      const data = await response.json();
      
      // Предварительная загрузка изображений в кэш
      if (data.images && data.images.length > 0) {
        data.images.forEach((img: ImageInfo) => {
          if (img.url) {
            imageCache.preload(img.url);
          }
        });
      }
      
      return data.images;
    } catch (error) {
      console.error('Ошибка при получении изображений по категории:', error);
      return [];
    }
  }
  
  // Удаление изображения (если нужно)
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Если URL не начинается с /, это не наше изображение
      if (!imageUrl || !imageUrl.startsWith('/')) {
        return false;
      }
      
      // Извлекаем ID из URL (предполагается, что ID - это название файла без расширения)
      const parts = imageUrl.split('/');
      const fileName = parts[parts.length - 1];
      const id = fileName.split('.')[0];
      
      if (!id) return false;
      
      const response = await fetch(`/api/images?id=${id}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      return false;
    }
  }

  // Форматирование размера файла
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const imageService = new ImageService();