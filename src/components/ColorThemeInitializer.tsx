"use client";
import React, { useEffect } from "react";

export default function ColorThemeInitializer() {
  useEffect(() => {
    // Инициализируем тему для Panda Burger (темная тема)
    const root = document.documentElement;
    
    // Устанавливаем CSS переменные для Panda Burger
    root.style.setProperty('--han-bg', '#1a1a1a');
    root.style.setProperty('--han-text', '#ffffff');
    root.style.setProperty('--bg-primary', '#1a1a1a');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#282828');
    root.style.setProperty('--text-secondary', '#cccccc');
    root.style.setProperty('--accent-call', '#f59e0b');
    root.style.setProperty('--accent-hover', '#d97706');
    root.style.setProperty('--border-color', '#404040');
    
    // Устанавливаем data-theme для специфичных стилей
    document.body.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-restaurant', 'panda-burger');
  }, []);
  
  return null;
}