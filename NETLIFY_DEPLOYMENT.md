# 🌐 Деплой на Netlify - Альтернативный вариант

## Подготовка для Netlify

Создайте файл `netlify.toml` в корне проекта:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Шаги деплоя:

1. Идите на https://netlify.com
2. Регистрируйтесь через GitHub
3. "New site from Git" → выберите ваш репозиторий
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Нажмите "Deploy site"

## ⚠️ Важно для Next.js

Для корректной работы Next.js на Netlify нужен плагин:
```bash
npm install @netlify/plugin-nextjs
```

И обновить `netlify.toml`:
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```