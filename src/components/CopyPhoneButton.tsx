'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyPhoneButtonProps {
  phone: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'text'
}

export default function CopyPhoneButton({ 
  phone, 
  className = '', 
  size = 'md',
  variant = 'primary'
}: CopyPhoneButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(phone)
    setCopied(true)
    setShowTooltip(true)
    
    setTimeout(() => {
      setCopied(false)
    }, 2000)
    
    setTimeout(() => {
      setShowTooltip(false)
    }, 2500)
  }

  const getButtonStyles = () => {
    const sizeClasses = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3'
    }

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
      text: 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700 dark:text-gray-200'
    }

    return `${sizeClasses[size]} ${variantClasses[variant]} rounded-md transition-all duration-200 ${className}`
  }
  
  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className={getButtonStyles()}
        title="Копировать номер"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow">
          Скопировано!
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}