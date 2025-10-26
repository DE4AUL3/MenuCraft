"use client"

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/hooks/useLanguage';

type CopyPhoneButtonProps = {
  phone: string;
  className?: string;
};

const CopyPhoneButton: React.FC<CopyPhoneButtonProps> = ({ phone, className = '' }) => {
  const { currentLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      toast.success(
        currentLanguage === 'ru' 
          ? 'Номер телефона скопирован!' 
          : 'Telefon belgisi göçürildi!',
        { duration: 1500 }
      );
      
      // Через 2 секунды возвращаем состояние кнопки
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(
        currentLanguage === 'ru' 
          ? 'Не удалось скопировать номер' 
          : 'Telefon belgisini göçürip bolmady',
        { duration: 3000 }
      );
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center px-2 py-1 text-xs rounded ${
        copied 
          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
      } ${className}`}
      title={currentLanguage === 'ru' ? 'Скопировать номер' : 'Belgini göçür'}
    >
      {copied ? (
        <Check className="w-3 h-3" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
};

export default CopyPhoneButton;