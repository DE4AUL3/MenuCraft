# 📱 QR-коды в виде еды - Техническое руководство

## 🎨 Дизайн концепции

### 🍕 QR-код "Пицца"
```
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
🔴⚫⚫⚫⚫⚫⚫⚫⚫🔴
🔴⚫🟡🟡🟡🟡🟡🟡⚫🔴
🔴⚫🟡⚫⚫⚫⚫🟡⚫🔴
🔴⚫🟡⚫QR⚫🟡⚫🔴
🔴⚫🟡⚫DATA⚫🟡⚫🔴
🔴⚫🟡⚫⚫⚫⚫🟡⚫🔴
🔴⚫🟡🟡🟡🟡🟡🟡⚫🔴
🔴⚫⚫⚫⚫⚫⚫⚫⚫🔴
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴
```

**Цветовая схема:**
- Корж: #D2691E (коричневый)
- Соус: #DC143C (красный)
- Сыр: #FFD700 (желтый)
- QR-паттерн: #000000 (черный)

### 🍔 QR-код "Бургер"
```
🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤  <- Верхняя булочка
🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢  <- Салат
🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴  <- Котлета
⚫⚫⚫⚫⚫⚫⚫⚫⚫⚫  <- QR-код здесь
🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡  <- Сыр
🟤🟤🟤🟤🟤🟤🟤🟤🟤🟤  <- Нижняя булочка
```

## 🛠 Техническая реализация

### Генерация QR-кода с кастомным дизайном

```javascript
// utils/qrGenerator.js
import QRCode from 'qrcode'

export class FoodQRGenerator {
  
  // Базовые настройки для надежного сканирования
  static baseConfig = {
    width: 300,
    height: 300,
    margin: 2,
    errorCorrectionLevel: 'H', // 30% коррекция ошибок
    type: 'image/png',
    quality: 0.92,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  }

  // QR-код в виде пиццы
  static async generatePizzaQR(url, options = {}) {
    const config = {
      ...this.baseConfig,
      ...options,
      color: {
        dark: '#8B4513',    // Коричневый для основы
        light: '#FFD700'    // Желтый для фона
      }
    }

    const qrDataURL = await QRCode.toDataURL(url, config)
    
    // Дополнительная стилизация через Canvas
    return this.addPizzaDecorations(qrDataURL)
  }

  // QR-код в виде бургера
  static async generateBurgerQR(url, options = {}) {
    const layers = [
      { color: '#DEB887', height: 15 }, // Верхняя булочка
      { color: '#228B22', height: 10 }, // Салат
      { color: '#8B4513', height: 20 }, // Котлета
      { qr: true, height: 200 },        // QR-код
      { color: '#FFD700', height: 15 }, // Сыр
      { color: '#DEB887', height: 15 }  // Нижняя булочка
    ]

    return this.createLayeredQR(url, layers)
  }

  // Вспомогательные методы
  static addPizzaDecorations(qrDataURL) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Загружаем QR-код
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Рисуем круглую основу пиццы
      ctx.beginPath()
      ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 10, 0, 2 * Math.PI)
      ctx.fillStyle = '#DEB887' // Цвет теста
      ctx.fill()
      
      // Накладываем QR-код
      ctx.drawImage(img, 0, 0)
      
      // Добавляем "начинку" - случайные точки
      this.addPizzaToppings(ctx, canvas.width, canvas.height)
    }
    
    img.src = qrDataURL
    return canvas.toDataURL()
  }

  static addPizzaToppings(ctx, width, height) {
    // Добавляем пепперони (красные кружки)
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = 8 + Math.random() * 4
      
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#DC143C'
      ctx.fill()
    }
    
    // Добавляем оливки (зеленые точки)
    for (let i = 0; i < 6; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = 3 + Math.random() * 2
      
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#556B2F'
      ctx.fill()
    }
  }
}
```

### Компонент для отображения QR-кода

```jsx
// components/QRCode/FoodQRCode.tsx
'use client'

import { useEffect, useState } from 'react'
import { FoodQRGenerator } from '@/utils/qrGenerator'

interface FoodQRCodeProps {
  url: string
  type: 'pizza' | 'burger' | 'coffee' | 'cake'
  size?: number
  className?: string
}

export default function FoodQRCode({ 
  url, 
  type, 
  size = 300, 
  className = '' 
}: FoodQRCodeProps) {
  const [qrImage, setQrImage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateQR()
  }, [url, type, size])

  const generateQR = async () => {
    setIsLoading(true)
    try {
      let qrDataURL = ''
      
      switch (type) {
        case 'pizza':
          qrDataURL = await FoodQRGenerator.generatePizzaQR(url, { width: size })
          break
        case 'burger':
          qrDataURL = await FoodQRGenerator.generateBurgerQR(url, { width: size })
          break
        case 'coffee':
          qrDataURL = await FoodQRGenerator.generateCoffeeQR(url, { width: size })
          break
        case 'cake':
          qrDataURL = await FoodQRGenerator.generateCakeQR(url, { width: size })
          break
        default:
          qrDataURL = await FoodQRGenerator.generatePizzaQR(url, { width: size })
      }
      
      setQrImage(qrDataURL)
    } catch (error) {
      console.error('Ошибка генерации QR-кода:', error)
      // Fallback на обычный QR-код
      const fallbackQR = await QRCode.toDataURL(url, { width: size })
      setQrImage(fallbackQR)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} 
           style={{ width: size, height: size }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Генерация QR...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <img 
        src={qrImage} 
        alt={`QR-код в виде ${type}`}
        className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{ width: size, height: size }}
      />
      
      {/* Декоративная рамка в зависимости от типа */}
      <div className={`absolute inset-0 rounded-lg ${getFrameStyle(type)}`} />
      
      {/* Инструкция для сканирования */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-gray-600 text-center whitespace-nowrap">
          📱 Наведите камеру для заказа
        </p>
      </div>
    </div>
  )
}

function getFrameStyle(type: string) {
  const styles = {
    pizza: 'border-4 border-orange-400 shadow-orange-200',
    burger: 'border-4 border-yellow-400 shadow-yellow-200', 
    coffee: 'border-4 border-amber-600 shadow-amber-200',
    cake: 'border-4 border-pink-400 shadow-pink-200'
  }
  return styles[type] || styles.pizza
}
```

