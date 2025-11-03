"use client";
import React, { useEffect } from "react";

export default function ColorThemeInitializer() {
  useEffect(() => {
    // Инициализируем panda-dark тему для Panda Burger
    const root = document.documentElement;
    
    // Устанавливаем CSS переменные из panda-dark темы
    root.style.setProperty('--color-bg', '#0e0e10');
    root.style.setProperty('--color-bg-secondary', '#1a1a1d');
    root.style.setProperty('--color-bg-card', '#1f1f22');
    root.style.setProperty('--color-bg-hover', '#27272a');
    root.style.setProperty('--color-text', '#f5f5f4');
    root.style.setProperty('--color-text-secondary', '#a1a1aa');
    root.style.setProperty('--color-text-muted', '#7c7c85');
    root.style.setProperty('--color-primary', '#b8252b');
    root.style.setProperty('--color-primary-hover', '#e0343a');
    root.style.setProperty('--color-accent', '#d4af37');
    root.style.setProperty('--color-accent-hover', '#e4c257');
    root.style.setProperty('--color-call', '#facc15');
    root.style.setProperty('--color-call-hover', '#fde047');
    root.style.setProperty('--color-border', '#2d2d30');
    root.style.setProperty('--color-input-bg', '#1c1c1f');
    
    // Совместимость со старыми переменными
    root.style.setProperty('--bg-primary', '#0e0e10');
    root.style.setProperty('--text-primary', '#f5f5f4');
    root.style.setProperty('--bg-secondary', '#1a1a1d');
    root.style.setProperty('--text-secondary', '#a1a1aa');
    root.style.setProperty('--accent-call', '#facc15');
    root.style.setProperty('--accent-hover', '#fde047');
    root.style.setProperty('--border-color', '#2d2d30');
    
    // Устанавливаем data-theme для специфичных стилей
    document.body.setAttribute('data-theme', 'panda-dark');
    document.body.setAttribute('data-restaurant', 'panda-burger');
    
    // Применяем темный фон к body
    document.body.style.backgroundColor = '#0e0e10';
    document.body.style.color = '#f5f5f4';
  }, []);
  
  return null;
}