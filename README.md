# MenuCraft — QR-меню для ресторанов

Современное Next.js приложение для QR-меню с поддержкой нескольких ресторанов, темной темы и двуязычного интерфейса.

## 🌟 Коротко (AAA-конспект)

- Стек: Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS 4
- Темы: единая система 60-30-10 (светлая/темная), единые токены, админ-бридж
- I18n: RU/TM переводы, хуки `useLanguage`, хранение выбора
- UI: адаптив, SSR/CSR, Lucide иконки, оптимизация изображений
- Админка: PremiumAdminDashboardV2 (активная), тестовые страницы выключены (заглушки)
- Данные: локальный CMS/db поверх localStorage (`cms`, `db`), API для sync/revalidate/health
- Качество: строгая типизация, ESLint Flat-config, прод-сборка проходит

Быстрый старт

```powershell
npm install; npm run dev
# prod: npm run build; npm start
```

API проверки

```text
GET  /api/health       → { ok: true, time, env }
GET  /api/sync?type=…  → menu | categories | stats | all
POST /api/sync         → триггер revalidate (проксирует /api/revalidate)
POST /api/revalidate   → revalidatePath / revalidateTag по типу
```

### Пользовательский интерфейс
- 📱 **Адаптивный дизайн** - работает на всех устройствах
- 🎨 **Темная/светлая тема** - автоматическое определение системных настроек
- 🌍 **Двуязычность** - поддержка русского и туркменского языков
- ⚡ **QR-навигация** - быстрый доступ через QR коды
- 🔄 **Плавные анимации** - современные CSS переходы
- 📊 **Карточки ресторанов** - детальная информация с рейтингами

### Техническая архитектура
- 🏗️ **Современные React паттерны** - кастомные хуки и композиция
- 💾 **Персистентное хранение** - сохранение настроек в localStorage
- 🎯 **TypeScript** - строгая типизация для надежности
- 🎨 **Tailwind CSS 4** - современная система стилизации
- 🧩 **Разделение ответственности** - модульная архитектура

## 🏪 Рестораны

### Panda Burger
- **Кухня**: Фаст-фуд / Çalt nahar
- **Специализация**: Бургеры и фаст-фуд премиум-класса
- **Рейтинг**: ⭐ 4.8
- **Статус**: 🟢 Открыт
- **Доставка**: 20-30 мин
- **Адрес**: ул. Нейтральности, 15 / Bitaraplyk köçesi, 15
- **Особенности**: Собственный SVG логотип с пандой

### Oceanic
- **Кухня**: Морепродукты / Deňiz önümleri  
- **Специализация**: Морская кухня с видом на Каспийское море
- **Рейтинг**: ⭐ 4.6
- **Статус**: 🔴 Закрыт
- **Доставка**: 35-45 мин
- **Адрес**: ул. Туркменбаши, 28 / Türkmenbaşy köçesi, 28
- **Особенности**: Фирменный морской стиль

## 🛠️ Технический стек

### Основные технологии
- **Next.js 15** с App Router и SSR/CSR
- **React 19** с современными хуками
- **TypeScript** для строгой типизации
- **Tailwind CSS 4** с кастомными свойствами
- **Lucide React** для консистентных иконок

### Архитектурные решения
- **Кастомные хуки**: `useTheme`, `useLanguage`
- **Разделение компонентов**: `RestaurantCard`, модульность
- **Система типов**: `Restaurant` интерфейсы
- **Интернационализация**: централизованная i18n система
- **Состояние приложения**: localStorage персистенция

## 🚀 Запуск проекта

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Git для клонирования

### Локальная разработка
```powershell
# Клонирование
git clone https://github.com/DE4AUL3/MenuCraft.git
cd MenuCraft

# Зависимости и запуск
npm install
npm run dev
```

