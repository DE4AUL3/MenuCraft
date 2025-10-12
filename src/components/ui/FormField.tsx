'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, useState, useRef, useEffect } from 'react'
import { Check, AlertCircle, Eye, EyeOff, Search } from 'lucide-react'

interface FormFieldProps {
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  icon?: ReactNode
  options?: { value: string; label: string }[]
  rows?: number
  maxLength?: number
  autoFocus?: boolean
  onFocus?: () => void
  onBlur?: () => void
}

export function FormField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  options = [],
  rows = 3,
  maxLength,
  autoFocus = false,
  onFocus,
  onBlur
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  const isFloating = isFocused || value.length > 0

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const inputClasses = `
    w-full px-4 py-3 bg-transparent border-2 rounded-xl outline-none transition-all duration-300
    ${error 
      ? 'border-red-300 focus:border-red-500' 
      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${icon ? 'pl-12' : ''}
    ${type === 'password' ? 'pr-12' : ''}
  `

  const renderInput = () => {
    const commonProps = {
      ref: inputRef as any,
      value,
      onChange: (e: any) => onChange(e.target.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
      disabled,
      maxLength,
      className: inputClasses,
      placeholder: isFloating ? placeholder : ''
    }

    switch (type) {
      case 'textarea':
        return <textarea {...commonProps} rows={rows} />
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Выберите...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'password':
        return (
          <input
            {...commonProps}
            type={showPassword ? 'text' : 'password'}
          />
        )
      
      default:
        return <input {...commonProps} type={type} />
    }
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Input container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <motion.div
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300 ${
              isFocused ? 'text-blue-500' : ''
            }`}
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}

        {/* Input field */}
        {renderInput()}

        {/* Password toggle */}
        {type === 'password' && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        )}

        {/* Floating label */}
        <motion.label
          className={`absolute left-4 pointer-events-none transition-all duration-300 ${
            icon ? 'left-12' : 'left-4'
          } ${
            error
              ? 'text-red-500'
              : isFocused
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
          animate={{
            y: isFloating ? -28 : 12,
            scale: isFloating ? 0.85 : 1,
            x: isFloating ? -4 : 0
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>

        {/* Focus ring */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-blue-500 pointer-events-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ 
            opacity: isFocused ? 0.2 : 0,
            scale: isFocused ? 1 : 1.05
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Success indicator */}
        {value && !error && (
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Check size={20} />
          </motion.div>
        )}
      </div>

      {/* Character counter */}
      {maxLength && (
        <motion.div
          className="text-xs text-gray-400 mt-1 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {value.length}/{maxLength}
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center gap-2 mt-2 text-sm text-red-500"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Premium Search Input
interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSearch?: () => void
  suggestions?: string[]
  onSuggestionSelect?: (suggestion: string) => void
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Поиск...",
  onSearch,
  suggestions = [],
  onSuggestionSelect
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(value.toLowerCase())
  ).slice(0, 5)

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        
        <motion.input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            setShowSuggestions(true)
          }}
          onBlur={() => {
            setIsFocused(false)
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 
            border-2 border-gray-200 dark:border-gray-700 
            rounded-xl outline-none transition-all duration-300
            focus:border-blue-500 dark:focus:border-blue-400
            focus:ring-4 focus:ring-blue-500/10
          `}
          whileFocus={{ scale: 1.02 }}
        />

        {/* Search button */}
        {onSearch && (
          <motion.button
            onClick={onSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={16} />
          </motion.button>
        )}
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.button
                key={suggestion}
                onClick={() => {
                  onSuggestionSelect?.(suggestion)
                  setShowSuggestions(false)
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <Search className="inline mr-3 text-gray-400" size={16} />
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}