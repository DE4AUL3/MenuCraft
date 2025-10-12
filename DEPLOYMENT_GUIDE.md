# 🚀 Руководство по развертыванию QR Menu App

## 📋 Предварительные требования

### Системные требования
- Node.js 18+ 
- npm или yarn
- Git

### Переменные окружения
Создайте файл `.env.local` в корне проекта:

```bash
# Базовые настройки
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Админ-панель
ADMIN_JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SESSION_TIMEOUT=7200000

# Уведомления (опционально)
ORDER_WEBHOOK_URL=https://your-webhook-url.com/orders
ADMIN_EMAIL=admin@your-domain.com

# Облачное хранилище (рекомендуется для продакшена)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# База данных (для продакшена)
DATABASE_URL=mongodb://your-mongo-connection-string
# или
POSTGRES_URL=postgresql://your-postgres-connection
```

## 🌐 Развертывание на Vercel (Рекомендуется)

### 1. Подготовка проекта
```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd catalog_cafe

# Установите зависимости
npm install

# Проверьте сборку
npm run build
```

### 2. Развертывание
```bash
# Установите Vercel CLI
npm i -g vercel

# Войдите в аккаунт
vercel login

# Разверните проект
vercel --prod
```

### 3. Настройка домена
- В Vercel Dashboard: Settings → Domains
- Добавьте ваш домен
- Настройте DNS записи у регистратора

## 🐳 Развертывание с Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## ⚙️ Настройка сервера

### Nginx конфигурация
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/fullchain.pem;
    ssl_certificate_key /etc/ssl/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Настройка админ-панели

### 1. Безопасность
- Смените JWT секрет в production
- Настройте HTTPS
- Ограничьте доступ к `/admin` по IP (опционально)

### 2. Первоначальная настройка
```bash
# Перейдите в админ-панель
https://your-domain.com/admin

# Создайте первые категории и товары
# Загрузите изображения
# Настройте рестораны
```

## 📱 PWA и мобильная оптимизация

### Настройки PWA уже включены:
- Service Worker
- Манифест приложения  
- Оффлайн поддержка
- Установка на домашний экран

### QR коды
- Генерируйте QR коды для каждого ресторана
- Формат: `https://your-domain.com/menu/[restaurant-id]`
- Печатайте на столах или стендах

## 🔄 Синхронизация данных

### Автоматическая синхронизация
Приложение автоматически синхронизирует изменения из админ-панели:
- Обновление меню в реальном времени
- Кэширование для быстрой загрузки
- API endpoints для интеграции

### API Endpoints
```bash
# Получить данные
GET /api/sync?type=menu
GET /api/sync?type=categories
GET /api/sync?type=stats

# Обновить кэш
POST /api/revalidate
{
  "type": "menu", // или "categories", "all"
  "path": "/menu/1"
}
```

## 📊 Мониторинг и аналитика

### Встроенная аналитика
- Просмотры страниц
- Популярные блюда
- Статистика заказов
- Время загрузки

### Интеграция с внешними сервисами
```javascript
// Google Analytics (добавьте в layout.tsx)
import { Analytics } from '@vercel/analytics/react';

// Yandex.Metrica
// Добавьте скрипт в head
```

## 🛠️ Обслуживание

### Резервное копирование
```bash
# Экспорт данных
npm run export-data

# Импорт данных
npm run import-data
```

### Обновления
```bash
# Получите последние изменения
git pull origin main

# Установите новые зависимости
npm install

# Пересоберите проект
npm run build

# Перезапустите
pm2 restart all
```

## 🆘 Поиск и устранение неисправностей

### Частые проблемы

1. **Изображения не загружаются**
   - Проверьте настройки localStorage
   - Убедитесь в правильности путей
   - Используйте cloudinary для продакшена

2. **Админ-панель не синхронизируется**
   - Проверьте API endpoints
   - Очистите кэш браузера
   - Перезапустите сервер

3. **Медленная загрузка**
   - Включите сжатие изображений
   - Настройте CDN
   - Проверьте размер bundle

### Логи
```bash
# PM2 логи
pm2 logs

# Docker логи
docker-compose logs app

# Vercel логи
vercel logs
```

## 🚀 Оптимизация производительности

### Рекомендации
- Используйте next/image для автоматической оптимизации
- Включите gzip сжатие на сервере
- Настройте кэширование статических ресурсов
- Мониторьте Core Web Vitals

### Команды для проверки
```bash
# Анализ bundle
npm run analyze

# Проверка производительности
npm run lighthouse

# Тестирование загрузки
npm run test:performance
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи
2. Убедитесь в правильности переменных окружения
3. Перезапустите сервисы
4. Обратитесь к документации

**Удачного развертывания! 🎉**