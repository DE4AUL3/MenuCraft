'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Users,
  MessageSquare,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Edit,
  Filter,
  Send,
  Mail,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  category: 'customer' | 'supplier' | 'delivery' | 'staff'
  notes?: string
  orders: number
  lastOrder?: string
  createdAt: string
}

interface ContactCategory {
  id: string
  name: string
  count: number
  color: string
}

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Иван Петров',
    phone: '+7 (999) 123-45-67',
    email: 'ivan@example.com',
    category: 'customer',
    notes: 'Постоянный клиент, предпочитает доставку',
    orders: 15,
    lastOrder: '2024-01-10',
    createdAt: '2023-06-15'
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    phone: '+7 (888) 234-56-78',
    email: 'maria@example.com',
    category: 'customer',
    notes: 'VIP клиент',
    orders: 32,
    lastOrder: '2024-01-12',
    createdAt: '2023-03-20'
  },
  {
    id: '3',
    name: 'ООО "Поставки"',
    phone: '+7 (777) 345-67-89',
    email: 'supply@company.com',
    category: 'supplier',
    notes: 'Поставщик продуктов',
    orders: 0,
    createdAt: '2023-01-10'
  }
]

const categories: ContactCategory[] = [
  { id: 'customer', name: 'Клиенты', count: 2, color: 'blue' },
  { id: 'supplier', name: 'Поставщики', count: 1, color: 'green' },
  { id: 'delivery', name: 'Доставка', count: 0, color: 'orange' },
  { id: 'staff', name: 'Персонал', count: 0, color: 'purple' }
]

export default function ContactsModule() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>(mockContacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [smsText, setSmsText] = useState('')
  const [copiedNumbers, setCopiedNumbers] = useState(false)

  // Фильтрация контактов
  useEffect(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(contact => contact.category === selectedCategory)
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, selectedCategory])

  const handleSelectContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const handleSelectAll = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id))
    }
  }

  const exportSelectedNumbers = () => {
    const selectedNumbers = contacts
      .filter(c => selectedContacts.includes(c.id))
      .map(c => c.phone)
      .join(', ')
    
    navigator.clipboard.writeText(selectedNumbers)
    setCopiedNumbers(true)
    setTimeout(() => setCopiedNumbers(false), 2000)
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'gray'
  }

  const getCategoryBadgeStyle = (category: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      green: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
    
    const color = getCategoryColor(category)
    return colorMap[color as keyof typeof colorMap] || colorMap.gray
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управление контактами
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            База контактов и SMS рассылка
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить контакт
          </button>
        </div>
      </div>

      {/* Статистика по категориям */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {category.name}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category.count}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/20 flex items-center justify-center`}>
                <Users className={`w-6 h-6 text-${category.color}-600 dark:text-${category.color}-400`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Поиск */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск контактов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Фильтр по категории */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Действия с выбранными */}
        {selectedContacts.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportSelectedNumbers}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {copiedNumbers ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedNumbers ? 'Скопировано!' : 'Копировать номера'}
            </button>
            <button
              onClick={() => setShowSMSModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              SMS рассылка ({selectedContacts.length})
            </button>
          </div>
        )}
      </div>

      {/* Таблица контактов */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Контакт
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Телефон
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Заказы
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Последний заказ
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => handleSelectContact(contact.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contact.name}
                      </div>
                      {contact.email && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {contact.phone}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeStyle(contact.category)}`}>
                      {categories.find(c => c.id === contact.category)?.name}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {contact.orders}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {contact.lastOrder || '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Контакты не найдены
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Попробуйте изменить фильтры поиска'
                : 'Начните добавлять контакты в вашу базу'
              }
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно SMS рассылки */}
      {showSMSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SMS рассылка
              </h3>
              <button
                onClick={() => setShowSMSModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Получатели ({selectedContacts.length})
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {contacts
                    .filter(c => selectedContacts.includes(c.id))
                    .map(c => c.name)
                    .join(', ')
                  }
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Текст сообщения
                </label>
                <textarea
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Введите текст SMS сообщения..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {smsText.length}/160 символов
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSMSModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  disabled={!smsText.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Отправить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}