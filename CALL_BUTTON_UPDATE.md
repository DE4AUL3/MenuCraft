# 📞 Обновление системы кнопки быстрого звонка

## ✅ Выполненные изменения

### 🚫 **Удалена глобальная кнопка звонка**
- Убрана `FloatingCallButton` из `layout.tsx`
- Теперь кнопка НЕ отображается глобально на всех страницах

### 📱 **Кнопка звонка теперь доступна ТОЛЬКО в:**

1. **Меню ресторана** (`/menu/[id]`)
   - ✅ Главная страница с категориями
   - ✅ Компонент: `FloatingCallButton`

2. **Страницы категорий** (`/menu/[id]/category/[categoryId]`)
   - ✅ Страницы блюд внутри категорий
   - ✅ Компонент: `FloatingCallButton`

3. **Старые страницы** (`/category/[id]`)
   - ✅ Оставлена для совместимости
   - ✅ Компонент: `FloatingCallButton`

### 🚫 **Кнопка звонка НЕ отображается на:**
- ❌ Админ-панель (`/admin/*`)
- ❌ Страница выбора ресторана (`/select-restaurant`)
- ❌ Главная страница с QR (`/`)
- ❌ Все остальные служебные страницы

## 🔧 Технические детали

### Замены компонентов:
```tsx
// Заменено в menu/[id]/page.tsx
- import PhoneButton from '@/components/PhoneButton'
+ import FloatingCallButton from '@/components/FloatingCallButton'

- <PhoneButton />
+ <FloatingCallButton />
```

### Структура файлов:
```
src/
├── app/
│   ├── layout.tsx                    ❌ Кнопка убрана
│   ├── admin/                        ❌ Без кнопки
│   ├── select-restaurant/            ❌ Без кнопки 
│   ├── menu/[id]/
│   │   ├── page.tsx                  ✅ Есть кнопка
│   │   └── category/[categoryId]/
│   │       └── page.tsx              ✅ Есть кнопка
│   └── category/[id]/
│       └── page.tsx                  ✅ Есть кнопка (legacy)
└── components/
    ├── FloatingCallButton.tsx        ✅ Используется
    └── PhoneButton.tsx               ⚠️ Устаревший
```

## 🎯 Результат

Теперь кнопка быстрого звонка появляется **только в контексте ресторана** - когда пользователь просматривает меню или выбирает блюда. Это создаёт более логичный UX, где кнопка звонка доступна именно тогда, когда она наиболее актуальна.

## 📱 Тестирование

### Проверить отсутствие кнопки:
- [ ] `http://localhost:3001/admin` 
- [ ] `http://localhost:3001/select-restaurant`
- [ ] `http://localhost:3001/?no-redirect=true`

### Проверить наличие кнопки:
- [ ] `http://localhost:3001/menu/1`
- [ ] `http://localhost:3001/menu/1/category/burgers` (если доступно)

Кнопка должна быть зелёной, с анимацией, в правом нижнем углу экрана! 📞✨