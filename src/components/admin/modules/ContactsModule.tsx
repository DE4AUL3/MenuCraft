'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Phone,
  Users,
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Edit,
  Filter,
  Send,
  Copy,
  Check
} from 'lucide-react'
import CopyPhoneButton from '@/components/CopyPhoneButton'

interface Contact {
  id: string
  name: string
  phone: string
  totalOrders: number
  totalAmount: number
  lastOrderDate: string | null
  firstOrderDate: string | null
  createdAt: string
  isActive: boolean
}

export default function ContactsModule() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [copiedNumbers, setCopiedNumbers] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [showSMSModal, setShowSMSModal] = useState(false)
  const [smsText, setSmsText] = useState('')

  // Загрузка контактов из БД через API
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/contacts')
        if (res.ok) {
          const data = await res.json()
          // API возвращает уже нужную структуру
          setContacts(Array.isArray(data) ? data : [])
        } else {
          setError('Не удалось загрузить контакты')
          setContacts([])
        }
      } catch (e) {
        setError('Ошибка при загрузке контактов')
        setContacts([])
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, [])

  // Фильтрация контактов
  useEffect(() => {
    let filtered = contacts
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      )
    }
    
    setFilteredContacts(filtered)
  }, [contacts, searchTerm])

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

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Удаляем контакт из списка
        setContacts(contacts.filter(contact => contact.id !== id))
        setShowDeleteConfirm(null)
      } else {
        setError('Ошибка при удалении контакта')
      }
    } catch (error) {
      setError('Ошибка при удалении контакта')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Контакты клиентов
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {contacts.length} {contacts.length === 1 ? 'контакт' : 
              contacts.length >= 2 && contacts.length <= 4 ? 'контакта' : 'контактов'}
          </p>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Поиск */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по номеру телефона..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-60 md:w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Действия с выбранными */}
        {selectedContacts.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportSelectedNumbers}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copiedNumbers ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedNumbers ? 'Скопировано!' : `Копировать номера (${selectedContacts.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Таблица контактов */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="text-gray-600 dark:text-gray-400">Загрузка контактов...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Номер телефона
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Заказы
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Сумма заказов
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Последний заказ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Первый заказ
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {contact.phone}
                        </span>
                        <CopyPhoneButton phone={contact.phone} variant="text" size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {contact.totalOrders}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                      {contact.totalAmount.toFixed(2)} TMT
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(contact.lastOrderDate)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(contact.firstOrderDate)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => window.open(`tel:${contact.phone}`)}
                          title="Позвонить"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => setShowDeleteConfirm(contact.id)}
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
        )}

        {!loading && !error && filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Контакты не найдены
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Попробуйте изменить запрос поиска'
                : 'Список контактов пуст'
              }
            </p>
          </div>
        )}
      </div>

      {/* Модальное окно подтверждения удаления */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Подтверждение удаления
              </h3>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Вы действительно хотите удалить этот контакт? Это действие нельзя отменить.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
                <button
                  onClick={() => showDeleteConfirm && handleDeleteContact(showDeleteConfirm)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}