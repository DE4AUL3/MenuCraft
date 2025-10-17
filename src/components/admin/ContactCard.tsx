'use client'

import React, { useState } from 'react'
import { Phone, Copy, Check, Clock } from 'lucide-react'
import CopyPhoneButton from '@/components/CopyPhoneButton'

interface ContactCardProps {
  id: string
  name: string
  phone: string
  totalOrders: number
  totalAmount: number
  lastOrderDate: string | null
  firstOrderDate: string | null
}

export default function ContactCard({
  id,
  name,
  phone,
  totalOrders,
  totalAmount,
  lastOrderDate,
  firstOrderDate
}: ContactCardProps) {
  const [expanded, setExpanded] = useState(false)

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
  
  const formatAmount = (amount: number) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ')
  }

  const handleCall = () => {
    window.open(`tel:${phone}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {phone}
              </p>
              <CopyPhoneButton phone={phone} variant="text" size="sm" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            {totalOrders} {totalOrders === 1 ? 'заказ' : 
                          totalOrders >= 2 && totalOrders <= 4 ? 'заказа' : 'заказов'}
          </span>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Сумма заказов</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatAmount(totalAmount)} ₽
              </p>
            </div>
            
            <div className="text-right">
              <button 
                onClick={handleCall}
                className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                <Phone className="w-3.5 h-3.5 mr-1" />
                Позвонить
              </button>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-start gap-1.5">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Последний заказ</p>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(lastOrderDate)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-1.5">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Первый заказ</p>
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(firstOrderDate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}