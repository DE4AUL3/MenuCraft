'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cms, MenuItem, Category } from '@/lib/cms';
import { useTheme } from '@/hooks/useTheme';
import SmartImage from './ui/SmartImage';

interface MenuItemFormData {
  categoryId: string;
  name: string;
  nameTk: string;
  description: string;
  descriptionTk: string;
  price: number;
  image: string;
  ingredients: string[];
  ingredientsTk: string[];
  isVegetarian: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isAvailable: boolean;
  sortOrder: number;
  calories?: number;
  cookingTime?: number;
  allergens: string[];
}

export default function MenuItemManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentRestaurant } = useTheme();

  // Определяем тему на основе ресторана
  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1';
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    categoryId: '',
    name: '',
    nameTk: '',
    description: '',
    descriptionTk: '',
    price: 0,
    image: '',
    ingredients: [],
    ingredientsTk: [],
    isVegetarian: false,
    isSpicy: false,
    isPopular: false,
    isAvailable: true,
    sortOrder: 1,
    calories: undefined,
    cookingTime: undefined,
    allergens: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const items = cms.getMenuItems();
    const cats = cms.getCategories();
    setMenuItems(items);
    setCategories(cats);
    
    if (formData.categoryId === '' && cats.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.categoryId === selectedCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        cms.updateMenuItem(editingId, formData);
      } else {
        cms.addMenuItem(formData);
      }
      
      loadData();
      resetForm();
      toast.success(editingId ? 'Товар обновлен!' : 'Товар добавлен!', {
        duration: 3000,
        position: 'top-right',
      });
    } catch (error) {
      toast.error('Ошибка: ' + (error as Error).message, {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setFormData({
      categoryId: item.categoryId,
      name: item.name,
      nameTk: item.nameTk,
      description: item.description,
      descriptionTk: item.descriptionTk,
      price: item.price,
      image: item.image,
      ingredients: [...item.ingredients],
      ingredientsTk: [...item.ingredientsTk],
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      isPopular: item.isPopular,
      isAvailable: item.isAvailable,
      sortOrder: item.sortOrder,
      calories: item.calories,
      cookingTime: item.cookingTime,
      allergens: [...item.allergens],
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      cms.deleteMenuItem(id);
      loadData();
      toast.success('Товар удален!', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      categoryId: categories.length > 0 ? categories[0].id : '',
      name: '',
      nameTk: '',
      description: '',
      descriptionTk: '',
      price: 0,
      image: '',
      ingredients: [],
      ingredientsTk: [],
      isVegetarian: false,
      isSpicy: false,
      isPopular: false,
      isAvailable: true,
      sortOrder: 1,
      calories: undefined,
      cookingTime: undefined,
      allergens: [],
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const addIngredient = (language: 'ru' | 'tk') => {
    const ingredient = prompt(`Введите ингредиент (${language === 'ru' ? 'RU' : 'TK'}):`);
    if (ingredient) {
      if (language === 'ru') {
        setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ingredient] }));
      } else {
        setFormData(prev => ({ ...prev, ingredientsTk: [...prev.ingredientsTk, ingredient] }));
      }
    }
  };

  const removeIngredient = (index: number, language: 'ru' | 'tk') => {
    if (language === 'ru') {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        ingredientsTk: prev.ingredientsTk.filter((_, i) => i !== index)
      }));
    }
  };

  const addAllergen = () => {
    const allergen = prompt('Введите аллерген:');
    if (allergen) {
      setFormData(prev => ({ ...prev, allergens: [...prev.allergens, allergen] }));
    }
  };

  const removeAllergen = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter((_, i) => i !== index)
    }));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление товарами
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Добавляйте, редактируйте и удаляйте товары в меню
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить товар
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Все товары ({menuItems.length})
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category.name} ({menuItems.filter(item => item.categoryId === category.id).length})
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${
              item.isAvailable ? 'border-gray-200 dark:border-gray-700' : 'border-red-300 dark:border-red-600'
            }`}
          >
            {/* Item Image */}
            <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
              {item.image ? (
                <SmartImage
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Нет изображения
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {item.isPopular && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    ⭐ Популярно
                  </span>
                )}
                {item.isVegetarian && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    🌱 Вегетарианское
                  </span>
                )}
                {item.isSpicy && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    🌶️ Острое
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.isAvailable ? 'Доступно' : 'Недоступно'}
                </span>
              </div>
            </div>

            {/* Item Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.nameTk}
                  </p>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {item.price} ТМТ
                </span>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                {item.description}
              </p>

              <div className="text-xs text-gray-400 mb-3">
                <span>Категория: {getCategoryName(item.categoryId)}</span>
                {item.calories && <span> • {item.calories} ккал</span>}
                {item.cookingTime && <span> • {item.cookingTime} мин</span>}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Items Message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {selectedCategory === 'all' ? 'Нет товаров' : 'Нет товаров в этой категории'}
          </p>
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-[#282828]' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingId ? 'Редактировать товар' : 'Добавить товар'}
                </h3>
                <button
                  onClick={resetForm}
                  className={`hover:text-gray-600 ${
                    isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Категория
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.filter(cat => cat.isActive).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Название (RU) *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Название (TK) *
                    </label>
                    <input
                      type="text"
                      value={formData.nameTk}
                      onChange={(e) => setFormData({ ...formData, nameTk: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Описание (RU) *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Описание (TK) *
                    </label>
                    <textarea
                      value={formData.descriptionTk}
                      onChange={(e) => setFormData({ ...formData, descriptionTk: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                      required
                    />
                  </div>
                </div>

                {/* Price and Details */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Цена (ТМТ) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Калории
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.calories || ''}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Время готовки (мин)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.cookingTime || ''}
                      onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Порядок
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL изображения
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="/images/menu/example.jpg"
                  />
                </div>

                {/* Ingredients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ингредиенты (RU)
                    </label>
                    <div className="space-y-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {ingredient}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(index, 'ru')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addIngredient('ru')}
                        className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        + Добавить ингредиент
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ингредиенты (TK)
                    </label>
                    <div className="space-y-2">
                      {formData.ingredientsTk.map((ingredient, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {ingredient}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeIngredient(index, 'tk')}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addIngredient('tk')}
                        className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        + Добавить ингредиент
                      </button>
                    </div>
                  </div>
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Аллергены
                  </label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.allergens.map((allergen, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full text-sm">
                          <span>{allergen}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergen(index)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addAllergen}
                      className="px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      + Добавить аллерген
                    </button>
                  </div>
                </div>

                {/* Flags */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">🌱 Вегетарианское</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isSpicy}
                      onChange={(e) => setFormData({ ...formData, isSpicy: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">🌶️ Острое</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">⭐ Популярное</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">✅ Доступно</span>
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Сохранить изменения' : 'Создать товар'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}