## 📱 Интеграция в проект

### Страница генерации QR-кодов для админа

```jsx
// app/admin/qr-generator/page.tsx
'use client'

import { useState } from 'react'
import FoodQRCode from '@/components/QRCode/FoodQRCode'

export default function QRGeneratorPage() {
  const [restaurant, setRestaurant] = useState('kemine-bistro')
  const [table, setTable] = useState('1')
  const [qrType, setQrType] = useState<'pizza' | 'burger' | 'coffee' | 'cake'>('pizza')
  
  const generateURL = () => {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com'
    return `${baseURL}/restaurant/${restaurant}?table=${table}&qr=${Date.now()}`
  }

  const downloadQR = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `qr-${restaurant}-table-${table}-${qrType}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎨 Генератор QR-кодов</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Настройки */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ресторан</label>
            <select 
              value={restaurant} 
              onChange={(e) => setRestaurant(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="kemine-bistro">Kemine Bistro</option>
              <option value="sultan-palace">Sultan Palace</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Номер стола</label>
            <input 
              type="number" 
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="w-full p-2 border rounded"
              min="1"
              max="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Тип QR-кода</label>
            <div className="grid grid-cols-2 gap-2">
              {['pizza', 'burger', 'coffee', 'cake'].map((type) => (
                <button
                  key={type}
                  onClick={() => setQrType(type as any)}
                  className={`p-2 rounded text-sm capitalize ${
                    qrType === type 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {type === 'pizza' && '🍕'} 
                  {type === 'burger' && '🍔'}
                  {type === 'coffee' && '☕'}
                  {type === 'cake' && '🍰'}
                  {' ' + type}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-600 mb-2">Ссылка:</p>
            <code className="text-xs bg-gray-100 p-2 rounded block break-all">
              {generateURL()}
            </code>
          </div>
        </div>

        {/* Превью QR-кода */}
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <FoodQRCode 
              url={generateURL()}
              type={qrType}
              size={280}
              className="mx-auto"
            />
          </div>
          
          <button
            onClick={downloadQR}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            📥 Скачать QR-код
          </button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Размер: 280x280px<br/>
            Формат: PNG<br/>
            Коррекция ошибок: 30%
          </p>
        </div>
      </div>

      {/* Инструкция по размещению */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">📋 Инструкция по размещению:</h3>
        <ul className="text-sm space-y-1">
          <li>• Минимальный размер печати: 5x5 см</li>
          <li>• Оптимальный размер: 8x8 см</li>
          <li>• Разместите на видном месте стола</li>
          <li>• Избегайте бликов и теней</li>
          <li>• Проверьте сканирование перед установкой</li>
        </ul>
      </div>
    </div>
  )
}
```

## 🎯 Лучшие практики

### ✅ DO (Рекомендуется):
- Используйте высокий уровень коррекции ошибок (30%)
- Минимальный размер QR-кода: 2x2 см
- Контрастные цвета для надежного сканирования
- Тестируйте на разных устройствах
- Добавляйте инструкции для пользователей

### ❌ DON'T (Избегайте):
- Слишком мелкие QR-коды (меньше 2 см)
- Низкий контраст цветов
- Сложные градиенты в области данных
- Слишком много декоративных элементов
- Размещение в местах с плохим освещением

## 🔍 Тестирование QR-кодов

```javascript
// utils/qrTester.js
export class QRTester {
  static async testQRCode(qrImage) {
    // Тест 1: Проверка размера
    const minSize = 150 // минимум 150x150 пикселей
    if (qrImage.width < minSize || qrImage.height < minSize) {
      return { success: false, error: 'QR-код слишком маленький' }
    }

    // Тест 2: Проверка контрастности
    const contrast = await this.checkContrast(qrImage)
    if (contrast < 0.7) {
      return { success: false, error: 'Недостаточный контраст' }
    }

    // Тест 3: Симуляция сканирования
    try {
      const qrData = await this.simulateScan(qrImage)
      return { success: true, data: qrData }
    } catch (error) {
      return { success: false, error: 'QR-код не читается' }
    }
  }
}
```

Готов начать реализацию! С какого типа QR-кода хотите начать? 🍕🍔☕🍰