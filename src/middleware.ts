import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit, createRateLimiter } from './lib/rateLimit';

// Создаем ограничитель запросов для API с более мягкими лимитами
const apiRateLimiter = createRateLimiter({
  limit: 1000,       // 1000 запросов
  windowMs: 60000,   // за 1 минуту
});

// Более строгое ограничение для путей авторизации
const authRateLimiter = createRateLimiter({
  limit: 10,         // 10 запросов
  windowMs: 60000,   // за 1 минуту
});

export function middleware(req: NextRequest) {
  // Блокируем доступ к test-страницам в продакшн-окружении
  if (process.env.NODE_ENV === 'production' && req.nextUrl.pathname.startsWith('/test')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  // Ограничение частоты запросов для различных путей
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Более строгое ограничение для путей авторизации
    if (req.nextUrl.pathname.includes('/auth/') || req.nextUrl.pathname.includes('/login/')) {
      const result = authRateLimiter(req);
      if (result) return result;
    } 
    // Стандартное ограничение для всех остальных API маршрутов
    else if (!req.nextUrl.pathname.startsWith('/api/public/')) {
      const result = apiRateLimiter(req);
      if (result) return result;
    }
    
    // Доступ к API маршрутам - проверка API ключа
    if (!req.nextUrl.pathname.startsWith('/api/public/')) {
      // Получаем API ключ из заголовка
      const apiKey = req.headers.get('X-API-KEY');
      
      // Проверяем API ключ (в продакшене нужно использовать безопасное сравнение)
      const validApiKey = process.env.API_KEY || 'development-key';
      
      // Если ключ отсутствует или неверный, возвращаем ошибку доступа в продакшене
      if (process.env.NODE_ENV === 'production' && (!apiKey || apiKey !== validApiKey)) {
        // В продакшене логируем неудачные попытки доступа
        console.warn(`API access attempt with invalid key: ${apiKey}`);
        
        return NextResponse.json(
          { error: 'Unauthorized: Invalid API key' },
          { status: 401 }
        );
      }
    }
  }
  
  // Доступ к административной части - проверка авторизации
  if (req.nextUrl.pathname.startsWith('/admin/')) {
    // Применяем ограничение запросов к административной части
    const adminRateLimiter = createRateLimiter({
      limit: 30,         // 30 запросов
      windowMs: 60000,   // за 1 минуту
    });
    
    const result = adminRateLimiter(req);
    if (result) return result;
    
    // В реальном приложении здесь должна быть проверка сессии/JWT токена
    // Получаем токен авторизации
    const authToken = req.cookies.get('auth_token')?.value;
    
    // Простая заглушка для проверки (в продакшене заменить на JWT валидацию)
    // В разработке пока пропускаем без проверки
    const isAuthorized = process.env.NODE_ENV === 'development' || !!authToken;
    
    // Если нет авторизации, перенаправляем на страницу входа
    if (!isAuthorized) {
      console.warn(`Unauthorized admin access attempt to ${req.nextUrl.pathname}`);
      
      // Перенаправляем на страницу входа
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('returnUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/|static/|public/|favicon.ico|manifest.json|robots.txt|sw.js).*)',
    '/api/:path*',
    '/admin/:path*'
  ],
}
