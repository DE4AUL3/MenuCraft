'use client';

// Кэш для изображений
class ImageCache {
  private cache: Map<string, string> = new Map();
  private maxSize: number = 100; // Максимальное количество кэшированных изображений
  
  constructor() {
    // Инициализация кэша из localStorage при возможности
    if (typeof window !== 'undefined') {
      try {
        const storedCache = localStorage.getItem('image_cache');
        if (storedCache) {
          const parsedCache = JSON.parse(storedCache);
          Object.entries(parsedCache).forEach(([key, value]) => {
            this.cache.set(key, value as string);
          });
          console.log(`📦 Загружено ${this.cache.size} изображений из кэша`);
        }
      } catch (error) {
        console.error('Ошибка загрузки кэша изображений:', error);
        this.clearCache();
      }
    }
  }
  
  // Получение URL изображения из кэша или возврат исходного URL
  get(url: string): string | null {
    if (!url) return null;
    return this.cache.get(url) || null;
  }
  
  // Сохранение URL в кэш
  set(url: string, dataUrl: string): void {
    if (!url || !dataUrl) return;
    
    // Если кэш переполнен, удаляем самые старые записи
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    // Добавляем URL в кэш
    this.cache.set(url, dataUrl);
    
    // Сохраняем кэш в localStorage
    if (typeof window !== 'undefined') {
      try {
        const cacheObject = Object.fromEntries(this.cache.entries());
        localStorage.setItem('image_cache', JSON.stringify(cacheObject));
      } catch (error) {
        console.error('Ошибка сохранения кэша изображений:', error);
      }
    }
  }
  
  // Очистка кэша
  clearCache(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('image_cache');
    }
    console.log('🧹 Кэш изображений очищен');
  }
  
  // Предварительная загрузка изображения
  async preload(url: string): Promise<string | null> {
    if (!url || typeof window === 'undefined') return null;
    
    // Проверяем, есть ли изображение в кэше
    const cachedUrl = this.get(url);
    if (cachedUrl) return cachedUrl;
    
    // Если изображение локальное, загружаем и кэшируем
    if (url.startsWith('/')) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        
        return new Promise((resolve) => {
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            this.set(url, dataUrl);
            resolve(dataUrl);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error(`Ошибка предварительной загрузки изображения ${url}:`, error);
        return null;
      }
    }
    
    return null;
  }
  
  // Получение размера кэша в килобайтах
  getSize(): number {
    try {
      if (typeof window === 'undefined') return 0;
      const cacheObject = Object.fromEntries(this.cache.entries());
      const cacheString = JSON.stringify(cacheObject);
      return Math.round(cacheString.length / 1024);
    } catch (error) {
      console.error('Ошибка при расчете размера кэша:', error);
      return 0;
    }
  }
}

// Экспортируем глобальный экземпляр кэша
export const imageCache = new ImageCache();

// Функция для предварительной загрузки набора изображений
export function preloadImages(urls: string[]): Promise<void> {
  const promises = urls.map(url => imageCache.preload(url));
  return Promise.all(promises).then(() => {
    console.log(`🔄 Предварительно загружено ${urls.length} изображений`);
  });
}