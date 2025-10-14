'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { mounted } = useTheme();

  if (!mounted) {
    return null; // Предотвращаем SSR гидратацию
  }

  return (
    <div
      className="relative bg-white/20 dark:bg-white/10 text-white p-2 rounded-xl backdrop-blur-sm border border-white/30"
      aria-label="Тема: Темная"
    >
      <div className="relative w-6 h-6">
        {/* Луна - всегда показываем темную тему */}
        <svg 
          className="absolute inset-0 w-6 h-6 opacity-100 rotate-0 scale-100" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
          />
        </svg>
      </div>
      
      {/* Подсказка */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Темная тема
      </div>
    </div>
  );
}