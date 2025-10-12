'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import OrderForm from '@/components/OrderForm'

export default function CartPage() {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { currentRestaurant } = useTheme()
  const { state: cartState, updateQuantity, removeItem } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState('')

  // Определяем тему на основе ресторана
  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1'

  const handleOrderSuccess = (orderId: string) => {
    setCompletedOrderId(orderId)
    setShowOrderForm(false)
    setShowSuccessNotification(true)
    
    // Скрыть уведомление через 3 секунды и вернуться к меню
    setTimeout(() => {
      setShowSuccessNotification(false)
      router.push('/select-restaurant')
    }, 3000)
  }

  if (cartState.items.length === 0 && !showSuccessNotification) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark 
          ? 'bg-[#212121]' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isDark 
              ? 'bg-[#282828]' 
              : 'bg-slate-200'
          }`}>
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${
            isDark 
              ? 'text-white' 
              : 'text-slate-900'
          }`}>
            Корзина пуста
          </h2>
          <p className={`mb-8 ${
            isDark 
              ? 'text-gray-300' 
              : 'text-slate-600'
          }`}>
            Добавьте блюда из меню, чтобы сделать заказ
          </p>
          <button
            onClick={() => router.push('/menu/1')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Перейти к меню
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-[#212121]' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${
        isDark 
          ? 'bg-[#282828]/95 border-gray-600' 
          : 'bg-white/95 border-slate-200/60'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 transition-colors duration-200 ${
                  isDark 
                    ? 'text-gray-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${
                  isDark 
                    ? 'text-white' 
                    : 'text-slate-900'
                }`}>
                  Корзина
                </h1>
                <p className={`text-sm ${
                  isDark 
                    ? 'text-gray-300' 
                    : 'text-slate-600'
                }`}>
                  {cartState.items.reduce((sum, item) => sum + item.quantity, 0)} товаров
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Items */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-8">
          {cartState.items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl shadow-lg border p-6 ${
                isDark 
                  ? 'bg-[#282828] border-gray-600' 
                  : 'bg-white border-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${
                    isDark 
                      ? 'text-white' 
                      : 'text-slate-900'
                  }`}>
                    {currentLanguage === 'tk' ? (item.nameTk || item.name) : item.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    isDark 
                      ? 'text-gray-300' 
                      : 'text-slate-600'
                  }`}>
                    {item.price} ТМТ за штуку
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 rounded-lg p-2 ${
                      isDark 
                        ? 'bg-[#212121]' 
                        : 'bg-slate-50'
                    }`}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isDark 
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                        }`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-semibold min-w-[2rem] text-center ${
                        isDark 
                          ? 'text-white' 
                          : 'text-slate-900'
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          isDark 
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-right ml-6">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {item.price * item.quantity} ТМТ
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${
          isDark 
            ? 'bg-[#282828] border-gray-600' 
            : 'bg-white border-slate-200/60'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isDark 
              ? 'text-white' 
              : 'text-slate-900'
          }`}>
            Итого
          </h3>
          <div className="space-y-2 mb-4">
            <div className={`flex justify-between ${
              isDark 
                ? 'text-gray-300' 
                : 'text-slate-600'
            }`}>
              <span>Сумма заказа:</span>
              <span>{cartState.totalAmount} ТМТ</span>
            </div>
            <div className={`flex justify-between ${
              isDark 
                ? 'text-gray-300' 
                : 'text-slate-600'
            }`}>
              <span>Доставка:</span>
              <span>{cartState.deliveryFee} ТМТ</span>
            </div>
            <div className={`border-t pt-2 ${
              isDark 
                ? 'border-gray-600' 
                : 'border-slate-200'
            }`}>
              <div className={`flex justify-between text-xl font-bold ${
                isDark 
                  ? 'text-white' 
                  : 'text-slate-900'
              }`}>
                <span>К оплате:</span>
                <span>{cartState.totalAmount + cartState.deliveryFee} ТМТ</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowOrderForm(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Оформить заказ
          </button>
        </div>
      </main>

      {/* Order Form */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed inset-0 bg-green-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full p-8 text-center ${
            isDark 
              ? 'bg-[#282828]' 
              : 'bg-white'
          }`}>
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              isDark 
                ? 'text-white' 
                : 'text-slate-900'
            }`}>
              Заказ принят!
            </h3>
            <p className={`mb-2 ${
              isDark 
                ? 'text-gray-300' 
                : 'text-slate-600'
            }`}>
              Номер заказа: <span className="font-mono font-bold text-green-600">#{completedOrderId}</span>
            </p>
            <p className={`mb-6 ${
              isDark 
                ? 'text-gray-300' 
                : 'text-slate-600'
            }`}>
              Оператор свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.
            </p>
            <div className={`w-full rounded-full h-2 ${
              isDark 
                ? 'bg-gray-600' 
                : 'bg-slate-200'
            }`}>
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <p className={`text-sm mt-2 ${
              isDark 
                ? 'text-gray-400' 
                : 'text-slate-500'
            }`}>
              Перенаправление через несколько секунд...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}