# Архитектура разделения MenuCraft на 2 проекта

## Структура проектов

```
MenuCraft/
├── menucraft-frontend/         # Клиентская часть
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Выбор ресторана + QR переход
│   │   │   ├── restaurant/[id]/page.tsx
│   │   │   ├── menu/[id]/page.tsx
│   │   │   ├── category/[id]/page.tsx
│   │   │   ├── cart/page.tsx
│   │   │   └── qr/page.tsx
│   │   ├── components/
│   │   │   ├── Restaurant/
│   │   │   ├── Menu/
│   │   │   ├── Cart/
│   │   │   └── ui/
│   │   └── lib/
│   │       └── api.ts         # API клиент для связи с admin
│   └── package.json
│
├── menucraft-admin/           # Админ-панель
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Дашборд
│   │   │   ├── restaurants/page.tsx
│   │   │   ├── menu/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   └── analytics/page.tsx
│   │   ├── components/
│   │   │   ├── admin/         # Вся админка
│   │   │   └── ui/
│   │   └── lib/
│   │       ├── api.ts         # API endpoints
│   │       └── dataService.ts # Управление данными
│   └── package.json
│
└── shared/                    # Общие компоненты (опционально)
    ├── types/
    ├── constants/
    └── utils/
```

## Связь между проектами

### Frontend -> Admin API
- `GET /api/restaurants` - список ресторанов
- `GET /api/restaurants/{id}` - данные ресторана
- `GET /api/restaurants/{id}/menu` - меню ресторана
- `POST /api/orders` - создание заказа

### Admin API endpoints
- `GET /api/restaurants` - управление ресторанами
- `POST /api/restaurants` - создание ресторана
- `PUT /api/restaurants/{id}` - обновление ресторана
- `DELETE /api/restaurants/{id}` - удаление ресторана
- `GET /api/orders` - список заказов
- `PUT /api/orders/{id}` - обновление статуса заказа

## Деплой

### Frontend
- **Домен**: `restaurants.vercel.app`
- **Описание**: Главная страница с выбором ресторанов + QR-коды
- **Функции**: Просмотр меню, заказы, корзина

### Admin
- **Домен**: `admin.restaurants.vercel.app`
- **Описание**: Админ-панель для управления всеми ресторанами
- **Функции**: CRUD ресторанов, меню, заказы, аналитика

## Преимущества

1. **Безопасность**: Админ-панель на отдельном домене
2. **Производительность**: Меньший размер бандла для клиентов
3. **Масштабирование**: Независимое развитие проектов
4. **SEO**: Оптимизированная клиентская часть
5. **Логическое разделение**: Четкое разделение ответственности

## Общие данные

### База данных
Будет располагаться в admin проекте и предоставлять API для frontend

### Изображения
Система загрузки и хранения изображений в admin проекте с публичными URL для frontend

### Синхронизация
Real-time обновления через WebSocket или Server-Sent Events (опционально)