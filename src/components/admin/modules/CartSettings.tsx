'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { dataService } from '@/lib/dataService';
import { CartSettings as CartSettingsType, DeliveryZone } from '@/types/common';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  MapPin, 
  DollarSign,
  Settings,
  Truck
} from 'lucide-react';

interface CartSettingsProps {
  restaurantId: string;
}

const CartSettings: React.FC<CartSettingsProps> = ({ restaurantId }) => {
  const { isDarkMode } = useTheme();
  const { currentLanguage: language } = useLanguage();
  const [cartSettings, setCartSettings] = useState<CartSettingsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'delivery'>('delivery');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSettings, setEditingSettings] = useState<CartSettingsType | null>(null);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [newZone, setNewZone] = useState<Partial<DeliveryZone>>({
    name: { ru: '', tk: '' },
    price: 0,
    isActive: true,
    estimatedTime: { from: 30, to: 60 }
  });

  // Дни недели для настройки расписания
  const weekDays = [
    { id: 0, name: { ru: 'Воскресенье', tk: 'Ýekşenbe' } },
    { id: 1, name: { ru: 'Понедельник', tk: 'Duşenbe' } },
    { id: 2, name: { ru: 'Вторник', tk: 'Sişenbe' } },
    { id: 3, name: { ru: 'Среда', tk: 'Çarşenbe' } },
    { id: 4, name: { ru: 'Четверг', tk: 'Penşenbe' } },
    { id: 5, name: { ru: 'Пятница', tk: 'Anna' } },
    { id: 6, name: { ru: 'Суббота', tk: 'Şenbe' } }
  ];

  useEffect(() => {
    loadCartSettings();
  }, [restaurantId]);

  const loadCartSettings = async () => {
    setIsLoading(true);
    try {
      // Пытаемся загрузить существующие настройки
      const settings = await dataService.getCartSettings(restaurantId);
      if (settings) {
        setCartSettings(settings);
      } else {
        // Создаём настройки по умолчанию
        const defaultSettings: CartSettingsType = {
          id: `cart_${restaurantId}`,
          restaurantId,
          deliveryZones: [],
          minOrderAmount: 50,
          freeDeliveryAmount: 200,
          currency: 'ТМТ',
          workingHours: { from: '09:00', to: '22:00' },
          workingDays: [1, 2, 3, 4, 5, 6], // Понедельник-Суббота
          isDeliveryEnabled: true,
          isTakeawayEnabled: true,
          orderProcessingTime: { min: 30, max: 60 },
          settings: {
            allowScheduledOrders: true,
            requirePhone: true,
            requireAddress: true,
            autoConfirmOrders: false
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCartSettings(defaultSettings);
        await dataService.saveCartSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек корзины:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!editingSettings) return;

    try {
      const updatedSettings = {
        ...editingSettings,
        updatedAt: new Date().toISOString()
      };
      
      await dataService.saveCartSettings(updatedSettings);
      setCartSettings(updatedSettings);
      setIsEditing(false);
      setEditingSettings(null);
      
      dataService.emitEvent({
        type: 'cart_settings_updated',
        data: updatedSettings
      });
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  const handleEditSettings = () => {
    setEditingSettings({ ...cartSettings! });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingSettings(null);
  };

  const handleZoneSave = async () => {
    if (!editingSettings) return;

    try {
      const zoneData: DeliveryZone = {
        id: editingZone?.id || `zone_${Date.now()}`,
        name: newZone.name!,
        price: newZone.price!,
        isActive: newZone.isActive!,
        minOrderAmount: newZone.minOrderAmount,
        estimatedTime: newZone.estimatedTime!,
        createdAt: editingZone?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      let updatedZones;
      if (editingZone) {
        // Редактирование существующей зоны
        updatedZones = editingSettings.deliveryZones.map(zone =>
          zone.id === editingZone.id ? zoneData : zone
        );
      } else {
        // Добавление новой зоны
        updatedZones = [...editingSettings.deliveryZones, zoneData];
      }

      setEditingSettings({
        ...editingSettings,
        deliveryZones: updatedZones
      });

      setIsZoneModalOpen(false);
      setEditingZone(null);
      setNewZone({
        name: { ru: '', tk: '' },
        price: 0,
        isActive: true,
        estimatedTime: { from: 30, to: 60 }
      });
    } catch (error) {
      console.error('Ошибка сохранения зоны доставки:', error);
    }
  };

  const handleZoneDelete = (zoneId: string) => {
    if (!editingSettings) return;
    
    const updatedZones = editingSettings.deliveryZones.filter(zone => zone.id !== zoneId);
    setEditingSettings({
      ...editingSettings,
      deliveryZones: updatedZones
    });
  };

  const handleZoneEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setNewZone({
      name: { ...zone.name },
      price: zone.price,
      isActive: zone.isActive,
      minOrderAmount: zone.minOrderAmount,
      estimatedTime: { ...zone.estimatedTime }
    });
    setIsZoneModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cartSettings) return null;

  const currentSettings = editingSettings || cartSettings;

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'ru' ? 'Настройки доставки' : 'Eltip bermek sazlamalary'}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {language === 'ru' 
              ? 'Управление зонами доставки и их стоимостью'
              : 'Eltip bermek zonalaryny we olaryň bahasyny dolandyrmak'
            }
          </p>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <button
              onClick={handleEditSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{language === 'ru' ? 'Редактировать' : 'Üýtgetmek'}</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSaveSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'ru' ? 'Сохранить' : 'Ýatda saklamak'}</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>{language === 'ru' ? 'Отмена' : 'Ýatyr'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Заголовок вкладки доставки */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'delivery', icon: Truck, label: { ru: 'Доставка', tk: 'Eltip bermek' } }
          ].map(tab => {
            return (
              <div
                key={tab.id}
                className="flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600 dark:text-blue-400"
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label[language]}</span>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Контент вкладок */}
      {/* Основные настройки были здесь, но убраны для упрощения интерфейса */}

      {activeTab === 'delivery' && (
        <div className="space-y-6">
          {/* Зоны доставки */}
          <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'ru' ? 'Зоны доставки' : 'Eltip bermek zonalary'}
              </h3>
              {isEditing && (
                <button
                  onClick={() => setIsZoneModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Добавить зону' : 'Zona goşmak'}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {currentSettings.deliveryZones.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>{language === 'ru' ? 'Зоны доставки не настроены' : 'Eltip bermek zonalary düzülmedi'}</p>
                </div>
              ) : (
                currentSettings.deliveryZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } ${!zone.isActive ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {zone.name[language]}
                          </h4>
                          {!zone.isActive && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                              {language === 'ru' ? 'Неактивна' : 'İşjeň däl'}
                            </span>
                          )}
                        </div>
                        <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span>{zone.price} {currentSettings.currency}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{zone.estimatedTime.from}-{zone.estimatedTime.to} мин</span>
                            </span>
                          </div>
                          {zone.minOrderAmount && (
                            <p className="text-xs">
                              {language === 'ru' ? 'Мин. сумма:' : 'Iň az mukdar:'} {zone.minOrderAmount} {currentSettings.currency}
                            </p>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleZoneEdit(zone)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleZoneDelete(zone.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Настройки расписания были здесь, но убраны для упрощения интерфейса */}

      {/* Модальное окно для добавления/редактирования зоны доставки */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsZoneModalOpen(false)} />
            
            <div className={`inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {editingZone 
                    ? (language === 'ru' ? 'Редактировать зону доставки' : 'Eltip bermek zonasyny üýtgetmek')
                    : (language === 'ru' ? 'Добавить зону доставки' : 'Eltip bermek zonasyny goşmak')
                  }
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'ru' ? 'Название (RU)' : 'Ady (RU)'}
                    </label>
                    <input
                      type="text"
                      value={newZone.name?.ru || ''}
                      onChange={(e) => setNewZone({
                        ...newZone,
                        name: { ...newZone.name!, ru: e.target.value }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Центр города"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'ru' ? 'Название (TK)' : 'Ady (TK)'}
                    </label>
                    <input
                      type="text"
                      value={newZone.name?.tk || ''}
                      onChange={(e) => setNewZone({
                        ...newZone,
                        name: { ...newZone.name!, tk: e.target.value }
                      })}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Şäher merkezi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'ru' ? 'Стоимость доставки' : 'Eltip bermek bahasy'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newZone.price || ''}
                        onChange={(e) => setNewZone({
                          ...newZone,
                          price: Number(e.target.value)
                        })}
                        className={`w-full px-3 py-2 pr-12 border rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="25"
                      />
                      <span className={`absolute right-3 top-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentSettings.currency}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {language === 'ru' ? 'Мин. сумма заказа' : 'Iň az sargyt mukdary'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={newZone.minOrderAmount || ''}
                        onChange={(e) => setNewZone({
                          ...newZone,
                          minOrderAmount: e.target.value ? Number(e.target.value) : undefined
                        })}
                        className={`w-full px-3 py-2 pr-12 border rounded-lg ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="100"
                      />
                      <span className={`absolute right-3 top-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {currentSettings.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language === 'ru' ? 'Время доставки (мин)' : 'Eltip bermek wagty (min)'}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={newZone.estimatedTime?.from || ''}
                      onChange={(e) => setNewZone({
                        ...newZone,
                        estimatedTime: {
                          ...newZone.estimatedTime!,
                          from: Number(e.target.value)
                        }
                      })}
                      className={`flex-1 px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="30"
                    />
                    <span className={`flex items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>-</span>
                    <input
                      type="number"
                      value={newZone.estimatedTime?.to || ''}
                      onChange={(e) => setNewZone({
                        ...newZone,
                        estimatedTime: {
                          ...newZone.estimatedTime!,
                          to: Number(e.target.value)
                        }
                      })}
                      className={`flex-1 px-3 py-2 border rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="60"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="zoneActive"
                    checked={newZone.isActive || false}
                    onChange={(e) => setNewZone({
                      ...newZone,
                      isActive: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="zoneActive" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {language === 'ru' ? 'Активная зона' : 'Işjeň zona'}
                  </label>
                </div>
              </div>
              
              <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-2`}>
                <button
                  onClick={() => setIsZoneModalOpen(false)}
                  className={`px-4 py-2 border rounded-lg ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {language === 'ru' ? 'Отмена' : 'Ýatyr'}
                </button>
                <button
                  onClick={handleZoneSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {language === 'ru' ? 'Сохранить' : 'Ýatda saklamak'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSettings;
