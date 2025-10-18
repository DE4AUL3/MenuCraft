// lib/cacheService.ts
import { LRUCache } from 'lru-cache';

// Конфигурация кэша для данных
const cacheOptions = {
  // Максимальное количество элементов в кэше
  max: 500,
  
  // Время жизни кэша в миллисекундах (10 минут)
  ttl: 1000 * 60 * 10,
  
  // Функция для определения размера объекта в кэше
  // Помогает предотвратить переполнение памяти
  sizeCalculation: (value: any, key: string) => {
    const jsonSize = JSON.stringify(value).length;
    return Math.ceil(jsonSize / 1024);
  },
  
  // Максимальный размер кэша (в единицах sizeCalculation)
  maxSize: 5000,
};

// Кэш для данных приложения
export const dataCache = new LRUCache(cacheOptions);

/**
 * Получает данные из кэша или вычисляет их
 * @param key Ключ кэша
 * @param fetchFn Функция для получения данных при промахе кэша
 * @param ttl Необязательное время жизни кэша для этого ключа
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Проверка наличия данных в кэше
  const cachedData = dataCache.get(key) as T | undefined;
  
  // Если данные есть в кэше, возвращаем их
  if (cachedData !== undefined) {
    return cachedData;
  }
  
  // Если данных нет в кэше, вызываем функцию для их получения
  try {
    const data = await fetchFn();
    
    // Помещаем полученные данные в кэш
    dataCache.set(key, data, { ttl });
    
    return data;
  } catch (error) {
    console.error(`Ошибка при получении данных для кэша: ${key}`, error);
    throw error;
  }
}

/**
 * Инвалидирует кэш для конкретного ключа или префикса
 * @param keyOrPattern Ключ или паттерн ключа для инвалидации
 */
export function invalidateCache(keyOrPattern: string | RegExp): void {
  if (typeof keyOrPattern === 'string') {
    // Инвалидируем конкретный ключ
    dataCache.delete(keyOrPattern);
  } else {
    // Инвалидируем все ключи, соответствующие регулярному выражению
    for (const key of dataCache.keys()) {
      if (keyOrPattern.test(key)) {
        dataCache.delete(key);
      }
    }
  }
}

/**
 * Полностью очищает кэш
 */
export function clearCache(): void {
  dataCache.clear();
}