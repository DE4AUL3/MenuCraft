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

    const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
    const newValue = event.newValue ? JSON.parse(event.newValue) : null;

    this.listeners.forEach(callback => {
      try {
        callback(event.key!, newValue, oldValue);
      } catch (error) {
        console.warn('Ошибка в StorageSync callback:', error);
      }
    });
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
    const oldValue = localStorage.getItem(key);
    localStorage.setItem(key, JSON.stringify(value));
    
    // Уведомляем другие вкладки
    this.broadcast(key, value);
  }

  /**
   * Получение значения из localStorage
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
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