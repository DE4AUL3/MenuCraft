'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Phone, Clock, MapPin, Save, Plus, X, Check, AlertCircle } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { RestaurantSettings } from '@/types/common';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';

export default function RestaurantGeneralSettings() {
  const [settings, setSettings] = useState<RestaurantSettings>({
    id: 'main_restaurant',
    name: { ru: '', tk: '' },
    logo: '',
    phones: [''],
    workingHours: { from: '09:00', to: '23:00' },
    address: { ru: '', tk: '' },
    description: { ru: '', tk: '' },
    isActive: true,
    createdAt: '',
    updatedAt: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Загружаем текущие настройки
    const currentSettings = dataService.getRestaurantSettings();
    setSettings(currentSettings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const updatedSettings = dataService.updateRestaurantSettings(settings);
      setSettings(updatedSettings);
      setSaveStatus('success');
      toast.success('Настройки успешно сохранены!');
      
      // Сбрасываем статус через 3 секунды
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      toast.error('Ошибка при сохранении настроек');
      console.error('Error saving restaurant settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addPhoneNumber = () => {
    setSettings(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }));
  };

  const removePhoneNumber = (index: number) => {
    if (settings.phones.length > 1) {
      setSettings(prev => ({
        ...prev,
        phones: prev.phones.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePhoneNumber = (index: number, value: string) => {
    setSettings(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            className="p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Store className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Общие настройки
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Основная информация о ресторане
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            saveStatus === 'success' 
              ? 'bg-green-500 text-white' 
              : saveStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {isSaving ? (
              <motion.div
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Сохранение...
              </motion.div>
            ) : saveStatus === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Сохранено
              </motion.div>
            ) : saveStatus === 'error' ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Ошибка
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Основная информация */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Основная информация
            </h3>
          </div>

          {/* Названия ресторана */}
          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название ресторана (Русский)
              </label>
              <input
                type="text"
                value={settings.name.ru}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  name: { ...prev.name, ru: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                placeholder="Название на русском языке"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Название ресторана (Туркменский)
              </label>
              <input
                type="text"
                value={settings.name.tk}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  name: { ...prev.name, tk: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-gray-400 dark:group-hover:border-gray-500"
                placeholder="Название на туркменском языке"
              />
            </div>
          </div>

          {/* Логотип */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Логотип ресторана
            </label>
            <ImageUpload
              currentImage={settings.logo}
              onImageChange={(imageUrl) => setSettings(prev => ({
                ...prev,
                logo: imageUrl || ''
              }))}
              placeholder="Загрузить логотип"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Рекомендуемый размер: 200×200px, форматы: PNG, JPG, SVG
            </p>
          </div>

          {/* Часы работы */}
          <div className="mt-6">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Часы работы
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Открытие
                </label>
                <input
                  type="time"
                  value={settings.workingHours.from}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, from: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Закрытие
                </label>
                <input
                  type="time"
                  value={settings.workingHours.to}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, to: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Контактная информация */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Контактная информация
            </h3>
          </div>

          {/* Номера телефонов */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4 mr-2" />
                Номера телефонов
              </label>
              <motion.button
                onClick={addPhoneNumber}
                className="inline-flex items-center px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить
              </motion.button>
            </div>

            <AnimatePresence>
              {settings.phones.map((phone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => updatePhoneNumber(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300"
                    placeholder="+993 XX XXX XX XX"
                  />
                  {settings.phones.length > 1 && (
                    <motion.button
                      onClick={() => removePhoneNumber(index)}
                      className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Адреса */}
          <div className="mt-6 space-y-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              Адрес
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Адрес (Русский)
                </label>
                <input
                  type="text"
                  value={settings.address?.ru || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    address: { ...prev.address!, ru: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300"
                  placeholder="Адрес на русском языке"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Адрес (Туркменский)
                </label>
                <input
                  type="text"
                  value={settings.address?.tk || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    address: { ...prev.address!, tk: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300"
                  placeholder="Адрес на туркменском языке"
                />
              </div>
            </div>
          </div>

          {/* Описания */}
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Описание ресторана
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Описание (Русский)
                </label>
                <textarea
                  value={settings.description?.ru || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    description: { ...prev.description!, ru: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300 resize-none"
                  placeholder="Краткое описание ресторана"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Описание (Туркменский)
                </label>
                <textarea
                  value={settings.description?.tk || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    description: { ...prev.description!, tk: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white transition-all duration-300 resize-none"
                  placeholder="Краткое описание ресторана"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Статус ресторана */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Статус ресторана
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl transition-all duration-300 ${
              settings.isActive 
                ? 'bg-green-100 dark:bg-green-900/30' 
                : 'bg-gray-100 dark:bg-gray-700/30'
            }`}>
              <div className={`w-6 h-6 rounded-full transition-all duration-300 ${
                settings.isActive 
                  ? 'bg-green-500 shadow-lg shadow-green-500/30' 
                  : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {settings.isActive ? 'Ресторан активен' : 'Ресторан неактивен'}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {settings.isActive 
                  ? 'Ресторан отображается на сайте и принимает заказы'
                  : 'Ресторан скрыт от клиентов и не принимает заказы'
                }
              </p>
            </div>
          </div>
          
          <motion.label 
            className="relative inline-flex items-center cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                isActive: e.target.checked
              }))}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-orange-600 shadow-lg"></div>
          </motion.label>
        </div>
      </motion.div>
    </div>
  );
}