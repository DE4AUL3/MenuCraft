// lib/rateLimit.ts
import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  // Максимальное количество запросов в указанный период
  limit?: number;
  
  // Период в секундах, для которого действует ограничение
  windowMs?: number;
  
  // Заголовок для идентификации источника запроса (по умолчанию IP)
  identifierHeader?: string;
}

interface RateLimitResult {
  // Можно ли выполнить запрос или превышен лимит
  success: boolean;
  
  // Оставшееся количество запросов
  remaining: number;
  
  // Заголовки для ответа с информацией о лимитах
  headers: Record<string, string>;
}

// Кэш для хранения счетчиков запросов по идентификатору
const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 60, // 1 час по умолчанию
});

/**
 * Middleware для ограничения частоты запросов
 * 
 * @param req Объект запроса Next.js
 * @param options Настройки ограничения запросов
 * @returns Результат проверки ограничения запросов
 */
export function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    limit = 60, // По умолчанию 60 запросов
    windowMs = 60 * 1000, // За 60 секунд
    identifierHeader
  } = options;

  // Определяем идентификатор источника запроса
  let identifier: string;
  
  if (identifierHeader && req.headers.get(identifierHeader)) {
    identifier = req.headers.get(identifierHeader) as string;
  } else {
    // Используем IP адрес как идентификатор
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    identifier = clientIp;
  }

  // Получаем текущий объект счетчика из кэша или создаем новый
  const now = Date.now();
  const windowStart = now - windowMs;
  
  const cachedItem = rateLimitCache.get(identifier) as { count: number, timestamps: number[] } | undefined;
  
  let timestamps = cachedItem?.timestamps || [];
  
  // Удаляем старые метки времени, которые вышли за пределы текущего окна
  timestamps = timestamps.filter(ts => ts > windowStart);
  
  // Добавляем текущую метку времени
  timestamps.push(now);
  
  // Сохраняем обновленную информацию в кэш
  rateLimitCache.set(identifier, { count: timestamps.length, timestamps }, { ttl: windowMs });
  
  // Проверяем, превышен ли лимит
  const remaining = Math.max(0, limit - timestamps.length);
  
  // Формируем заголовки для ответа
  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': (Math.ceil(now / 1000) + Math.floor(windowMs / 1000)).toString(),
  };

  return {
    success: timestamps.length <= limit,
    remaining,
    headers,
  };
}

/**
 * Создает middleware-обработчик для ограничения частоты запросов
 * 
 * @param options Настройки ограничения запросов
 * @returns Middleware-функция для Next.js
 */
export function createRateLimiter(options: RateLimitOptions = {}) {
  return function rateLimiterMiddleware(req: NextRequest) {
    const result = rateLimit(req, options);
    
    // Если лимит превышен, возвращаем ошибку 429
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({ error: 'Слишком много запросов, пожалуйста, повторите позже' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            ...result.headers,
          },
        }
      );
    }
    
    // В случае успеха просто добавляем заголовки к запросу
    // Next.js middleware должен вернуть null/undefined, чтобы запрос продолжил выполнение
    return undefined;
  };
}