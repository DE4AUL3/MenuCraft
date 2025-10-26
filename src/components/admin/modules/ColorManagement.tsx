'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Check, Eye, Save, RefreshCw } from 'lucide-react';
import { defaultThemes, ColorTheme, applyColorTheme, getSavedColorTheme } from '@/config/colors';
import toast from 'react-hot-toast';

export default function ColorManagement() {
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>(defaultThemes[0]);
  const [previewMode, setPreviewMode] = useState(false);
  const [originalTheme, setOriginalTheme] = useState<ColorTheme>(defaultThemes[0]);

  useEffect(() => {
    const savedTheme = getSavedColorTheme();
    setSelectedTheme(savedTheme);
    setOriginalTheme(savedTheme);
    applyColorTheme(savedTheme);
  }, []);

  const handleThemeSelect = (theme: ColorTheme) => {
    setSelectedTheme(theme);
    if (!previewMode) {
      applyColorTheme(theme);
    }
  };

  const handlePreview = (theme: ColorTheme) => {
    if (!previewMode) {
      setPreviewMode(true);
      setOriginalTheme(selectedTheme);
    }
    applyColorTheme(theme);
    setSelectedTheme(theme);
  };

  const handleSave = () => {
    applyColorTheme(selectedTheme);
    setOriginalTheme(selectedTheme);
    setPreviewMode(false);
    toast.success('Цветовая схема сохранена!', {
      icon: '🎨',
      duration: 3000,
    });
  };

  const handleCancel = () => {
    if (previewMode) {
      applyColorTheme(originalTheme);
      setSelectedTheme(originalTheme);
      setPreviewMode(false);
      toast.error('Предпросмотр отменен');
    }
  };

  const handleReset = () => {
    const defaultTheme = defaultThemes[0];
    setSelectedTheme(defaultTheme);
    applyColorTheme(defaultTheme);
    setOriginalTheme(defaultTheme);
    setPreviewMode(false);
    toast.success('Сброшено к стандартной теме', {
      icon: '🔄',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-linear-to-br from-purple-500 to-pink-600 rounded-xl">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Управление цветами
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Выберите цветовую схему для вашего ресторана
            </p>
          </div>
        </div>

        {/* Кнопки управления */}
        {previewMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <Eye className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              Режим предпросмотра активен
            </span>
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Текущая тема */}
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
  <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Текущая тема: {selectedTheme.name}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: selectedTheme.primary }}
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: selectedTheme.secondary }}
            />
            <div 
              className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
              style={{ backgroundColor: selectedTheme.primaryDark }}
            />
          </div>
          <div 
            className="flex-1 h-8 rounded-lg shadow-inner"
            style={{
              background: `linear-gradient(to right, ${selectedTheme.gradient.from}, ${selectedTheme.gradient.via}, ${selectedTheme.gradient.to})`
            }}
          />
        </div>
      </div>

      {/* Галерея тем */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {defaultThemes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 cursor-pointer transition-all duration-300 hover:shadow-lg group ${
              selectedTheme.id === theme.id 
                ? 'border-blue-500 dark:border-blue-400' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleThemeSelect(theme)}
          >
            {/* Галочка для выбранной темы */}
            {selectedTheme.id === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}

            {/* Название темы */}
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {theme.name}
            </h3>

            {/* Цветовая палитра */}
            <div className="space-y-3 mb-4">
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.primary }}
                  title="Primary"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.primaryDark }}
                  title="Dark"
                />
                <div 
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: theme.accent }}
                  title="Accent"
                />
              </div>

              {/* Градиент */}
              <div 
                className="h-4 rounded-lg"
                style={{
                  background: `linear-gradient(to right, ${theme.gradient.from}, ${theme.gradient.via}, ${theme.gradient.to})`
                }}
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(theme);
                }}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Предпросмотр
              </button>
              {selectedTheme.id === theme.id && !previewMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Кнопка сброса */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Сбросить к стандартной теме
        </button>
      </div>
    </div>
  );
}