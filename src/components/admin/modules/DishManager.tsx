'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  X,
  DollarSign
} from 'lucide-react'
import { Dish, Category } from '@/types/common'
import { dataService } from '@/lib/dataService'
import ImageUpload from '@/components/ui/ImageUpload'

interface DishManagerProps {
  theme?: 'light' | 'dark'
}

export default function DishManager({ theme = 'light' }: DishManagerProps) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showInactive, setShowInactive] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [loading, setLoading] = useState(true)

  // Форма для добавления/редактирования блюда
  const [formData, setFormData] = useState<Partial<Dish>>({
    name: { ru: '', tk: '' },
    description: { ru: '', tk: '' },
    price: 0,
    categoryId: '',
    image: '',
    isActive: true,
    isAvailable: true,
    preparationTime: 15,
    calories: 0,
    weight: 0
  })

  const themeStyles = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textMuted: 'text-gray-600',
      cardBg: 'bg-gray-50',
      inputBg: 'bg-white',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      secondaryBg: 'bg-gray-100 hover:bg-gray-200'
    },
    dark: {
      bg: 'bg-gray-900',
      border: 'border-gray-700',
      text: 'text-gray-100',
      textMuted: 'text-gray-400',
      cardBg: 'bg-gray-800',
      inputBg: 'bg-gray-800',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      secondaryBg: 'bg-gray-700 hover:bg-gray-600'
    }
  }

  const styles = themeStyles[theme]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [dishesData, categoriesData] = await Promise.all([
        dataService.getAllDishes(),
        dataService.getAllCategories()
      ])
      setDishes(dishesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = 
      dish.name.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.name.tk.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || dish.categoryId === selectedCategory
    const matchesActive = showInactive || dish.isActive

    return matchesSearch && matchesCategory && matchesActive
  })

  const openModal = (dish?: Dish) => {
    if (dish) {
      setEditingDish(dish)
      setFormData({ ...dish })
    } else {
      setEditingDish(null)
      setFormData({
        name: { ru: '', tk: '' },
        description: { ru: '', tk: '' },
        price: 0,
        categoryId: categories[0]?.id || '',
        image: '',
        isActive: true,
        isAvailable: true,
        preparationTime: 15,
        calories: 0,
        weight: 0
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingDish(null)
    setFormData({
      name: { ru: '', tk: '' },
      description: { ru: '', tk: '' },
      price: 0,
      categoryId: '',
      image: '',
      isActive: true,
      isAvailable: true,
      preparationTime: 15,
      calories: 0,
      weight: 0
    })
  }

  const handleSave = async () => {
    try {
      if (!formData.name?.ru || !formData.name?.tk || !formData.categoryId) {
        alert('Пожалуйста, заполните все обязательные поля')
        return
      }

      if (editingDish) {
        // Редактирование
        const updatedDish = await dataService.updateDish(editingDish.id, formData)
        setDishes(prev => prev.map(d => d.id === editingDish.id ? updatedDish : d))
      } else {
        // Создание
        const newDish = await dataService.createDish(formData as Omit<Dish, 'id' | 'createdAt' | 'updatedAt'>)
        setDishes(prev => [...prev, newDish])
      }

      closeModal()
    } catch (error) {
      console.error('Ошибка сохранения блюда:', error)
      alert('Ошибка сохранения блюда')
    }
  }

  const handleDelete = async (dishId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это блюдо?')) return

    try {
      await dataService.deleteDish(dishId)
      setDishes(prev => prev.filter(d => d.id !== dishId))
    } catch (error) {
      console.error('Ошибка удаления блюда:', error)
      alert('Ошибка удаления блюда')
    }
  }

  const toggleDishStatus = async (dish: Dish) => {
    try {
      const updatedDish = await dataService.updateDish(dish.id, {
        isActive: !dish.isActive
      })
      setDishes(prev => prev.map(d => d.id === dish.id ? updatedDish : d))
    } catch (error) {
      console.error('Ошибка изменения статуса блюда:', error)
    }
  }

  const handleImageUpload = (imageUrl: string | null) => {
    setFormData(prev => ({ ...prev, image: imageUrl || '' }))
  }

  if (loading) {
    return (
      <div className={`p-6 ${styles.bg} ${styles.text} rounded-lg`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Загрузка блюд...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 ${styles.bg} ${styles.text} rounded-lg`}>
      {/* Заголовок и кнопка добавления */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Управление блюдами</h2>
          <p className={styles.textMuted}>
            Всего блюд: {dishes.length} | Активных: {dishes.filter(d => d.isActive).length}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className={`px-4 py-2 ${styles.buttonBg} text-white rounded-lg flex items-center gap-2 transition-colors`}
        >
          <Plus className="w-4 h-4" />
          Добавить блюдо
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск блюд..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>

        {/* Категория */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`px-4 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="all">Все категории</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Показать неактивные */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="rounded"
          />
          <span>Показать неактивные</span>
        </label>
      </div>

      {/* Список блюд */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDishes.map(dish => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${styles.cardBg} ${styles.border} border rounded-lg p-4 ${
                !dish.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Изображение блюда */}
              <div className="relative mb-4">
                {dish.image ? (
                  <img
                    src={dish.image}
                    alt={dish.name.ru}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className={`w-full h-48 ${styles.secondaryBg} rounded-lg flex items-center justify-center`}>
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Статус доступности */}
                <div className="absolute top-2 right-2 flex gap-2">
                  {!dish.isAvailable && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                      Недоступно
                    </span>
                  )}
                  {!dish.isActive && (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">
                      Неактивно
                    </span>
                  )}
                </div>
              </div>

              {/* Информация о блюде */}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1">{dish.name.ru}</h3>
                <p className={`text-sm ${styles.textMuted} mb-2`}>{dish.name.tk}</p>
                <p className={`text-sm ${styles.textMuted} line-clamp-2`}>
                  {dish.description?.ru || 'Описание отсутствует'}
                </p>
              </div>

              {/* Цена и детали */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-lg">{dish.price} ТМТ</span>
                </div>
                <div className={`text-xs ${styles.textMuted}`}>
                  {dish.preparationTime || 15} мин
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className={`text-xs ${styles.textMuted} mb-4 grid grid-cols-2 gap-2`}>
                {(dish.calories || 0) > 0 && <div>🔥 {dish.calories} ккал</div>}
                {(dish.weight || 0) > 0 && <div>⚖️ {dish.weight}г</div>}
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(dish)}
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Изменить
                </button>
                
                <button
                  onClick={() => toggleDishStatus(dish)}
                  className={`px-3 py-2 rounded text-sm flex items-center justify-center ${
                    dish.isActive
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {dish.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                
                <button
                  onClick={() => handleDelete(dish.id)}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center justify-center"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Блюда не найдены</h3>
          <p className={styles.textMuted}>
            {searchTerm || selectedCategory !== 'all' 
              ? 'Попробуйте изменить фильтры поиска'
              : 'Начните с добавления первого блюда'
            }
          </p>
        </div>
      )}

      {/* Модальное окно добавления/редактирования */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${styles.bg} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingDish ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
                </h3>
                <button
                  onClick={closeModal}
                  className={`p-2 ${styles.secondaryBg} rounded-lg hover:bg-gray-300`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Название на русском */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название (Русский) *
                  </label>
                  <input
                    type="text"
                    value={formData.name?.ru || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, ru: e.target.value } as { ru: string; tk: string }
                    }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="Введите название блюда"
                  />
                </div>

                {/* Название на туркменском */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Название (Туркменский) *
                  </label>
                  <input
                    type="text"
                    value={formData.name?.tk || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, tk: e.target.value } as { ru: string; tk: string }
                    }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="Tagamyň adyny giriziň"
                  />
                </div>

                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Категория *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Цена */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Цена (ТМТ) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="0.00"
                  />
                </div>

                {/* Время приготовления */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Время приготовления (мин)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 15 }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Вес */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Вес (г)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Калории */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Калории
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.calories}
                    onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {/* Статусы */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Активно</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                      className="rounded"
                    />
                    <span>Доступно</span>
                  </label>
                </div>
              </div>

              {/* Описание на русском */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Описание (Русский)
                </label>
                <textarea
                  value={formData.description?.ru || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, ru: e.target.value } as { ru: string; tk: string }
                  }))}
                  rows={3}
                  className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  placeholder="Введите описание блюда"
                />
              </div>

              {/* Описание на туркменском */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Описание (Туркменский)
                </label>
                <textarea
                  value={formData.description?.tk || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, tk: e.target.value } as { ru: string; tk: string }
                  }))}
                  rows={3}
                  className={`w-full px-3 py-2 ${styles.inputBg} ${styles.border} border rounded-lg focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tagamyň düşündirişini giriziň"
                />
              </div>

              {/* Загрузка изображения */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Изображение блюда
                </label>
                <ImageUpload
                  currentImage={formData.image}
                  onImageChange={handleImageUpload}
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className={`flex-1 px-4 py-2 ${styles.buttonBg} text-white rounded-lg flex items-center justify-center gap-2`}
                >
                  <Save className="w-4 h-4" />
                  {editingDish ? 'Сохранить изменения' : 'Создать блюдо'}
                </button>
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 ${styles.secondaryBg} ${styles.text} rounded-lg`}
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}