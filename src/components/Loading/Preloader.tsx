'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Готовим для вас меню...');
  const { currentRestaurant } = useTheme();

  const loadingTexts = [
    'Готовим для вас меню...',
    'Подбираем лучшие блюда...',
    'Добро пожаловать!'
  ];

  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1';

  useEffect(() => {
    let textIndex = 0;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        
        const newProgress = prev + 2;
        if (newProgress >= 30 && textIndex === 0) {
          setCurrentText(loadingTexts[1]);
          textIndex = 1;
        } else if (newProgress >= 80 && textIndex === 1) {
          setCurrentText(loadingTexts[2]);
          textIndex = 2;
        }
        
        return newProgress;
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${
      isDark ? 'bg-[#212121]' : 'bg-white'
    }`}>
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="relative mx-auto w-16 h-16">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            isDark ? 'bg-white' : 'bg-[#212121]'
          }`}>
            <div className={`text-2xl ${
              isDark ? 'text-[#212121]' : 'text-white'
            }`}>🍽️</div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className={`text-2xl font-light tracking-wide ${
            isDark ? 'text-white' : 'text-[#212121]'
          }`}>
            QR Menu
          </h1>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {isDark ? 'Panda Burger' : 'Han Tagam'}
          </p>
        </div>

        <div className="w-48 mx-auto space-y-3">
          <div className={`w-full rounded-full h-1 overflow-hidden ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div className={`h-full rounded-full transition-all duration-300 ease-out ${
              isDark ? 'bg-white' : 'bg-[#212121]'
            }`} style={{ width: `${progress}%` }}></div>
          </div>
          
          <p className={`text-sm animate-pulse ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentText}
          </p>
        </div>
      </div>
    </div>
  );
}
