 'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ui/ImageUpload';
import SmartImage from '@/components/ui/SmartImage';
import { motion } from 'framer-motion';
import type { Category } from '@/types/common';

interface CategoryFormData {
  name: string;
  nameTk: string;
  image: string;
  dishPageImage: string;
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
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    nameTk: '',
    image: '',
    dishPageImage: '',
    gradient: 'from-blue-600 to-purple-600',
    description: '',
    descriptionTk: '',
    sortOrder: 1,
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Focus trap + Esc handling when modal is open
  useEffect(() => {
    if (!isFormOpen) return;

    const node = modalRef.current;
    const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = node ? Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)) : [];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        resetForm();
        return;
      }
      if (e.key === 'Tab') {
        if (!first || !last) return;
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // focus first input
    setTimeout(() => first?.focus(), 0);
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFormOpen]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/category');
      if (response.ok) {
        const data = await response.json();
        // Преобразуем данные из формата БД в формат, используемый компонентом
        const mappedCategories: Category[] = data.map((item: any) => ({
          id: item.id,
          name: item.nameRu,
          nameTk: item.nameTk,
          image: item.imageCard,
          dishPageImage: item.imageBackground,
          gradient: 'from-blue-600 to-purple-600', // Дефолтный градиент
          description: item.descriptionRu,
          descriptionTk: item.descriptionTk,
          sortOrder: item.order,
          isActive: item.status
        }));
        setCategories(mappedCategories);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка загрузки категорий');
      }
    } catch (error) {
      console.error('Ошибка при загрузке категорий:', error);
      toast.error('Ошибка загрузки категорий!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const categoryData = {
        nameRu: formData.name,
        nameTk: formData.nameTk,
        descriptionRu: formData.description,
        descriptionTk: formData.descriptionTk,
        imageCard: formData.image,
        imageBackground: formData.dishPageImage,
        order: formData.sortOrder,
        status: formData.isActive,
        restaurantId: 'han-tagam',
      };

      console.log('Submitting category data:', categoryData); // Log the category data being submitted

      let response;
      if (editingId) {
        // Редактирование существующей категории
        response = await fetch(`/api/category/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Создание новой категории
        response = await fetch('/api/category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      }

      console.log('Server response:', response);
      if (!response.ok) {
        let errorMessage = 'Произошла ошибка при сохранении';
        try {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            console.error('Error details (json):', errorJson);
            errorMessage = errorJson.error || errorMessage;
          } catch {
            console.error('Error details (text):', errorText);
            errorMessage = errorText || errorMessage;
          }
        } catch (e) {
          console.error('Не удалось прочитать тело ответа об ошибке', e);
        }
        throw new Error(errorMessage);
      }

      await loadCategories();
      resetForm();
      toast.success(
        editingId ? 'Категория успешно обновлена!' : 'Категория успешно создана!', 
        { icon: '✅', duration: 3000 }
      );
    } catch (error) {
      console.error('Ошибка при сохранении категории:', error);
      toast.error(
        error instanceof Error ? error.message : 'Ошибка сохранения категории!', 
        { duration: 4000 }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      nameTk: category.nameTk,
      image: category.image,
      dishPageImage: category.dishPageImage || '',
      gradient: category.gradient,
      description: category.description || '',
      descriptionTk: category.descriptionTk || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        const response = await fetch(`/api/category/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка удаления категории');
        }
        
        await loadCategories();
        toast.success('Категория успешно удалена!', { 
          duration: 3000, 
          position: 'top-right',
          icon: '🗑️' 
        });
      } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        toast.error(
          error instanceof Error ? error.message : 'Ошибка удаления категории!', 
          { duration: 4000, position: 'top-right' }
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameTk: '',
      image: '',
      dishPageImage: '',
      gradient: 'from-blue-600 to-purple-600',
      description: '',
      descriptionTk: '',
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

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
            <div className="h-32 bg-gray-200 dark:bg-gray-700 relative">
              {category.image ? (
                <SmartImage
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-2xl font-bold">
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="presentation"
          onMouseDown={(e) => {
            // close on backdrop click
            if (e.target === e.currentTarget) {
              resetForm();
            }
          }}
        >
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.16 }}
            className="bg-white dark:bg-[#282828] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 id="category-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingId ? 'Редактировать категорию' : 'Добавить категорию'}
                </h3>
                <button
                  onClick={resetForm}
                  aria-label="Закрыть"
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
                    Изображение категории (для карточки)
                  </label>
                  <ImageUpload
                    currentImage={formData.image}
                    onImageChange={(imageUrl: string | null) => setFormData({ ...formData, image: imageUrl || '' })}
                    placeholder="Добавить изображение категории"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Рекомендуемый размер: 300x200px (соотношение 3:2)
                  </p>
                </div>

                {/* Dish Page Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Изображение для страницы блюд (заголовок)
                  </label>
                  <ImageUpload
                    currentImage={formData.dishPageImage}
                    onImageChange={(imageUrl) => setFormData({ ...formData, dishPageImage: imageUrl || '' })}
                    placeholder="Добавить изображение для страницы блюд"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Рекомендуемый размер: 1200x300px (широкий баннер)
                  </p>
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
                    disabled={isSaving}
                    className={`flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {isSaving ? (
                      <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" /><path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" strokeLinecap="round" /></svg>
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
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
          </motion.div>
        </div>
      )}
    </div>
  );
}