# 🏗️ Архитектурная документация

## 📁 Структура проекта

```
src/
├── app/                          # Next.js App Router (Pages)
│   ├── (public)/                # Публичные страницы
│   │   ├── page.tsx             # Главная → /select-restaurant
│   │   ├── select-restaurant/   # Выбор ресторана
│   │   ├── menu/[id]/          # Меню ресторана
│   │   │   └── category/[categoryId]/ # Категория блюд
│   │   └── cart/               # Корзина
│   ├── admin/                  # Админ-панель (защищенные маршруты)
│   ├── test/                   # Тестовые страницы макетов
│   ├── globals.css             # Глобальные стили
│   └── layout.tsx              # Root Layout с провайдерами
├── components/                  # Переиспользуемые компоненты
│   ├── ui/                     # Базовые UI компоненты
│   │   ├── Button.tsx          # Кнопка с вариантами
│   │   ├── LoadingSpinner.tsx  # Спиннер загрузки
│   │   └── NotificationContainer.tsx # Система уведомлений
│   └── Restaurant/             # Бизнес-логика ресторанов
│       ├── RestaurantSelector.tsx
│       └── RestaurantCard.tsx
├── hooks/                      # Кастомные React хуки
│   ├── useCart.tsx            # Управление корзиной (Context + Reducer)
│   ├── useTheme.ts            # Темная/светлая тема
│   ├── useLanguage.ts         # Интернационализация RU/TK
│   └── useNotifications.ts    # Система уведомлений
├── lib/                       # Утилиты и хелперы
│   └── utils.ts              # Общие функции
├── types/                     # TypeScript типы
│   ├── restaurant.ts         # Типы ресторанов
│   ├── menu.ts              # Типы меню и корзины
│   └── index.ts             # Экспорт всех типов
├── config/                   # Конфигурация
│   └── constants.ts         # Константы приложения
└── i18n/                    # Интернационализация
    └── translations.ts      # Переводы RU/TK
```

## 🧩 Архитектурные паттерны

### 1. **Feature-Based Structure**
Компоненты сгруппированы по функциональности

### 2. **Separation of Concerns**
- **Компоненты** - только UI и локальное состояние
- **Хуки** - бизнес-логика и глобальное состояние
- **Utils** - чистые функции без побочных эффектов

### 3. **Context + Reducer Pattern**
Правильная архитектура для глобального состояния

### 4. **Custom Hooks для переиспользования**
Каждый хук имеет единственную ответственность

## 🎨 UX/UI принципы

### 1. **Mobile-First Design**
- Все компоненты адаптивные
- Touch-friendly интерфейс
- Оптимизация для мобильных устройств

### 2. **Consistent Design System**
- Единая цветовая палитра
- Стандартные размеры отступов
- Консистентные анимации