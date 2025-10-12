import { APP_CONFIG } from '@/config/constants';

/**
 * Утилита для объединения CSS классов
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Форматирование цены с валютой
 */
export function formatPrice(price: number, currency: string = APP_CONFIG.CURRENCY): string {
  return `${price} ${currency}`
}

/**
 * Генерация случайного ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Задержка для async функций
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Безопасное сохранение в localStorage
 */
export function saveToStorage(key: string, value: any): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value))
    }
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

/**
 * Безопасное чтение из localStorage
 */
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    }
    return defaultValue
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
    return defaultValue
  }
}

/**
 * Проверка на мобильное устройство
 */
export function isMobile(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

/**
 * Валидация номера телефона
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+993\s?\d{2}\s?\d{3}-?\d{2}-?\d{2}$/
  return phoneRegex.test(phone)
}

/**
 * Обрезка текста до указанной длины
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}