**Сервер будет доступен по адресу:** [http://localhost:3000](http://localhost:3000)

### Сборка для продакшена
```powershell
npm run build
npm start
# опционально
npm run lint
```

### Проверка API
```text
GET  http://localhost:3000/api/health
GET  http://localhost:3000/api/sync
POST http://localhost:3000/api/revalidate  (JSON: { "type": "all" })
```

## 📁 Архитектура проекта

```
src/
├── app/                          # Next.js App Router
│   ├── select-restaurant/        # Страница выбора ресторанов
│   │   └── page.tsx             # Главная страница каталога
│   ├── menu/[id]/               # Динамические страницы меню
│   ├── admin/                   # Админ-панель (PremiumAdminDashboardV2)
│   ├── globals.css              # Глобальные стили Tailwind
│   ├── layout.tsx               # Корневой layout с провайдерами
│   └── page.tsx                 # Корневая страница (редирект)
├── components/                   # React компоненты
│   └── Restaurant/              # Компоненты ресторанов
│       ├── RestaurantSelector.tsx   # Главный компонент выбора
│       └── RestaurantCard.tsx       # Карточка ресторана
├── hooks/                       # Кастомные React хуки
│   ├── useTheme.ts             # Управление темной/светлой темой
│   └── useLanguage.ts          # Переключение языков (RU/TM)
├── types/                       # TypeScript определения
│   └── restaurant.ts           # Интерфейсы ресторанов и данных
├── i18n/                       # Интернационализация
│   └── translations.ts         # Переводы на русский и туркменский
└── public/                     # Статические файлы
    ├── images/                 # Изображения ресторанов
    └── panda-burger-logo.svg   # SVG логотип Panda Burger
```

### Ключевые файлы

#### `hooks/useTheme.ts`
- Централизованное управление темой
- Автоматическое определение системных настроек
- Сохранение выбора в localStorage
- Безопасная инициализация на клиенте

#### `hooks/useLanguage.ts`  
- Переключение между русским и туркменским
- Персистентное хранение выбора языка
- Типобезопасные ключи переводов

#### `types/restaurant.ts`
- TypeScript интерфейсы для всех данных
- Строгая типизация ресторанов и меню
- Поддержка мультиязычности в типах

#### `i18n/translations.ts`
- Централизованная система переводов  
- Типобезопасные ключи локализации
- Fallback на русский язык

## 🌐 Развертывание на хостинге

Примечание: в проект добавлен `vercel.json` (фиксирует команды сборки/установки). Если на Vercel появляется ошибка "версия Next.js не обнаружена", проверьте в настройках проекта Root Directory (= корень репозитория) и выполните Clear build cache → Redeploy.

### 💰 Рекомендуемые варианты и стоимость

#### 🥇 **Vercel (Рекомендуется)**
- **Бесплатный план**: 
  - ✅ 100GB пропускной способности
  - ✅ Автоматические развертывания из Git
  - ✅ HTTPS по умолчанию
  - ✅ Глобальная CDN
  - **Стоимость: $0/месяц**

- **Pro план ($20/месяц)**:
  - ✅ Безлимитная пропускная способность  
  - ✅ Приоритетная поддержка
  - ✅ Расширенная аналитика
  - ✅ Предварительный просмотр веток

#### 🥈 **Альтернативные варианты**
- **Netlify**: $0-19/месяц (аналогичный функционал)
- **Railway**: $5-20/месяц (с базой данных)
- **DigitalOcean App Platform**: $5-12/месяц
- **AWS Amplify**: $1-15/месяц (по использованию)

### 📋 Пошаговый план развертывания

#### 1. **Подготовка проекта**
```powershell
# Проверка сборки
npm run build
npm run lint

# Создание production переменных
echo "NEXT_PUBLIC_SITE_URL=https://yourdomain.com" > .env.production
```

#### 2. **Настройка Git репозитория**
```powershell
# Инициализация Git (если не сделано)
git init
git add .
git commit -m "Initial commit"

# Создание репозитория на GitHub
# Загрузка кода
git remote add origin https://github.com/DE4AUL3/MenuCraft.git
git push -u origin main
```

#### 3. **Развертывание на Vercel**
1. Зайти на [vercel.com](https://vercel.com)
2. Подключить GitHub аккаунт
3. Импортировать репозиторий
4. Настроить environment variables
5. Автоматическое развертывание ✅

#### 3.1. Авто‑деплой через GitHub Actions (интеграция)

В репозитории добавлен workflow `.github/workflows/vercel-deploy.yml`.

Настройка (один раз в GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret):
- `VERCEL_TOKEN` — токен из Vercel → Account Settings → Tokens
- `VERCEL_ORG_ID` — ID вашей Organization (Vercel → Settings → General)
- `VERCEL_PROJECT_ID` — ID проекта (Vercel → Project → Settings → General)

Как работает:
- Любой PR или пуш в не-main ветки → Preview деплой (вернёт Preview URL)
- Пуш в `main` → Production деплой (вернёт прод‑URL)

Локально ничего дополнительно настраивать не нужно — GitHub Actions выполнит `vercel pull/build/deploy`.

#### 4. **Настройка собственного домена**
```bash
# Покупка домена (примеры)
# Namecheap: $8-15/год
# GoDaddy: $10-20/год  
# Cloudflare: $8-12/год

# Настройка DNS в Vercel
# A record: @ -> Vercel IP
# CNAME: www -> vercel-alias.com
```

### 💸 Итоговая стоимость запуска

| Компонент | Минимальная | Оптимальная | Премиум |
|-----------|-------------|-------------|---------|
| **Хостинг** | $0 (Vercel Free) | $20/мес (Vercel Pro) | $20/мес |
| **Домен** | $10/год | $15/год | $25/год |
| **SSL** | $0 (включен) | $0 (включен) | $0 (включен) |
| **CDN** | $0 (включен) | $0 (включен) | $0 (включен) |
| **Итого/год** | **$10-15** | **$255-270** | **$265-285** |

> **Рекомендация**: Начать с бесплатного плана Vercel + платный домен = $10-15/год

## 🏢 Multi-tenant решение для двух ресторанов

### 🎯 Архитектурные подходы

#### **Вариант 1: Поддомены (Рекомендуется)**
```
├── qr.yoursite.com           # Общая страница выбора
├── admin.panda.yoursite.com  # Админка Panda Burger  
└── admin.oceanic.yoursite.com # Админка Oceanic
```

**Преимущества:**
- ✅ Полная изоляция ресторанов
- ✅ Независимые админ-панели  
- ✅ Легкое масштабирование
- ✅ SEO-дружелюбность

#### **Вариант 2: Роли и разграничение доступа**
```
├── /select-restaurant        # Общая страница
├── /admin/restaurant/1       # Админка первого ресторана
├── /admin/restaurant/2       # Админка второго ресторана  
└── /menu/[restaurant_id]     # Меню конкретного ресторана
```

### 🔧 Техническая реализация

#### **База данных (будущее развитие)**
```sql
-- Таблица ресторанов
restaurants (id, name, slug, settings, created_at)

-- Таблица пользователей  
users (id, email, password, restaurant_id, role)

-- Таблица меню
menu_items (id, restaurant_id, name, price, category_id)

-- Разграничение доступа по restaurant_id
```

#### **Middleware аутентификации**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const restaurantId = getRestaurantFromURL(request.url)
  const userRestaurant = getUserRestaurant(request)
  
  if (restaurantId !== userRestaurant) {
    return redirect('/unauthorized')
  }
}
```

#### **Компонентная архитектура**
```typescript
// components/AdminLayout.tsx
interface AdminLayoutProps {
  restaurantId: string
  children: React.ReactNode
}

// Динамическая тема и настройки по ресторану
const getRestaurantTheme = (restaurantId: string) => {
  return restaurantId === '1' ? pandaTheme : oceanicTheme
}
```

### 📱 QR код стратегия

#### **Генерация QR кодов**
```
QR-код ресторана → https://yoursite.com/r/panda
                 ↓
              Редирект на /select-restaurant?highlight=panda
                 ↓  
          Выделение нужного ресторана на странице
```

#### **Параметризованные ссылки**
```typescript
// utils/qrGenerator.ts
export const generateRestaurantQR = (restaurantSlug: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  return `${baseUrl}/r/${restaurantSlug}`
}

// Автоматический редирект
// app/r/[slug]/page.tsx
export default function RestaurantRedirect({ params }: { params: { slug: string } }) {
  redirect(`/select-restaurant?highlight=${params.slug}`)
}
```

## ⚙️ Основной функционал

### 🎨 Система тем
- **Автоматическое определение**: Следует системным настройкам пользователя
- **Ручное переключение**: Кнопка в header с иконками Sun/Moon
- **Персистентность**: Сохранение выбора в localStorage
- **Плавные переходы**: CSS transitions для всех элементов
- **Отладка**: Console.log для диагностики переключений

```typescript
// Пример использования хука темы
const { isDarkMode, toggleTheme, mounted } = useTheme()

// Безопасная проверка клиентской инициализации
if (!mounted) return <LoadingSpinner />
```

### 🌍 Мультиязычность  
- **Языки**: Русский (основной) и туркменский
- **Переключение**: Кнопка RU/TM в header
- **Fallback**: Автоматический возврат к русскому при отсутствии перевода
- **Типобезопасность**: TypeScript контроль ключей переводов

```typescript
// Пример использования переводов
const { currentLanguage, toggleLanguage } = useLanguage()
const text = getText('selectRestaurant', currentLanguage)
```

### 📱 Адаптивный дизайн
- **Mobile-first**: Дизайн начинается с мобильных устройств
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly**: Увеличенные области нажатия
- **Плавные анимации**: Scale эффекты при наведении
- **Оптимизированные изображения**: Next.js Image компонент

### 🎯 UX/UI особенности
- **Микроанимации**: Hover эффекты на карточках ресторанов
- **Статус индикаторы**: Зеленый/красный для открытых/закрытых ресторанов  
- **Градиенты**: Современные CSS градиенты для кнопок
- **Иконки**: Lucide React для консистентности
- **Тени**: Layered shadows для глубины

## 🔧 История разработки и улучшения

### 📋 Выполненные задачи
- ✅ **Создание логотипа Panda Burger**: Собственный SVG с пандой в синем круге
- ✅ **Удаление shimmer эффектов**: Убраны все `animate-shimmer` классы
- ✅ **Исправление переключения темы**: Добавлена отладка и исправлены хуки
- ✅ **Расширение туркменских переводов**: Полная локализация интерфейса
- ✅ **Архитектурный рефакторинг**: Внедрение современных React паттернов

### 🏗️ Внедренные улучшения архитектуры

#### **Разделение ответственности**
- **useTheme.ts**: Изолированная логика управления темой
- **useLanguage.ts**: Автономное переключение языков  
- **RestaurantCard.tsx**: Вынесенный компонент карточки
- **types/restaurant.ts**: Централизованные TypeScript интерфейсы
- **i18n/translations.ts**: Единая система локализации

#### **Современные React паттерны**
- **Кастомные хуки**: Переиспользуемая логика состояния
- **Композиция компонентов**: Модульная архитектура
- **TypeScript интеграция**: Строгая типизация всех данных
- **Performance оптимизация**: Правильная обработка mount/unmount

#### **Код качество**
- **Консистентное именование**: Единые конвенции
- **Документирование**: JSDoc комментарии для сложной логики
- **Обработка ошибок**: Graceful fallbacks
- **Accessibility**: ARIA labels и семантические элементы

### 🐛 Исправленные проблемы (фрагмент)
1. **Дублированный код в RestaurantSelector.tsx**: Убран лишний return statement
2. **Отсутствующие импорты**: Добавлены Image, иконки из Lucide React
3. **Проблемы с переключением темы**: Исправлена инициализация на клиенте
4. **Неполные переводы**: Расширена база туркменских переводов
5. **Проблемы с портами**: Настроен запуск на порту 3000

## 🚧 Планируемое развитие

### 🎯 Краткосрочные цели (1-2 месяца)
- [ ] **Полноценные страницы меню**: Динамические `/menu/[id]` с блюдами
- [ ] **Система заказов**: Корзина и оформление заказов
- [ ] **Backend интеграция**: API для управления данными
- [ ] **Админ-панель**: CRUD операции для ресторанов

### 🌟 Среднесрочные цели (3-6 месяцев)  
- [ ] **База данных**: PostgreSQL с Prisma ORM
- [ ] **Аутентификация**: NextAuth.js для админов
- [ ] **Загрузка изображений**: Cloudinary интеграция
- [ ] **Уведомления**: Real-time через WebSocket
- [ ] **Аналитика**: Dashboard с метриками

### 🚀 Долгосрочные цели (6+ месяцев)
- [ ] **PWA функциональность**: Offline режим и установка
- [ ] **Платежная система**: Интеграция с платежными сервисами  
- [ ] **Геолокация**: Определение ближайшего ресторана
- [ ] **AI рекомендации**: Персонализированные предложения
- [ ] **Многогородность**: Поддержка нескольких городов

## 📚 Документация разработчика

### 🔍 Отладка и диагностика

#### Системы логирования
```typescript
// useTheme.ts содержит отладочные console.log
const toggleTheme = () => {
  console.log('🎨 Theme toggle clicked')
  console.log('Current isDarkMode:', isDarkMode)
  // ...
}

// Для диагностики проблем с темой
// Откройте DevTools Console и следите за логами
```

#### Проверка состояния приложения
```typescript
// В браузере (DevTools Console):
localStorage.getItem('theme')        // Текущая тема
localStorage.getItem('language')     // Текущий язык
window.matchMedia('(prefers-color-scheme: dark)').matches // Системная тема
```

### 🧪 Тестирование

#### Ручное тестирование
1. **Переключение темы**: Кликните по иконке Sun/Moon в header
2. **Смена языка**: Переключите RU/TM и проверьте изменения текста
3. **Адаптивность**: Измените размер окна браузера
4. **Навигация**: Кликните на карточки ресторанов
5. **Состояния**: Проверьте hover эффекты

#### Тестирование на устройствах
```bash
# Для тестирования на мобильных устройствах
# Найдите IP адрес машины:
ipconfig # Windows
ifconfig # macOS/Linux

# Доступ с мобильного:
# http://YOUR_IP:3000/select-restaurant
```

### 🎨 Кастомизация и настройка

## 🧰 Backend (микро) в составе шаблона

- Источник данных: `localStorage` через сервисы `cms` и `db`
- API:
  - `GET /api/health` — health-check
  - `GET /api/sync?type=menu|categories|stats|all` — чтение данных
  - `POST /api/sync` — триггер ревалидации кэша
  - `POST /api/revalidate` — revalidatePath/revalidateTag по типу
- Ограничения: без внешней БД; данные живут в браузере (демонстрационно)
- Миграция в полноценный бэкенд: Prisma + Postgres, NextAuth, Cloudinary (см. планы)

#### Добавление нового ресторана
```typescript
// В RestaurantSelector.tsx добавьте в массив restaurants:
{
  id: '3',
  name: 'Новый ресторан',
  description: 'Описание ресторана',
  descriptionTk: 'Restoranyň beýany',
  image: '/images/new-restaurant.jpg',
  cuisine: 'Кухня',
  rating: 4.5,
  deliveryTime: '25-35 мин',
  deliveryTimeTk: '25-35 min',
  // ... другие поля
}
```

#### Добавление нового перевода
```typescript
// В i18n/translations.ts:
export const translations = {
  ru: {
    newKey: 'Новый текст',
    // ...
  },
  tk: {
    newKey: 'Täze tekst',
    // ...
  }
}

// Использование:
const text = getText('newKey', currentLanguage)
```

#### Настройка стилей
```css
/* В globals.css можно переопределить CSS переменные */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}

