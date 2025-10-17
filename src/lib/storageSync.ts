'use client';

import React from 'react';

/**
 * Система синхронизации localStorage между вкладками браузера
 * Используется только в development режиме
 */

type StorageEventCallback = (key: string, newValue: any, oldValue: any) => void;

class StorageSync {
  private listeners: Set<StorageEventCallback> = new Set();
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startListening();
    }
  }

  private startListening() {
    if (this.isListening) return;
    
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    this.isListening = true;
  }

  private handleStorageChange(event: StorageEvent) {
    if (!event.key) return;

    try {
      // Безопасный парсинг JSON с проверкой на ошибки
      let oldValue = null;
      let newValue = null;
      
      if (event.oldValue) {
        try {
          oldValue = JSON.parse(event.oldValue);
        } catch (e) {
          console.warn(`Не удалось распарсить oldValue для ключа ${event.key}:`, e);
          oldValue = event.oldValue; // Используем строку как есть
        }
      }
      
      if (event.newValue) {
        try {
          newValue = JSON.parse(event.newValue);
        } catch (e) {
          console.warn(`Не удалось распарсить newValue для ключа ${event.key}:`, e);
          newValue = event.newValue; // Используем строку как есть
        }
      }

      this.listeners.forEach(callback => {
        try {
          callback(event.key!, newValue, oldValue);
        } catch (error) {
          console.warn('Ошибка в StorageSync callback:', error);
        }
      });
    } catch (error) {
      console.error('Ошибка обработки события storage:', error);
    }
  }

  /**
   * Подписка на изменения localStorage
   */
  subscribe(callback: StorageEventCallback) {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Принудительная синхронизация между вкладками
   */
  broadcast(key: string, value: any) {
    // Используем временный ключ для принудительного события
    const tempKey = `__sync_${key}_${Date.now()}`;
    localStorage.setItem(tempKey, JSON.stringify(value));
    localStorage.removeItem(tempKey);
  }

  /**
   * Безопасная установка значения с уведомлением других вкладок
   */
  setItem(key: string, value: any) {
    try {
      const oldValue = localStorage.getItem(key);
      
      // Проверяем, можно ли сериализовать значение
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      
      // Уведомляем другие вкладки
      this.broadcast(key, value);
    } catch (error) {
      console.error(`Ошибка при сохранении ${key} в localStorage:`, error);
    }
  }

  /**
   * Получение значения из localStorage
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      try {
        // Пытаемся распарсить JSON
        return JSON.parse(item);
      } catch (e) {
        // Если не получилось распарсить, возвращаем строку или дефолтное значение
        console.warn(`Не удалось распарсить значение для ключа ${key}:`, e);
        return (item as unknown as T) || defaultValue;
      }
    } catch (error) {
      console.error(`Ошибка при получении ${key} из localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Удаление значения с уведомлением
   */
  removeItem(key: string) {
    localStorage.removeItem(key);
    this.broadcast(key, null);
  }
}

// Создаем синглтон
export const storageSync = new StorageSync();

/**
 * Hook для синхронизации состояния с localStorage
 */
export function useStorageSync<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [state, setState] = React.useState<T>(() => 
    storageSync.getItem(key, defaultValue)
  );

  React.useEffect(() => {
    const unsubscribe = storageSync.subscribe((changedKey, newValue) => {
      if (changedKey === key) {
        setState(newValue ?? defaultValue);
      }
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const setValue = React.useCallback((value: T) => {
    setState(value);
    storageSync.setItem(key, value);
  }, [key]);

  return [state, setValue];
}

export default storageSync;