'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { dataService } from '@/lib/dataService';
import { imageService } from '@/lib/imageService';
import ImageUpload from '@/components/ui/ImageUpload';
import type { Category } from '@/types/common';

interface CategoryFormData {
  name: string;
  nameTk: string;
  image: string;
  gradient: string;
  description: string;
  descriptionTk: string;
  sortOrder: number;
  isActive: boolean;
}

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameTk: '',
    image: '',
    gradient: 'from-blue-600 to-purple-600',
    description: '',
    descriptionTk: '',
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    const data = dataService.getCategories();
    setCategories(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        dataService.updateCategory(editingId, formData);
      } else {
        dataService.addCategory(formData);
      }
      
      loadCategories();
      resetForm();
      alert(editingId ? 'Категория обновлена!' : 'Категория добавлена!');
    } catch (error) {
      alert('Ошибка: ' + (error as Error).message);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      nameTk: category.nameTk,
      image: category.image,
      gradient: category.gradient,
      description: category.description || '',
      descriptionTk: category.descriptionTk || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        dataService.deleteCategory(id);
        loadCategories();
        alert('Категория удалена!');
      } catch (error) {
        alert('Ошибка: ' + (error as Error).message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameTk: '',
      image: '',
      gradient: 'from-blue-600 to-purple-600',
      description: '',
      descriptionTk: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const gradientOptions = [
    'from-blue-600 to-purple-600',
    'from-red-600 to-pink-600',
    'from-yellow-600 to-orange-600',
    'from-green-600 to-blue-600',
    'from-purple-600 to-indigo-600',
    'from-pink-600 to-purple-600',
    'from-orange-600 to-red-600',
    'from-indigo-600 to-purple-600',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление категориями
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Добавляйте, редактируйте и удаляйте категории меню
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить категорию
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative bg-white dark:bg-[#282828] rounded-lg shadow-md overflow-hidden border ${
              category.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-red-300 dark:border-red-600'
            }`}
          >
            {/* Category Image */}
            <div className={`h-32 bg-gradient-to-br ${category.gradient} relative`}>
              {category.image ? (
                <img
                  src={imageService.getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                  {category.name.charAt(0)}
                </div>
              )}
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Активна' : 'Неактивна'}
                </span>
              </div>
            </div>

            {/* Category Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  #{category.sortOrder}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {category.nameTk}
              </p>
              
              {category.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Изменить
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#282828] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Редактировать категорию' : 'Добавить категорию'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Название (RU)
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
                      Название (TK)
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
                      Описание (RU)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Описание (TK)
                    </label>
                    <textarea
                      value={formData.descriptionTk}
                      onChange={(e) => setFormData({ ...formData, descriptionTk: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Изображение категории
                  </label>
                  <ImageUpload
                    currentImage={formData.image}
                    onImageChange={(imageUrl) => setFormData({ ...formData, image: imageUrl || '' })}
                    placeholder="Добавить изображение категории"
                  />
                </div>

                {/* Gradient */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Градиент
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {gradientOptions.map((gradient) => (
                      <button
                        key={gradient}
                        type="button"
                        onClick={() => setFormData({ ...formData, gradient })}
                        className={`h-12 rounded-lg bg-gradient-to-r ${gradient} border-2 ${
                          formData.gradient === gradient
                            ? 'border-blue-500'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sort Order and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Порядок сортировки
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Статус
                    </label>
                    <select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="active">Активна</option>
                      <option value="inactive">Неактивна</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Сохранить изменения' : 'Создать категорию'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 dark:bg-[#212121] text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-[#282828] transition-colors"
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