/* Или создать новые Tailwind классы */
@layer utilities {
  .custom-gradient {
    background: linear-gradient(45deg, #color1, #color2);
  }
}
```

## 📞 Поддержка и контакты

### 🐛 Сообщение об ошибках
При обнаружении багов, пожалуйста, включите:
1. Версию браузера
2. Шаги воспроизведения
3. Ожидаемое поведение
4. Скриншоты/видео (если применимо)
5. Console errors (F12 → Console)

### 🎯 Запросы функций
Новые идеи и предложения приветствуются! Опишите:
1. Бизнес-потребность
2. Предлагаемое решение  
3. Альтернативные варианты
4. Приоритет (низкий/средний/высокий)

### 📋 Чек-лист для разработчиков
- [ ] Код следует TypeScript строгим типам
- [ ] Компоненты используют корректные React patterns
- [ ] Добавлены переводы для обоих языков
- [ ] Тестирована адаптивность на разных экранах
- [ ] Проверена работа в темной и светлой теме
- [ ] Обновлена документация при необходимости

---

**Автор проекта**: DJ DE4AUL3 + DJ GITCOP
**Дата**: 10 октября 2025 г.
**Статус**: Готовый шаблон (демо-данные + локальный CMS)
**Лицензия**: MIT

*Этот проект создан с использованием современных веб-технологий и лучших практик разработки.*
