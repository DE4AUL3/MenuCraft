'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return null; // Предотвращаем SSR гидратацию
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative bg-white/20 dark:bg-white/10 text-white hover:bg-white/30 dark:hover:bg-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 group"
      aria-label="Переключить тему"
    >
      <div className="relative w-6 h-6">
        {/* Солнце */}
        <svg 
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-180 scale-50'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
          />
        </svg>
        
        {/* Луна */}
        <svg 
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-180 scale-50'
          }`} 
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
      
      {/* Подсказка при наведении */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
      </div>
    </button>
  );
}