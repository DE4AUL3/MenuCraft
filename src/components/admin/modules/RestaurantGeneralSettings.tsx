'use client';

import { useState, useEffect } from 'react';
import { Store, Upload, Phone, Clock, MapPin, Save, Plus, X } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { RestaurantSettings } from '@/types/common';
import ImageUpload from '@/components/ui/ImageUpload';

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
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Загружаем текущие настройки
    const currentSettings = dataService.getRestaurantSettings();
    setSettings(currentSettings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updatedSettings = dataService.updateRestaurantSettings(settings);
      setSettings(updatedSettings);
      setSaveMessage('Настройки успешно сохранены!');
      
      // Очищаем сообщение через 3 секунды
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Ошибка при сохранении настроек');
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
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Общие настройки ресторана
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Основная информация о вашем ресторане
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Сообщение о сохранении */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('Ошибка')
            ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
            : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Основная информация */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Основная информация
          </h3>

          {/* Названия ресторана */}
          <div className="space-y-4">
            <div>
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Название на русском языке"
              />
            </div>

            <div>
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Название на туркменском языке"
              />
            </div>
          </div>

          {/* Логотип */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              <Clock className="w-4 h-4 inline mr-1" />
              Часы работы
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Открытие
                </label>
                <input
                  type="time"
                  value={settings.workingHours.from}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, from: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Закрытие
                </label>
                <input
                  type="time"
                  value={settings.workingHours.to}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: { ...prev.workingHours, to: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Контактная информация
          </h3>

          {/* Номера телефонов */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Phone className="w-4 h-4 inline mr-1" />
                Номера телефонов
              </label>
              <button
                onClick={addPhoneNumber}
                className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-3 h-3 mr-1" />
                Добавить
              </button>
            </div>

            {settings.phones.map((phone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => updatePhoneNumber(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="+993 XX XXX XX XX"
                />
                {settings.phones.length > 1 && (
                  <button
                    onClick={() => removePhoneNumber(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Адреса */}
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 inline mr-1" />
              Адрес
            </label>
            
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Адрес (Русский)
              </label>
              <input
                type="text"
                value={settings.address?.ru || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address!, ru: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Адрес на русском языке"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Адрес (Туркменский)
              </label>
              <input
                type="text"
                value={settings.address?.tk || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address!, tk: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Адрес на туркменском языке"
              />
            </div>
          </div>

          {/* Описания */}
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Описание ресторана
            </label>
            
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Описание (Русский)
              </label>
              <textarea
                value={settings.description?.ru || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  description: { ...prev.description!, ru: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Краткое описание ресторана"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Описание (Туркменский)
              </label>
              <textarea
                value={settings.description?.tk || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  description: { ...prev.description!, tk: e.target.value }
                }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Краткое описание ресторана"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Статус ресторана */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Статус ресторана
        </h3>
        
        <div className="flex items-center space-x-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isActive}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                isActive: e.target.checked
              }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {settings.isActive ? 'Ресторан активен' : 'Ресторан неактивен'}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Неактивные рестораны не отображаются на сайте
        </p>
      </div>
    </div>
  );
}