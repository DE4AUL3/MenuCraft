'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Search, 
  Volume2, 
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/PremiumCard'

interface VoiceSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

// Типы для Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onstart: ((event: Event) => void) | null
  onend: ((event: Event) => void) | null
  onerror: ((event: any) => void) | null
  onspeechstart: ((event: Event) => void) | null
  onspeechend: ((event: Event) => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export default function VoiceSearch({ onSearch, placeholder = "Скажите что ищете...", className = '' }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState('ru-RU')
  const [confidence, setConfidence] = useState<number>(0)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)

  // Инициализация Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = language

        recognitionInstance.onstart = () => {
          setIsListening(true)
          setError(null)
          setAudioLevel(0)
        }

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            const confidence = event.results[i][0].confidence

            if (event.results[i].isFinal) {
              finalTranscript += transcript
              setConfidence(confidence)
            } else {
              interimTranscript += transcript
            }
          }

          setTranscript(finalTranscript)
          setInterimTranscript(interimTranscript)

          // Автоматический поиск при финальном результате
          if (finalTranscript.trim()) {
            setIsProcessing(true)
            setTimeout(() => {
              onSearch?.(finalTranscript.trim())
              setSuccessMessage(`Найдено: "${finalTranscript.trim()}"`)
              setIsProcessing(false)
              
              // Очищаем сообщение об успехе через 3 секунды
              setTimeout(() => setSuccessMessage(null), 3000)
            }, 500)
          }
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
          setInterimTranscript('')
          setAudioLevel(0)
        }

        recognitionInstance.onerror = (event: any) => {
          setIsListening(false)
          setAudioLevel(0)
          
          switch (event.error) {
            case 'no-speech':
              setError('Речь не обнаружена. Попробуйте еще раз.')
              break
            case 'audio-capture':
              setError('Микрофон недоступен. Проверьте подключение.')
              break
            case 'not-allowed':
              setError('Доступ к микрофону запрещен. Разрешите доступ в настройках браузера.')
              break
            case 'network':
              setError('Ошибка сети. Проверьте подключение к интернету.')
              break
            default:
              setError(`Ошибка распознавания: ${event.error}`)
          }
        }

        recognitionInstance.onspeechstart = () => {
          setAudioLevel(Math.random() * 100)
        }

        recognitionInstance.onspeechend = () => {
          setAudioLevel(0)
        }

        setRecognition(recognitionInstance)
      } else {
        setIsSupported(false)
        setError('Web Speech API не поддерживается в вашем браузере')
      }
    }
  }, [language, onSearch])

  // Эмуляция уровня аудио
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isListening])

  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      setTranscript('')
      setInterimTranscript('')
      setError(null)
      setSuccessMessage(null)
      recognition.start()
    }
  }, [recognition, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const handleManualSearch = () => {
    const query = transcript.trim() || interimTranscript.trim()
    if (query) {
      onSearch?.(query)
      setSuccessMessage(`Поиск: "${query}"`)
      setTimeout(() => setSuccessMessage(null), 3000)
    }
  }

  const clearAll = () => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
    setSuccessMessage(null)
    if (isListening) {
      stopListening()
    }
  }

  const changeLanguage = (newLang: string) => {
    setLanguage(newLang)
    if (recognition) {
      recognition.lang = newLang
    }
  }

  if (!isSupported) {
    return (
      <Card variant="default" className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Голосовой поиск недоступен
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Ваш браузер не поддерживает Web Speech API. Попробуйте Chrome или Edge.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Основной блок поиска */}
      <Card variant="gradient" className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Голосовой поиск
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Используйте голос для поиска блюд и ресторанов
          </p>
        </div>

        {/* Микрофон с анимацией */}
        <div className="flex justify-center mb-6">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={isListening ? "secondary" : "primary"}
              size="lg"
              onClick={isListening ? stopListening : startListening}
              className="w-20 h-20 rounded-full p-0 relative overflow-hidden"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>

            {/* Анимация звуковых волн */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.7, 0.3, 0.7] 
                  }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              )}
            </AnimatePresence>

            {/* Индикатор уровня звука */}
            {isListening && (
              <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  animate={{ 
                    width: `${audioLevel}%`,
                    background: audioLevel > 70 ? 'linear-gradient(to right, #ef4444, #f97316)' : 'linear-gradient(to right, #22c55e, #3b82f6)'
                  }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Статус */}
        <div className="text-center mb-4">
          <AnimatePresence mode="wait">
            {isListening && (
              <motion.p
                key="listening"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-blue-600 dark:text-blue-400 font-medium"
              >
                🎤 Слушаю...
              </motion.p>
            )}
            
            {isProcessing && (
              <motion.p
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-yellow-600 dark:text-yellow-400 font-medium"
              >
                ⚡ Обрабатываю...
              </motion.p>
            )}
            
            {!isListening && !isProcessing && (
              <motion.p
                key="ready"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Нажмите на микрофон для начала
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Текст распознавания */}
        <AnimatePresence>
          {(transcript || interimTranscript) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white">
                    {transcript && (
                      <span className="bg-green-100 dark:bg-green-900/20 px-1 rounded">
                        {transcript}
                      </span>
                    )}
                    {interimTranscript && (
                      <span className="text-gray-500 italic ml-1">
                        {interimTranscript}
                      </span>
                    )}
                  </p>
                  {confidence > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Уверенность: {Math.round(confidence * 100)}%
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="flex-shrink-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Кнопки действий */}
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={handleManualSearch}
            leftIcon={<Search size={16} />}
            disabled={!transcript.trim() && !interimTranscript.trim()}
          >
            Найти
          </Button>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => changeLanguage('ru-RU')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === 'ru-RU'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              РУ
            </button>
            <button
              onClick={() => changeLanguage('en-US')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                language === 'en-US'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </Card>

      {/* Сообщения об ошибках и успехе */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
              <AlertCircle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
              <CheckCircle size={20} />
              <span className="font-medium">{successMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Подсказки */}
      <Card variant="glass" className="p-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Volume2 size={18} />
          Примеры команд:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div>• &quot;Найди пиццу&quot;</div>
          <div>• &quot;Покажи десерты&quot;</div>
          <div>• &quot;Суши в Panda Express&quot;</div>
          <div>• &quot;Бургеры дешевле 500 рублей&quot;</div>
        </div>
      </Card>
    </div>
  )
}