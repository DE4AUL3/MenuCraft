'use client';

import { storageSync } from './storageSync';

export interface ImageInfo {
  id: string;
  filename: string;
  size: number;
  uploadedAt: string;
  category: 'logos' | 'categories' | 'products' | 'other';
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class ImageService {
  
  // Конвертация файла в base64 для хранения в localStorage
  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Ошибка конвертации файла'));
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsDataURL(file);
    });
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

  // Сжатие изображения
  async compressImage(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Устанавливаем размеры для категорий (оптимальный размер)
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;

        // Пропорциональное масштабирование
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Рисуем изображение
        ctx?.drawImage(img, 0, 0, width, height);

        // Конвертируем обратно в файл
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Загрузка и обработка изображения
  async uploadImage(file: File, category: 'logos' | 'categories' | 'products' | 'other' = 'other', alt?: string): Promise<ImageUploadResult> {
    try {
      // Проверяем файл
      const validation = this.validateImageFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Сжимаем изображение
      const compressedFile = await this.compressImage(file);

      // Конвертируем в base64
      const base64 = await this.convertToBase64(compressedFile);

      // Создаем временное изображение для получения размеров
      const img = new Image();
      const dimensions = await new Promise<{width: number, height: number}>((resolve) => {
        img.onload = () => resolve({width: img.width, height: img.height});
        img.src = base64;
      });

      // Сохраняем в localStorage с уникальным ключом
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const imageData = {
        id: imageId,
        filename: file.name,
        data: base64,
        size: compressedFile.size,
        uploadedAt: new Date().toISOString(),
        category: category,
        alt: alt || '',
        width: dimensions.width,
        height: dimensions.height
      };

      storageSync.setItem(`image_${imageId}`, imageData);
      
      const url = `local:${imageId}`;

      return {
        success: true,
        url: url
      };

    } catch (error) {
      return {
        success: false,
        error: 'Ошибка загрузки изображения: ' + (error as Error).message
      };
    }
  }

  // Получение изображения по ID
  getImageById(imageId: string): string | null {
    try {
      const imageData = localStorage.getItem(`image_${imageId}`);
      if (imageData) {
        const parsed = JSON.parse(imageData);
        return parsed.data;
      }
      return null;
    } catch {
      return null;
    }
  }

  // Получение URL изображения для отображения
  getImageUrl(imageUrl: string): string {
    if (imageUrl.startsWith('local:')) {
      const imageId = imageUrl.replace('local:', '');
      
      const base64Data = this.getImageById(imageId);
      if (base64Data) {
        return base64Data;
      } else {
        return '/images/placeholder.svg';
      }
    }
    
    return imageUrl;
  }

  // Удаление изображения
  deleteImage(imageUrl: string): boolean {
    if (imageUrl.startsWith('local:')) {
      const imageId = imageUrl.replace('local:', '');
      storageSync.removeItem(`image_${imageId}`);
      return true;
    }
    return false;
  }

  // Получение информации о всех загруженных изображениях
  getAllImages(): ImageInfo[] {
    const images: ImageInfo[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('image_')) {
        try {
          const imageData = localStorage.getItem(key);
          if (imageData) {
            const parsed = JSON.parse(imageData);
            images.push({
              id: parsed.id,
              filename: parsed.filename,
              size: parsed.size,
              uploadedAt: parsed.uploadedAt,
              category: parsed.category || 'other',
              url: `local:${parsed.id}`,
              alt: parsed.alt || '',
              width: parsed.width || 0,
              height: parsed.height || 0
            });
          }
        } catch {
          // Игнорируем поврежденные записи
        }
      }
    }
    return images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  // Получение изображений по категории
  getImagesByCategory(category: 'logos' | 'categories' | 'products' | 'other'): ImageInfo[] {
    return this.getAllImages().filter(img => img.category === category);
  }

  // Обновление метаданных изображения
  updateImageMetadata(imageId: string, updates: Partial<Pick<ImageInfo, 'alt' | 'category'>>): boolean {
    try {
      const key = `image_${imageId}`;
      const imageData = localStorage.getItem(key);
      if (imageData) {
        const parsed = JSON.parse(imageData);
        const updated = { ...parsed, ...updates };
        localStorage.setItem(key, JSON.stringify(updated));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Получение статистики по изображениям
  getImageStats(): { total: number; byCategory: Record<string, number> } {
    const images = this.getAllImages();
    const stats = {
      total: images.length,
      byCategory: {
        logos: 0,
        categories: 0,
        products: 0,
        other: 0
      }
    };

    images.forEach(img => {
      stats.byCategory[img.category]++;
    });

    return stats;
  }

  // Очистка всех изображений
  clearAllImages(): void {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('image_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  // Получение размера всех изображений
  getTotalImagesSize(): number {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('image_')) {
        try {
          const imageData = localStorage.getItem(key);
          if (imageData) {
            const parsed = JSON.parse(imageData);
            totalSize += parsed.size || 0;
          }
        } catch {
          // Игнорируем поврежденные записи
        }
      }
    }
    return totalSize;
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