'use client'

import { useState } from 'react'
import { Phone, X } from 'lucide-react'

export default function PhoneButton() {
  const [isOpen, setIsOpen] = useState(false)
  const phoneNumber = '+993 12 123456'

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`
  }

  return (
    <>
      {/* Main Phone Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse-ring opacity-75"></div>
          
          {/* Phone icon */}
          <Phone className="w-6 h-6 z-10 relative animate-bounce" />
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-green-400/50 to-emerald-500/50 blur-lg group-hover:blur-xl transition-all duration-300"></div>
        </button>
      </div>

      {/* Phone Number Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 animate-slide-up">
            <div className="bg-white dark:bg-black rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="bg-linear-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Позвонить</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Phone Number */}
            <div className="p-4">
              <button
                onClick={handleCallClick}
                className="w-full text-left group"
              >
                <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {phoneNumber}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Нажмите для звонка
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}