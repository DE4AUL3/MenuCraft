# Deployment Guide (RU / EN)

This project is a Next.js 15 + React 19 app ready for zero-config deploy on Vercel. Below are two ways to deploy.

## ✅ Option 1 — Vercel Dashboard (Recommended)
1. Go to https://vercel.com and sign in with GitHub
2. Import repository: DE4AUL3/MenuCraft
3. Framework Preset: Next.js (auto)
4. Root Directory: repository root ("/")
5. Node.js: 18.x or 20.x
6. Environment Variables: optional
7. Clear build cache → Deploy

## ✅ Option 2 — Vercel CLI
```powershell
npm i -g vercel
vercel login
vercel --prod
```

## Notes
- vercel.json is included to ensure the correct build/install commands
- package.json contains: "vercel-build": "next build", engines: {"node": ">=18.18.0"}
- If you use GitHub Actions, set repo secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

---

# Руководство по развёртыванию (RU / EN)

Проект — Next.js 15 + React 19, готов к развертыванию в Vercel без настройки. Два способа ниже.

## ✅ Вариант 1 — Vercel Dashboard (рекомендуется)
1. Зайдите на https://vercel.com и войдите через GitHub
2. Импортируйте репозиторий: DE4AUL3/MenuCraft
3. Framework Preset: Next.js (авто)
4. Root Directory: корень репозитория ("/")
5. Node.js: 18.x или 20.x
6. Переменные окружения: опционально
7. Clear build cache → Deploy

## ✅ Вариант 2 — Vercel CLI
```powershell
npm i -g vercel
vercel login
vercel --prod
```

## Заметки
- vercel.json добавлен — гарантирует корректные команды сборки/установки
- package.json содержит: "vercel-build": "next build", engines: {"node": ">=18.18.0"}
- Если используете GitHub Actions — добавьте секреты: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
